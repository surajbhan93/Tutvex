import { useState, useEffect, useRef, useCallback } from "react";

// ============================================================
// TYPES
// ============================================================
interface Color {
  name: string;
  bg: string;
  text: string;
}

interface Level {
  id: number;
  name: string;
  emoji: string;
  colorCount: number;
  time: number;
  coinsPerHit: number;
  description: string;
  hideLabel: boolean;
  shuffle: boolean;
}

interface Powerup {
  id: string;
  emoji: string;
  label: string;
  cost: number;
}

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  opacity: number;
  age: number;
  life: number;
}

interface CoinParticleData {
  id: number;
  coins: number;
  x: number;
  y: number;
}

interface LeaderboardEntry {
  name: string;
  score: number;
  coins: number;
  level: string;
  date: string;
}

interface AudioEngine {
  startMusic: () => void;
  stopMusic: () => void;
  playCorrect: () => void;
  playWrong: () => void;
  playLevelUp: () => void;
  playCoin: () => void;
}

type Screen = "menu" | "playing" | "gameover" | "leaderboard" | "levelselect";
type FlashType = "correct" | "wrong" | null;

// ============================================================
// CONSTANTS
// ============================================================
const ALL_COLORS: Color[] = [
  { name: "Red",    bg: "#ef4444", text: "#fff" },
  { name: "Blue",   bg: "#3b82f6", text: "#fff" },
  { name: "Green",  bg: "#22c55e", text: "#fff" },
  { name: "Yellow", bg: "#facc15", text: "#000" },
  { name: "Purple", bg: "#a855f7", text: "#fff" },
  { name: "Pink",   bg: "#ec4899", text: "#fff" },
  { name: "Orange", bg: "#f97316", text: "#fff" },
  { name: "Teal",   bg: "#14b8a6", text: "#fff" },
  { name: "Indigo", bg: "#6366f1", text: "#fff" },
  { name: "Lime",   bg: "#84cc16", text: "#000" },
  { name: "Cyan",   bg: "#06b6d4", text: "#000" },
  { name: "Rose",   bg: "#f43f5e", text: "#fff" },
];

const LEVELS: Level[] = [
  { id: 1,  name: "Rookie",     emoji: "🥚", colorCount: 4,  time: 30, coinsPerHit: 10,  description: "4 colors · 30s",           hideLabel: false, shuffle: false },
  { id: 2,  name: "Beginner",   emoji: "🐣", colorCount: 5,  time: 27, coinsPerHit: 15,  description: "5 colors · 27s",           hideLabel: false, shuffle: false },
  { id: 3,  name: "Learner",    emoji: "🐥", colorCount: 6,  time: 25, coinsPerHit: 20,  description: "6 colors · 25s",           hideLabel: false, shuffle: false },
  { id: 4,  name: "Challenger", emoji: "⚡", colorCount: 6,  time: 20, coinsPerHit: 30,  description: "6 colors · 20s · Fast",    hideLabel: false, shuffle: false },
  { id: 5,  name: "Expert",     emoji: "🔥", colorCount: 7,  time: 18, coinsPerHit: 40,  description: "7 colors · 18s",           hideLabel: false, shuffle: false },
  { id: 6,  name: "Master",     emoji: "💎", colorCount: 8,  time: 15, coinsPerHit: 60,  description: "8 colors · Labels hidden", hideLabel: true,  shuffle: false },
  { id: 7,  name: "Elite",      emoji: "🦅", colorCount: 9,  time: 13, coinsPerHit: 80,  description: "9 colors · Shuffles",      hideLabel: true,  shuffle: true  },
  { id: 8,  name: "Legend",     emoji: "👑", colorCount: 10, time: 11, coinsPerHit: 100, description: "10 colors · Rapid",        hideLabel: true,  shuffle: true  },
  { id: 9,  name: "Nightmare",  emoji: "💀", colorCount: 11, time: 9,  coinsPerHit: 150, description: "11 colors · Chaos",        hideLabel: true,  shuffle: true  },
  { id: 10, name: "GOD MODE",   emoji: "🌟", colorCount: 12, time: 7,  coinsPerHit: 250, description: "ALL colors · INSANE",      hideLabel: true,  shuffle: true  },
];

const POWERUPS: Powerup[] = [
  { id: "time",   emoji: "⏰", label: "+5s",     cost: 50  },
  { id: "life",   emoji: "❤️",  label: "+1 Life", cost: 100 },
  { id: "reveal", emoji: "👁",  label: "Reveal",  cost: 75  },
  { id: "skip",   emoji: "⏭",  label: "Skip",    cost: 30  },
];

const PARTICLE_COLORS = ["#facc15", "#22c55e", "#a855f7", "#3b82f6", "#ec4899"];

