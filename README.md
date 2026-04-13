# Digital Delta

[![Platform](https://img.shields.io/badge/platform-Flutter-02569B?style=for-the-badge&logo=flutter&logoColor=white)](https://flutter.dev/)
[![State Management](https://img.shields.io/badge/state-Provider-7B1FA2?style=for-the-badge)](https://pub.dev/packages/provider)
[![Mapping](https://img.shields.io/badge/maps-Leaflet%20via%20WebView-199900?style=for-the-badge)](https://leafletjs.com/)
[![Schema](https://img.shields.io/badge/schema-Proto3-0A7EA4?style=for-the-badge)](./delta/proto/digitaldelta.proto)

> Digital Delta is a disaster-response logistics mobile app designed for flood-prone regions. It helps responders visualize the relief network, identify blocked routes, optimize delivery paths, simulate AI-assisted flood prediction, manage inventory, and fall back to air-drop delivery when the ground network becomes unreachable.

## Quick Links

- [Project Overview](#project-overview)
- [Core Features](#core-features)
- [Technology Stack](#technology-stack)
- [Getting Started](#getting-started)
- [Architecture Diagram](./docs/architecture-diagram.md)
- [Demo Walkthrough](./DEMO.md)
- [Proto Schema](./delta/proto/digitaldelta.proto)

## Project Overview

Digital Delta presents a mobile-first emergency logistics experience for coordinating relief distribution during flood scenarios. The app combines a live operational map, stateful route status updates, route optimization, predictive flood-risk detection, and inventory management in a polished Flutter interface.

This repository currently contains:

- A Flutter mobile prototype in `my_app/`
- Protocol schema definitions in `delta/proto/digitaldelta.proto`
- Judge walkthrough instructions in `DEMO.md`
- A dedicated architecture diagram in `docs/architecture-diagram.md`

## Core Features

### 1. Operations Login

- Login screen
- Entering username and password proceeds to the main system

### 2. Live Logistics Network Map

- Interactive operational map powered by Leaflet inside Flutter WebView
- Relief camps, command center, hospital, supply-drop node, and volunteers shown on the network
- Road and waterway links are visually differentiated

### 3. Manual Flood Reporting

- Tap a route segment to mark or clear flood disruption
- Flooded edges instantly update the shared app state
- Route availability changes propagate across the workflow

### 4. Destination Selection and Route Planning

- Simulated QR flow for selecting a destination node
- Shortest path calculation from the central hub to the selected destination
- ETA display for the active delivery route

### 5. Predictive Logistics Engine

- On-device demo of a custom logistic regression pipeline
- Simulates rainfall, rate-of-change, and elevation signals
- Flags high-risk edges and displays model metrics such as accuracy, precision, recall, and F1 score

### 6. Resilient Re-Routing

- Recalculates routes after manual or predicted flood events
- Automatically avoids flooded edges
- Falls back to drone/air-drop delivery when no ground or water route is available

### 7. Inventory Registry

- Add, view, edit, and delete supply items
- Tracks SKU, quantity, and category
- Useful for simulating hub-side logistics operations

## Technology Stack

### Mobile App

- Flutter
- Dart
- Provider
- webview_flutter

### Mapping and Visualization

- Leaflet
- OpenStreetMap tiles
- Embedded HTML/CSS/JavaScript inside WebView

### Data and Simulation

- In-memory mock logistics graph
- Seeded volunteer positions
- Simulated flood-risk prediction with logistic regression

### Protocol Definition

- Protocol Buffers (`proto3`)


### Important Files

- `my_app/lib/main.dart` - App entry, routes, Provider setup
- `my_app/lib/data/mock_data.dart` - Demo graph, edges, volunteers, inventory seed data
- `my_app/lib/providers/data_provider.dart` - Shared global state for routes and inventory
- `my_app/lib/screens/dashboard_screen.dart` - Live logistics map
- `my_app/lib/screens/route_optimization_screen.dart` - Route calculation, flood toggling, air-drop fallback
- `my_app/lib/screens/predict.dart` - Predictive flood-risk demo and metrics
- `delta/proto/digitaldelta.proto` - Messaging and logistics schema definitions

## Getting Started

### Prerequisites

- Flutter SDK compatible with Dart `^3.11.4`
- Android Studio or VS Code with Flutter tooling
- Android emulator or physical Android device recommended
- Internet connection required for loading OpenStreetMap tiles in the WebView

### Run The Mobile App

```bash
cd my_app
flutter pub get
flutter run
```

### Build APK

```bash
cd my_app
flutter build apk
```

## Architecture Snapshot

Digital Delta uses a Flutter frontend with a shared Provider-based state layer. Interactive maps are rendered through WebView-hosted Leaflet, while route disruptions and inventory changes are kept in the app-wide state. The predictive screen simulates flood-risk detection and writes route failures back into that same state so rerouting reflects both manual and AI-assisted disruptions.

For the full diagram, see [`docs/architecture-diagram.md`](./docs/architecture-diagram.md).

## Protocol Schema

The repository includes a protobuf schema at [`delta/proto/digitaldelta.proto`](./delta/proto/digitaldelta.proto). It defines structures for:

- Triage requests
- Inventory stock updates
- Road status events
- Delivery tasks and chain-of-custody data
- Chat messaging
- Sync envelopes and node identity

## Future Scope

- Replace mock graph data with live backend synchronization
- Connect the mobile UI directly to protobuf-backed peer sync flows
- Add real QR scanning, offline persistence, and field authentication
- Expand prediction with live weather, telemetry, and historical flood data
