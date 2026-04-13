import 'package:flutter/material.dart';
import 'package:provider/provider.dart'; // Added for state management
import 'core/theme.dart';
import 'providers/data_provider.dart';   // Your Data Context
import 'screens/login_screen.dart';
import 'screens/home_screen.dart';
import 'screens/qr_scan_screen.dart';
import 'screens/inventory_screen.dart';  // Added Inventory route

void main() {
  runApp(
    // Wrap the app in the Provider to replace React's DataContext
    ChangeNotifierProvider(
      create: (context) => DataProvider(),
      child: const DigitalDeltaApp(),
    ),
  );
}

class DigitalDeltaApp extends StatelessWidget {
  const DigitalDeltaApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Digital Delta',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        scaffoldBackgroundColor: AppColors.background,
        colorScheme: ColorScheme.dark(
          primary: AppColors.primary,
          surface: AppColors.surface,
        ),
      ),
      // This tells the app to start at the Login Screen, bypassing any default "Home" pages
      initialRoute: '/login',
      routes: {
        '/login': (context) => const LoginScreen(),
        '/home': (context) => const HomeScreen(),
        '/qr_scan': (context) => const QRScanScreen(),
        '/inventory': (context) => const InventoryScreen(), // Added
        // Note: RouteOptimizationScreen takes arguments, so we navigate to it dynamically, not here.
      },
    );
  }
}