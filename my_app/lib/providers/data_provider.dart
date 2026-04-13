import 'dart:convert';
import 'package:flutter/material.dart';
import '../data/mock_data.dart';

class DataProvider extends ChangeNotifier {
  // FOOLPROOF DEEP COPY: This breaks the 'const' lock from MockData.
  // Now, every screen can mutate these global variables safely!
  List<Map<String, dynamic>> nodes = List<Map<String, dynamic>>.from(jsonDecode(jsonEncode(MockData.nodes)));
  List<Map<String, dynamic>> edges = List<Map<String, dynamic>>.from(jsonDecode(jsonEncode(MockData.edges)));
  List<Map<String, dynamic>> volunteers = List<Map<String, dynamic>>.from(jsonDecode(jsonEncode(MockData.volunteers)));
  List<Map<String, dynamic>> inventory = List<Map<String, dynamic>>.from(jsonDecode(jsonEncode(MockData.initialInventory)));

  // --- MAP CRUD ---
  void updateEdgeStatus(String edgeId, bool isFlooded) {
    final index = edges.indexWhere((edge) => edge['id'] == edgeId);
    if (index != -1) {
      edges[index]['is_flooded'] = isFlooded;
      notifyListeners(); // This forces all connected screens to rebuild with the new map
    }
  }

  // --- INVENTORY CRUD ---
  void addItem(Map<String, dynamic> item) {
    inventory.add({
      ...item,
      'id': DateTime.now().millisecondsSinceEpoch.toString(),
    });
    notifyListeners();
  }

  void updateItem(String id, Map<String, dynamic> updatedFields) {
    final index = inventory.indexWhere((item) => item['id'] == id);
    if (index != -1) {
      inventory[index] = { ...inventory[index], ...updatedFields };
      notifyListeners();
    }
  }

  void deleteItem(String id) {
    inventory.removeWhere((item) => item['id'] == id);
    notifyListeners();
  }
}