import { DataProvider } from "./context/DataContext";
import React, { useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import LoginScreen from "./screens/LoginScreen";
import HomeScreen from "./screens/HomeScreen";
import QRScanScreen from "./screens/QRScanScreen";
import RouteOptimizationScreen from "./screens/RouteOptimizationScreen";
import InventoryScreen from "./screens/InventoryScreen";

const Stack = createNativeStackNavigator();

export default function App() {
  const [loggedIn, setLoggedIn] = useState(false);

  if (!loggedIn) {
    return <LoginScreen onLogin={() => setLoggedIn(true)} />;
  }

  return (
    <DataProvider>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{ headerShown: false, animation: "fade" }}
        >
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="QRScan" component={QRScanScreen} />
          <Stack.Screen
            name="RouteOptimization"
            component={RouteOptimizationScreen}
          />
          <Stack.Screen name="Inventory" component={InventoryScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </DataProvider>
  );
}