// ============================================================
// WEB AUDIO ENGINE
// ============================================================
function createAudioEngine(): AudioEngine {
  let ctx: AudioContext | null = null;
  let musicInterval: ReturnType<typeof setInterval> | null = null;
  let playing = false;

  const getCtx = (): AudioContext => {
    if (!ctx) {
      ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return ctx;
  };

  const playNote = (freq: number, dur: number, type: OscillatorType = "square", vol = 0.08): void => {
    try {
      const c = getCtx();
      const osc = c.createOscillator();
      const g = c.createGain();
      osc.type = type;
      osc.frequency.value = freq;
      g.gain.setValueAtTime(vol, c.currentTime);
      g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + dur);
      osc.connect(g);
      g.connect(c.destination);
      osc.start();
      osc.stop(c.currentTime + dur);
    } catch (_) {}
  };

  const melody: number[] = [262, 294, 330, 349, 392, 440, 392, 349, 330, 294, 262, 294, 330, 392, 440, 392];
  let noteIdx = 0;

  const startMusic = (): void => {
  if (playing) return;
  playing = true;

  musicInterval = setInterval(() => {
    if (!playing) return;

    const note = melody[noteIdx % melody.length] ?? 262;
    playNote(note, 0.18, "square", 0.04);

    if (noteIdx % 4 === 0) {
      playNote(65, 0.3, "triangle", 0.03);
    }

    noteIdx++;
  }, 280);
};

  const stopMusic = (): void => {
    playing = false;
    if (musicInterval) clearInterval(musicInterval);
  };

  const playCorrect = (): void => {
    [523, 659, 784].forEach((f, i) => setTimeout(() => playNote(f, 0.15, "square", 0.1), i * 80));
  };

  const playWrong = (): void => {
    [200, 150].forEach((f, i) => setTimeout(() => playNote(f, 0.2, "sawtooth", 0.12), i * 100));
  };

  const playLevelUp = (): void => {
    [523, 659, 784, 1047].forEach((f, i) => setTimeout(() => playNote(f, 0.25, "square", 0.1), i * 100));
  };

  const playCoin = (): void => playNote(1046, 0.08, "square", 0.06);

  return { startMusic, stopMusic, playCorrect, playWrong, playLevelUp, playCoin };
}

// ============================================================
// STORAGE HELPERS
// ============================================================
declare global {
  interface Window {
    storage?: {
      get: (key: string, shared?: boolean) => Promise<{ value: string } | null>;
      set: (key: string, value: string, shared?: boolean) => Promise<void>;
    };
  }
}

async function saveScore(
  name: string,
  score: number,
  coins: number,
  level: string
): Promise<LeaderboardEntry[]> {
  try {
    if (!window.storage) return [];
    const existing = await window.storage.get("lb_colorpro", true).catch(() => null);
    let board: LeaderboardEntry[] = existing ? JSON.parse(existing.value) : [];
    board.push({ name, score, coins, level, date: new Date().toLocaleDateString() });
    board.sort((a, b) => b.score - a.score);
    board = board.slice(0, 10);
    await window.storage.set("lb_colorpro", JSON.stringify(board), true);
    return board;
  } catch (_) {
    return [];
  }
}

async function getLeaderboard(): Promise<LeaderboardEntry[]> {
  try {
    if (!window.storage) return [];
    const result = await window.storage.get("lb_colorpro", true);
    return result ? JSON.parse(result.value) : [];
  } catch (_) {
    return [];
  }
}

async function getTotalCoins(): Promise<number> {
  try {
    if (!window.storage) return 0;
    const result = await window.storage.get("coins_colorpro");
    return result ? parseInt(result.value, 10) : 0;
  } catch (_) {
    return 0;
  }
}

async function saveTotalCoins(coins: number): Promise<void> {
  try {
    if (!window.storage) return;
    await window.storage.set("coins_colorpro", String(coins));
  } catch (_) {}
}

// ============================================================
// SUB-COMPONENTS
// ============================================================
function ParticlesLayer({ particles }: { particles: Particle[] }) {
  return (
    <div
      style={{
        position: "fixed", top: 0, left: 0,
        width: "100%", height: "100%",
        pointerEvents: "none", zIndex: 9999,
      }}
    >
      {particles.map((p) => (
        <div
          key={p.id}
          style={{
            position: "absolute",
            left: p.x,
            top: p.y,
            width: p.size,
            height: p.size,
            borderRadius: "50%",
            background: p.color,
            opacity: p.opacity,
            transform: `translate(${p.vx * p.age}px, ${p.vy * p.age + p.age * p.age * 0.1}px) scale(${Math.max(0, 1 - p.age / p.life)})`,
            boxShadow: `0 0 ${p.size * 2}px ${p.color}`,
          }}
        />
      ))}
    </div>
  );
}

function CoinPopup({ data }: { data: CoinParticleData }) {
  return (
    <div
      style={{
        position: "fixed",
        left: data.x,
        top: data.y,
        zIndex: 10000,
        pointerEvents: "none",
        fontSize: "1.1rem",
        fontWeight: 900,
        color: "#facc15",
        textShadow: "0 0 10px #facc15",
        animation: "coinFloat 1.2s ease-out forwards",
        whiteSpace: "nowrap",
      }}
    >
      +{data.coins}🪙
    </div>
  );
}

// ============================================================
// STAT CARD
// ============================================================
function StatCard({
  label,
  value,
  valueColor,
}: {
  label: string;
  value: string | number;
  valueColor?: string;
}) {
  return (
    <div
      style={{
        background: "rgba(0,0,0,0.5)",
        border: "1px solid rgba(99,102,241,0.3)",
        borderRadius: 10,
        padding: "0.5rem 0.75rem",
        textAlign: "center",
        minWidth: 70,
      }}
    >
      <div style={{ fontSize: "0.6rem", color: "#8b8bcd", letterSpacing: "0.1em" }}>{label}</div>
      <div style={{ fontWeight: 900, fontSize: "0.95rem", color: valueColor ?? "#a855f7" }}>
        {value}
      </div>
    </div>
  );
}

