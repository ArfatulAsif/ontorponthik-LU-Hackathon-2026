import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart'; // Added for local storage
import '../core/theme.dart';

class LoginScreen extends StatefulWidget {
  const LoginScreen({super.key});

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> with TickerProviderStateMixin {
  late AnimationController _entryController;
  late AnimationController _pulseController;
  late AnimationController _floatController;

  late Animation<double> _logoPop;
  late Animation<double> _fadeAnim;
  late Animation<Offset> _slideAnim;
  late Animation<double> _radarScale;
  late Animation<double> _radarOpacity;
  late Animation<Offset> _logoFloat;

  // Added Role Selection variables
  final List<String> _userTypes = ['Supply Manager', 'Field Volunteer', 'Camp Commander'];
  String _selectedUserType = 'Supply Manager'; // Default selection

  @override
  void initState() {
    super.initState();

    // 1. Entry Animations
    _entryController = AnimationController(vsync: this, duration: const Duration(milliseconds: 800));
    _logoPop = Tween<double>(begin: 0.0, end: 1.0).animate(CurvedAnimation(parent: _entryController, curve: Curves.elasticOut));
    _fadeAnim = Tween<double>(begin: 0.0, end: 1.0).animate(CurvedAnimation(parent: _entryController, curve: const Interval(0.2, 1.0, curve: Curves.easeOut)));
    _slideAnim = Tween<Offset>(begin: const Offset(0, 0.2), end: Offset.zero).animate(CurvedAnimation(parent: _entryController, curve: const Interval(0.2, 1.0, curve: Curves.easeOut)));

    // 2. Continuous Radar Pulse Loop
    _pulseController = AnimationController(vsync: this, duration: const Duration(milliseconds: 2500))..repeat();
    _radarScale = Tween<double>(begin: 1.0, end: 1.5).animate(CurvedAnimation(parent: _pulseController, curve: Curves.easeOut));
    _radarOpacity = TweenSequence([
      TweenSequenceItem(tween: Tween<double>(begin: 0.1, end: 0.4), weight: 48),
      TweenSequenceItem(tween: Tween<double>(begin: 0.4, end: 0.0), weight: 52),
    ]).animate(_pulseController);

    // 3. Continuous Logo Float Loop
    _floatController = AnimationController(vsync: this, duration: const Duration(milliseconds: 2000))..repeat(reverse: true);
    _logoFloat = Tween<Offset>(begin: Offset.zero, end: const Offset(0, -0.06)).animate(CurvedAnimation(parent: _floatController, curve: Curves.easeInOut));

    _entryController.forward();
  }

  @override
  void dispose() {
    _entryController.dispose();
    _pulseController.dispose();
    _floatController.dispose();
    super.dispose();
  }

  // Handle saving to local storage and navigating
  Future<void> _handleLogin() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString('user_type', _selectedUserType);
    
    if (mounted) {
      Navigator.pushReplacementNamed(context, '/home');
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF9FAFB),
      body: Stack(
        children: [
          // Grid Overlay
          Container(color: AppColors.surface.withOpacity(0.03)),

          SafeArea(
            child: Center(
              child: SingleChildScrollView(
                padding: const EdgeInsets.symmetric(horizontal: 32),
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    // --- HEADER & ANIMATED LOGO ---
                    SizedBox(
                      height: 120,
                      width: 120,
                      child: Stack(
                        alignment: Alignment.center,
                        children: [
                          AnimatedBuilder(
                            animation: _pulseController,
                            builder: (context, child) => Transform.scale(
                              scale: _radarScale.value,
                              child: Opacity(
                                opacity: _radarOpacity.value,
                                child: Container(
                                  width: 90, height: 90,
                                  decoration: BoxDecoration(shape: BoxShape.circle, border: Border.all(color: AppColors.primary, width: 2)),
                                ),
                              ),
                            ),
                          ),
                          SlideTransition(
                            position: _logoFloat,
                            child: ScaleTransition(
                              scale: _logoPop,
                              child: Container(
                                width: 90, height: 90,
                                decoration: BoxDecoration(
                                  color: AppColors.surface, borderRadius: BorderRadius.circular(24),
                                  boxShadow: [BoxShadow(color: AppColors.primary.withOpacity(0.3), blurRadius: 20, offset: const Offset(0, 10))],
                                ),
                                child: Center(
                                  child: Container(
                                    width: 45, height: 45,
                                    decoration: BoxDecoration(border: Border.all(color: Colors.white.withOpacity(0.15), width: 2), borderRadius: BorderRadius.circular(12)),
                                    child: const Center(child: Text('Δ', style: TextStyle(color: Colors.white, fontSize: 36, fontWeight: FontWeight.w300))),
                                  ),
                                ),
                              ),
                            ),
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(height: 20),

                    // --- TEXT & FORM ---
                    FadeTransition(
                      opacity: _fadeAnim,
                      child: SlideTransition(
                        position: _slideAnim,
                        child: Column(
                          children: [
                            RichText(text: const TextSpan(
                              text: 'Digital ', style: TextStyle(fontSize: 34, fontWeight: FontWeight.w900, color: AppColors.surface, letterSpacing: -1),
                              children: [TextSpan(text: 'Delta', style: TextStyle(color: AppColors.primary))],
                            )),
                            const SizedBox(height: 12),
                            Container(width: 40, height: 3, color: AppColors.accentYellow, margin: const EdgeInsets.symmetric(vertical: 8)),
                            const Text('RESILIENT LOGISTICS & MESH TRIAGE\nENGINE FOR DISASTER RESPONSE', textAlign: TextAlign.center, style: TextStyle(fontSize: 13, color: AppColors.surface, fontWeight: FontWeight.bold, letterSpacing: 0.5)),
                            Container(width: 40, height: 3, color: AppColors.accentYellow, margin: const EdgeInsets.symmetric(vertical: 8)),
                            const SizedBox(height: 40),

                            // Role Selection Dropdown
                            Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                const Text('SELECT AUTHORIZED ROLE', style: TextStyle(fontSize: 11, fontWeight: FontWeight.w800, color: AppColors.textMuted, letterSpacing: 1)),
                                const SizedBox(height: 8),
                                DropdownButtonFormField<String>(
                                  value: _selectedUserType,
                                  icon: const Icon(Icons.keyboard_arrow_down, color: AppColors.surface),
                                  decoration: InputDecoration(
                                    filled: true,
                                    fillColor: Colors.white,
                                    contentPadding: const EdgeInsets.symmetric(horizontal: 18, vertical: 16),
                                    enabledBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(16), borderSide: const BorderSide(color: Color(0xFFEDF2F7), width: 1.5)),
                                    focusedBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(16), borderSide: const BorderSide(color: AppColors.primary, width: 1.5)),
                                  ),
                                  dropdownColor: Colors.white,
                                  items: _userTypes.map((String type) {
                                    return DropdownMenuItem<String>(
                                      value: type,
                                      child: Text(type, style: const TextStyle(color: AppColors.surface, fontSize: 16, fontWeight: FontWeight.w600)),
                                    );
                                  }).toList(),
                                  onChanged: (String? newValue) {
                                    if (newValue != null) {
                                      setState(() {
                                        _selectedUserType = newValue;
                                      });
                                    }
                                  },
                                ),
                              ],
                            ),
                            
                            const SizedBox(height: 28),

                            // Login Button
                            ElevatedButton(
                              style: ElevatedButton.styleFrom(
                                backgroundColor: AppColors.primary,
                                minimumSize: const Size(double.infinity, 64),
                                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(18)),
                                elevation: 8,
                                shadowColor: AppColors.primary.withOpacity(0.4),
                              ),
                              onPressed: _handleLogin, // Calls our async function to save role
                              child: const Text('AUTHENTICATE', style: TextStyle(color: Colors.white, fontSize: 15, fontWeight: FontWeight.w900, letterSpacing: 1)),
                            ),
                            const SizedBox(height: 30),
                            const Text('SECURE ENCRYPTED CHANNEL', style: TextStyle(fontSize: 10, fontWeight: FontWeight.w700, color: AppColors.textMuted, letterSpacing: 2)),
                          ],
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}