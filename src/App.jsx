 import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import SplashScreen from "./pages/SplashScreen";
import ModeSelect from "./pages/ModeSelect";
import VsComputer from "./pages/VsComputer";
import Multiplayer from "./pages/Multiplayer";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Splash must be FIRST */}
        <Route path="/" element={<SplashScreen />} />
        <Route path="/mode" element={<ModeSelect />} />
        <Route path="/vs-computer" element={<VsComputer />} />
        <Route path="/multiplayer" element={<Multiplayer />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
