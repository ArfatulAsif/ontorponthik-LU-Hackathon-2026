import { useState } from "react";
import LoginScreen from "./screens/LoginScreen";
import DashboardScreen from "./screens/DashboardScreen";

export default function App() {
  const [loggedIn, setLoggedIn] = useState(false);

  if (loggedIn) {
    return <DashboardScreen />;
  }

  return <LoginScreen onLogin={() => setLoggedIn(true)} />;

  
}
