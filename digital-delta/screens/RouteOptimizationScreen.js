import React, { useMemo } from 'react';
import { StyleSheet, View, Text, Pressable, Platform } from 'react-native';
import { WebView } from 'react-native-webview';
import { useRoute, useNavigation } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { colors } from '../theme';

// Import centralized data
import { NODES, EDGES } from '../data';

export default function RouteOptimizationScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { destination } = route.params;

  const graphData = useMemo(() => {
    // Pulling directly from data.js, which already has the base_weight_mins hardcoded
    return { nodes: NODES, edges: EDGES };
  }, []);

  const mapHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
      <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
      <style>
        body { padding: 0; margin: 0; background-color: ${colors.background}; font-family: sans-serif; }
        #map { height: 100vh; width: 100vw; }
        #info-panel { position: absolute; top: 20px; right: 20px; z-index: 1000; background: ${colors.surface}; color: #fff; padding: 15px; border-radius: 8px; border: 1px solid ${colors.primary}; font-weight: bold; }
        .leaflet-popup-content-wrapper { background-color: ${colors.surface}; color: ${colors.text}; }
        .leaflet-popup-tip { background-color: ${colors.surface}; }
        .icon-container { display: flex; justify-content: center; align-items: center; width: 28px; height: 28px; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 6px rgba(0,0,0,0.6); }
        .icon-svg { fill: white; width: 16px; height: 16px; }
      </style>
    </head>
    <body>
      <div id="info-panel">Calculating route...</div>
      <div id="map"></div>
      <script>
        const graph = ${JSON.stringify(graphData)};
        const TARGET_NODE = "${destination.id}";
        const SOURCE_NODE = "N1";
        
        const map = L.map('map', { zoomControl: false }).setView([24.95, 91.8], 10);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 18 }).addTo(map);

        const svgs = {
          pentagon: '<path d="M12 2L2 9l4 13h12l4-13z"/>',
          house: '<path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>',
          hospital: '<path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-2 10h-4v4h-2v-4H7v-2h4V7h2v4h4v2z"/>',
          drone: '<path d="M12 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm-4 7V7H4v2h2v4H4v2h4v-2h4v2h4v-2h2v-4h-2V7h-4v2H8zm-1 2h10v2H7v-2z"/>'
        };

        const getNode = (id) => graph.nodes.find(n => n.id === id);
        let activeLayers = [];

        // --- DIJKSTRA ALGORITHM ---
        function calculateShortestPath() {
          let distances = {};
          let previous = {};
          let unvisited = new Set();

          graph.nodes.forEach(n => { distances[n.id] = Infinity; unvisited.add(n.id); });
          distances[SOURCE_NODE] = 0;

          while (unvisited.size > 0) {
            let current = null;
            unvisited.forEach(n => {
              if (current === null || distances[n] < distances[current]) current = n;
            });

            if (current === TARGET_NODE || distances[current] === Infinity) break;
            unvisited.delete(current);

            let neighbors = graph.edges.filter(e => !e.is_flooded && (e.source === current || e.target === current));
            
            neighbors.forEach(edge => {
              let neighborId = edge.source === current ? edge.target : edge.source;
              if (unvisited.has(neighborId)) {
                let alt = distances[current] + edge.base_weight_mins;
                if (alt < distances[neighborId]) {
                  distances[neighborId] = alt;
                  previous[neighborId] = { node: current, edge: edge.id };
                }
              }
            });
          }

          let pathEdges = [];
          let curr = TARGET_NODE;
          while (previous[curr]) {
            pathEdges.push(previous[curr].edge);
            curr = previous[curr].node;
          }
          return { path: pathEdges, totalTime: distances[TARGET_NODE] };
        }

        function renderNetwork() {
          activeLayers.forEach(layer => map.removeLayer(layer));
          activeLayers = [];

          const routeData = calculateShortestPath();
          
          let infoPanel = document.getElementById('info-panel');
          if (routeData.totalTime === Infinity) {
            infoPanel.innerHTML = "DESTINATION UNREACHABLE<br>All routes flooded.";
            infoPanel.style.borderColor = "red";
          } else {
            infoPanel.innerHTML = "ETA: " + routeData.totalTime + " mins<br>Optimal Route Active";
            infoPanel.style.borderColor = "${colors.accentGreen}";
          }

          // 1. Draw Edges
          graph.edges.forEach(edge => {
            const sourceNode = getNode(edge.source);
            const targetNode = getNode(edge.target);
            
            if (sourceNode && targetNode) {
              const isOptimal = routeData.path.includes(edge.id);
              let color = '#64748b'; 
              let weight = 3;
              let dashArray = null;

              if (edge.is_flooded) {
                color = '${colors.primary}'; 
                dashArray = '5, 5';
              } else if (isOptimal) {
                color = '${colors.accentGreen}'; 
                weight = 6;
              } else if (edge.type === 'waterway') {
                color = '#3b82f6'; 
              }

              const polyline = L.polyline([[sourceNode.lat, sourceNode.lng], [targetNode.lat, targetNode.lng]], {
                color: color, weight: weight, dashArray: dashArray, opacity: isOptimal ? 1.0 : 0.6
              }).bindPopup('Time: ' + edge.base_weight_mins + ' mins<br><br><b>[Click to toggle Flooded]</b>');

              // Dynamic Recalculation Event
              polyline.on('click', function () {
                edge.is_flooded = !edge.is_flooded; 
                renderNetwork(); 
              });

              polyline.addTo(map);
              activeLayers.push(polyline);
            }
          });

          // 2. Draw Nodes
          graph.nodes.forEach(node => {
            let bgColor = '#64748b';
            let svgPath = svgs.house;

            if (node.type === 'central_command') { bgColor = '${colors.primary}'; svgPath = svgs.pentagon; }
            else if (node.type === 'hospital') { bgColor = '${colors.accentGreen}'; svgPath = svgs.hospital; }
            else if (node.type === 'supply_drop') { bgColor = '#8b5cf6'; svgPath = svgs.drone; }
            else if (node.type === 'relief_camp') { bgColor = '${colors.accentYellow}'; }

            if (node.id === SOURCE_NODE || node.id === TARGET_NODE) {
               bgColor = '${colors.accentGreen}';
            }

            const iconHtml = \`<div class="icon-container" style="background-color: \${bgColor};"><svg viewBox="0 0 24 24" class="icon-svg">\${svgPath}</svg></div>\`;
            const customIcon = L.divIcon({ html: iconHtml, className: '', iconSize: [28, 28], iconAnchor: [14, 14] });
            
            const marker = L.marker([node.lat, node.lng], { icon: customIcon }).bindPopup('<b>' + node.name + '</b>');
            marker.addTo(map);
            activeLayers.push(marker);
          });
        }

        renderNetwork();
      </script>
    </body>
    </html>
  `;

  return (
    <View style={styles.root}>
      <StatusBar style="light" />
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backText}>← Abort</Text>
        </Pressable>
        <Text style={styles.headerTitle}>Delivering to: {destination.name}</Text>
      </View>
      <WebView originWhitelist={['*']} source={{ html: mapHtml }} style={{ flex: 1 }} scrollEnabled={false} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  header: { paddingTop: Platform.OS === 'ios' ? 60 : 40, paddingHorizontal: 20, paddingBottom: 20, backgroundColor: colors.surface, flexDirection: 'row', alignItems: 'center' },
  backBtn: { marginRight: 15 },
  backText: { color: colors.primary, fontWeight: 'bold' },
  headerTitle: { color: colors.text, fontSize: 16, fontWeight: 'bold' }
});