 import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

function SplashScreen() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/mode");
    }, 2500); // animation duration

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "black",
        color: "white",
         fontFamily: '"Orbitron", sans-serif',
    fontSize: "26px",
    fontWeight: 800,
    letterSpacing: "4px",
    textTransform: "uppercase",
    color: "#000000",        
    textShadow: "0 0 12px #38bdf8, 0 0 30px #38bdf8"
      }}
    >
      <motion.h1
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        style={{ fontSize: "48px", letterSpacing: "4px" }}
      >
        ROCK PAPER SCISSORS
      </motion.h1>
    </div>
  );
}

export default SplashScreen;
