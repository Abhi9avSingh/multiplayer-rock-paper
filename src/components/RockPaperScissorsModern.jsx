 import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Particles from 'react-tsparticles';
import { loadFull } from 'tsparticles';
import Lottie from 'lottie-react';
import confettiJson from '../assets/lottie/confetti.json';

const dict = ['r', 'p', 's'];
const labels = { r: 'Rock', p: 'Paper', s: 'Scissors' };
const emojis = { r: '🪨', p: '📜', s: '✂️' };

export default function RockPaperScissorsModern() {
  const [round, setRound] = useState(0);
  const [playerScore, setPlayerScore] = useState(0);
  const [compScore, setCompScore] = useState(0);
  const [playerChoice, setPlayerChoice] = useState(null);
  const [compChoice, setCompChoice] = useState(null);
  const [showResults, setShowResults] = useState(false);
  const [lastOutcome, setLastOutcome] = useState('');  
  const [showConfetti, setShowConfetti] = useState(false);

  // refs for audio
  const clickRef = useRef(null);
  const winRef = useRef(null);
  const loseRef = useRef(null);

  useEffect(() => {
    // audio files are in public/sounds/ - replace with real mp3s
    try {
      clickRef.current = new Audio('/sounds/click.mp3');
      winRef.current = new Audio('/sounds/win.mp3');
      loseRef.current = new Audio('/sounds/lose.mp3');
    } catch (e) {
      // ignore in environments without audio
    }
  }, []);

  const particlesInit = async (main) => {
    await loadFull(main);
  };

  const generateRandomNo = (n) => Math.floor(Math.random() * n);

  const greater = (char1, char2) => {
    if (char1 === char2) return -1; // tie
    if (char1 === 'r' && char2 === 's') return 1;
    if (char1 === 'p' && char2 === 'r') return 1;
    if (char1 === 's' && char2 === 'p') return 1;
    return 0;
  };

  const play = (choiceIndex) => {
    if (round >= 3) return;
    // press sound
    try {
      if (clickRef.current) {
        clickRef.current.currentTime = 0;
        clickRef.current.play();
      }
    } catch (e) {}

    const player = dict[choiceIndex];
    const comp = dict[generateRandomNo(3)];

    setPlayerChoice(player);
    setCompChoice(comp);

    const outcome = greater(comp, player);

    if (outcome === 1) {
      // comp greater => player loses
      setCompScore((s) => s + 1);
      setLastOutcome('lose');
      try { loseRef.current?.play(); } catch {}
    // } else if (outcome === -1) {
    //   // tie: give both a point (nostalgic behavior)
    //   setPlayerScore((s) => s + 1);
    //   setCompScore((s) => s + 1);
    //   setLastOutcome('tie');
    } else {
      // player wins
      setPlayerScore((s) => s + 1);
      setLastOutcome('win');
      try { winRef.current?.play(); } catch {}
    }

    const next = round + 1;
    setRound(next);

    // end of game
    if (next === 3) {
      setTimeout(() => setShowResults(true), 700);
      // determine confetti based on current updated scores (approx)
      setTimeout(() => {
        if (playerScore + (lastOutcome === 'win' ? 1 : 0) > compScore + (lastOutcome === 'lose' ? 1 : 0)) {
          setShowConfetti(true);
        }
      }, 800);
    }
  };

  const reset = () => {
    setRound(0);
    setPlayerScore(0);
    setCompScore(0);
    setPlayerChoice(null);
    setCompChoice(null);
    setShowResults(false);
    setLastOutcome('');
    setShowConfetti(false);
  };

  const finalMessage = () => {
    if (playerScore > compScore) return 'You Win 🎉';
    if (playerScore === compScore) return "It's a Tie 🤝";
    return 'You Lost 💔';
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative">
      {/* Particles */}
      <Particles
        id="tsparticles"
        init={particlesInit}
        options={{
          fullScreen: { enable: false },
          fpsLimit: 60,
          particles: {
            number: { value: 40, density: { enable: true, area: 800 } },
            color: { value: ['#FF6B6B', '#FFD93D', '#6BCB77', '#4D96FF'] },
            shape: { type: 'circle' },
            opacity: { value: 0.85 },
            size: { value: { min: 6, max: 14 } },
            move: { enable: true, speed: 1.5, direction: 'none', outModes: { default: 'bounce' } },
          },
          interactivity: {
            events: { onHover: { enable: true, mode: 'repulse' }, onClick: { enable: true, mode: 'push' } },
            modes: { repulse: { distance: 120 }, push: { quantity: 4 } },
          },
        }}
        style={{ position: 'absolute', inset: 0, zIndex: 0 }}
      />

      <div className="relative z-10 w-full max-w-3xl">
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ type: 'spring', stiffness: 80 }} className="backdrop-blur-sm bg-white/60 rounded-2xl p-6 shadow-2xl">
          <header className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-extrabold text-gray-800">Bubble RPS</h1>
              <p className="text-sm text-gray-600">Cute bubble-style Rock-Paper-Scissors — 3 rounds</p>
            </div>

            <div className="text-right">
              <div className="text-sm text-gray-600">Round</div>
              <div className="text-lg font-bold text-gray-800">{round}/3</div>
            </div>
          </header>

          <main className="grid md:grid-cols-3 gap-4 items-center">
            {/* Left: Player area */}
            <div className="flex flex-col items-center md:items-start">
              <div className="mb-2 text-sm text-gray-600">You</div>
              <div className="w-40 h-40 rounded-full bg-gradient-to-br from-pink-300 to-yellow-200 shadow-lg flex items-center justify-center text-5xl">
                {playerChoice ? emojis[playerChoice] : '🙂'}
              </div>
              <div className="mt-3 text-center md:text-left">
                <div className="text-sm text-gray-600">Score</div>
                <div className="text-2xl font-semibold">{playerScore}</div>
              </div>
            </div>

            {/* Center: Buttons */}
            <div className="flex flex-col items-center justify-center">
              <div className="mb-3 text-sm text-gray-600">Choose your move</div>
              <div className="flex gap-3">
                {['r', 'p', 's'].map((c, i) => (
                  <motion.button
                    key={c}
                    whileTap={{ scale: 0.92, rotateX: -8 }}
                    whileHover={{ scale: 1.03 }}
                    onClick={() => play(i)}
                    className="relative w-20 h-20 rounded-full flex flex-col items-center justify-center shadow-2xl transform-gpu"
                    style={{
                      background: 'linear-gradient(135deg, rgba(255,255,255,0.9), rgba(255,255,255,0.65))',
                    }}
                  >
                    <span className="text-3xl mb-1">{emojis[c]}</span>
                    <span className="text-xs font-medium text-gray-700">{labels[c]}</span>
                    <span className="absolute -top-2 -left-2 w-6 h-6 rounded-full opacity-80" style={{ background: 'rgba(255,255,255,0.6)' }} />
                  </motion.button>
                ))}
              </div>

              <div className="mt-4 text-xs text-gray-500">Tip: tap the bubbles — cute animations included ✨</div>
            </div>

            {/* Right: Computer area */}
            <div className="flex flex-col items-center md:items-end">
              <div className="mb-2 text-sm text-gray-600">Computer</div>
              <div className="w-40 h-40 rounded-full bg-gradient-to-br from-blue-200 to-purple-200 shadow-lg flex items-center justify-center text-5xl">
                {compChoice ? emojis[compChoice] : '🤖'}
              </div>
              <div className="mt-3 text-center md:text-right">
                <div className="text-sm text-gray-600">Score</div>
                <div className="text-2xl font-semibold">{compScore}</div>
              </div>
            </div>
          </main>

          <div className="mt-6">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">Last outcome</div>
              <div className="text-sm font-medium text-gray-800">{lastOutcome ? lastOutcome.toUpperCase() : '—'}</div>
            </div>

            <div className="mt-4 flex gap-3 flex-wrap">
              <button onClick={() => reset()} className="px-4 py-2 rounded-full bg-white/80 shadow-md text-sm font-medium">
                Reset
              </button>

              <button onClick={() => { try { clickRef.current?.play(); } catch {} }} className="px-4 py-2 rounded-full bg-white/80 shadow-md text-sm font-medium">
                Play sound
              </button>
            </div>
          </div>
        </motion.div>

        {/* Scoreboard popup when game ends */}
        <AnimatePresence>
          {showResults && (
            <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.8, opacity: 0 }} transition={{ type: 'spring', stiffness: 120 }} className="mt-6 p-4 rounded-2xl bg-white/90 shadow-2xl text-center">
              <div className="flex items-center justify-center gap-3">
                <div className="text-3xl font-extrabold">{finalMessage()}</div>
                <div className="text-xl text-gray-600">— Final Score</div>
              </div>

              <div className="mt-3 text-sm text-gray-700">
                You: <span className="font-semibold">{playerScore}</span> &nbsp;|&nbsp; CPU: <span className="font-semibold">{compScore}</span>
              </div>

              <div className="mt-4 flex items-center justify-center gap-4">
                <button onClick={() => { setShowResults(false); setShowConfetti(false); }} className="px-4 py-2 rounded-full bg-white shadow-sm">
                  Close
                </button>

                <button onClick={reset} className="px-4 py-2 rounded-full bg-gradient-to-r from-pink-400 to-yellow-300 text-white font-semibold shadow-lg">
                  Play Again
                </button>
              </div>

              <div className="mt-4 h-40 flex items-center justify-center">
                <AnimatePresence>
                  {showConfetti && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                      <Lottie animationData={confettiJson} style={{ width: 240, height: 240 }} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
