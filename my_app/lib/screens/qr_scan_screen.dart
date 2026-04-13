import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../core/theme.dart';
import '../providers/data_provider.dart';
import 'route_optimization_screen.dart';

class QRScanScreen extends StatefulWidget {
  const QRScanScreen({super.key});

  @override
  State<QRScanScreen> createState() => _QRScanScreenState();
}

class _QRScanScreenState extends State<QRScanScreen> with TickerProviderStateMixin {
  Map<String, dynamic>? _selectedNode;
  bool _dropdownOpen = false;

  late AnimationController _fadeCtrl;
  late Animation<double> _fadeAnim;

  late AnimationController _scanCtrl;
  late Animation<double> _scanAnim;

  @override
  void initState() {
    super.initState();

    // Fade in animation
    _fadeCtrl = AnimationController(vsync: this, duration: const Duration(milliseconds: 600));
    _fadeAnim = Tween<double>(begin: 0.0, end: 1.0).animate(CurvedAnimation(parent: _fadeCtrl, curve: Curves.easeOut));
    _fadeCtrl.forward();

    // Looping scan line animation
    _scanCtrl = AnimationController(vsync: this, duration: const Duration(milliseconds: 2000));
    _scanAnim = Tween<double>(begin: 10.0, end: 270.0).animate(CurvedAnimation(parent: _scanCtrl, curve: Curves.linear));
    _scanCtrl.repeat(reverse: true);
  }

  @override
  void dispose() {
    _fadeCtrl.dispose();
    _scanCtrl.dispose();
    super.dispose();
  }

