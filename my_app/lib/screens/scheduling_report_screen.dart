import 'package:flutter/material.dart';
import '../core/theme.dart';
import 'priority_scheduling_screen.dart';

class SchedulingReportScreen extends StatelessWidget {
  final List<DeliveryRequest> processedRequests;

  const SchedulingReportScreen({super.key, required this.processedRequests});

  @override
  Widget build(BuildContext context) {
    int cumulativeTime = 0;
    int breaches = 0;

    // Calculate Final Timings and Breaches
    for (var req in processedRequests) {
      cumulativeTime += req.travelTime;
      req.completionTime = cumulativeTime;
      if (req.completionTime > req.slaMins) {
        req.isBreach = true;
        breaches++;
      }
    }

    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 1,
        title: const Text('Logistics SLA Report', style: TextStyle(color: AppColors.surface, fontWeight: FontWeight.bold)),
        leading: IconButton(
          icon: const Icon(Icons.close, color: AppColors.surface),
          onPressed: () => Navigator.pop(context), // Returns to Dashboard
        ),
      ),
      body: Column(
        children: [
          // SUMMARY CARDS
          Container(
            padding: const EdgeInsets.all(20),
            color: Colors.white,
            child: Row(
              children: [
                Expanded(
                  child: _buildSummaryCard(
                    'TOTAL DISPATCHED',
                    '${processedRequests.length}',
                    AppColors.surface,
                    Icons.local_shipping,
                  ),
                ),
                const SizedBox(width: 15),
                Expanded(
                  child: _buildSummaryCard(
                    'SLA BREACHES',
                    '$breaches',
                    breaches > 0 ? const Color(0xFFF04E36) : const Color(0xFF2FC94E),
                    breaches > 0 ? Icons.warning_amber_rounded : Icons.check_circle,
                  ),
                ),
              ],
            ),
          ),
          
          // LIST OF EXECUTED REQUESTS
          Expanded(
            child: ListView.builder(
              padding: const EdgeInsets.all(20),
              itemCount: processedRequests.length,
              itemBuilder: (context, index) {
                final req = processedRequests[index];
                return Container(
                  margin: const EdgeInsets.only(bottom: 15),
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(16),
                    border: Border.all(color: req.isBreach ? const Color(0xFFFCA5A5) : const Color(0xFFE2E8F0)),
                    boxShadow: [BoxShadow(color: Colors.black.withOpacity(0.02), blurRadius: 5)],
                  ),
                  child: Padding(
                    padding: const EdgeInsets.all(16),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Row(
                              children: [
                                Container(
                                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                                  decoration: BoxDecoration(color: AppColors.surface, borderRadius: BorderRadius.circular(8)),
                                  child: Text('#${index + 1}', style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
                                ),
                                const SizedBox(width: 10),
                                Text(req.targetName, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16, color: AppColors.surface)),
                              ],
                            ),
                            Text(req.priority, style: const TextStyle(fontWeight: FontWeight.w900, fontSize: 16, color: AppColors.textMuted)),
                          ],
                        ),
                        const SizedBox(height: 12),
                        Row(
                          children: [
                            const Icon(Icons.timer_outlined, size: 14, color: AppColors.textMuted),
                            const SizedBox(width: 4),
                            Text('Delivery ETA: ${req.completionTime} mins', style: const TextStyle(fontSize: 12, color: AppColors.surface, fontWeight: FontWeight.w600)),
                            const Spacer(),
                            Container(
                              padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                              decoration: BoxDecoration(
                                color: req.isBreach ? const Color(0xFFFEF2F2) : const Color(0xFFF0FDF4),
                                borderRadius: BorderRadius.circular(12),
                              ),
                              child: Text(
                                req.isBreach ? 'BREACHED (${req.slaMins}m Limit)' : 'SLA MET',
                                style: TextStyle(
                                  fontSize: 10, fontWeight: FontWeight.w900,
                                  color: req.isBreach ? const Color(0xFFF04E36) : const Color(0xFF2FC94E),
                                ),
                              ),
                            )
                          ],
                        ),
                        if (req.isAirDrop)
                          Padding(
                            padding: const EdgeInsets.only(top: 8),
                            child: Row(
                              children: const [
                                Icon(Icons.flight_takeoff, size: 14, color: Color(0xFF8B5CF6)),
                                SizedBox(width: 4),
                                Text('Re-routed via Emergency Air Drop', style: TextStyle(fontSize: 12, color: Color(0xFF8B5CF6), fontStyle: FontStyle.italic)),
                              ],
                            ),
                          )
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

  Widget _buildSummaryCard(String title, String value, Color color, IconData icon) {
    return Container(
      padding: const EdgeInsets.all(15),
      decoration: BoxDecoration(
        color: const Color(0xFFF8FAFC),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: const Color(0xFFE2E8F0)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Icon(icon, color: color, size: 28),
          const SizedBox(height: 12),
          Text(value, style: TextStyle(fontSize: 24, fontWeight: FontWeight.w900, color: color)),
          Text(title, style: const TextStyle(fontSize: 10, fontWeight: FontWeight.w800, color: AppColors.textMuted, letterSpacing: 0.5)),
        ],
      ),
    );
  }
}