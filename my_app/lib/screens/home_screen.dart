import 'package:flutter/material.dart';
import '../core/theme.dart';
import 'dashboard_screen.dart'; // We embed the map here just like RN

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> with SingleTickerProviderStateMixin {
  bool _isSidebarOpen = false;

  void _toggleSidebar() {
    setState(() {
      _isSidebarOpen = !_isSidebarOpen;
    });
  }

  @override
  Widget build(BuildContext context) {
    final screenWidth = MediaQuery.of(context).size.width;

    return Scaffold(
      body: Stack(
        children: [
          // 1. The Map Background
          const DashboardScreen(),

          // 2. Header Menu Button
          Positioned(
            top: 50, left: 20,
            child: GestureDetector(
              onTap: _toggleSidebar,
              child: Container(
                width: 50, height: 50,
                decoration: BoxDecoration(
                  color: Colors.white, 
                  borderRadius: BorderRadius.circular(15),
                  boxShadow: [BoxShadow(color: Colors.black.withOpacity(0.15), blurRadius: 10, offset: const Offset(0, 4))],
                ),
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    // FIX: Moved color and borderRadius inside BoxDecoration
                    Container(width: 20, height: 2.5, margin: const EdgeInsets.symmetric(vertical: 2), decoration: BoxDecoration(color: AppColors.surface, borderRadius: BorderRadius.circular(5))),
                    Container(width: 14, height: 2.5, margin: const EdgeInsets.symmetric(vertical: 2), decoration: BoxDecoration(color: AppColors.surface, borderRadius: BorderRadius.circular(5))),
                    Container(width: 20, height: 2.5, margin: const EdgeInsets.symmetric(vertical: 2), decoration: BoxDecoration(color: AppColors.surface, borderRadius: BorderRadius.circular(5))),
                  ],
                ),
              ),
            ),
          ),

          // 3. Scan QR Floating Action Button (Gradient)
          Positioned(
            bottom: 40, left: 0, right: 0,
            child: Center(
              child: GestureDetector(
                onTap: () => Navigator.pushNamed(context, '/qr_scan'),
                child: Container(
                  width: 78, height: 78,
                  decoration: BoxDecoration(
                    shape: BoxShape.circle,
                    boxShadow: [BoxShadow(color: AppColors.primary.withOpacity(0.5), blurRadius: 15, offset: const Offset(0, 8))],
                    gradient: const LinearGradient(
                      colors: [Color(0xFFFF7E6B), AppColors.primary, Color(0xFFD63A25)],
                      begin: Alignment.topLeft, end: Alignment.bottomRight,
                    ),
                    border: Border.all(color: Colors.white.withOpacity(0.2), width: 1.5),
                  ),
                  child: Stack(
                    children: [
                      Positioned(top: 0, left: 0, right: 0, height: 39, child: Container(decoration: BoxDecoration(color: Colors.white.withOpacity(0.12), borderRadius: const BorderRadius.vertical(top: Radius.circular(39))))),
                      const Center(child: Icon(Icons.qr_code_scanner, color: Colors.white, size: 30)),
                    ],
                  ),
                ),
              ),
            ),
          ),

          // 4. Animated Overlay & Sidebar
          if (_isSidebarOpen)
            GestureDetector(
              onTap: _toggleSidebar,
              child: AnimatedOpacity(
                duration: const Duration(milliseconds: 300),
                opacity: _isSidebarOpen ? 1.0 : 0.0,
                child: Container(color: Colors.black.withOpacity(0.3)),
              ),
            ),
            
          AnimatedPositioned(
            duration: const Duration(milliseconds: 400),
            curve: Curves.easeOutCubic,
            top: 0, bottom: 0,
            left: _isSidebarOpen ? 0 : -screenWidth,
            width: screenWidth,
            child: GestureDetector(
              onHorizontalDragEnd: (details) {
                if (details.primaryVelocity! < 0) _toggleSidebar(); // Swipe left to close
              },
              child: Container(
                color: Colors.white.withOpacity(0.92), // Glass effect translation
                padding: const EdgeInsets.only(top: 60, left: 30, right: 30),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // Close Button
                    Align(
                      alignment: Alignment.topRight,
                      child: IconButton(
                        icon: const Icon(Icons.close, color: AppColors.surface),
                        style: IconButton.styleFrom(backgroundColor: AppColors.surface.withOpacity(0.05)),
                        onPressed: _toggleSidebar,
                      ),
                    ),
                    const SizedBox(height: 20),
                    
                    // Logo & Status
                    Container(width: 50, height: 50, decoration: BoxDecoration(color: AppColors.surface, borderRadius: BorderRadius.circular(12)), child: const Center(child: Text('Δ', style: TextStyle(color: Colors.white, fontSize: 24)))),
                    const SizedBox(height: 20),
                    RichText(text: const TextSpan(text: 'Digital ', style: TextStyle(fontSize: 32, fontWeight: FontWeight.w900, color: AppColors.surface, letterSpacing: -1), children: [TextSpan(text: 'Delta', style: TextStyle(color: AppColors.primary))])),
                    const SizedBox(height: 12),
                    Row(
                      children: [
                        Container(width: 8, height: 8, decoration: const BoxDecoration(color: AppColors.accentGreen, shape: BoxShape.circle), margin: const EdgeInsets.symmetric(horizontal: 8)),
                        const Text('LOGISTICS NODE ACTIVE', style: TextStyle(fontSize: 10, fontWeight: FontWeight.w800, color: AppColors.textMuted, letterSpacing: 1.5)),
                      ],
                    ),
                    const SizedBox(height: 40),

                    // Nav Items
                    _buildSidebarItem(Icons.inventory_2_outlined, 'Inventory Management', () { _toggleSidebar(); Navigator.pushNamed(context, '/inventory'); }),
                    _buildSidebarItem(Icons.assignment_outlined, 'Duty Management', () {}),
                    _buildSidebarItem(Icons.hub_outlined, 'Network Mesh', () {}),
                    _buildSidebarItem(Icons.settings_outlined, 'System Settings', () {}),

                    const Spacer(),
                    const Center(child: Text('SECURE ENCRYPTED CHANNEL', style: TextStyle(fontSize: 10, fontWeight: FontWeight.w700, color: AppColors.textMuted, letterSpacing: 2))),
                    // FIX: Moved color and borderRadius inside BoxDecoration
                    Center(child: Container(width: 30, height: 2, margin: const EdgeInsets.only(top: 12, bottom: 40), decoration: BoxDecoration(color: AppColors.primary, borderRadius: BorderRadius.circular(1)))),
                  ],
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildSidebarItem(IconData icon, String label, VoidCallback onTap) {
    return InkWell(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.symmetric(vertical: 18),
        decoration: BoxDecoration(border: Border(bottom: BorderSide(color: AppColors.surface.withOpacity(0.05)))),
        child: Row(
          children: [
            Container(
              width: 42, height: 42,
              decoration: BoxDecoration(color: AppColors.surface.withOpacity(0.05), borderRadius: BorderRadius.circular(12)),
              child: Icon(icon, color: AppColors.surface, size: 22),
            ),
            const SizedBox(width: 16),
            Text(label, style: const TextStyle(color: AppColors.surface, fontSize: 16, fontWeight: FontWeight.w600)),
          ],
        ),
      ),
    );
  }
}