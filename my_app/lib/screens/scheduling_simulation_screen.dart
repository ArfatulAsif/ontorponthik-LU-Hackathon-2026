import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:webview_flutter/webview_flutter.dart';
import 'package:provider/provider.dart';
import '../core/theme.dart';
import '../providers/data_provider.dart';
import 'priority_scheduling_screen.dart';
import 'scheduling_report_screen.dart';

class SchedulingSimulationScreen extends StatefulWidget {
  final List<DeliveryRequest> scheduledRequests;

  const SchedulingSimulationScreen({super.key, required this.scheduledRequests});

  @override
  State<SchedulingSimulationScreen> createState() => _SchedulingSimulationScreenState();
}

class _SchedulingSimulationScreenState extends State<SchedulingSimulationScreen> {
  late final WebViewController _controller;

  @override
  void initState() {
    super.initState();

    final provider = context.read<DataProvider>();
    final graphData = {
      "nodes": provider.nodes,
      "edges": provider.edges,
    };
    
    // Convert requests to JSON for JS Loop
    final requestsJsonData = widget.scheduledRequests.map((r) => {
      'id': r.id,
      'targetId': r.targetId,
      'targetName': r.targetName,
      'priority': r.priority,
      'path': r.path,
      'isAirDrop': r.isAirDrop
    }).toList();

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
        #info-panel { position: absolute; top: 20px; left: 20px; right: 20px; z-index: 1000; background: rgba(15, 42, 61, 0.9); color: #fff; padding: 15px; border-radius: 8px; border: 2px solid #2FC94E; font-weight: bold; text-align: center;}
      </style>
    </head>
    <body>
      <div id="info-panel">Initializing Fleet Simulator...</div>
      <div id="map"></div>

      <script>
        const graph = ${jsonEncode(graphData)};
        const requests = ${jsonEncode(requestsJsonData)};
        
        const map = L.map('map', { zoomControl: false }).setView([24.95, 91.8], 10);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 18 }).addTo(map);

        const svgs = {
          pentagon: '<path d="M12 2L2 9l4 13h12l4-13z"/>',
          house: '<path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>',
          car: '<path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"/>',
          boat: '<path d="M2 21h20v-2H2v2zm3.5-3l1.83-5.5H16.67L18.5 18h-13zM6 11l-3-6 5.51 1.84L9 4.5l2.49 2.34L17 5l-3 6H6z"/>',
          plane: '<path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/>'
        };

        const getNode = (id) => graph.nodes.find(n => n.id === id);
        
        // Draw Base Nodes
        graph.nodes.forEach(node => {
          let bgColor = '#64748b';
          let svgPath = svgs.house;
          if (node.type === 'central_command') { bgColor = '#F04E36'; svgPath = svgs.pentagon; }
          const iconHtml = `<div style="display: flex; justify-content: center; align-items: center; width: 20px; height: 20px; border-radius: 50%; border: 2px solid white; background-color: \${bgColor};"><svg viewBox="0 0 24 24" fill="white" style="width: 12px; height: 12px;">\${svgPath}</svg></div>`;
          const customIcon = L.divIcon({ html: iconHtml, className: '', iconSize: [20, 20] });
          L.marker([node.lat, node.lng], { icon: customIcon }).addTo(map);
        });

        function animateVehicle(startNode, endNode, type) {
          return new Promise(resolve => {
            let svgPath = type === 'waterway' ? svgs.boat : (type === 'air' ? svgs.plane : svgs.car);
            let bgColor = type === 'waterway' ? '#1E3A8A' : (type === 'air' ? '#000000' : '#2FC94E');

            const iconHtml = `<div style="display: flex; justify-content: center; align-items: center; width: 30px; height: 30px; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 10px rgba(0,0,0,0.8); background-color: \${bgColor};"><svg viewBox="0 0 24 24" fill="white" style="width: 18px; height: 18px;">\${svgPath}</svg></div>`;
            const customIcon = L.divIcon({ html: iconHtml, className: '', iconSize: [30, 30], iconAnchor: [15, 15] });
            const marker = L.marker([startNode.lat, startNode.lng], { icon: customIcon, zIndexOffset: 1000 }).addTo(map);

            const duration = 2000; // 2 seconds per edge
            const startTime = performance.now();

            function step(currentTime) {
              const elapsed = currentTime - startTime;
              const progress = Math.min(elapsed / duration, 1);
              marker.setLatLng([
                startNode.lat + (endNode.lat - startNode.lat) * progress,
                startNode.lng + (endNode.lng - startNode.lng) * progress
              ]);

              if (progress < 1) requestAnimationFrame(step);
              else { map.removeLayer(marker); resolve(); }
            }
            requestAnimationFrame(step);
          });
        }

        async function runSimulation() {
          let infoPanel = document.getElementById('info-panel');
          
          for(let i=0; i<requests.length; i++) {
            let req = requests[i];
            infoPanel.innerHTML = `DISPATCHING (\${req.priority}): \${req.targetName}<br><span style="font-size: 12px; font-weight: normal;">Queue Position: \${i+1} / \${requests.length}</span>`;
            
            let pathLayers = [];
            let currentNodeId = "N1";

            // Draw Full Path
            for(let j=0; j<req.path.length; j++) {
              let edge = graph.edges.find(e => e.id === req.path[j]);
              let sNode = getNode(edge.source);
              let tNode = getNode(edge.target);
              let color = edge.type === 'waterway' ? '#3b82f6' : '#2FC94E';
              let pl = L.polyline([[sNode.lat, sNode.lng], [tNode.lat, tNode.lng]], {color: color, weight: 5}).addTo(map);
              pathLayers.push(pl);
            }

            // Animate Along Path
            for(let j=0; j<req.path.length; j++) {
              let edge = graph.edges.find(e => e.id === req.path[j]);
              let startNode = currentNodeId === edge.source ? getNode(edge.source) : getNode(edge.target);
              let endNode = currentNodeId === edge.source ? getNode(edge.target) : getNode(edge.source);
              await animateVehicle(startNode, endNode, edge.type);
              currentNodeId = endNode.id;
            }

            // AirDrop Fallback Animation
            if(req.isAirDrop) {
              let airport = getNode("N2");
              let target = getNode(req.targetId);
              let dl = L.polyline([[airport.lat, airport.lng], [target.lat, target.lng]], {color: '#000', weight: 4, dashArray: '10,10'}).addTo(map);
              pathLayers.push(dl);
              await animateVehicle(airport, target, 'air');
            }

            // Clean up path for next request
            pathLayers.forEach(l => map.removeLayer(l));
          }

          infoPanel.innerHTML = "ALL UNITS DEPLOYED. Generating Report...";
          setTimeout(() => {
            AppChannel.postMessage("COMPLETE");
          }, 1000);
        }

        setTimeout(runSimulation, 1000);
      </script>
    </body>
    </html>
    ''';

    _controller = WebViewController()
      ..setJavaScriptMode(JavaScriptMode.unrestricted)
      ..setBackgroundColor(AppColors.background)
      ..addJavaScriptChannel(
        'AppChannel',
        onMessageReceived: (message) {
          if (message.message == "COMPLETE") {
            Navigator.pushReplacement(
              context,
              MaterialPageRoute(builder: (context) => SchedulingReportScreen(processedRequests: widget.scheduledRequests)),
            );
          }
        },
      )
      ..loadHtmlString(mapHtml);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: WebViewWidget(controller: _controller),
    );
  }
}