import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

const dict = ["r", "p", "s"];
const labels = { r: "Rock", p: "Paper", s: "Scissors" };
const emojis = { r: "🪨", p: "📜", s: "✂️" };

export default function  Player1VsPlayer2() {
  const [round, setRound] = useState(0);
  const [player1Score, setPlayer1Score] = useState(0);
  const [player2Score, setPlayer2Score] = useState(0);

  const [player1Choice, setPlayer1Choice] = useState(null);
  const [player2Choice, setPlayer2Choice] = useState(null);

  const [currentTurn, setCurrentTurn] = useState(1); // 1 or 2
  const [showResults, setShowResults] = useState(false);
  const [lastOutcome, setLastOutcome] = useState("");

  // sounds
  const clickRef = useRef(null);
  const winRef = useRef(null);
  const loseRef = useRef(null);

  useEffect(() => {
    try {
      clickRef.current = new Audio("/sounds/click.mp3");
      winRef.current = new Audio("/sounds/win.mp3");
      loseRef.current = new Audio("/sounds/lose.mp3");
    } catch {}
  }, []);

  // game rule
  const greater = (a, b) => {
    if (a === b) return -1;
    if (a === "r" && b === "s") return 1;
    if (a === "p" && b === "r") return 1;
    if (a === "s" && b === "p") return 1;
    return 0;
  };

  const play = (choiceIndex) => {
    if (round >= 3) return;

    try {
      clickRef.current?.play();
    } catch {}

    const choice = dict[choiceIndex];

    // PLAYER 1 TURN
    if (currentTurn === 1) {
      setPlayer1Choice(choice);
      setCurrentTurn(2);
      return;
    }

    // PLAYER 2 TURN
    if (currentTurn === 2) {
      setPlayer2Choice(choice);

      const result = greater(choice, player1Choice);

      if (result === 1) {
        setPlayer2Score((s) => s + 1);
        setLastOutcome("Player 2 Wins");
        try { loseRef.current?.play(); } catch {}
      } else if (result === -1) {
        setPlayer1Score((s) => s + 1);
        setPlayer2Score((s) => s + 1);
        setLastOutcome("Tie");
      } else {
        setPlayer1Score((s) => s + 1);
        setLastOutcome("Player 1 Wins");
        try { winRef.current?.play(); } catch {}
      }

      setRound((r) => r + 1);
      setCurrentTurn(1);

      if (round + 1 === 3) {
        setTimeout(() => setShowResults(true), 600);
      }
    }
  };

  const reset = () => {
    setRound(0);
    setPlayer1Score(0);
    setPlayer2Score(0);
    setPlayer1Choice(null);
    setPlayer2Choice(null);
    setCurrentTurn(1);
    setShowResults(false);
    setLastOutcome("");
  };

  const finalMessage = () => {
    if (player1Score > player2Score) return "Player 1 Wins 🎉";
    if (player1Score < player2Score) return "Player 2 Wins 🎉";
    return "It's a Tie 🤝";
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-indigo-200 to-purple-200">
      <div className="w-full max-w-3xl bg-white/80 backdrop-blur rounded-2xl p-6 shadow-2xl">
        
        {/* Header */}
        <div className="flex justify-between mb-4">
          <h1 className="text-2xl font-extrabold">Local Multiplayer RPS</h1>
          <div className="text-sm font-semibold">Round {round}/3</div>
        </div>

        {/* Turn Indicator */}
        <div className="text-center mb-4 font-bold text-lg">
          {currentTurn === 1 ? "Player 1's Turn" : "Player 2's Turn"}
        </div>

        {/* Players */}
        <div className="grid grid-cols-3 gap-4 items-center">
          
          {/* Player 1 */}
          <div className="text-center">
            <div className="font-semibold">Player 1</div>
            <div className="text-5xl my-2">
  {player1Choice ? (
    currentTurn === 2 ? "❓" : emojis[player1Choice]
  ) : "🙂"}
</div>

            <div>Score: {player1Score}</div>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 justify-center">
            {["r", "p", "s"].map((c, i) => (
              <motion.button
                key={c}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => play(i)}
                className="w-20 h-20 rounded-full bg-white shadow-lg flex flex-col items-center justify-center"
              >
                <span className="text-3xl">{emojis[c]}</span>
                <span className="text-xs">{labels[c]}</span>
              </motion.button>
            ))}
          </div>

          {/* Player 2 */}
          <div className="text-center">
            <div className="font-semibold">Player 2</div>
            <div className="text-5xl my-2">
              {player2Choice ? emojis[player2Choice] : "😎"}
            </div>
            <div>Score: {player2Score}</div>
          </div>
        </div>

        {/* Outcome */}
        <div className="mt-4 text-center font-semibold">
          Last Outcome: {lastOutcome || "—"}
        </div>

        {/* Controls */}
        <div className="mt-4 flex justify-center gap-4">
          <button onClick={reset} className="px-4 py-2 rounded-full bg-white shadow">
            Reset
          </button>
        </div>

        {/* Final Result */}
        <AnimatePresence>
          {showResults && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ opacity: 0 }}
              className="mt-6 p-4 bg-white rounded-xl shadow-lg text-center"
            >
              <h2 className="text-2xl font-extrabold">{finalMessage()}</h2>
              <p className="mt-2">
                Player 1: {player1Score} | Player 2: {player2Score}
              </p>
              <button
                onClick={reset}
                className="mt-3 px-4 py-2 rounded-full bg-indigo-500 text-white"
              >
                Play Again
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
