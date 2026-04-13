import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../core/theme.dart';
import '../providers/data_provider.dart';
import 'scheduling_simulation_screen.dart';

class DeliveryRequest {
  final String id;
  final String targetId;
  final String targetName;
  final String priority;
  final int slaMins;
  final String details;

  List<String> path = [];
  int travelTime = 0;
  int slackTime = 0;
  bool isAirDrop = false;
  
  // FIX: Added missing properties for the report screen
  int completionTime = 0; 
  bool isBreach = false;

  DeliveryRequest(this.id, this.targetId, this.targetName, this.priority, this.slaMins, this.details);
}

class PrioritySchedulingScreen extends StatefulWidget {
  const PrioritySchedulingScreen({super.key});

  @override
  State<PrioritySchedulingScreen> createState() => _PrioritySchedulingScreenState();
}

class _PrioritySchedulingScreenState extends State<PrioritySchedulingScreen> {
  final List<DeliveryRequest> _requests = [
    DeliveryRequest("REQ-001", "N7", "Gowainghat Camp", "P0", 180, "Antivenom & Blood Bags"),
    DeliveryRequest("REQ-002", "N11", "Derai Camp", "P1", 600, "Emergency Food Rations"),
    DeliveryRequest("REQ-003", "N3", "Sunamganj Sadar Camp", "P1", 600, "Water Purification Kits"),
    DeliveryRequest("REQ-004", "N4", "Companyganj Outpost", "P2", 1440, "Thermal Blankets"),
    DeliveryRequest("REQ-005", "N8", "Jaintiapur Camp", "P2", 1440, "Standard Medicine"),
    DeliveryRequest("REQ-006", "N9", "Bishwanath Camp", "P0", 180, "Critical Surgical Tools"),
    DeliveryRequest("REQ-007", "N10", "Golapganj Camp", "P3", 4320, "Tent Canvas & Construction"),
  ];

  Map<String, dynamic> _runDijkstra(String source, String target, List<Map<String, dynamic>> nodes, List<Map<String, dynamic>> edges) {
    Map<String, int> distances = {};
    Map<String, Map<String, dynamic>> previous = {};
    Set<String> unvisited = {};

    for (var n in nodes) {
      distances[n['id']] = 999999;
      unvisited.add(n['id']);
    }
    distances[source] = 0;

    while (unvisited.isNotEmpty) {
      String? current;
      for (var n in unvisited) {
        if (current == null || distances[n]! < distances[current]!) current = n;
      }

      if (current == target || distances[current] == 999999) break;
      unvisited.remove(current);

      var neighbors = edges.where((e) => e['is_flooded'] != true && (e['source'] == current || e['target'] == current)).toList();

      for (var edge in neighbors) {
        String neighborId = edge['source'] == current ? edge['target'] : edge['source'];
        if (unvisited.contains(neighborId)) {
          int alt = distances[current]! + (edge['base_weight_mins'] as int);
          if (alt < distances[neighborId]!) {
            distances[neighborId] = alt;
            previous[neighborId] = {'node': current, 'edge': edge['id']};
          }
        }
      }
    }

    List<String> pathEdges = [];
    String curr = target;
    while (previous.containsKey(curr)) {
      pathEdges.add(previous[curr]!['edge']);
      curr = previous[curr]!['node'];
    }
    return {'path': pathEdges.reversed.toList(), 'totalTime': distances[target]};
  }

  void _generateScheduleAndSimulate() {
    final provider = context.read<DataProvider>();
    
    for (var req in _requests) {
      var route = _runDijkstra("N1", req.targetId, provider.nodes, provider.edges);
      
      // If Unreachable, Fallback to AirDrop via Airport (N2)
      if (route['totalTime'] == 999999) {
        var airportRoute = _runDijkstra("N1", "N2", provider.nodes, provider.edges);
        req.path = List<String>.from(airportRoute['path']);
        req.travelTime = (airportRoute['totalTime'] as int) + 45; // 45 mins flight time
        req.isAirDrop = true;
      } else {
        req.path = List<String>.from(route['path']);
        req.travelTime = route['totalTime'] as int;
        req.isAirDrop = false;
      }
      
      // Calculate Slack: How much time we have to spare before breaching SLA
      req.slackTime = req.slaMins - req.travelTime;
    }

    // Advanced Sorting: Priority Level first, then by Slack Time.
    // This allows a P1 with 0 slack to be processed before a P0 with massive slack!
    _requests.sort((a, b) {
      int pA = int.parse(a.priority.substring(1));
      int pB = int.parse(b.priority.substring(1));
      if (pA != pB) {
        if (a.slackTime > 300 && b.slackTime < 0) return 1; // Process B first if A is safe
        return pA.compareTo(pB);
      }
      return a.slackTime.compareTo(b.slackTime);
    });

    Navigator.pushReplacement(
      context,
      MaterialPageRoute(
        builder: (context) => SchedulingSimulationScreen(scheduledRequests: _requests),
      ),
    );
  }

  Color _getPriorityColor(String priority) {
    if (priority == "P0") return const Color(0xFFF04E36); // Red
    if (priority == "P1") return const Color(0xFFEAB308); // Orange
    if (priority == "P2") return const Color(0xFF3B82F6); // Blue
    return const Color(0xFF64748B); // Grey
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 1,
        iconTheme: const IconThemeData(color: AppColors.surface),
        title: const Text('Logistics Queue', style: TextStyle(color: AppColors.surface, fontWeight: FontWeight.bold)),
      ),
      body: Column(
        children: [
          Container(
            padding: const EdgeInsets.all(20),
            color: Colors.white,
            child: ElevatedButton.icon(
              style: ElevatedButton.styleFrom(
                backgroundColor: AppColors.primary,
                minimumSize: const Size(double.infinity, 60),
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(15)),
              ),
              icon: const Icon(Icons.bolt, color: Colors.white),
              label: const Text('SCHEDULE BASED ON PRIORITY', style: TextStyle(color: Colors.white, fontWeight: FontWeight.w900, letterSpacing: 1)),
              onPressed: _generateScheduleAndSimulate,
            ),
          ),
          Expanded(
            child: ListView.builder(
              padding: const EdgeInsets.all(20),
              itemCount: _requests.length,
              itemBuilder: (context, index) {
                final req = _requests[index];
                return Container(
                  margin: const EdgeInsets.only(bottom: 12),
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(12),
                    border: Border(left: BorderSide(color: _getPriorityColor(req.priority), width: 6)),
                    boxShadow: [BoxShadow(color: Colors.black.withOpacity(0.05), blurRadius: 5)],
                  ),
                  child: ListTile(
                    contentPadding: const EdgeInsets.symmetric(horizontal: 20, vertical: 8),
                    title: Text(req.targetName, style: const TextStyle(fontWeight: FontWeight.bold, color: AppColors.surface)),
                    subtitle: Padding(
                      padding: const EdgeInsets.only(top: 8),
                      child: Text(req.details, style: const TextStyle(fontSize: 12, color: AppColors.textMuted)),
                    ),
                    trailing: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Text(req.priority, style: TextStyle(fontWeight: FontWeight.w900, color: _getPriorityColor(req.priority), fontSize: 16)),
                        Text('${req.slaMins ~/ 60}h SLA', style: const TextStyle(fontSize: 10, color: AppColors.textMuted, fontWeight: FontWeight.bold)),
                      ],
                    ),
                  ),
                );
              },
            ),
          )
        ],
      ),
    );
  }
}