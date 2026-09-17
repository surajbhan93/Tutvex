import { useState, useEffect } from "react";
// import { useRouter } from "next/router";
import Head from "next/head";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
// import Footer from "@/components/landing/Footer";
import NavBar from "@/components/navbar/NavBar";
const GAMES = [
  {
    id: "math-quize",
    title: "Math Quiz",
    emoji: "🧮",
    desc: "Solve maths problems & earn stars!",
    color: "#F59E0B",
    glow: "rgba(245,158,11,0.25)",
    from: "#F59E0B",
    to: "#EF4444",
    badge: "Numbers",
    tip: "Easy → Hard levels",
  },
  {
    id: "word-puzzle",
    title: "Word Puzzle",
    emoji: "🔤",
    desc: "Unscramble words & build vocabulary!",
    color: "#EC4899",
    glow: "rgba(236,72,153,0.25)",
    from: "#EC4899",
    to: "#8B5CF6",
    badge: "Vocabulary",
    tip: "15 fun words",
  },
  {
    id: "memory-match",
    title: "Memory Match",
    emoji: "🃏",
    desc: "Match the pairs & train your memory!",
    color: "#6366F1",
    glow: "rgba(99,102,241,0.25)",
    from: "#6366F1",
    to: "#06B6D4",
    badge: "Brain Power",
    tip: "3 exciting levels",
  },
  {
    id: "snake",
    title: "Child Snake",
    emoji: "🐍",
    desc: "Control the snake & grow longer!",
    color: "#22C55E",
    glow: "rgba(34,197,94,0.25)",
    from: "#22C55E",
    to: "#16A34A",
    badge: "Arcade",
    tip: "Speed increases",
  },
  {
    id: "color-matching",
    title: "Color Match",
    emoji: "🎨",
    desc: "Match colors with drag & drop!",
    color: "#8B5CF6",
    glow: "rgba(139,92,246,0.25)",
    from: "#8B5CF6",
    to: "#EC4899",
    badge: "Focus",
    tip: "With timer & lives",
  },
  {
    id: "find-odd-one",
    title: "Find Odd One",
    emoji: "👀",
    desc: "Spot the different item quickly!",
    color: "#F43F5E",
    glow: "rgba(244,63,94,0.25)",
    from: "#F43F5E",
    to: "#F97316",
    badge: "Logic",
    tip: "3 lives challenge",
  },
];