  void _handleProceed() {
    if (_selectedNode != null) {
      Navigator.push(
        context,
        MaterialPageRoute(
          builder: (context) => RouteOptimizationScreen(destination: _selectedNode!),
        ),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    // Filter nodes from Provider
    final nodes = context.watch<DataProvider>().nodes;
    final filteredNodes = nodes.where((n) => n['type'] == 'relief_camp' || n['type'] == 'supply_drop').toList();

    return Scaffold(
      backgroundColor: AppColors.background,
      body: FadeTransition(
        opacity: _fadeAnim,
        child: SafeArea(
          child: Padding(
            padding: const EdgeInsets.symmetric(horizontal: 25, vertical: 20),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // --- HEADER ---
                GestureDetector(
                  onTap: () => Navigator.pop(context),
                  child: Row(
                    children: const [
                      Icon(Icons.chevron_left, color: AppColors.surface, size: 28),
                      Text('BACK TO HUB', style: TextStyle(color: AppColors.surface, fontSize: 12, fontWeight: FontWeight.w800, letterSpacing: 2)),
                    ],
                  ),
                ),
                Container(
                  height: 3, width: 40,
                  margin: const EdgeInsets.only(top: 10, bottom: 20), // Reduced margin
                  decoration: BoxDecoration(color: AppColors.primary, borderRadius: BorderRadius.circular(2)),
                ),

                // --- CAMERA WRAPPER ---
                Container(
                  height: 280, // Reduced from 320 to fit perfectly on all screens
                  decoration: BoxDecoration(
                    color: Colors.black, 
                    borderRadius: BorderRadius.circular(24),
                    boxShadow: [BoxShadow(color: Colors.black.withOpacity(0.2), blurRadius: 15, offset: const Offset(0, 10))],
                  ),
                  child: Stack(
                    children: [
                      // Corners
                      Positioned(top: 15, left: 15, child: Container(width: 40, height: 40, decoration: const BoxDecoration(border: Border(top: BorderSide(color: AppColors.primary, width: 4), left: BorderSide(color: AppColors.primary, width: 4)), borderRadius: BorderRadius.only(topLeft: Radius.circular(20))))),
                      Positioned(top: 15, right: 15, child: Container(width: 40, height: 40, decoration: const BoxDecoration(border: Border(top: BorderSide(color: AppColors.primary, width: 4), right: BorderSide(color: AppColors.primary, width: 4)), borderRadius: BorderRadius.only(topRight: Radius.circular(20))))),
                      Positioned(bottom: 15, left: 15, child: Container(width: 40, height: 40, decoration: const BoxDecoration(border: Border(bottom: BorderSide(color: AppColors.primary, width: 4), left: BorderSide(color: AppColors.primary, width: 4)), borderRadius: BorderRadius.only(bottomLeft: Radius.circular(20))))),
                      Positioned(bottom: 15, right: 15, child: Container(width: 40, height: 40, decoration: const BoxDecoration(border: Border(bottom: BorderSide(color: AppColors.primary, width: 4), right: BorderSide(color: AppColors.primary, width: 4)), borderRadius: BorderRadius.only(bottomRight: Radius.circular(20))))),

                      // Animated Scan Line
                      AnimatedBuilder(
                        animation: _scanAnim,
                        builder: (context, child) {
                          return Positioned(
                            top: _scanAnim.value,
                            left: 20, right: 20,
                            child: Container(
                              height: 3,
                              decoration: BoxDecoration(
                                color: AppColors.primary,
                                boxShadow: [BoxShadow(color: AppColors.primary.withOpacity(1), blurRadius: 10)],
                              ),
                            ),
                          );
                        },
                      ),

                      // Status Badge
                      Align(
                        alignment: Alignment.bottomCenter,
                        child: Container(
                          margin: const EdgeInsets.only(bottom: 15),
                          padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                          decoration: BoxDecoration(color: AppColors.surface.withOpacity(0.8), borderRadius: BorderRadius.circular(20)),
                          child: Row(
                            mainAxisSize: MainAxisSize.min,
                            children: [
                              Container(width: 6, height: 6, margin: const EdgeInsets.only(right: 8), decoration: const BoxDecoration(color: AppColors.accentGreen, shape: BoxShape.circle)),
                              const Text('SCANNER ACTIVE', style: TextStyle(color: Colors.white, fontSize: 9, fontWeight: FontWeight.w900, letterSpacing: 1)),
                            ],
                          ),
                        ),
                      ),
                    ],
                  ),
                ),

                const SizedBox(height: 30),

                // --- DROPDOWN SECTION ---
                const Text('DESTINATION NODE', style: TextStyle(color: AppColors.textMuted, fontSize: 11, fontWeight: FontWeight.w900, letterSpacing: 1.5)),
                const SizedBox(height: 12),

                GestureDetector(
                  onTap: () => setState(() => _dropdownOpen = !_dropdownOpen),
                  child: Container(
                    padding: const EdgeInsets.all(18),
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(16),
                      border: Border.all(color: _dropdownOpen ? AppColors.primary : const Color(0xFFEDF2F7), width: 1.5),
                    ),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Text(
                          _selectedNode != null ? _selectedNode!['name'] : 'SELECT RELIEF SHELTER',
                          style: TextStyle(color: _selectedNode != null ? AppColors.surface : AppColors.textMuted, fontSize: 15, fontWeight: FontWeight.w600),
                        ),
                        Icon(_dropdownOpen ? Icons.keyboard_arrow_up : Icons.keyboard_arrow_down, color: AppColors.surface),
                      ],
                    ),
                  ),
                ),

                // --- DYNAMIC EXPANDED LIST ---
                // By using Expanded, it perfectly fills the remaining space without EVER overflowing
                if (_dropdownOpen)
                  Expanded(
                    child: Container(
                      margin: const EdgeInsets.only(top: 8, bottom: 15),
                      decoration: BoxDecoration(
                        color: Colors.white,
                        borderRadius: BorderRadius.circular(16),
                        border: Border.all(color: const Color(0xFFEDF2F7), width: 1.5),
                        boxShadow: [BoxShadow(color: Colors.black.withOpacity(0.05), blurRadius: 10)],
                      ),
                      child: ListView.builder(
                        padding: EdgeInsets.zero, // Removes default ListView padding
                        shrinkWrap: true,
                        itemCount: filteredNodes.length,
                        itemBuilder: (context, index) {
                          final node = filteredNodes[index];
                          return InkWell(
                            onTap: () {
                              setState(() {
                                _selectedNode = node;
                                _dropdownOpen = false;
                              });
                            },
                            child: Container(
                              padding: const EdgeInsets.all(18),
                              decoration: const BoxDecoration(border: Border(bottom: BorderSide(color: Color(0xFFF1F5F9)))),
                              child: Row(
                                children: [
                                  const Icon(Icons.location_on, color: AppColors.primary, size: 18),
                                  const SizedBox(width: 12),
                                  Text(node['name'], style: const TextStyle(color: AppColors.surface, fontWeight: FontWeight.w500)),
                                ],
                              ),
                            ),
                          );
                        },
                      ),
                    ),
                  )
                else
                  const Spacer(), // Pushes the button to the bottom when dropdown is closed

                // --- OPTIMIZATION BUTTON ---
                Opacity(
                  opacity: _selectedNode == null ? 0.5 : 1.0,
                  child: GestureDetector(
                    onTap: _selectedNode == null ? null : _handleProceed,
                    child: Container(
                      height: 64,
                      decoration: BoxDecoration(
                        borderRadius: BorderRadius.circular(18),
                        boxShadow: _selectedNode == null ? [] : [BoxShadow(color: AppColors.primary.withOpacity(0.3), blurRadius: 12, offset: const Offset(0, 6))],
                        gradient: LinearGradient(
                          colors: _selectedNode == null 
                            ? [AppColors.textMuted, AppColors.textMuted] 
                            : [const Color(0xFFFF7E6B), AppColors.primary, const Color(0xFFD63A25)],
                        ),
                      ),
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: const [
                          Text('CALCULATE OPTIMUM ROUTE', style: TextStyle(color: Colors.white, fontWeight: FontWeight.w800, letterSpacing: 1, fontSize: 14)),
                          SizedBox(width: 8),
                          Icon(Icons.navigation, color: Colors.white, size: 18),
                        ],
                      ),
                    ),
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}