// ============================================================
// MAIN COMPONENT
// ============================================================
export default function ColorMatchingPRO() {
  const [screen, setScreen] = useState<Screen>("menu");
  const [levelIdx, setLevelIdx] = useState<number>(0);
  const [colors, setColors] = useState<Color[]>([]);
  const [target, setTarget] = useState<Color | null>(null);
  const [score, setScore] = useState<number>(0);
  const [lives, setLives] = useState<number>(3);
  const [timeLeft, setTimeLeft] = useState<number>(30);
  const [combo, setCombo] = useState<number>(0);
  const [coins, setCoins] = useState<number>(0);
  const [totalCoins, setTotalCoins] = useState<number>(0);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [coinParticles, setCoinParticles] = useState<CoinParticleData[]>([]);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [playerName, setPlayerName] = useState<string>("Player");
  const [revealed, setRevealed] = useState<boolean>(false);
  const [shakeDrop, setShakeDrop] = useState<boolean>(false);
  const [flashDrop, setFlashDrop] = useState<FlashType>(null);
  const [roundsThisLevel, setRoundsThisLevel] = useState<number>(0);
  const [musicOn, setMusicOn] = useState<boolean>(true);
  const [savingScore, setSavingScore] = useState<boolean>(false);
  const [scoresSaved, setScoresSaved] = useState<boolean>(false);
  const [dropHover, setDropHover] = useState<boolean>(false);

  const audioRef = useRef<AudioEngine | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const shuffleRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const particleIdRef = useRef<number>(0);
  const gameOverFiredRef = useRef<boolean>(false);


const currentLevel = (LEVELS[levelIdx] ?? LEVELS[0])!;


  // ── Init ──
  useEffect(() => {
    audioRef.current = createAudioEngine();
    getTotalCoins().then((c) => setTotalCoins(c));
    getLeaderboard().then((b) => setLeaderboard(b));
    return () => audioRef.current?.stopMusic();
  }, []);

  // ── Music ──
  useEffect(() => {
    if (!audioRef.current) return;
    if (musicOn && screen === "playing") audioRef.current.startMusic();
    else audioRef.current.stopMusic();
  }, [musicOn, screen]);

  // ── Timer ──
  useEffect(() => {
    if (screen !== "playing") {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }
    if (timerRef.current) clearInterval(timerRef.current);
    gameOverFiredRef.current = false;
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          if (!gameOverFiredRef.current) {
            gameOverFiredRef.current = true;
            triggerGameOver();
          }
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [screen, levelIdx]);

  // ── Auto-shuffle ──
  useEffect(() => {
  if (shuffleRef.current) clearInterval(shuffleRef.current);

  const lvl = LEVELS[levelIdx];
  if (!lvl || screen !== "playing" || !lvl.shuffle) return;

  shuffleRef.current = setInterval(() => {
    setColors((c) => [...c].sort(() => Math.random() - 0.5));
  }, 2000);

  return () => {
    if (shuffleRef.current) clearInterval(shuffleRef.current);
  };
}, [screen, levelIdx]);

  // ── Generate Round ──
  const generateRound = useCallback(
  (lvlIdx: number = levelIdx): void => {
   const lvl = LEVELS[lvlIdx];
if (!lvl) return;

const pool = ALL_COLORS.slice(0, lvl.colorCount);
    const shuffled = [...pool].sort(() => Math.random() - 0.5);

    setColors(shuffled);

    const randomIndex = Math.floor(Math.random() * shuffled.length);
    const randomColor = shuffled[randomIndex] ?? null;
    setTarget(randomColor);

    setRevealed(false);
  },
  [levelIdx]
);

  // ── Particles ──
  const spawnParticles = useCallback(
    (x: number, y: number, correct: boolean): void => {
      const newPs: Particle[] = Array.from(
  { length: correct ? 22 : 8 },
  (_, i): Particle => ({
    id: particleIdRef.current++,
    x,
    y,
    vx: (Math.random() - 0.5) * 10,
    vy: (Math.random() - 0.5) * 10 - 4,
    size: Math.random() * 12 + 5,
    color: correct
      ? PARTICLE_COLORS[i % PARTICLE_COLORS.length] ?? "#facc15"
      : "#ef4444",
    opacity: 1,
    age: 0,
    life: 40 + Math.random() * 25,
  })
);

      setParticles((prev) => [...prev, ...newPs]);

      let frame = 0;
      const animate = (): void => {
        frame++;
        setParticles((ps) =>
          ps
            .map((p) => ({ ...p, age: p.age + 1, opacity: Math.max(0, 1 - p.age / p.life) }))
            .filter((p) => p.age < p.life)
        );
        if (frame < 55) requestAnimationFrame(animate);
      };
      requestAnimationFrame(animate);
    },
    []
  );

  const spawnCoinParticle = useCallback((amount: number, x: number, y: number): void => {
    const cp: CoinParticleData = { id: particleIdRef.current++, coins: amount, x, y };
    setCoinParticles((prev) => [...prev, cp]);
    setTimeout(() => setCoinParticles((prev) => prev.filter((p) => p.id !== cp.id)), 1300);
  }, []);

  // ── Game Over ──
  const triggerGameOver = useCallback((): void => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (shuffleRef.current) clearInterval(shuffleRef.current);
    audioRef.current?.stopMusic();
    setScreen("gameover");
    setScoresSaved(false);
  }, []);

  // ── Handle Answer ──
  const handleAnswer = useCallback(
  (colorName: string, eventX: number, eventY: number): void => {
    if (!target) return;

    const lvl = LEVELS[levelIdx];
    if (!lvl) return;

    const correct = colorName === target.name;
    const cx = eventX || window.innerWidth / 2;
    const cy = eventY || window.innerHeight / 2;

    spawnParticles(cx, cy, correct);

    if (correct) {
      audioRef.current?.playCorrect();

      setCombo((prevCombo) => {
        const newCombo = prevCombo + 1;
        const multiplier = Math.min(newCombo, 5);
        const earned = lvl.coinsPerHit * multiplier;

        audioRef.current?.playCoin();
        setScore((s) => s + 10 * multiplier);
        setCoins((c) => c + earned);
        spawnCoinParticle(earned, cx, cy);

        return newCombo;
      });

      setFlashDrop("correct");
      setTimeout(() => setFlashDrop(null), 300);

      setRoundsThisLevel((prev) => {
        const newRounds = prev + 1;

        if (newRounds >= 5 && levelIdx < LEVELS.length - 1) {
          audioRef.current?.playLevelUp();
          const nextIdx = levelIdx + 1;

          const nextLevel = LEVELS[nextIdx];
          if (!nextLevel) return prev;

          setLevelIdx(nextIdx);
          setTimeLeft(nextLevel.time);
          setRoundsThisLevel(0);
          setTimeout(() => generateRound(nextIdx), 0);
          return 0;
        }

        setTimeout(() => generateRound(levelIdx), 0);
        return newRounds;
      });
    } else {
      audioRef.current?.playWrong();
      setCombo(0);
      setFlashDrop("wrong");
      setShakeDrop(true);

      setTimeout(() => {
        setFlashDrop(null);
        setShakeDrop(false);
      }, 400);

      setLives((l) => {
        const next = l - 1;
        if (next <= 0) {
          if (!gameOverFiredRef.current) {
            gameOverFiredRef.current = true;
            triggerGameOver();
          }
          return 0;
        }
        setTimeout(() => generateRound(levelIdx), 0);
        return next;
      });
    }
  },
  [target, levelIdx, spawnParticles, spawnCoinParticle, generateRound, triggerGameOver]
);

  // ── Start Game ──
const startGame = useCallback(
  (startLevelIdx = 0): void => {
    const lvl = LEVELS[startLevelIdx];
    if (!lvl) return;

    gameOverFiredRef.current = false;
    setLevelIdx(startLevelIdx);
    setScore(0);
    setLives(3);
    setCombo(0);
    setCoins(0);
    setRoundsThisLevel(0);
    setTimeLeft(lvl.time);
    setScoresSaved(false);
    setParticles([]);
    setCoinParticles([]);
    generateRound(startLevelIdx);
    setScreen("playing");

    if (musicOn) {
      setTimeout(() => audioRef.current?.startMusic(), 150);
    }
  },
  [generateRound, musicOn]
);
  // ── Save Score ──
  const handleSaveScore = async (): Promise<void> => {
  const lvl = LEVELS[levelIdx];
  if (!lvl) return;

  setSavingScore(true);

  const newTotal = totalCoins + coins;
  await saveTotalCoins(newTotal);
  setTotalCoins(newTotal);

  const board = await saveScore(
    playerName,
    score,
    coins,
    lvl.name
  );

  setLeaderboard(board);
  setSavingScore(false);
  setScoresSaved(true);
};

  // ── Power-ups ──
  const usePowerup = (id: string): void => {
    const pu = POWERUPS.find((p) => p.id === id);
    if (!pu || coins < pu.cost) return;
    setCoins((c) => c - pu.cost);
    if (id === "time") setTimeLeft((t) => t + 5);
    if (id === "life") setLives((l) => Math.min(l + 1, 5));
    if (id === "reveal") {
      setRevealed(true);
      setTimeout(() => setRevealed(false), 3000);
    }
    if (id === "skip") generateRound(levelIdx);
    audioRef.current?.playCoin();
  };

  // ── Drag & Drop ──
  const onDragStart = (e: React.DragEvent<HTMLDivElement>, colorName: string): void => {
    e.dataTransfer.setData("color", colorName);
  };

  const onDrop = (e: React.DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
    const name = e.dataTransfer.getData("color");
    if (name) handleAnswer(name, e.clientX, e.clientY);
    setDropHover(false);
  };

  const onColorClick = (colorName: string, e: React.MouseEvent<HTMLDivElement>): void => {
    handleAnswer(colorName, e.clientX, e.clientY);
  };

  // ── Derived ──
  const timerPct = currentLevel ? (timeLeft / currentLevel.time) * 100 : 100;
  const timerColor = timerPct > 50 ? "#22c55e" : timerPct > 25 ? "#facc15" : "#ef4444";
  const dropBorderColor =
    flashDrop === "correct" ? "#22c55e"
    : flashDrop === "wrong" ? "#ef4444"
    : dropHover ? "#a855f7"
    : "rgba(99,102,241,0.4)";
  const dropBg =
    flashDrop === "correct" ? "rgba(34,197,94,0.15)"
    : flashDrop === "wrong" ? "rgba(239,68,68,0.15)"
    : dropHover ? "rgba(168,85,247,0.1)"
    : "rgba(0,0,0,0.3)";

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#050510",
        fontFamily: "'Courier New', monospace",
        color: "#fff",
        overflow: "hidden",
        position: "relative",
      }}
    >
      {/* Background Grid */}
      <div
        style={{
          position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none",
          backgroundImage: `linear-gradient(rgba(99,102,241,0.06) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(99,102,241,0.06) 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
          animation: "gridMove 20s linear infinite",
        }}
      />

      {/* Global CSS */}
      <style>{`
        @keyframes gridMove { from{background-position:0 0} to{background-position:0 40px} }
        @keyframes coinFloat { 0%{opacity:1;transform:translateY(0) scale(1)} 100%{opacity:0;transform:translateY(-80px) scale(1.5)} }
        @keyframes shake { 0%,100%{transform:translateX(0)} 20%{transform:translateX(-10px)} 40%{transform:translateX(10px)} 60%{transform:translateX(-6px)} 80%{transform:translateX(6px)} }
        @keyframes slideIn { from{opacity:0;transform:translateY(-20px)} to{opacity:1;transform:translateY(0)} }
        @keyframes glow { 0%,100%{box-shadow:0 0 8px #6366f1,0 0 15px #6366f1} 50%{box-shadow:0 0 25px #a855f7,0 0 50px #a855f7,0 0 70px #a855f7} }
        @keyframes neonText { 0%,100%{text-shadow:0 0 5px #fff,0 0 12px #a855f7,0 0 22px #a855f7} 50%{text-shadow:0 0 10px #fff,0 0 30px #6366f1,0 0 55px #6366f1} }
        @keyframes rotate { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        @keyframes popIn { 0%{transform:scale(0.4);opacity:0} 70%{transform:scale(1.2)} 100%{transform:scale(1);opacity:1} }
        .ctile:hover { transform:scale(1.13) translateY(-5px) !important; }
        .ctile:active { transform:scale(0.93) !important; }
        .pup:hover { transform:scale(1.1); }
        .nbtn:hover { background:rgba(99,102,241,0.3) !important; }
        .lvlcard:hover { transform:scale(1.04) !important; border-color:rgba(168,85,247,0.7) !important; }
      `}</style>

      {/* Particles */}
      <ParticlesLayer particles={particles} />
      {coinParticles.map((cp) => (
        <CoinPopup key={cp.id} data={cp} />
      ))}

      {/* ═══════════════ MENU ═══════════════ */}
      {screen === "menu" && (
        <div
          style={{
            position: "relative", zIndex: 1,
            display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center",
            minHeight: "100vh", padding: "2rem", textAlign: "center",
          }}
        >
          <div style={{ fontSize: "5rem", animation: "rotate 8s linear infinite", display: "inline-block", marginBottom: "1rem" }}>
            🎨
          </div>
          <h1
            style={{
              fontSize: "clamp(2.5rem,6vw,4rem)", fontWeight: 900,
              letterSpacing: "0.05em", animation: "neonText 2s infinite", marginBottom: "0.25rem",
            }}
          >
            COLOR MATCH
          </h1>
          <div style={{ color: "#a855f7", fontSize: "1rem", letterSpacing: "0.3em", marginBottom: "2.5rem" }}>
            ULTIMATE EDITION · 10 LEVELS
          </div>

          {/* Stats row */}
          <div style={{ display: "flex", gap: "1rem", marginBottom: "2rem", flexWrap: "wrap", justifyContent: "center" }}>
            {(
              [
                ["🏦", "COINS", `${totalCoins}🪙`],
                ["🏆", "BEST", leaderboard[0]?.score ?? "--"],
                ["🎮", "LEVELS", "10"],
              ] as [string, string, string | number][]
            ).map(([ic, lb, val]) => (
              <div
                key={lb}
                style={{
                  background: "rgba(99,102,241,0.15)",
                  border: "1px solid rgba(99,102,241,0.4)",
                  borderRadius: 12, padding: "0.75rem 1.5rem", minWidth: 100,
                }}
              >
                <div style={{ fontSize: "1.5rem" }}>{ic}</div>
                <div style={{ color: "#8b8bcd", fontSize: "0.7rem" }}>{lb}</div>
                <div style={{ fontWeight: 900, fontSize: "1.1rem", color: "#a855f7" }}>{val}</div>
              </div>
            ))}
          </div>

          {/* Buttons */}
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", width: "100%", maxWidth: 320 }}>
            <button
              onClick={() => startGame(0)}
              style={{
                background: "linear-gradient(135deg,#6366f1,#a855f7)",
                border: "none", color: "#fff", padding: "1rem 2rem",
                borderRadius: 12, fontSize: "1.2rem", fontWeight: 900,
                cursor: "pointer", animation: "glow 2s infinite", letterSpacing: "0.1em",
              }}
            >
              ▶ START GAME
            </button>
            <button
              onClick={() => setScreen("levelselect")}
              className="nbtn"
              style={{
                background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.4)",
                color: "#a855f7", padding: "0.75rem 2rem", borderRadius: 12,
                fontSize: "1rem", fontWeight: 700, cursor: "pointer", transition: "background 0.2s",
              }}
            >
              🎯 SELECT LEVEL
            </button>
            <button
              onClick={() => getLeaderboard().then((b) => { setLeaderboard(b); setScreen("leaderboard"); })}
              className="nbtn"
              style={{
                background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.4)",
                color: "#a855f7", padding: "0.75rem 2rem", borderRadius: 12,
                fontSize: "1rem", fontWeight: 700, cursor: "pointer", transition: "background 0.2s",
              }}
            >
              🏆 LEADERBOARD
            </button>
          </div>

          {/* Music toggle */}
          <div style={{ marginTop: "2rem", display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <span style={{ color: "#555" }}>🎵 Music</span>
            <div
              onClick={() => setMusicOn((m) => !m)}
              style={{
                width: 48, height: 24, borderRadius: 12,
                background: musicOn ? "#6366f1" : "#333",
                cursor: "pointer", transition: "background 0.3s", position: "relative",
              }}
            >
              <div
                style={{
                  position: "absolute", top: 2, left: musicOn ? 26 : 2,
                  width: 20, height: 20, borderRadius: "50%",
                  background: "#fff", transition: "left 0.3s",
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════ LEVEL SELECT ═══════════════ */}
      {screen === "levelselect" && (
        <div style={{ position: "relative", zIndex: 1, padding: "2rem", maxWidth: 820, margin: "0 auto" }}>
          <button
            onClick={() => setScreen("menu")}
            style={{
              background: "rgba(99,102,241,0.2)", border: "1px solid rgba(99,102,241,0.4)",
              color: "#a855f7", padding: "0.5rem 1rem", borderRadius: 8, cursor: "pointer", marginBottom: "2rem",
            }}
          >
            ← Back
          </button>
          <h2
            style={{
              fontSize: "2rem", fontWeight: 900, textAlign: "center",
              marginBottom: "2rem", animation: "neonText 2s infinite",
            }}
          >
            SELECT LEVEL
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(230px, 1fr))", gap: "1rem" }}>
            {LEVELS.map((lvl, i) => (
              <div
                key={lvl.id}
                className="lvlcard"
                onClick={() => startGame(i)}
                style={{
                  background: "rgba(99,102,241,0.1)",
                  border: `1px solid rgba(${i === 9 ? "250,204,21" : "99,102,241"},0.4)`,
                  borderRadius: 12, padding: "1.25rem", cursor: "pointer",
                  transition: "all 0.2s", position: "relative", overflow: "hidden",
                }}
              >
                {i === 9 && (
                  <div
                    style={{
                      position: "absolute", top: 8, right: 8,
                      background: "#facc15", color: "#000",
                      borderRadius: 4, padding: "0.1rem 0.4rem",
                      fontSize: "0.65rem", fontWeight: 900,
                    }}
                  >
                    MAX
                  </div>
                )}
                <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>{lvl.emoji}</div>
                <div style={{ fontWeight: 900, fontSize: "1.1rem", color: i === 9 ? "#facc15" : "#a855f7" }}>
                  LV{lvl.id} · {lvl.name}
                </div>
                <div style={{ color: "#888", fontSize: "0.8rem", marginTop: "0.25rem" }}>{lvl.description}</div>
                <div style={{ color: "#facc15", fontSize: "0.8rem", marginTop: "0.5rem" }}>
                  💰 {lvl.coinsPerHit} coins/hit
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ═══════════════ PLAYING ═══════════════ */}
      {screen === "playing" && target && (
        <div
          style={{
            position: "relative", zIndex: 1,
            display: "flex", flexDirection: "column",
            alignItems: "center", minHeight: "100vh",
            padding: "1rem 1rem 2rem", animation: "slideIn 0.3s ease",
          }}
        >
          {/* Top bar */}
          <div
            style={{
              display: "flex", width: "100%", maxWidth: 620,
              gap: "0.5rem", marginBottom: "1rem", flexWrap: "wrap", justifyContent: "center",
            }}
          >
            <StatCard label="SCORE" value={score} valueColor="#a855f7" />
            <StatCard label="LIVES" value={"❤️".repeat(lives)} valueColor="#ef4444" />
            <StatCard label="COMBO" value={`x${Math.min(combo, 5)}`} valueColor={combo > 2 ? "#facc15" : "#a855f7"} />
            <StatCard label="COINS" value={coins} valueColor="#facc15" />
            <button
              onClick={() => setMusicOn((m) => !m)}
              style={{
                background: "rgba(0,0,0,0.5)", border: "1px solid rgba(99,102,241,0.3)",
                borderRadius: 10, padding: "0.5rem 0.75rem",
                color: "#a855f7", cursor: "pointer", fontSize: "1.2rem",
              }}
            >
              {musicOn ? "🔊" : "🔇"}
            </button>
          </div>

          {/* Level indicator */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.75rem" }}>
            <div style={{ fontSize: "1.5rem" }}>{currentLevel.emoji}</div>
            <div>
              <div style={{ fontWeight: 900, color: "#a855f7", fontSize: "0.9rem", letterSpacing: "0.15em" }}>
                LV{currentLevel.id} · {currentLevel.name.toUpperCase()}
              </div>
              <div style={{ display: "flex", gap: 3, marginTop: 3 }}>
                {Array.from({ length: 5 }).map((_, i) => (
                  <div
                    key={i}
                    style={{
                      width: 28, height: 4, borderRadius: 2,
                      background: i < roundsThisLevel ? "#a855f7" : "rgba(99,102,241,0.2)",
                      transition: "background 0.3s",
                    }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Timer bar */}
          <div
            style={{
              width: "100%", maxWidth: 500, height: 8,
              background: "rgba(255,255,255,0.1)", borderRadius: 4,
              marginBottom: "1rem", overflow: "hidden",
            }}
          >
            <div
              style={{
                height: "100%",
                width: `${timerPct}%`,
                background: `linear-gradient(90deg, ${timerColor}, ${timerColor}bb)`,
                borderRadius: 4,
                transition: "width 0.9s linear, background 0.5s",
                boxShadow: `0 0 8px ${timerColor}`,
              }}
            />
          </div>
          <div
            style={{
              fontSize: "1.8rem", fontWeight: 900, color: timerColor,
              marginBottom: "1rem", textShadow: `0 0 15px ${timerColor}`,
            }}
          >
            ⏱ {timeLeft}s
          </div>

          {/* Target */}
          <div style={{ fontSize: "0.85rem", color: "#8b8bcd", marginBottom: "0.5rem", letterSpacing: "0.15em" }}>
            MATCH THIS COLOR
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.25rem" }}>
            <div
              style={{
                width: 60, height: 60, borderRadius: 12,
                background: currentLevel.hideLabel && !revealed ? "rgba(255,255,255,0.08)" : target.bg,
                border: `2px solid ${target.bg}55`,
                boxShadow: `0 0 20px ${target.bg}99`,
                transition: "background 0.3s",
              }}
            />
            {!currentLevel.hideLabel || revealed ? (
              <div style={{ fontSize: "1.8rem", fontWeight: 900, color: "#fff", textShadow: "0 0 10px rgba(255,255,255,0.5)" }}>
                {target.name}
              </div>
            ) : (
              <div style={{ fontSize: "1.4rem", color: "#444", letterSpacing: "0.25em" }}>???</div>
            )}
          </div>

          {/* Drop zone */}
          <div
            onDragOver={(e) => { e.preventDefault(); setDropHover(true); }}
            onDragLeave={() => setDropHover(false)}
            onDrop={onDrop}
            style={{
              width: 175, height: 175,
              border: `3px dashed ${dropBorderColor}`,
              borderRadius: 20, marginBottom: "1.25rem",
              background: dropBg,
              display: "flex", flexDirection: "column",
              alignItems: "center", justifyContent: "center",
              cursor: "crosshair", transition: "all 0.2s",
              animation: shakeDrop ? "shake 0.4s" : "none",
              boxShadow: dropHover ? "0 0 30px rgba(168,85,247,0.35)" : "none",
            }}
          >
            <div style={{ fontSize: "2.5rem" }}>
              {flashDrop === "correct" ? "✅" : flashDrop === "wrong" ? "❌" : "🎯"}
            </div>
            <div style={{ color: "rgba(255,255,255,0.25)", fontSize: "0.7rem", marginTop: "0.5rem", letterSpacing: "0.1em" }}>
              DROP OR CLICK
            </div>
          </div>

          {/* Color tiles */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: `repeat(${Math.min(currentLevel.colorCount, 4)}, 1fr)`,
              gap: "0.55rem", maxWidth: 440, width: "100%",
            }}
          >
            {colors.map((color, i) => (
              <div
                key={`${color.name}-${i}`}
                className="ctile"
                draggable
                onDragStart={(e) => onDragStart(e, color.name)}
                onClick={(e) => onColorClick(color.name, e)}
                style={{
                  background: color.bg, height: 65, borderRadius: 12,
                  cursor: "grab",
                  boxShadow: `0 4px 15px ${color.bg}66`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontWeight: 900, fontSize: "0.68rem",
                  color: currentLevel.hideLabel && !revealed ? "transparent" : color.text,
                  border: `1px solid ${color.bg}99`,
                  transition: "transform 0.15s, box-shadow 0.2s",
                  letterSpacing: "0.05em", userSelect: "none",
                }}
              >
                {!currentLevel.hideLabel || revealed ? color.name.toUpperCase() : ""}
              </div>
            ))}
          </div>

          {/* Power-ups */}
          <div style={{ display: "flex", gap: "0.5rem", marginTop: "1.25rem", flexWrap: "wrap", justifyContent: "center" }}>
            {POWERUPS.map((pu) => {
              const canAfford = coins >= pu.cost;
              return (
                <button
                  key={pu.id}
                  className="pup"
                  onClick={() => usePowerup(pu.id)}
                  style={{
                    background: canAfford ? "rgba(99,102,241,0.2)" : "rgba(0,0,0,0.3)",
                    border: `1px solid ${canAfford ? "rgba(99,102,241,0.5)" : "rgba(255,255,255,0.1)"}`,
                    color: canAfford ? "#a855f7" : "#555",
                    padding: "0.4rem 0.65rem", borderRadius: 8,
                    cursor: canAfford ? "pointer" : "not-allowed",
                    fontSize: "0.75rem", transition: "all 0.2s",
                    lineHeight: 1.6,
                  }}
                >
                  {pu.emoji} {pu.label}
                  <br />
                  <span style={{ fontSize: "0.65rem", color: canAfford ? "#facc15" : "#444" }}>
                    🪙{pu.cost}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Quit */}
          <button
            onClick={() => {
              if (timerRef.current) clearInterval(timerRef.current);
              audioRef.current?.stopMusic();
              setScreen("menu");
            }}
            style={{
              marginTop: "1rem", background: "transparent", border: "none",
              color: "#444", cursor: "pointer", fontSize: "0.8rem",
            }}
          >
            ✕ Quit
          </button>
        </div>
      )}

      {/* ═══════════════ GAME OVER ═══════════════ */}
      {screen === "gameover" && (
        <div
          style={{
            position: "relative", zIndex: 1,
            display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center",
            minHeight: "100vh", padding: "2rem",
            textAlign: "center", animation: "slideIn 0.5s ease",
          }}
        >
          <div style={{ fontSize: "4rem", marginBottom: "1rem", animation: "popIn 0.5s ease" }}>
            {score >= 100 ? "🏆" : score >= 50 ? "🥈" : "💀"}
          </div>
          <h2 style={{ fontSize: "3rem", fontWeight: 900, marginBottom: "0.5rem", animation: "neonText 2s infinite" }}>
            GAME OVER
          </h2>
          <div style={{ color: "#a855f7", fontSize: "1rem", letterSpacing: "0.2em", marginBottom: "2rem" }}>
            REACHED LV{currentLevel.id} · {currentLevel.name.toUpperCase()}
          </div>

          <div
            style={{
              display: "grid", gridTemplateColumns: "1fr 1fr",
              gap: "1rem", marginBottom: "2rem", width: "100%", maxWidth: 360,
            }}
          >
            {(
              [
                ["⭐ SCORE", score],
                ["🪙 COINS", coins],
                ["🔥 TOP COMBO", `x${Math.min(combo, 5)}`],
                ["🏅 LEVEL", `${currentLevel.id}/10`],
              ] as [string, string | number][]
            ).map(([lb, val]) => (
              <div
                key={lb as string}
                style={{
                  background: "rgba(99,102,241,0.1)",
                  border: "1px solid rgba(99,102,241,0.3)",
                  borderRadius: 12, padding: "1rem",
                }}
              >
                <div style={{ color: "#8b8bcd", fontSize: "0.7rem", letterSpacing: "0.1em" }}>{lb}</div>
                <div style={{ fontWeight: 900, fontSize: "1.5rem", color: "#a855f7" }}>{val}</div>
              </div>
            ))}
          </div>

          {/* Save Score */}
          {!scoresSaved ? (
            <div style={{ marginBottom: "1.5rem", width: "100%", maxWidth: 360 }}>
              <div style={{ display: "flex", gap: "0.5rem", marginBottom: "0.75rem" }}>
                <input
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  placeholder="Your Name"
                  maxLength={16}
                  style={{
                    flex: 1, background: "rgba(99,102,241,0.1)",
                    border: "1px solid rgba(99,102,241,0.4)",
                    color: "#fff", borderRadius: 8, padding: "0.6rem",
                    fontSize: "1rem", outline: "none",
                  }}
                />
                <button
                  onClick={handleSaveScore}
                  disabled={savingScore}
                  style={{
                    background: "linear-gradient(135deg,#6366f1,#a855f7)",
                    border: "none", color: "#fff", padding: "0.6rem 1rem",
                    borderRadius: 8, cursor: "pointer", fontWeight: 700,
                    fontSize: "0.9rem", whiteSpace: "nowrap",
                  }}
                >
                  {savingScore ? "💾..." : "💾 SAVE"}
                </button>
              </div>
              <div style={{ color: "#555", fontSize: "0.7rem" }}>🌐 Saves to shared leaderboard</div>
            </div>
          ) : (
            <div
              style={{
                marginBottom: "1.5rem", padding: "0.75rem 1.5rem",
                background: "rgba(34,197,94,0.15)", border: "1px solid rgba(34,197,94,0.4)",
                borderRadius: 10, color: "#22c55e", fontWeight: 700,
              }}
            >
              ✅ Score saved! Total coins: {totalCoins}🪙
            </div>
          )}

          <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", justifyContent: "center" }}>
            <button
              onClick={() => startGame(0)}
              style={{
                background: "linear-gradient(135deg,#6366f1,#a855f7)",
                border: "none", color: "#fff", padding: "0.9rem 1.8rem",
                borderRadius: 12, fontSize: "1rem", fontWeight: 900, cursor: "pointer",
              }}
            >
              ▶ PLAY AGAIN
            </button>
            <button
              onClick={() => getLeaderboard().then((b) => { setLeaderboard(b); setScreen("leaderboard"); })}
              style={{
                background: "rgba(99,102,241,0.15)", border: "1px solid rgba(99,102,241,0.4)",
                color: "#a855f7", padding: "0.9rem 1.8rem", borderRadius: 12,
                fontSize: "1rem", fontWeight: 700, cursor: "pointer",
              }}
            >
              🏆 SCORES
            </button>
            <button
              onClick={() => setScreen("menu")}
              style={{
                background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.1)",
                color: "#666", padding: "0.9rem 1.8rem", borderRadius: 12,
                fontSize: "1rem", cursor: "pointer",
              }}
            >
              🏠 MENU
            </button>
          </div>
        </div>
      )}

      {/* ═══════════════ LEADERBOARD ═══════════════ */}
      {screen === "leaderboard" && (
        <div
          style={{
            position: "relative", zIndex: 1, padding: "2rem",
            maxWidth: 600, margin: "0 auto", animation: "slideIn 0.3s ease",
          }}
        >
          <button
            onClick={() => setScreen("menu")}
            style={{
              background: "rgba(99,102,241,0.2)", border: "1px solid rgba(99,102,241,0.4)",
              color: "#a855f7", padding: "0.5rem 1rem", borderRadius: 8,
              cursor: "pointer", marginBottom: "2rem",
            }}
          >
            ← Back
          </button>
          <h2
            style={{
              fontSize: "2.5rem", fontWeight: 900, textAlign: "center",
              marginBottom: "0.5rem", animation: "neonText 2s infinite",
            }}
          >
            🏆 LEADERBOARD
          </h2>
          <p style={{ textAlign: "center", color: "#555", fontSize: "0.8rem", marginBottom: "2rem" }}>
            🌐 Shared scores · All players
          </p>

          {leaderboard.length === 0 ? (
            <div style={{ textAlign: "center", color: "#555", padding: "3rem" }}>
              No scores yet. Be the first! 🎮
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
              {leaderboard.map((entry, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex", alignItems: "center", gap: "1rem",
                    background:
                      i === 0 ? "rgba(250,204,21,0.1)"
                      : i === 1 ? "rgba(200,200,200,0.08)"
                      : i === 2 ? "rgba(180,120,60,0.08)"
                      : "rgba(99,102,241,0.05)",
                    border: `1px solid ${
                      i === 0 ? "rgba(250,204,21,0.35)"
                      : i === 1 ? "rgba(200,200,200,0.2)"
                      : i === 2 ? "rgba(180,120,60,0.25)"
                      : "rgba(99,102,241,0.15)"
                    }`,
                    borderRadius: 12, padding: "0.9rem 1.2rem",
                  }}
                >
                  <div style={{ fontSize: "1.5rem", minWidth: 32, textAlign: "center" }}>
                    {i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : `#${i + 1}`}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 900, fontSize: "1rem", color: i === 0 ? "#facc15" : "#fff" }}>
                      {entry.name}
                    </div>
                    <div style={{ color: "#555", fontSize: "0.7rem" }}>
                      LV: {entry.level} · {entry.date}
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontWeight: 900, fontSize: "1.2rem", color: "#a855f7" }}>{entry.score}</div>
                    <div style={{ color: "#facc15", fontSize: "0.75rem" }}>🪙{entry.coins}</div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div style={{ textAlign: "center", marginTop: "2rem" }}>
            <button
              onClick={() => startGame(0)}
              style={{
                background: "linear-gradient(135deg,#6366f1,#a855f7)",
                border: "none", color: "#fff", padding: "0.9rem 2rem",
                borderRadius: 12, fontSize: "1rem", fontWeight: 900, cursor: "pointer",
              }}
            >
              ▶ PLAY NOW
            </button>
          </div>
        </div>
      )}
    </div>
  );
}