export default function GamesLobby() {
  // const router =/ useRouter();
  const [player, setPlayer] = useState("");
  const [scores, setScores] = useState<Record<string, number>>({});
  const [nameInput, setNameInput] = useState("");
  const [nameSet, setNameSet] = useState(false);
  const [particles, setParticles] = useState<{ x: number; y: number; char: string; id: number }[]>([]);

  useEffect(() => {
    const p = localStorage.getItem("kg_player") || "";
    const s = localStorage.getItem("kg_scores");
    if (p) { setPlayer(p); setNameSet(true); }
    if (s) setScores(JSON.parse(s));
    setParticles(
      ["🌟", "⭐", "🎮", "🎯", "🏆", "✨", "🚀", "🎪"].map((char, id) => ({
        x: 5 + Math.random() * 90,
        y: 5 + Math.random() * 90,
        char,
        id,
      }))
    );
  }, []);

  const saveName = () => {
    if (!nameInput.trim()) return;
    const n = nameInput.trim();
    localStorage.setItem("kg_player", n);
    setPlayer(n);
    setNameSet(true);
  };

  const totalScore = Object.values(scores).reduce((a, b) => a + b, 0);

  return (
    <>
    <NavBar />
      <Head>
        <title>Kids Game Zone 🎮</title>
        <link
          href="https://fonts.googleapis.com/css2?family=Baloo+2:wght@700;800;900&family=Nunito:wght@400;600;700;800&display=swap"
          rel="stylesheet"
        />
        <style>{`
          body { margin: 0; background: #0a0520; }
          .font-display { font-family: 'Baloo 2', cursive; }
          .font-body { font-family: 'Nunito', sans-serif; }
          @keyframes float {
            0%,100% { transform: translateY(0px) rotate(0deg); }
            50% { transform: translateY(-14px) rotate(8deg); }
          }
          @keyframes orb-pulse {
            0%,100% { opacity: 0.3; transform: scale(1); }
            50% { opacity: 0.55; transform: scale(1.08); }
          }
          .float-el { animation: float var(--dur,4s) ease-in-out infinite; }
          .orb { animation: orb-pulse var(--dur,7s) ease-in-out infinite; }
        `}</style>
      </Head>

      <div
        className="min-h-screen relative overflow-hidden"
        style={{
          background: "linear-gradient(145deg,#0a0520 0%,#12083a 50%,#0d1b3e 100%)",
          fontFamily: "'Nunito',sans-serif",
        }}
      >
        {/* BG orbs */}
        {[
          { color: "rgba(139,92,246,0.18)", size: 500, top: "-10%", left: "-8%", dur: "7s" },
          { color: "rgba(236,72,153,0.13)", size: 600, bottom: "-15%", right: "-10%", dur: "9s", delay: "2s" },
          { color: "rgba(99,102,241,0.1)", size: 400, top: "40%", left: "50%", dur: "6s", delay: "1s" },
        ].map((o, i) => (
          <div
            key={i}
            className="orb pointer-events-none absolute rounded-full"
            style={{
              width: o.size, height: o.size,
              background: `radial-gradient(circle,${o.color} 0%,transparent 70%)`,
              top: o.top, left: o.left, bottom: (o as any).bottom, right: (o as any).right,
              "--dur": o.dur, "--delay": o.delay,
            } as React.CSSProperties}
          />
        ))}

        {/* Grid */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: "linear-gradient(rgba(255,255,255,1) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,1) 1px,transparent 1px)", backgroundSize: "52px 52px" }}
        />

        {/* Floating emojis */}
        {particles.map((p) => (
          <div
            key={p.id}
            className="float-el pointer-events-none absolute select-none text-2xl opacity-20"
            style={{ left: `${p.x}%`, top: `${p.y}%`, "--dur": `${3.5 + p.id * 0.4}s` } as React.CSSProperties}
          >
            {p.char}
          </div>
        ))}

        <div className="relative z-10 max-w-4xl mx-auto px-4 py-10">

          {/* ── NAME GATE ── */}
          <AnimatePresence mode="wait">
            {!nameSet ? (
              <motion.div
                key="name-gate"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="flex flex-col items-center justify-center min-h-screen"
              >
                <motion.div
                  animate={{ rotate: [0, 6, -6, 0], scale: [1, 1.08, 1] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="text-8xl mb-6"
                >🎮</motion.div>

                <h1 className="font-display text-center text-white mb-2" style={{ fontSize: "clamp(36px,6vw,60px)", fontWeight: 900, lineHeight: 1.15 }}>
                  Kids{" "}
                  <span style={{ background: "linear-gradient(135deg,#F59E0B,#EC4899,#6366F1)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                    Game Zone
                  </span>
                </h1>
                <p className="font-body text-white/40 text-lg mb-10">Learn · Play · Win 🌟</p>

                <div
                  className="w-full max-w-sm rounded-3xl p-8 relative overflow-hidden"
                  style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.12)", backdropFilter: "blur(20px)" }}
                >
                  <label className="font-body block text-white/50 text-xs font-bold uppercase tracking-widest mb-3">
                    Apna naam likho ✏️
                  </label>
                  <input
                    type="text"
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && saveName()}
                    placeholder="e.g. Arjun, Priya..."
                    maxLength={18}
                    className="font-body w-full rounded-2xl px-5 py-4 text-white text-xl font-semibold placeholder-white/25 outline-none transition"
                    style={{ background: "rgba(255,255,255,0.08)", border: "1.5px solid rgba(255,255,255,0.15)" }}
                    onFocus={(e) => (e.target.style.borderColor = "#8B5CF6")}
                    onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.15)")}
                  />
                  <motion.button
                    whileHover={nameInput.trim() ? { scale: 1.03, y: -2 } : {}}
                    whileTap={nameInput.trim() ? { scale: 0.97 } : {}}
                    onClick={saveName}
                    className="font-display mt-4 w-full py-4 rounded-2xl text-white font-black text-xl tracking-wide transition"
                    style={{
                      background: nameInput.trim()
                        ? "linear-gradient(135deg,#7C3AED,#EC4899)"
                        : "rgba(255,255,255,0.1)",
                      cursor: nameInput.trim() ? "pointer" : "not-allowed",
                      color: nameInput.trim() ? "#fff" : "rgba(255,255,255,0.3)",
                      boxShadow: nameInput.trim() ? "0 8px 24px rgba(124,58,237,0.4)" : "none",
                    }}
                  >
                    🚀 Start Adventure
                  </motion.button>

                  <div className="mt-6 grid grid-cols-3 gap-2 text-center">
                    {GAMES.map((g) => (
                      <div key={g.id} style={{ background: "rgba(255,255,255,0.04)", borderRadius: 12, padding: "10px 4px" }}>
                        <div className="text-2xl">{g.emoji}</div>
                        <div className="font-body text-white/30 text-xs mt-1">{g.title}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            ) : (
              /* ── LOBBY ── */
              <motion.div key="lobby" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>

                {/* Header */}
                <motion.div
                  initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
                  className="flex items-center justify-between mb-10 flex-wrap gap-4"
                >
                  <div>
                    <p className="font-body text-white/35 text-xs uppercase tracking-widest">Game Zone</p>
                    <h1 className="font-display text-white mt-1" style={{ fontSize: "clamp(22px,4vw,36px)", fontWeight: 900 }}>
                      Hey,{" "}
                      <span style={{ background: "linear-gradient(135deg,#F59E0B,#EC4899)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                        {player}! 👋
                      </span>
                    </h1>
                  </div>

                  <div className="flex items-center gap-3">
                    <div
                      className="text-center px-5 py-3 rounded-2xl"
                      style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)" }}
                    >
                      <div className="font-display text-yellow-400 text-2xl font-black">{totalScore}</div>
                      <div className="font-body text-white/30 text-xs">Total Points</div>
                    </div>
                    <button
                      onClick={() => { localStorage.removeItem("kg_player"); setPlayer(""); setNameSet(false); setNameInput(""); }}
                      className="font-body px-4 py-3 rounded-2xl text-white/40 hover:text-white/70 text-sm transition"
                      style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}
                    >
                      🚪 Exit
                    </button>
                  </div>
                </motion.div>

                {/* Score row */}
                {Object.keys(scores).length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                    className="grid grid-cols-3 gap-3 mb-8"
                  >
                    {GAMES.map((g) => (
                      <div
                        key={g.id}
                        className="text-center py-4 rounded-2xl"
                        style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
                      >
                        <div className="text-2xl">{g.emoji}</div>
                        <div className="font-display text-white font-black text-xl mt-1">{scores[g.id] ?? 0}</div>
                        <div className="font-body text-white/30 text-xs">best pts</div>
                      </div>
                    ))}
                  </motion.div>
                )}

                {/* Game cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  {GAMES.map((game, i) => (
                    <motion.div
                      key={game.id}
                      initial={{ opacity: 0, y: 50 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                    >
                      <Link href={`/games/${game.id}`} style={{ textDecoration: "none" }}>
                        <motion.div
                          whileHover={{ y: -8, scale: 1.02 }}
                          whileTap={{ scale: 0.97 }}
                          className="relative rounded-3xl overflow-hidden cursor-pointer"
                          style={{
                            background: `radial-gradient(circle at 25% 25%,${game.glow},rgba(255,255,255,0.04))`,
                            border: `1px solid ${game.color}33`,
                            backdropFilter: "blur(12px)",
                            boxShadow: `0 8px 32px ${game.glow}`,
                          }}
                        >
                          {/* Top bar */}
                          <div style={{ height: 4, background: `linear-gradient(90deg,${game.from},${game.to})` }} />

                          <div className="p-7">
                            <span
                              className="font-body inline-block text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-4"
                              style={{ background: `${game.color}22`, color: game.color }}
                            >
                              {game.badge}
                            </span>

                            <motion.div
                              animate={{ rotate: [0, 5, -5, 0] }}
                              transition={{ duration: 3, repeat: Infinity, delay: i * 0.6 }}
                              className="text-6xl mb-4"
                            >
                              {game.emoji}
                            </motion.div>

                            <h3 className="font-display text-white font-black mb-2" style={{ fontSize: 22 }}>{game.title}</h3>
                            <p className="font-body text-white/45 text-sm leading-relaxed mb-1">{game.desc}</p>
                            <p className="font-body text-white/25 text-xs mb-5">{game.tip}</p>

                            {scores[game.id] !== undefined && (
                              <p className="font-body text-yellow-400 text-sm font-bold mb-4">⭐ Best: {scores[game.id]} pts</p>
                            )}

                            <div
                              className="font-display w-full py-3 rounded-2xl text-white font-black text-center text-sm tracking-wide"
                              style={{ background: `linear-gradient(135deg,${game.from},${game.to})`, boxShadow: `0 4px 16px ${game.glow}` }}
                            >
                              {scores[game.id] ? "▶ Play Again" : "▶ Start Game"}
                            </div>
                          </div>
                        </motion.div>
                      </Link>
                    </motion.div>
                  ))}
                </div>

                <p className="font-body text-center text-white/15 text-xs mt-12">
                  ✦ 3 games · AI-powered hints · Save your score
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </>
  );
}
