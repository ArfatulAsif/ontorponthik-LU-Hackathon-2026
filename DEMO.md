# Digital Delta: Operational User Guide

Welcome to the **Digital Delta** command interface. This platform is designed to streamline emergency logistics, bridge the gap between predictive AI and field operations, and ensure that life-saving supplies reach their destination despite shifting flood conditions.

## 🛠 Getting Started

To deploy the command center locally, follow these steps:

1.  **Initialize Environment**: Navigate to the project directory.
    ```bash
    cd my_app
    flutter pub get
    ```
2.  **Launch Interface**: Run the application on an Android emulator or a physical Android device.
    ```bash
    flutter run
    ```

---

## 🛰 Navigating the Command Hub

### 1. Accessing the System
Upon launching the app, you will be met with the Digital Delta secure login. Enter credentials and tap **LOGIN** to enter the operational dashboard.

### 2. Monitoring Live Operations
The **Live Operations Map** serves as primary tactical view. 
* **Nodes**: Identify the Command Hub, Relief Camps, Hospitals, and Supply-Drop nodes.
* **Real-time Assets**: Track moving volunteers and field units across the Sylhet region.
* **Unified Graph**: Both road and water-based delivery routes are integrated into a single logistics network.

### 3. Reporting Field Disruptions
Digital Delta allows for real-time manual intervention when field teams encounter obstacles:
* **Manual Reporting**: Tap any route segment (edge) on the map.
* **Flood Confirmation**: Confirm the flood warning in the popup.
* The route will visually change to indicate a disruption, and the system state will immediately update to prevent future routing through that path.

---

## 📦 Resource Management

### Managing Inventory
Before dispatching a delivery, use the **Inventory Management** suite to track stockpile:
1.  Open the sidebar and select **Inventory Management**.
2.  **Add Supplies**: Use the form to register new stock (e.g., medical kits, dry food).
3.  **Audit & Edit**: Tap existing items to view details, update quantities, or remove depleted resources.

---

## 🛣 Intelligent Routing & AI Integration

### 1. Standard Route Optimization
When a request for supplies comes in, utilize the optimization engine:
* Tap the **QR/Scan Button** on the home screen.
* Select destination (e.g., a specific Relief Camp).
* Tap **CALCULATE OPTIMUM ROUTE**.
* **Result**: The system highlights the shortest viable path and provides an estimated time of arrival (ETA) based on current node status.

### 2. Dynamic Re-Routing
If a situation changes mid-delivery:
* Tap a segment of your active route and mark it as flooded.
* The system will instantly recalculate an alternative path using available edges, ensuring the delivery remains in motion.

### 3. Proactive Risk Prediction
Move from reactive to proactive logistics by using the **Predictive Logistics Engine**:
* Navigate to **Proactively Predict**.
* The system runs a simulation using the internal prediction pipeline.
* **Analyze Risks**: View model metrics (Accuracy, F1 Score) and a list of edges flagged as "High Risk" for imminent flooding.
* **AI-Informed Planning**: Tap **New Routing** to return to the map. The system will automatically treat those "at-risk" edges as blocked, calculating a safe route before the flooding even occurs.

---

## 🛸 Prority Scheduling (Advanced)

Request for relief from relief shelter to supply manager are processed via Earliest Deadline First priority scheduling. Here dijkstra algorithm calculate route and time taken, and based on priority and SLA requests are processed.

---

## 💡 System Notes for Operators

* **Connectivity**: An active internet connection is required to render map tiles.
* **Data Persistence**: This prototype uses in-memory seed data. Restarting the application will reset the map and inventory to the baseline state.
* **Rapid Access**: Credential verification is bypassed in this build to ensure judges and operators can test the full workflow without friction.
