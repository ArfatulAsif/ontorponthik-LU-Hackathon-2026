import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:webview_flutter/webview_flutter.dart';
import 'package:provider/provider.dart';
import '../core/theme.dart';
import '../providers/data_provider.dart';

class DashboardScreen extends StatefulWidget {
  const DashboardScreen({super.key});

  @override
  State<DashboardScreen> createState() => _DashboardScreenState();
}

class _DashboardScreenState extends State<DashboardScreen> {
  late final WebViewController _controller;

  @override
  void initState() {
    super.initState();
    
    // 1. Fetch initial data from Provider WITHOUT listening to changes in initState
    final dataProvider = context.read<DataProvider>();
    final graphData = {
      "nodes": dataProvider.nodes,
      "edges": dataProvider.edges,
      "volunteers": dataProvider.volunteers,
    };
    final graphJson = jsonEncode(graphData);

    // 2. Generate HTML exactly once
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
        .leaflet-popup-content-wrapper { background-color: #0f2a3d; color: #f4f7fa; border-radius: 8px; }
        .leaflet-popup-tip { background-color: #0f2a3d; }
        .icon-container { display: flex; justify-content: center; align-items: center; width: 28px; height: 28px; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 6px rgba(0,0,0,0.6); }
        .icon-svg { fill: white; width: 16px; height: 16px; }
        .volunteer-icon { width: 22px; height: 22px; border: 1.5px solid white; }

        #flood-modal {
          display: none; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);
          background: #0f2a3d; border: 2px solid #F04E36; padding: 20px;
          border-radius: 12px; z-index: 2000; flex-direction: column; align-items: center; text-align: center;
          color: white; width: 80%; max-width: 300px; box-shadow: 0px 10px 30px rgba(0,0,0,0.8);
        }
        .modal-text { font-size: 16px; margin-bottom: 20px; line-height: 1.4; }
        .btn-row { display: flex; justify-content: space-between; width: 100%; }
        .modal-btn { padding: 12px 0; border-radius: 8px; border: none; font-weight: bold; width: 48%; font-size: 14px; }
        .btn-yes { background: #F04E36; color: white; }
        .btn-no { background: #94a3b8; color: white; }
      </style>
    </head>
    <body>
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
        let pendingEdge = null; 

        const map = L.map('map', { zoomControl: false }).setView([24.8949, 91.8687], 10);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 18 }).addTo(map);

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

        function closeModal() {
          document.getElementById('flood-modal').style.display = 'none';
          pendingEdge = null;
        }

        function confirmFlood() {
          if (pendingEdge) {
            const newStatus = !pendingEdge.is_flooded;
            AppChannel.postMessage(JSON.stringify({
              edgeId: pendingEdge.id,
              isFlooded: newStatus
            }));
            
            // Re-render local JS map instantly so we don't have to reload the whole HTML
            pendingEdge.is_flooded = newStatus;
            renderNetwork();
          }
          closeModal();
        }
        
        let activeLayers = [];

        function renderNetwork() {
          activeLayers.forEach(layer => map.removeLayer(layer));
          activeLayers = [];
          
          graph.edges.forEach(edge => {
            const sourceNode = getNode(edge.source);
            const targetNode = getNode(edge.target);
            if (sourceNode && targetNode) {
              let color = '#94a3b8';
              let dashArray = null;
              if (edge.is_flooded) { color = '#F04E36'; dashArray = '5, 5'; } 
              else if (edge.type === 'waterway' || edge.type === 'river') { color = '#3b82f6'; }

              const polyline = L.polyline([[sourceNode.lat, sourceNode.lng], [targetNode.lat, targetNode.lng]], {
                color: color, weight: 3, dashArray: dashArray, opacity: 0.8
              }).addTo(map);

              polyline.on('click', function () {
                pendingEdge = edge;
                document.getElementById('modal-text').innerText = edge.is_flooded 
                  ? "Remove flood warning from this route?" 
                  : "Is there a flood or severe issue in this edge?";
                document.getElementById('flood-modal').style.display = 'flex';
              });
              activeLayers.push(polyline);
            }
          });

          graph.nodes.forEach(node => {
            let bgColor = '#64748b';
            let svgPath = svgs.house;
            if (node.type === 'central_command') { bgColor = '#F04E36'; svgPath = svgs.pentagon; }
            else if (node.type === 'hospital') { bgColor = '#2FC94E'; svgPath = svgs.hospital; }
            else if (node.type === 'supply_drop') { bgColor = '#8b5cf6'; svgPath = svgs.drone; }
            else if (node.type === 'relief_camp') { bgColor = '#EAB308'; }

            const iconHtml = `<div class="icon-container" style="background-color: \${bgColor};"><svg viewBox="0 0 24 24" class="icon-svg">\${svgPath}</svg></div>`;
            const customIcon = L.divIcon({ html: iconHtml, className: '', iconSize: [28, 28], iconAnchor: [14, 14] });
            const marker = L.marker([node.lat, node.lng], { icon: customIcon }).addTo(map).bindPopup('<b>' + node.name + '</b>');
            activeLayers.push(marker);
          });

          graph.volunteers.forEach(vol => {
            let svgPath = svgs.person;
            let bgColor = '#94a3b8';
            if (vol.is_driving) {
              if (vol.edge_type === 'waterway' || vol.edge_type === 'river') { svgPath = svgs.boat; bgColor = '#0284c7'; }
              else { svgPath = svgs.car; bgColor = '#d43e10'; }
            }
            const iconHtml = `<div class="icon-container volunteer-icon" style="background-color: \${bgColor};"><svg viewBox="0 0 24 24" class="icon-svg" style="width:12px; height:12px;">\${svgPath}</svg></div>`;
            const customIcon = L.divIcon({ html: iconHtml, className: '', iconSize: [22, 22], iconAnchor: [11, 11] });
            const marker = L.marker([vol.lat, vol.lng], { icon: customIcon }).addTo(map);
            activeLayers.push(marker);
          });
        }
        
        renderNetwork();
      </script>
    </body>
    </html>
    ''';

    _controller = WebViewController()
      ..setJavaScriptMode(JavaScriptMode.unrestricted)
      ..setBackgroundColor(AppColors.background)
      ..addJavaScriptChannel(
        'AppChannel',
        onMessageReceived: (JavaScriptMessage message) {
          try {
            final data = jsonDecode(message.message);
            if (data['edgeId'] != null) {
              // Updates global state so routing screens know about the flood
              context.read<DataProvider>().updateEdgeStatus(data['edgeId'], data['isFlooded']);
            }
          } catch (e) {
            debugPrint("Error parsing WebView message: $e");
          }
        },
      )
      ..loadHtmlString(mapHtml);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      body: WebViewWidget(controller: _controller),
    );
  }
}