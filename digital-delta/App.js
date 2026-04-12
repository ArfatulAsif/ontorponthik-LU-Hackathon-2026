import { useState } from "react";
import LoginScreen from "./screens/LoginScreen";
import DashboardScreen from "./screens/DashboardScreen";

export default function App() {
  const [sessionReady, setSessionReady] = useState(false);

  if (!sessionReady) {
    return <LoginScreen onComplete={() => setSessionReady(true)} />;
  }

  return <DashboardScreen />;
}
