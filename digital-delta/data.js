// 1. Export Original Nodes
export const NODES = [
  {
    id: "N1",
    name: "Sylhet City Hub (supply inventory)",
    type: "central_command",
    lat: 24.8949,
    lng: 91.8687,
  },
  {
    id: "N2",
    name: "Osmani Airport Node",
    type: "supply_drop",
    lat: 24.9632,
    lng: 91.8668,
  },
  {
    id: "N3",
    name: "Sunamganj Sadar Camp",
    type: "relief_camp",
    lat: 25.0658,
    lng: 91.4073,
  },
  {
    id: "N4",
    name: "Companyganj Outpost",
    type: "relief_camp",
    lat: 25.0715,
    lng: 91.7554,
  },
  {
    id: "N5",
    name: "Kanaighat Point",
    type: "waypoint",
    lat: 24.9945,
    lng: 92.2611,
  },
  {
    id: "N6",
    name: "Habiganj Medical",
    type: "hospital",
    lat: 24.384,
    lng: 91.4169,
  },
  // 7 New Relief Camps
  {
    id: "N7",
    name: "Gowainghat Camp",
    type: "relief_camp",
    lat: 25.105,
    lng: 91.995,
  },
  {
    id: "N8",
    name: "Jaintiapur Camp",
    type: "relief_camp",
    lat: 25.1333,
    lng: 92.1167,
  },
  {
    id: "N9",
    name: "Bishwanath Camp",
    type: "relief_camp",
    lat: 24.875,
    lng: 91.725,
  },
  {
    id: "N10",
    name: "Golapganj Camp",
    type: "relief_camp",
    lat: 24.8483,
    lng: 92.0183,
  },
  {
    id: "N11",
    name: "Derai Camp",
    type: "relief_camp",
    lat: 24.7833,
    lng: 91.35,
  },
  {
    id: "N12",
    name: "Chhatak Camp",
    type: "relief_camp",
    lat: 25.0333,
    lng: 91.6667,
  },
  {
    id: "N13",
    name: "Zakiganj Camp",
    type: "relief_camp",
    lat: 24.875,
    lng: 92.37,
  },
];

// 2. Export Edges with Hardcoded Weights (No random functions)
export const EDGES = [
  // Original Edges
  {
    id: "E1",
    source: "N1",
    target: "N2",
    type: "road",
    is_flooded: false,
    base_weight_mins: 20,
  },
  {
    id: "E2",
    source: "N1",
    target: "N3",
    type: "road",
    is_flooded: false,
    base_weight_mins: 85,
  },
  {
    id: "E3",
    source: "N2",
    target: "N4",
    type: "road",
    is_flooded: false,
    base_weight_mins: 45,
  },
  {
    id: "E4",
    source: "N1",
    target: "N5",
    type: "road",
    is_flooded: false,
    base_weight_mins: 60,
  },
  {
    id: "E5",
    source: "N1",
    target: "N6",
    type: "road",
    is_flooded: false,
    base_weight_mins: 110,
  },
  {
    id: "E6",
    source: "N1",
    target: "N3",
    type: "waterway",
    is_flooded: false,
    base_weight_mins: 145,
  },
  {
    id: "E7",
    source: "N3",
    target: "N4",
    type: "waterway",
    is_flooded: false,
    base_weight_mins: 55,
  },

  // 15 New Interconnecting Edges
  {
    id: "E8",
    source: "N1",
    target: "N9",
    type: "road",
    is_flooded: false,
    base_weight_mins: 30,
  },
  {
    id: "E9",
    source: "N1",
    target: "N10",
    type: "road",
    is_flooded: false,
    base_weight_mins: 25,
  },
  {
    id: "E10",
    source: "N10",
    target: "N13",
    type: "road",
    is_flooded: false,
    base_weight_mins: 40,
  },
  {
    id: "E11",
    source: "N2",
    target: "N7",
    type: "road",
    is_flooded: true,
    base_weight_mins: 35,
  }, // Simulating a flood
  {
    id: "E12",
    source: "N7",
    target: "N8",
    type: "road",
    is_flooded: false,
    base_weight_mins: 20,
  },
  {
    id: "E13",
    source: "N9",
    target: "N12",
    type: "road",
    is_flooded: false,
    base_weight_mins: 50,
  },
  {
    id: "E14",
    source: "N12",
    target: "N3",
    type: "road",
    is_flooded: false,
    base_weight_mins: 45,
  },
  {
    id: "E15",
    source: "N3",
    target: "N11",
    type: "waterway",
    is_flooded: false,
    base_weight_mins: 75,
  },
  {
    id: "E16",
    source: "N11",
    target: "N6",
    type: "road",
    is_flooded: false,
    base_weight_mins: 65,
  },
  {
    id: "E17",
    source: "N5",
    target: "N8",
    type: "waterway",
    is_flooded: false,
    base_weight_mins: 80,
  },
  {
    id: "E18",
    source: "N4",
    target: "N7",
    type: "waterway",
    is_flooded: false,
    base_weight_mins: 50,
  },
  {
    id: "E19",
    source: "N10",
    target: "N5",
    type: "road",
    is_flooded: false,
    base_weight_mins: 35,
  },
  {
    id: "E20",
    source: "N12",
    target: "N4",
    type: "road",
    is_flooded: false,
    base_weight_mins: 25,
  },
  {
    id: "E21",
    source: "N6",
    target: "N9",
    type: "road",
    is_flooded: false,
    base_weight_mins: 55,
  },
  {
    id: "E22",
    source: "N1",
    target: "N12",
    type: "waterway",
    is_flooded: false,
    base_weight_mins: 120,
  },
];

// 3. Generate and Export Volunteers (Keeping your exact loop for the volunteers as requested)
const generateVolunteers = () => {
  const volunteersArray = [];
  for (let i = 0; i < 30; i++) {
    const edge = EDGES[Math.floor(Math.random() * EDGES.length)];
    const source = NODES.find((n) => n.id === edge.source);
    const target = NODES.find((n) => n.id === edge.target);

    // Interpolate a random position along the edge
    const progress = Math.random() * 0.8 + 0.1; // Stay between 10% and 90% of the path
    const lat = source.lat + (target.lat - source.lat) * progress;
    const lng = source.lng + (target.lng - source.lng) * progress;

    const is_driving = Math.random() > 0.3; // 70% chance they are driving

    volunteersArray.push({
      id: `V${i + 1}`,
      lat,
      lng,
      is_driving,
      edge_type: edge.type, // Used to determine car vs boat
    });
  }
  return volunteersArray;
};

// Execute once so volunteer positions stay consistent across your pages
export const VOLUNTEERS = generateVolunteers();

export const INITIAL_INVENTORY = [
  {
    id: "1",
    sku: "MED-001",
    name: "Paracetamol 500mg",
    quantity: 500,
    category: "Medicine",
  },
  {
    id: "2",
    sku: "WAT-020",
    name: "20L Clean Water Barrel",
    quantity: 120,
    category: "Water",
  },
  {
    id: "3",
    sku: "FOD-102",
    name: "Dry Food Pack (Small)",
    quantity: 350,
    category: "Food",
  },
  {
    id: "4",
    sku: "MED-088",
    name: "Oral Rehydration Salt (ORS)",
    quantity: 1000,
    category: "Medicine",
  },
  {
    id: "5",
    sku: "WAT-001",
    name: "Water Purification Tablets",
    quantity: 2000,
    category: "Water",
  },
];
