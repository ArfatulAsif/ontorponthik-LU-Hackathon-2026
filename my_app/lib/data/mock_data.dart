import 'dart:math';

class MockData {
  static const List<Map<String, dynamic>> nodes = [
    { "id": "N1", "name": "Sylhet City Hub (supply inventory)", "type": "central_command", "lat": 24.8949, "lng": 91.8687 },
    { "id": "N2", "name": "Osmani Airport Node", "type": "supply_drop", "lat": 24.9632, "lng": 91.8668 },
    { "id": "N3", "name": "Sunamganj Sadar Camp", "type": "relief_camp", "lat": 25.0658, "lng": 91.4073 },
    { "id": "N4", "name": "Companyganj Outpost", "type": "relief_camp", "lat": 25.0715, "lng": 91.7554 },
    { "id": "N5", "name": "Kanaighat Point", "type": "waypoint", "lat": 24.9945, "lng": 92.2611 },
    { "id": "N6", "name": "Habiganj Medical", "type": "hospital", "lat": 24.3840, "lng": 91.4169 },
    { "id": "N7", "name": "Gowainghat Camp", "type": "relief_camp", "lat": 25.1050, "lng": 91.9950 },
    { "id": "N8", "name": "Jaintiapur Camp", "type": "relief_camp", "lat": 25.1333, "lng": 92.1167 },
    { "id": "N9", "name": "Bishwanath Camp", "type": "relief_camp", "lat": 24.8750, "lng": 91.7250 },
    { "id": "N10", "name": "Golapganj Camp", "type": "relief_camp", "lat": 24.8483, "lng": 92.0183 },
    { "id": "N11", "name": "Derai Camp", "type": "relief_camp", "lat": 24.7833, "lng": 91.3500 },
    { "id": "N12", "name": "Chhatak Camp", "type": "relief_camp", "lat": 25.0333, "lng": 91.6667 },
    { "id": "N13", "name": "Zakiganj Camp", "type": "relief_camp", "lat": 24.8750, "lng": 92.3700 }
  ];

  static const List<Map<String, dynamic>> edges = [
    { "id": "E1", "source": "N1", "target": "N2", "type": "road", "is_flooded": false, "base_weight_mins": 20 },
    { "id": "E2", "source": "N1", "target": "N3", "type": "road", "is_flooded": false, "base_weight_mins": 85 },
    { "id": "E3", "source": "N2", "target": "N4", "type": "road", "is_flooded": false, "base_weight_mins": 45 },
    { "id": "E4", "source": "N1", "target": "N5", "type": "road", "is_flooded": false, "base_weight_mins": 60 },
    { "id": "E5", "source": "N1", "target": "N6", "type": "road", "is_flooded": false, "base_weight_mins": 110 },
    { "id": "E6", "source": "N1", "target": "N3", "type": "waterway", "is_flooded": false, "base_weight_mins": 145 },
    { "id": "E7", "source": "N3", "target": "N4", "type": "waterway", "is_flooded": false, "base_weight_mins": 55 },
    { "id": "E8", "source": "N1", "target": "N9", "type": "road", "is_flooded": false, "base_weight_mins": 30 },
    { "id": "E9", "source": "N1", "target": "N10", "type": "road", "is_flooded": false, "base_weight_mins": 25 },
    { "id": "E10", "source": "N10", "target": "N13", "type": "road", "is_flooded": false, "base_weight_mins": 40 },
    { "id": "E11", "source": "N2", "target": "N7", "type": "road", "is_flooded": true, "base_weight_mins": 35 },
    { "id": "E12", "source": "N7", "target": "N8", "type": "road", "is_flooded": false, "base_weight_mins": 20 },
    { "id": "E13", "source": "N9", "target": "N12", "type": "road", "is_flooded": false, "base_weight_mins": 50 },
    { "id": "E14", "source": "N12", "target": "N3", "type": "road", "is_flooded": false, "base_weight_mins": 45 },
    { "id": "E15", "source": "N3", "target": "N11", "type": "waterway", "is_flooded": false, "base_weight_mins": 75 },
    { "id": "E16", "source": "N11", "target": "N6", "type": "road", "is_flooded": false, "base_weight_mins": 65 },
    { "id": "E17", "source": "N5", "target": "N8", "type": "waterway", "is_flooded": false, "base_weight_mins": 80 },
    { "id": "E18", "source": "N4", "target": "N7", "type": "waterway", "is_flooded": false, "base_weight_mins": 50 },
    { "id": "E19", "source": "N10", "target": "N5", "type": "road", "is_flooded": false, "base_weight_mins": 35 },
    { "id": "E20", "source": "N12", "target": "N4", "type": "road", "is_flooded": false, "base_weight_mins": 25 },
    { "id": "E21", "source": "N6", "target": "N9", "type": "road", "is_flooded": false, "base_weight_mins": 55 },
    { "id": "E22", "source": "N1", "target": "N12", "type": "waterway", "is_flooded": false, "base_weight_mins": 120 }
  ];

  // Auto-generate the 30 volunteers like the JS version
  static final List<Map<String, dynamic>> volunteers = _generateVolunteers();

  static List<Map<String, dynamic>> _generateVolunteers() {
    final random = Random(42); // Seeded so positions don't jump on reload
    final List<Map<String, dynamic>> volunteersArray = [];
    
    for (int i = 0; i < 30; i++) {
      final edge = edges[random.nextInt(edges.length)];
      final source = nodes.firstWhere((n) => n['id'] == edge['source']);
      final target = nodes.firstWhere((n) => n['id'] == edge['target']);
      
      final progress = random.nextDouble() * 0.8 + 0.1;
      final lat = source['lat'] + (target['lat'] - source['lat']) * progress;
      final lng = source['lng'] + (target['lng'] - source['lng']) * progress;
      
      final isDriving = random.nextDouble() > 0.3;
      
      volunteersArray.add({
        'id': 'V${i + 1}',
        'lat': lat,
        'lng': lng,
        'is_driving': isDriving,
        'edge_type': edge['type'],
      });
    }
    return volunteersArray;
  }

  // Initial Inventory data
  static const List<Map<String, dynamic>> initialInventory = [
    { "id": "1", "sku": "MED-001", "name": "Paracetamol 500mg", "quantity": 500, "category": "Medicine" },
    { "id": "2", "sku": "WAT-020", "name": "20L Clean Water Barrel", "quantity": 120, "category": "Water" },
    { "id": "3", "sku": "FOD-102", "name": "Dry Food Pack (Small)", "quantity": 350, "category": "Food" },
    { "id": "4", "sku": "MED-088", "name": "Oral Rehydration Salt (ORS)", "quantity": 1000, "category": "Medicine" },
    { "id": "5", "sku": "WAT-001", "name": "Water Purification Tablets", "quantity": 2000, "category": "Water" }
  ];
}