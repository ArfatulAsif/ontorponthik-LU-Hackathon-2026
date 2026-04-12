import React, { useRef, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { WebView } from 'react-native-webview';
import { StatusBar } from 'expo-status-bar';
import { colors } from '../theme';

export default function MapScreen() {
  const webviewRef = useRef(null);

  // 1. Generate the expanded static graph data
  const graphData = useMemo(() => {
    const nodes = [
      // Original Nodes
      { id: "N1", name: "Sylhet City Hub (supply inventory)", type: "central_command", lat: 24.8949, lng: 91.8687 },
      { id: "N2", name: "Osmani Airport Node", type: "supply_drop", lat: 24.9632, lng: 91.8668 },
      { id: "N3", name: "Sunamganj Sadar Camp", type: "relief_camp", lat: 25.0658, lng: 91.4073 },
      { id: "N4", name: "Companyganj Outpost", type: "relief_camp", lat: 25.0715, lng: 91.7554 },
      { id: "N5", name: "Kanaighat Point", type: "waypoint", lat: 24.9945, lng: 92.2611 },
      { id: "N6", name: "Habiganj Medical", type: "hospital", lat: 24.3840, lng: 91.4169 },
      // 7 New Relief Camps
      { id: "N7", name: "Gowainghat Camp", type: "relief_camp", lat: 25.1050, lng: 91.9950 },
      { id: "N8", name: "Jaintiapur Camp", type: "relief_camp", lat: 25.1333, lng: 92.1167 },
      { id: "N9", name: "Bishwanath Camp", type: "relief_camp", lat: 24.8750, lng: 91.7250 },
      { id: "N10", name: "Golapganj Camp", type: "relief_camp", lat: 24.8483, lng: 92.0183 },
      { id: "N11", name: "Derai Camp", type: "relief_camp", lat: 24.7833, lng: 91.3500 },
      { id: "N12", name: "Chhatak Camp", type: "relief_camp", lat: 25.0333, lng: 91.6667 },
      { id: "N13", name: "Zakiganj Camp", type: "relief_camp", lat: 24.8750, lng: 92.3700 }
    ];

    const edges = [
      // Original Edges
      { id: "E1", source: "N1", target: "N2", type: "road", is_flooded: false },
      { id: "E2", source: "N1", target: "N3", type: "road", is_flooded: false },
      { id: "E3", source: "N2", target: "N4", type: "road", is_flooded: false },
      { id: "E4", source: "N1", target: "N5", type: "road", is_flooded: false },
      { id: "E5", source: "N1", target: "N6", type: "road", is_flooded: false },
      { id: "E6", source: "N1", target: "N3", type: "waterway", is_flooded: false },
      { id: "E7", source: "N3", target: "N4", type: "waterway", is_flooded: false },
      // 15 New Interconnecting Edges
      { id: "E8", source: "N1", target: "N9", type: "road", is_flooded: false },
      { id: "E9", source: "N1", target: "N10", type: "road", is_flooded: false },
      { id: "E10", source: "N10", target: "N13", type: "road", is_flooded: false },
      { id: "E11", source: "N2", target: "N7", type: "road", is_flooded: true }, // Simulating a flood
      { id: "E12", source: "N7", target: "N8", type: "road", is_flooded: false },
      { id: "E13", source: "N9", target: "N12", type: "road", is_flooded: false },
      { id: "E14", source: "N12", target: "N3", type: "road", is_flooded: false },
      { id: "E15", source: "N3", target: "N11", type: "waterway", is_flooded: false },
      { id: "E16", source: "N11", target: "N6", type: "road", is_flooded: false },
      { id: "E17", source: "N5", target: "N8", type: "waterway", is_flooded: false },
      { id: "E18", source: "N4", target: "N7", type: "waterway", is_flooded: false },
      { id: "E19", source: "N10", target: "N5", type: "road", is_flooded: false },
      { id: "E20", source: "N12", target: "N4", type: "road", is_flooded: false },
      { id: "E21", source: "N6", target: "N9", type: "road", is_flooded: false },
      { id: "E22", source: "N1", target: "N12", type: "waterway", is_flooded: false }
    ];

    // 2. Generate 30 Field Volunteers along random edges
    const volunteers = [];
    for (let i = 0; i < 30; i++) {
      const edge = edges[Math.floor(Math.random() * edges.length)];
      const source = nodes.find(n => n.id === edge.source);
      const target = nodes.find(n => n.id === edge.target);
      
      // Interpolate a random position along the edge
      const progress = Math.random() * 0.8 + 0.1; // Stay between 10% and 90% of the path
      const lat = source.lat + (target.lat - source.lat) * progress;
      const lng = source.lng + (target.lng - source.lng) * progress;
      
      const is_driving = Math.random() > 0.3; // 70% chance they are driving

      volunteers.push({
        id: `V${i + 1}`,
        lat,
        lng,
        is_driving,
        edge_type: edge.type, // Used to determine car vs boat
      });
    }

    return { nodes, edges, volunteers };
  }, []);

  const mapHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
      <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
      <style>
        body { padding: 0; margin: 0; background-color: ${colors.background}; }
        #map { height: 100vh; width: 100vw; }
        
        /* Custom dark theme for popups to match your app */
        .leaflet-popup-content-wrapper {
          background-color: ${colors.surface};
          color: ${colors.text};
          border-radius: 8px;
        }
        .leaflet-popup-tip { background-color: ${colors.surface}; }
        
        /* Icon container styles */
        .icon-container {
          display: flex; justify-content: center; align-items: center;
          width: 28px; height: 28px; border-radius: 50%;
          border: 2px solid white; box-shadow: 0 0 6px rgba(0,0,0,0.6);
        }
        .icon-svg { fill: white; width: 16px; height: 16px; }
        
        /* Volunteer specific styles */
        .volunteer-icon { width: 22px; height: 22px; border: 1.5px solid white; }
      </style>
    </head>
    <body>
      <div id="map"></div>
      <script>
        const graph = ${JSON.stringify(graphData)};
        
        // Initialize map centered on Sylhet
        const map = L.map('map', { zoomControl: false }).setView([24.8949, 91.8687], 10);

        // Standard OpenStreetMap Tiles (Online mode) - Exactly as before
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 18,
          attribution: '© OpenStreetMap'
        }).addTo(map);

        // --- SVG PATHS ---
        const svgs = {
          pentagon: '<path d="M12 2L2 9l4 13h12l4-13z"/>',
          house: '<path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>',
          hospital: '<path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-2 10h-4v4h-2v-4H7v-2h4V7h2v4h4v2z"/>',
          drone: '<path d="M12 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm-4 7V7H4v2h2v4H4v2h4v-2h4v2h4v-2h2v-4h-2V7h-4v2H8zm-1 2h10v2H7v-2z"/>',
          person: '<path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>',
          car: '<path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"/>',
          boat: '<path d="M2 21h20v-2H2v2zm3.5-3l1.83-5.5H16.67L18.5 18h-13zM6 11l-3-6 5.51 1.84L9 4.5l2.49 2.34L17 5l-3 6H6z"/>'
        };

        const getNode = (id) => graph.nodes.find(n => n.id === id);

        // 1. Draw Edges
        graph.edges.forEach(edge => {
          const sourceNode = getNode(edge.source);
          const targetNode = getNode(edge.target);
          
          if (sourceNode && targetNode) {
            const latlngs = [
              [sourceNode.lat, sourceNode.lng],
              [targetNode.lat, targetNode.lng]
            ];
            
            // Style logic based on edge constraints
            let color = '#94a3b8'; // Default road (textMuted)
            let dashArray = null;

            if (edge.is_flooded) {
              color = '${colors.primary}'; // Red for flooded
              dashArray = '5, 5';
            } else if (edge.type === 'waterway' || edge.type === 'river') {
              color = '#3b82f6'; // Blue for rivers/waterways
            }

            L.polyline(latlngs, {
              color: color,
              weight: 3,
              dashArray: dashArray,
              opacity: 0.8
            }).addTo(map).bindPopup('Route: ' + edge.type + '<br>Time: ' + (edge.base_weight_mins || 'N/A') + ' mins');
          }
        });

        // 2. Draw Facility Nodes
        graph.nodes.forEach(node => {
          let bgColor = '#64748b';
          let svgPath = svgs.house;

          if (node.type === 'central_command') { bgColor = '${colors.primary}'; svgPath = svgs.pentagon; }
          else if (node.type === 'hospital') { bgColor = '${colors.accentGreen}'; svgPath = svgs.hospital; }
          else if (node.type === 'supply_drop') { bgColor = '#8b5cf6'; svgPath = svgs.drone; }
          else if (node.type === 'relief_camp') { bgColor = '${colors.accentYellow}'; }

          const iconHtml = \`
            <div class="icon-container" style="background-color: \${bgColor};">
              <svg viewBox="0 0 24 24" class="icon-svg">\${svgPath}</svg>
            </div>
          \`;

          const customIcon = L.divIcon({ html: iconHtml, className: '', iconSize: [28, 28], iconAnchor: [14, 14] });
          L.marker([node.lat, node.lng], { icon: customIcon })
            .addTo(map)
            .bindPopup('<b>' + node.name + '</b><br>Type: ' + node.type);
        });

        // 3. Draw Volunteers
        graph.volunteers.forEach(vol => {
          let svgPath = svgs.person;
          let bgColor = '#94a3b8';
          
          if (vol.is_driving) {
            if (vol.edge_type === 'waterway' || vol.edge_type === 'river') {
               svgPath = svgs.boat;
               bgColor = '#0284c7';
            } else {
               svgPath = svgs.car;
               bgColor = '#ea580c';
            }
          }

          const iconHtml = \`
            <div class="icon-container volunteer-icon" style="background-color: \${bgColor};">
              <svg viewBox="0 0 24 24" class="icon-svg" style="width:12px; height:12px;">\${svgPath}</svg>
            </div>
          \`;

          const customIcon = L.divIcon({ html: iconHtml, className: '', iconSize: [22, 22], iconAnchor: [11, 11] });
          L.marker([vol.lat, vol.lng], { icon: customIcon })
            .addTo(map)
            .bindPopup('<b>Volunteer ' + vol.id + '</b><br>Status: ' + (vol.is_driving ? 'Driving' : 'Walking'));
        });
      </script>
    </body>
    </html>
  `;

  return (
    <View style={styles.root}>
      <StatusBar style="light" />
      <WebView
        ref={webviewRef}
        originWhitelist={['*']}
        source={{ html: mapHtml }}
        style={styles.map}
        scrollEnabled={false}
        bounces={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  map: { flex: 1, backgroundColor: 'transparent' },
});