import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:webview_flutter/webview_flutter.dart';
import 'package:provider/provider.dart';
import '../core/theme.dart';
import '../providers/data_provider.dart';
import 'predict.dart';

class RouteOptimizationScreen extends StatefulWidget {
  final Map<String, dynamic> destination;

  const RouteOptimizationScreen({super.key, required this.destination});

  @override
  State<RouteOptimizationScreen> createState() => _RouteOptimizationScreenState();
}

class _RouteOptimizationScreenState extends State<RouteOptimizationScreen> {
  late final WebViewController _controller;
  String _lastGraphJson = "";

  @override
  void initState() {
    super.initState();
    // Initialize controller once
    _controller = WebViewController()
      ..setJavaScriptMode(JavaScriptMode.unrestricted)
      ..setBackgroundColor(AppColors.background)
      ..addJavaScriptChannel(
        'AppChannel',
        onMessageReceived: (JavaScriptMessage message) {
          try {
            final data = jsonDecode(message.message);
            if (data['edgeId'] != null) {
              // Instantly saves manual taps to the Global State!
              context.read<DataProvider>().updateEdgeStatus(data['edgeId'], data['isFlooded']);
            }
          } catch (e) {
            debugPrint("Error parsing WebView message: $e");
          }
        },
      );
  }

