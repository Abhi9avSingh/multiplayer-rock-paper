import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

function ModeSelect() {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{
        opacity: 1,
        backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"]
      }}
      
      style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        gap: "24px",
        background: "linear-gradient(270deg, #020617, #7a74d2, #2b376e)",
        backgroundSize: "600% 600%",
        color: "white"
      }}
    >
      <h2
  style={{
    fontFamily: '"Orbitron", sans-serif',
    fontSize: "56px",
    fontWeight: 800,
    letterSpacing: "4px",
    textTransform: "uppercase",
    color: "#000000",        
    textShadow: "0 0 12px #38bdf8, 0 0 30px #38bdf8"
  }}
>
  SELECT GAME MODE
</h2>


      <button className="glow-btn" onClick={() => navigate("/vs-computer")}>
        Play vs Computer
      </button>
      <h2 
       style={{
    fontFamily: '"Orbitron", sans-serif',
    fontSize: "26px",
    fontWeight: 800,
    letterSpacing: "4px",
    textTransform: "uppercase",
    color: "#000000",        
    textShadow: "0 0 12px #38bdf8, 0 0 30px #38bdf8"
  }}
      className="neon-text">OR</h2>

      <button className="glow-btn" onClick={() => navigate("/multiplayer")}>
        Multiplayer
      </button>
    </motion.div>
  );
}

export default ModeSelect;