  @override
  Widget build(BuildContext context) {
    // CRITICAL: We watch the provider inside build() so this screen is hyper-reactive
    final dataProvider = context.watch<DataProvider>();
    
    final graphData = {
      "nodes": dataProvider.nodes,
      "edges": dataProvider.edges, // This now contains all manual and ML-predicted floods!
    };
    final graphJson = jsonEncode(graphData);
    final destinationId = widget.destination['id'];

    // Only reload the WebView HTML if the global state actually changed
    if (_lastGraphJson != graphJson) {
      _lastGraphJson = graphJson;

      final String mapHtml = '''
      <!DOCTYPE html>
      <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
        <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
        <style>
          body { padding: 0; margin: 0; background-color: #081F2E; font-family: sans-serif; }
          #map { height: 100vh; width: 100vw; }
          #info-panel { position: absolute; top: 20px; right: 20px; z-index: 1000; background: #0F2A3D; color: #fff; padding: 15px; border-radius: 8px; border: 1px solid #F04E36; font-weight: bold; }
          .leaflet-popup-content-wrapper { background-color: #0F2A3D; color: #F4F7FA; }
          .leaflet-popup-tip { background-color: #0F2A3D; }
          
          /* Custom Modal Styles */
          #flood-modal {
            display: none; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);
            background: #0F2A3D; border: 2px solid #F04E36; padding: 20px;
            border-radius: 12px; z-index: 2000; flex-direction: column; align-items: center; text-align: center;
            color: white; width: 80%; max-width: 300px; box-shadow: 0px 10px 30px rgba(0,0,0,0.8);
          }
          .modal-text { font-size: 16px; margin-bottom: 20px; line-height: 1.4; }
          .btn-row { display: flex; justify-content: space-between; width: 100%; }
          .modal-btn { padding: 12px 0; border-radius: 8px; border: none; font-weight: bold; width: 48%; font-size: 14px; }
          .btn-yes { background: #F04E36; color: white; }
          .btn-no { background: #64748b; color: white; }
        </style>
      </head>
      <body>
        <div id="info-panel">Calculating route...</div>
        <div id="map"></div>

        <div id="flood-modal">
          <div class="modal-text" id="modal-text">Is there a flood or severe issue in this edge?</div>
          <div class="btn-row">
            <button class="modal-btn btn-no" onclick="closeModal()">No</button>
            <button class="modal-btn btn-yes" onclick="confirmFlood()">Yes</button>
          </div>
        </div>

        <script>
          const graph = $graphJson;
          const TARGET_NODE = "$destinationId";
          const SOURCE_NODE = "N1";
          
          const map = L.map('map', { zoomControl: false }).setView([24.95, 91.8], 10);
          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 18 }).addTo(map);

          const svgs = {
            pentagon: '<path d="M12 2L2 9l4 13h12l4-13z"/>',
            house: '<path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>',
            hospital: '<path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-2 10h-4v4h-2v-4H7v-2h4V7h2v4h4v2z"/>',
            drone: '<path d="M12 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm-4 7V7H4v2h2v4H4v2h4v-2h4v2h4v-2h2v-4h-2V7h-4v2H8zm-1 2h10v2H7v-2z"/>',
            car: '<path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"/>',
            boat: '<path d="M2 21h20v-2H2v2zm3.5-3l1.83-5.5H16.67L18.5 18h-13zM6 11l-3-6 5.51 1.84L9 4.5l2.49 2.34L17 5l-3 6H6z"/>',
            plane: '<path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/>'
          };

          const getNode = (id) => graph.nodes.find(n => n.id === id);
          let activeLayers = [];
          let polylineMap = {}; 
          let pendingEdge = null; 
          let currentRenderId = 0;

          function closeModal() {
            document.getElementById('flood-modal').style.display = 'none';
            pendingEdge = null;
          }

          function confirmFlood() {
            if (pendingEdge) {
              const newStatus = !pendingEdge.is_flooded;
              pendingEdge.is_flooded = newStatus; 
              
              if (window.AppChannel) {
                 AppChannel.postMessage(JSON.stringify({
                   edgeId: pendingEdge.id,
                   isFlooded: newStatus
                 }));
              }
              renderNetwork(); 
            }
            closeModal();
          }

          function calculateShortestPath(targetId) {
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

              if (current === targetId || distances[current] === Infinity) break;
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
            let curr = targetId;
            while (previous[curr]) {
              pathEdges.push(previous[curr].edge);
              curr = previous[curr].node;
            }
            return { path: pathEdges.reverse(), totalTime: distances[targetId] };
          }

          async function renderNetwork() {
            currentRenderId++;
            const myRenderId = currentRenderId;

            activeLayers.forEach(layer => map.removeLayer(layer));
            activeLayers = [];
            polylineMap = {};

            let routeData = calculateShortestPath(TARGET_NODE);
            let infoPanel = document.getElementById('info-panel');
            let isFallback = false;
            let airportNode = null;

            if (routeData.totalTime === Infinity) {
              airportNode = graph.nodes.find(n => n.type === 'supply_drop');
              if (airportNode) {
                routeData = calculateShortestPath(airportNode.id);
                if (routeData.totalTime !== Infinity) {
                  isFallback = true;
                  infoPanel.innerHTML = "DESTINATION UNREACHABLE<br>Re-routing via Air Drop...";
                  infoPanel.style.borderColor = "#EAB308";
                } else {
                  infoPanel.innerHTML = "SYSTEM FAILURE<br>All logistics pathways flooded.";
                  infoPanel.style.borderColor = "red";
                }
              }
            } else {
              infoPanel.innerHTML = "ETA: " + routeData.totalTime + " mins<br>Routing Active...";
              infoPanel.style.borderColor = "#2FC94E";
            }

            graph.edges.forEach(edge => {
              const sourceNode = getNode(edge.source);
              const targetNode = getNode(edge.target);
              
              if (sourceNode && targetNode) {
                let color = '#64748b'; 
                let weight = 3;
                let dashArray = null;

                if (edge.is_flooded) {
                  color = '#F04E36'; 
                  dashArray = '5, 5';
                } else if (edge.type === 'waterway') {
                  color = '#3b82f6'; 
                }

                const polyline = L.polyline([[sourceNode.lat, sourceNode.lng], [targetNode.lat, targetNode.lng]], {
                  color: color, weight: weight, dashArray: dashArray, opacity: 0.6
                });

                polyline.on('click', function () {
                  pendingEdge = edge;
                  if (edge.is_flooded) {
                    document.getElementById('modal-text').innerText = "Remove flood warning from this route?";
                  } else {
                    document.getElementById('modal-text').innerText = "Is there a flood or severe issue in this edge?";
                  }
                  document.getElementById('flood-modal').style.display = 'flex';
                });

                polyline.addTo(map);
                activeLayers.push(polyline);
                polylineMap[edge.id] = polyline; 
              }
            });

            graph.nodes.forEach(node => {
              if (node.type !== 'relief_camp' && node.type !== 'supply_drop' && node.id !== SOURCE_NODE && node.id !== TARGET_NODE) return;
              let bgColor = '#64748b';
              let svgPath = svgs.house;

              if (node.type === 'central_command') { bgColor = '#F04E36'; svgPath = svgs.pentagon; }
              else if (node.type === 'supply_drop') { bgColor = '#8b5cf6'; svgPath = svgs.drone; }
              else if (node.type === 'relief_camp') { bgColor = '#EAB308'; }

              if (node.id === SOURCE_NODE || node.id === TARGET_NODE) bgColor = '#2FC94E';

              const iconHtml = `<div style="display: flex; justify-content: center; align-items: center; width: 28px; height: 28px; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 6px rgba(0,0,0,0.6); background-color: \${bgColor};"><svg viewBox="0 0 24 24" fill="white" style="width: 16px; height: 16px;">\${svgPath}</svg></div>`;
              const customIcon = L.divIcon({ html: iconHtml, className: '', iconSize: [28, 28], iconAnchor: [14, 14] });
              
              const marker = L.marker([node.lat, node.lng], { icon: customIcon }).bindPopup('<b>' + node.name + '</b>');
              marker.addTo(map);
              activeLayers.push(marker);
            });

            if (routeData.totalTime !== Infinity && routeData.path.length > 0) {
              let currentNodeId = SOURCE_NODE;
              
              for (let i = 0; i < routeData.path.length; i++) {
                if (myRenderId !== currentRenderId) return; 

                let edgeId = routeData.path[i];
                let edge = graph.edges.find(e => e.id === edgeId);
                let pl = polylineMap[edgeId];
                
                let color = (edge.type === 'waterway' || edge.type === 'river') ? '#1E3A8A' : '#2FC94E';
                
                if (pl) {
                  pl.setStyle({ color: color, weight: 6, opacity: 1.0, dashArray: null });
                  pl.bringToFront();
                }

                let startNode = currentNodeId === edge.source ? getNode(edge.source) : getNode(edge.target);
                let endNode = currentNodeId === edge.source ? getNode(edge.target) : getNode(edge.source);
                
                await animateVehicle(startNode, endNode, edge.type, myRenderId);
                
                currentNodeId = endNode.id;
              }

              if (myRenderId !== currentRenderId) return;

              if (isFallback && airportNode) {
                let tNode = getNode(TARGET_NODE);
                
                let blackLine = L.polyline([[airportNode.lat, airportNode.lng], [tNode.lat, tNode.lng]], {
                  color: '#000000', weight: 4, dashArray: '10, 10'
                }).addTo(map);
                activeLayers.push(blackLine);
                
                await animateVehicle(airportNode, tNode, 'air', myRenderId);
                
                if (myRenderId === currentRenderId) {
                   infoPanel.innerHTML = "Package Delivered via Drone Air Drop!";
                   infoPanel.style.borderColor = "#8b5cf6"; 
                }
              } else {
                if (myRenderId === currentRenderId) {
                   infoPanel.innerHTML = "ETA: " + routeData.totalTime + " mins<br>Package Delivered!";
                }
              }
            }
          }

          function animateVehicle(startNode, endNode, type, myRenderId) {
            return new Promise(resolve => {
              let svgPath, bgColor;
              if (type === 'waterway' || type === 'river') {
                svgPath = svgs.boat; bgColor = '#1E3A8A'; 
              } else if (type === 'air') {
                svgPath = svgs.plane; bgColor = '#000000'; 
              } else {
                svgPath = svgs.car; bgColor = '#2FC94E'; 
              }

              const iconHtml = `<div style="display: flex; justify-content: center; align-items: center; width: 28px; height: 28px; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 10px rgba(0,0,0,0.8); background-color: \${bgColor};"><svg viewBox="0 0 24 24" fill="white" style="width: 16px; height: 16px;">\${svgPath}</svg></div>`;
              const customIcon = L.divIcon({ html: iconHtml, className: '', iconSize: [28, 28], iconAnchor: [14, 14] });
              
              const marker = L.marker([startNode.lat, startNode.lng], { icon: customIcon }).addTo(map);
              activeLayers.push(marker);

              const duration = 2000; 
              const startTime = performance.now();

              function step(currentTime) {
                if (myRenderId !== currentRenderId) {
                  map.removeLayer(marker);
                  resolve();
                  return;
                }

                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);

                const currentLat = startNode.lat + (endNode.lat - startNode.lat) * progress;
                const currentLng = startNode.lng + (endNode.lng - startNode.lng) * progress;
                
                marker.setLatLng([currentLat, currentLng]);

                if (progress < 1) {
                  requestAnimationFrame(step);
                } else {
                  map.removeLayer(marker);
                  resolve();
                }
              }
              requestAnimationFrame(step);
            });
          }

          renderNetwork();
        </script>
      </body>
      </html>
      ''';

      _controller.loadHtmlString(mapHtml);
    }

    return Scaffold(
      appBar: AppBar(
        backgroundColor: AppColors.surface,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back, color: AppColors.primary),
          onPressed: () => Navigator.pop(context),
        ),
        title: Text('Delivering to: ${widget.destination['name']}', style: const TextStyle(fontSize: 16)),
      ),
      body: Stack(
        children: [
          // The Interactive Map
          WebViewWidget(controller: _controller),

          // The ML Prediction Button Overlay
          Positioned(
            bottom: 20,
            left: 20,
            child: ElevatedButton.icon(
              style: ElevatedButton.styleFrom(
                backgroundColor: const Color(0xFF0284c7), // Ocean Blue
                foregroundColor: Colors.white,
                padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(30)),
                elevation: 8,
              ),
              icon: const Icon(Icons.water_drop, size: 18),
              label: const Text("Proactively Predict", style: TextStyle(fontSize: 13, fontWeight: FontWeight.bold)),
              onPressed: () {
                Navigator.pushReplacement(
                  context,
                  MaterialPageRoute(
                    builder: (context) => PredictScreen(destination: widget.destination),
                  ),
                );
              },
            ),
          ),
        ],
      ),
    );
  }
}