import { useState, useEffect, useRef, useCallback } from "react";

// ============================================================
// TYPES
// ============================================================
interface Level {
  id: number;
  name: string;
  emoji: string;
  gridSize: number;
  time: number;
  coinsPerHit: number;
  description: string;
  showTimer: boolean;
  flickerInterval: number | null; // ms, null = no flicker
  rotateItems: boolean;
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

interface CoinPopData {
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

interface Powerup {
  id: string;
  emoji: string;
  label: string;
  cost: number;
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
// QUESTION BANK — 10 difficulty tiers
// ============================================================
const QUESTION_BANK: Record<number, string[][]> = {
  1: [
    ["🍎","🍎","🍎","🍌"],
    ["🐶","🐶","🐱","🐶"],
    ["🌞","🌞","🌞","🌙"],
    ["🍦","🍦","🍰","🍦"],
    ["🐟","🐟","🐟","🦋"],
    ["🌹","🌹","🌻","🌹"],
    ["🎈","🎈","🎀","🎈"],
    ["⭐","⭐","⭐","💫"],
  ],
  2: [
    ["🚗","🚗","🚕","🚗","🚗"],
    ["🍕","🍕","🍔","🍕","🍕"],
    ["🐘","🐘","🐯","🐘","🐘"],
    ["📚","📚","💻","📚","📚"],
    ["🌊","🌊","🌊","🌵","🌊"],
    ["🎮","🎮","🎲","🎮","🎮"],
    ["🏠","🏠","⛺","🏠","🏠"],
    ["🚀","🚀","✈️","🚀","🚀"],
  ],
  3: [
    ["🔺","🔺","🔻","🔺","🔺","🔺"],
    ["🟢","🟢","🔵","🟢","🟢","🟢"],
    ["😀","😀","😀","😡","😀","😀"],
    ["🦁","🦁","🐺","🦁","🦁","🦁"],
    ["🌺","🌺","🌺","🌴","🌺","🌺"],
    ["🎵","🎵","🎵","🎸","🎵","🎵"],
    ["🍇","🍇","🍇","🍓","🍇","🍇"],
    ["🏆","🏆","🥇","🏆","🏆","🏆"],
  ],
  4: [
    ["🐈","🐈","🐈","🐕","🐈","🐈","🐈"],
    ["🌍","🌍","🌍","🌍","🪐","🌍","🌍"],
    ["🎃","🎃","🎄","🎃","🎃","🎃","🎃"],
    ["💎","💎","💎","💎","🔮","💎","💎"],
    ["🌈","🌈","🌈","🌈","☁️","🌈","🌈"],
    ["🦅","🦅","🦅","🦅","🦆","🦅","🦅"],
    ["🌙","🌙","🌙","🌙","☀️","🌙","🌙"],
    ["🍄","🍄","🍄","🍄","🌿","🍄","🍄"],
  ],
  5: [
    ["🔴","🔴","🔴","🔴","🟠","🔴","🔴","🔴"],
    ["🏋","🏋","🏊","🏋","🏋","🏋","🏋","🏋"],
    ["🧲","🧲","🧲","🧲","🔋","🧲","🧲","🧲"],
    ["🦊","🦊","🦊","🦊","🦝","🦊","🦊","🦊"],
    ["🌮","🌮","🌮","🌮","🥙","🌮","🌮","🌮"],
    ["🎯","🎯","🎯","🎯","🎳","🎯","🎯","🎯"],
    ["🧊","🧊","🧊","🧊","🌊","🧊","🧊","🧊"],
    ["🪄","🪄","🪄","🪄","🔮","🪄","🪄","🪄"],
  ],
  6: [
    ["🧬","🧬","🧬","🧬","🧪","🧬","🧬","🧬","🧬"],
    ["⚗️","⚗️","⚗️","⚗️","⚗️","🔬","⚗️","⚗️","⚗️"],
    ["🌐","🌐","🌐","🌐","🌐","🗺️","🌐","🌐","🌐"],
    ["🏰","🏰","🏰","🏰","🏰","🗼","🏰","🏰","🏰"],
    ["🦋","🦋","🦋","🦋","🦋","🐛","🦋","🦋","🦋"],
    ["🎭","🎭","🎭","🎭","🎭","🎪","🎭","🎭","🎭"],
    ["💠","💠","💠","💠","💠","🔷","💠","💠","💠"],
    ["🪸","🪸","🪸","🪸","🪸","🐚","🪸","🪸","🪸"],
  ],
  7: [
    ["🫧","🫧","🫧","🫧","🫧","🫧","💦","🫧","🫧","🫧"],
    ["🪬","🪬","🪬","🪬","🪬","🪬","🧿","🪬","🪬","🪬"],
    ["🫀","🫀","🫀","🫀","🫀","🫀","🧠","🫀","🫀","🫀"],
    ["🐉","🐉","🐉","🐉","🐉","🐉","🦕","🐉","🐉","🐉"],
    ["🌋","🌋","🌋","🌋","🌋","🌋","🏔","🌋","🌋","🌋"],
    ["🧩","🧩","🧩","🧩","🧩","🧩","🎲","🧩","🧩","🧩"],
    ["🛸","🛸","🛸","🛸","🛸","🛸","🚀","🛸","🛸","🛸"],
    ["🪩","🪩","🪩","🪩","🪩","🪩","🎪","🪩","🪩","🪩"],
  ],
  8: [
    // Similar-looking pairs — easily confused
    ["🌑","🌑","🌑","🌑","🌑","🌑","🌑","🌒","🌑","🌑","🌑"],
    ["😶","😶","😶","😶","😶","😶","😶","😑","😶","😶","😶"],
    ["🔲","🔲","🔲","🔲","🔲","🔲","🔲","🔳","🔲","🔲","🔲"],
    ["🟫","🟫","🟫","🟫","🟫","🟫","🟫","🟤","🟫","🟫","🟫"],
    ["🅾","🅾","🅾","🅾","🅾","🅾","🅾","⭕","🅾","🅾","🅾"],
    ["📳","📳","📳","📳","📳","📳","📳","📴","📳","📳","📳"],
    ["🔶","🔶","🔶","🔶","🔶","🔶","🔶","🟠","🔶","🔶","🔶"],
    ["🌕","🌕","🌕","🌕","🌕","🌕","🌕","🌔","🌕","🌕","🌕"],
  ],
  9: [
    // Very similar — requires focus
    ["😮","😮","😮","😮","😮","😮","😮","😮","😦","😮","😮","😮"],
    ["🏃","🏃","🏃","🏃","🏃","🏃","🏃","🏃","🚶","🏃","🏃","🏃"],
    ["🌿","🌿","🌿","🌿","🌿","🌿","🌿","🌿","🍃","🌿","🌿","🌿"],
    ["🧡","🧡","🧡","🧡","🧡","🧡","🧡","🧡","❤️","🧡","🧡","🧡"],
    ["🔸","🔸","🔸","🔸","🔸","🔸","🔸","🔸","🔹","🔸","🔸","🔸"],
    ["💬","💬","💬","💬","💬","💬","💬","💬","💭","💬","💬","💬"],
    ["🌱","🌱","🌱","🌱","🌱","🌱","🌱","🌱","🌾","🌱","🌱","🌱"],
    ["🫐","🫐","🫐","🫐","🫐","🫐","🫐","🫐","🍇","🫐","🫐","🫐"],
  ],
  10: [
    // Hardest — very subtle differences + large grids
    ["🔵","🔵","🔵","🔵","🔵","🔵","🔵","🔵","🔵","🔵","💙","🔵","🔵","🔵","🔵","🔵"],
    ["⬛","⬛","⬛","⬛","⬛","⬛","⬛","⬛","⬛","⬛","◼","⬛","⬛","⬛","⬛","⬛"],
    ["▪","▪","▪","▪","▪","▪","▪","▪","▪","▪","▫","▪","▪","▪","▪","▪"],
    ["🟥","🟥","🟥","🟥","🟥","🟥","🟥","🟥","🟥","🟥","❤️","🟥","🟥","🟥","🟥","🟥"],
    ["🔘","🔘","🔘","🔘","🔘","🔘","🔘","🔘","🔘","🔘","⚪","🔘","🔘","🔘","🔘","🔘"],
    ["🌑","🌑","🌑","🌑","🌑","🌑","🌑","🌑","🌑","🌑","⚫","🌑","🌑","🌑","🌑","🌑"],
    ["🟦","🟦","🟦","🟦","🟦","🟦","🟦","🟦","🟦","🟦","🔷","🟦","🟦","🟦","🟦","🟦"],
    ["💚","💚","💚","💚","💚","💚","💚","💚","💚","💚","🟢","💚","💚","💚","💚","💚"],
  ],
};

const LEVELS: Level[] = [
  { id: 1,  name: "Rookie",      emoji: "🥚", gridSize: 4,  time: 30, coinsPerHit: 10,  description: "4 items · Simple emojis",             showTimer: true,  flickerInterval: null, rotateItems: false },
  { id: 2,  name: "Beginner",    emoji: "🐣", gridSize: 5,  time: 27, coinsPerHit: 15,  description: "5 items · 27s",                        showTimer: true,  flickerInterval: null, rotateItems: false },
  { id: 3,  name: "Scout",       emoji: "🐥", gridSize: 6,  time: 24, coinsPerHit: 20,  description: "6 items · 24s",                        showTimer: true,  flickerInterval: null, rotateItems: false },
  { id: 4,  name: "Challenger",  emoji: "⚡", gridSize: 7,  time: 20, coinsPerHit: 30,  description: "7 items · 20s",                        showTimer: true,  flickerInterval: null, rotateItems: false },
  { id: 5,  name: "Expert",      emoji: "🔥", gridSize: 8,  time: 17, coinsPerHit: 45,  description: "8 items · 17s",                        showTimer: true,  flickerInterval: null, rotateItems: false },
  { id: 6,  name: "Master",      emoji: "💎", gridSize: 9,  time: 14, coinsPerHit: 65,  description: "9 items · No hints",                   showTimer: false, flickerInterval: null, rotateItems: false },
  { id: 7,  name: "Elite",       emoji: "🦅", gridSize: 10, time: 12, coinsPerHit: 90,  description: "10 items · Items rotate!",             showTimer: false, flickerInterval: null, rotateItems: true  },
  { id: 8,  name: "Legend",      emoji: "👑", gridSize: 11, time: 10, coinsPerHit: 120, description: "11 items · Similar emojis",            showTimer: false, flickerInterval: null, rotateItems: true  },
  { id: 9,  name: "Nightmare",   emoji: "💀", gridSize: 12, time: 8,  coinsPerHit: 180, description: "12 items · Flicker chaos",             showTimer: false, flickerInterval: 1800, rotateItems: true  },
  { id: 10, name: "GOD MODE",    emoji: "🌟", gridSize: 16, time: 6,  coinsPerHit: 300, description: "16 items · INSANE",                    showTimer: false, flickerInterval: 1200, rotateItems: true  },
];

const POWERUPS: Powerup[] = [
  { id: "time",    emoji: "⏰", label: "+5s",      cost: 50  },
  { id: "life",    emoji: "❤️",  label: "+1 Life",  cost: 100 },
  { id: "hint",    emoji: "💡",  label: "Hint",     cost: 60  },
  { id: "skip",    emoji: "⏭",  label: "Skip",     cost: 30  },
];

const PARTICLE_COLORS = ["#facc15","#22c55e","#a855f7","#3b82f6","#ec4899","#f97316"];

// ============================================================
// AUDIO ENGINE
// ============================================================
function createAudioEngine(): AudioEngine {
  let ctx: AudioContext | null = null;
  let musicInterval: ReturnType<typeof setInterval> | null = null;
  let playing = false;

  const getCtx = (): AudioContext => {
    if (!ctx) ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    return ctx;
  };

  const playNote = (freq: number, dur: number, type: OscillatorType = "square", vol = 0.07): void => {
    try {
      const c = getCtx();
      const osc = c.createOscillator();
      const g = c.createGain();
      osc.type = type;
      osc.frequency.value = freq;
      g.gain.setValueAtTime(vol, c.currentTime);
      g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + dur);
      osc.connect(g); g.connect(c.destination);
      osc.start(); osc.stop(c.currentTime + dur);
    } catch (_) {}
  };

  const melody = [330,392,440,523,392,349,330,294,330,392,523,440,392,330,294,262];
  let noteIdx = 0;

 const startMusic = (): void => {
  if (playing) return;
  playing = true;

  musicInterval = setInterval(() => {
    if (!playing) return;

    const note = melody[noteIdx % melody.length] ?? 262;
    playNote(note, 0.2, "triangle", 0.035);

    if (noteIdx % 3 === 0) {
      playNote(65, 0.28, "sine", 0.025);
    }

    noteIdx++;
  }, 320);
};

  const stopMusic = (): void => { playing = false; if (musicInterval) clearInterval(musicInterval); };
  const playCorrect = (): void => { [523,784,1047].forEach((f,i)=> setTimeout(()=>playNote(f,0.12,"square",0.1),i*70)); };
  const playWrong = (): void => { [220,165].forEach((f,i)=> setTimeout(()=>playNote(f,0.22,"sawtooth",0.12),i*110)); };
  const playLevelUp = (): void => { [392,523,659,784,1047].forEach((f,i)=> setTimeout(()=>playNote(f,0.22,"square",0.1),i*90)); };
  const playCoin = (): void => playNote(1047, 0.07, "square", 0.06);

  return { startMusic, stopMusic, playCorrect, playWrong, playLevelUp, playCoin };
}

// ============================================================
// STORAGE
// ============================================================
declare global {
  interface Window {
    storage?: {
      get: (key: string, shared?: boolean) => Promise<{ value: string } | null>;
      set: (key: string, value: string, shared?: boolean) => Promise<void>;
    };
  }
}

async function saveScore(name: string, score: number, coins: number, level: string): Promise<LeaderboardEntry[]> {
  try {
    if (!window.storage) return [];
    const existing = await window.storage.get("lb_oddoneout", true).catch(() => null);
    let board: LeaderboardEntry[] = existing ? JSON.parse(existing.value) : [];
    board.push({ name, score, coins, level, date: new Date().toLocaleDateString() });
    board.sort((a, b) => b.score - a.score);
    board = board.slice(0, 10);
    await window.storage.set("lb_oddoneout", JSON.stringify(board), true);
    return board;
  } catch (_) { return []; }
}

async function getLeaderboard(): Promise<LeaderboardEntry[]> {
  try {
    if (!window.storage) return [];
    const r = await window.storage.get("lb_oddoneout", true);
    return r ? JSON.parse(r.value) : [];
  } catch (_) { return []; }
}

async function getTotalCoins(): Promise<number> {
  try {
    if (!window.storage) return 0;
    const r = await window.storage.get("coins_oddoneout");
    return r ? parseInt(r.value, 10) : 0;
  } catch (_) { return 0; }
}

async function saveTotalCoins(c: number): Promise<void> {
  try { if (window.storage) await window.storage.set("coins_oddoneout", String(c)); } catch (_) {}
}

// ============================================================
// PARTICLE COMPONENTS
// ============================================================
function ParticleLayer({ particles }: { particles: Particle[] }) {
  return (
    <div style={{ position:"fixed", inset:0, pointerEvents:"none", zIndex:9999 }}>
      {particles.map(p => (
        <div key={p.id} style={{
          position:"absolute", left:p.x, top:p.y,
          width:p.size, height:p.size, borderRadius:"50%",
          background:p.color, opacity:p.opacity,
          transform:`translate(${p.vx*p.age}px,${p.vy*p.age+p.age*p.age*0.08}px) scale(${Math.max(0,1-p.age/p.life)})`,
          boxShadow:`0 0 ${p.size*2}px ${p.color}`,
        }}/>
      ))}
    </div>
  );
}

function CoinPop({ data }: { data: CoinPopData }) {
  return (
    <div style={{
      position:"fixed", left:data.x, top:data.y, zIndex:10000,
      pointerEvents:"none", fontSize:"1.1rem", fontWeight:900,
      color:"#facc15", textShadow:"0 0 10px #facc15",
      animation:"coinFloat 1.2s ease-out forwards", whiteSpace:"nowrap",
    }}>+{data.coins}🪙</div>
  );
}

// ============================================================
// MAIN COMPONENT
// ============================================================
export default function FindTheOddOne() {
  const [screen, setScreen] = useState<Screen>("menu");
  const [levelIdx, setLevelIdx] = useState<number>(0);
  const [question, setQuestion] = useState<string[]>([]);
  const [oddItem, setOddItem] = useState<string>("");
  const [hintIdx, setHintIdx] = useState<number | null>(null);
  const [score, setScore] = useState<number>(0);
  const [lives, setLives] = useState<number>(3);
  const [timeLeft, setTimeLeft] = useState<number>(30);
  const [combo, setCombo] = useState<number>(0);
  const [coins, setCoins] = useState<number>(0);
  const [totalCoins, setTotalCoins] = useState<number>(0);
  const [roundsThisLevel, setRoundsThisLevel] = useState<number>(0);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [coinPops, setCoinPops] = useState<CoinPopData[]>([]);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [playerName, setPlayerName] = useState<string>("Player");
  const [flashCard, setFlashCard] = useState<FlashType>(null);
  const [wrongIdx, setWrongIdx] = useState<number | null>(null);
  const [musicOn, setMusicOn] = useState<boolean>(true);
  const [savingScore, setSavingScore] = useState<boolean>(false);
  const [scoresSaved, setScoresSaved] = useState<boolean>(false);
  const [flickerVisible, setFlickerVisible] = useState<boolean>(true);
  const [rotations, setRotations] = useState<number[]>([]);

  const audioRef = useRef<AudioEngine | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const flickerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const particleIdRef = useRef<number>(0);
  const gameOverFiredRef = useRef<boolean>(false);

  const currentLevel = LEVELS[levelIdx];

  // Init
  useEffect(() => {
    audioRef.current = createAudioEngine();
    getTotalCoins().then(c => setTotalCoins(c));
    getLeaderboard().then(b => setLeaderboard(b));
    return () => audioRef.current?.stopMusic();
  }, []);

  // Music
  useEffect(() => {
    if (!audioRef.current) return;
    if (musicOn && screen === "playing") audioRef.current.startMusic();
    else audioRef.current.stopMusic();
  }, [musicOn, screen]);

  // Timer
  useEffect(() => {
    if (screen !== "playing") { if (timerRef.current) clearInterval(timerRef.current); return; }
    if (timerRef.current) clearInterval(timerRef.current);
    gameOverFiredRef.current = false;
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          if (!gameOverFiredRef.current) { gameOverFiredRef.current = true; triggerGameOver(); }
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [screen, levelIdx]);

  // Flicker effect for hard levels
useEffect(() => {
  if (flickerRef.current) clearInterval(flickerRef.current);

  const lvl = LEVELS[levelIdx];
  if (!lvl || screen !== "playing" || !lvl.flickerInterval) {
    setFlickerVisible(true);
    return;
  }

  flickerRef.current = setInterval(() => {
    setFlickerVisible((v) => !v);
  }, lvl.flickerInterval);

  return () => {
    if (flickerRef.current) clearInterval(flickerRef.current);
  };
}, [screen, levelIdx]);
  // Rotation effect

useEffect(() => {
  const lvl = LEVELS[levelIdx];
  if (!lvl || !lvl.rotateItems || question.length === 0) {
    setRotations(question.map(() => 0));
    return;
  }

  setRotations(question.map(() => Math.floor(Math.random() * 4) * 90));

  const interval = setInterval(() => {
    setRotations(prev => prev.map(r => (r + 90) % 360));
  }, 2500);

  return () => clearInterval(interval);
}, [question, levelIdx]);

  const findOdd = (arr: string[]): string => {
    return arr.find(item => arr.filter(i => i === item).length === 1) ?? "";
  };

 const generateRound = useCallback(
  (lvlIdx: number = levelIdx): void => {
    const bank = QUESTION_BANK[lvlIdx + 1] ?? QUESTION_BANK[10];
    if (!bank || bank.length === 0) return;

    const randomIndex = Math.floor(Math.random() * bank.length);
    const pool = bank[randomIndex];
    if (!pool) return;

    const shuffled = [...pool].sort(() => Math.random() - 0.5);
    const odd = findOdd(shuffled);

    setQuestion(shuffled);
    setOddItem(odd);
    setHintIdx(null);
    setWrongIdx(null);
    setFlashCard(null);
  },
  [levelIdx]
);

  const spawnParticles = useCallback((x: number, y: number, correct: boolean): void => {
    const ps: Particle[] = Array.from(
  { length: correct ? 24 : 8 },
  (_, i): Particle => ({
    id: particleIdRef.current++,
    x,
    y,
    vx: (Math.random() - 0.5) * 12,
    vy: (Math.random() - 0.5) * 12 - 4,
    size: Math.random() * 12 + 5,
    color: correct
      ? PARTICLE_COLORS[i % PARTICLE_COLORS.length] ?? "#facc15"
      : "#ef4444",
    opacity: 1,
    age: 0,
    life: 45 + Math.random() * 20,
  })
);
    setParticles(prev => [...prev, ...ps]);
    let frame = 0;
    const animate = (): void => {
      frame++;
      setParticles(ps => ps.map(p => ({ ...p, age: p.age + 1, opacity: Math.max(0, 1 - p.age / p.life) })).filter(p => p.age < p.life));
      if (frame < 55) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, []);

  const spawnCoin = useCallback((amount: number, x: number, y: number): void => {
    const cp: CoinPopData = { id: particleIdRef.current++, coins: amount, x, y };
    setCoinPops(prev => [...prev, cp]);
    setTimeout(() => setCoinPops(prev => prev.filter(p => p.id !== cp.id)), 1300);
  }, []);

  const triggerGameOver = useCallback((): void => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (flickerRef.current) clearInterval(flickerRef.current);
    audioRef.current?.stopMusic();
    setScreen("gameover");
    setScoresSaved(false);
  }, []);

 const handleClick = useCallback(
  (item: string, idx: number, e: React.MouseEvent): void => {
    if (screen !== "playing") return;

    const lvl = LEVELS[levelIdx];
    if (!lvl) return;

    const correct = item === oddItem;
    spawnParticles(e.clientX, e.clientY, correct);

    if (correct) {
      audioRef.current?.playCorrect();

      setCombo((prev) => {
        const newCombo = prev + 1;
        const mult = Math.min(newCombo, 5);
        const earned = lvl.coinsPerHit * mult;

        audioRef.current?.playCoin();
        setScore((s) => s + 10 * mult);
        setCoins((c) => c + earned);
        spawnCoin(earned, e.clientX, e.clientY);

        return newCombo;
      });

      setFlashCard("correct");
      setTimeout(() => setFlashCard(null), 280);

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
          setTimeout(() => generateRound(nextIdx), 50);
          return 0;
        }

        setTimeout(() => generateRound(levelIdx), 50);
        return newRounds;
      });
    } else {
      audioRef.current?.playWrong();
      setCombo(0);
      setWrongIdx(idx);
      setFlashCard("wrong");

      setTimeout(() => {
        setWrongIdx(null);
        setFlashCard(null);
      }, 450);

      setLives((l) => {
        const next = l - 1;
        if (next <= 0) {
          if (!gameOverFiredRef.current) {
            gameOverFiredRef.current = true;
            triggerGameOver();
          }
          return 0;
        }

        setTimeout(() => generateRound(levelIdx), 50);
        return next;
      });
    }
  },
  [screen, oddItem, levelIdx, spawnParticles, spawnCoin, generateRound, triggerGameOver]
);

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
    setCoinPops([]);
    setFlickerVisible(true);

    generateRound(startLevelIdx);
    setScreen("playing");

    if (musicOn) {
      setTimeout(() => audioRef.current?.startMusic(), 150);
    }
  },
  [generateRound, musicOn]
);

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

  const usePowerup = (id: string): void => {
    const pu = POWERUPS.find(p => p.id === id);
    if (!pu || coins < pu.cost) return;
    setCoins(c => c - pu.cost);
    if (id === "time") setTimeLeft(t => t + 5);
    if (id === "life") setLives(l => Math.min(l + 1, 5));
    if (id === "skip") generateRound(levelIdx);
    if (id === "hint") {
      const idx = question.indexOf(oddItem);
      setHintIdx(idx);
      setTimeout(() => setHintIdx(null), 2500);
    }
    audioRef.current?.playCoin();
  };
const levelId = currentLevel?.id ?? 1;
  // Derived
  const timerPct = currentLevel ? (timeLeft / currentLevel.time) * 100 : 100;
  const timerColor = timerPct > 50 ? "#22c55e" : timerPct > 25 ? "#facc15" : "#ef4444";
  const cols = Math.ceil(Math.sqrt(question.length));

  return (
    <div style={{ minHeight:"100vh", background:"#03030f", fontFamily:"'Courier New', monospace", color:"#fff", position:"relative", overflow:"hidden" }}>

      {/* Animated starfield bg */}
      <div style={{ position:"fixed", inset:0, zIndex:0, pointerEvents:"none",
        backgroundImage:`radial-gradient(circle, rgba(168,85,247,0.08) 1px, transparent 1px)`,
        backgroundSize:"35px 35px", animation:"bgDrift 30s linear infinite" }} />

      <style>{`
        @keyframes bgDrift { from{background-position:0 0} to{background-position:35px 35px} }
        @keyframes coinFloat { 0%{opacity:1;transform:translateY(0) scale(1)} 100%{opacity:0;transform:translateY(-85px) scale(1.6)} }
        @keyframes glow { 0%,100%{box-shadow:0 0 8px #7c3aed,0 0 16px #7c3aed} 50%{box-shadow:0 0 28px #a855f7,0 0 55px #a855f7} }
        @keyframes neonText { 0%,100%{text-shadow:0 0 6px #fff,0 0 14px #a855f7,0 0 28px #a855f7} 50%{text-shadow:0 0 10px #fff,0 0 35px #6366f1,0 0 60px #6366f1} }
        @keyframes slideUp { from{opacity:0;transform:translateY(30px)} to{opacity:1;transform:translateY(0)} }
        @keyframes popIn { 0%{transform:scale(0.3);opacity:0} 65%{transform:scale(1.15)} 100%{transform:scale(1);opacity:1} }
        @keyframes shake { 0%,100%{transform:translateX(0)} 20%{transform:translateX(-10px)} 40%{transform:translateX(10px)} 60%{transform:translateX(-6px)} 80%{transform:translateX(6px)} }
        @keyframes pulse { 0%,100%{transform:scale(1)} 50%{transform:scale(1.06)} }
        @keyframes hintBounce { 0%,100%{transform:scale(1)} 50%{transform:scale(1.25)} }
        @keyframes spin90 { from{transform:rotate(0deg)} to{transform:rotate(90deg)} }
        .card-btn:hover { transform:scale(1.12) translateY(-4px) !important; }
        .card-btn:active { transform:scale(0.88) !important; }
        .pup-btn:hover { transform:scale(1.08); }
        .lvl-card:hover { transform:scale(1.04) !important; }
        .nb:hover { background:rgba(99,102,241,0.3) !important; }
      `}</style>

      <ParticleLayer particles={particles} />
      {coinPops.map(cp => <CoinPop key={cp.id} data={cp} />)}

      {/* ═══════════════════ MENU ═══════════════════ */}
      {screen === "menu" && (
        <div style={{ position:"relative", zIndex:1, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", minHeight:"100vh", padding:"2rem", textAlign:"center" }}>
          <div style={{ fontSize:"5rem", marginBottom:"1rem", animation:"pulse 1.5s infinite" }}>👀</div>
          <h1 style={{ fontSize:"clamp(2.4rem,6vw,3.8rem)", fontWeight:900, letterSpacing:"0.06em", animation:"neonText 2.5s infinite", marginBottom:"0.3rem" }}>
            FIND THE ODD
          </h1>
          <div style={{ color:"#a855f7", fontSize:"1rem", letterSpacing:"0.3em", marginBottom:"2.5rem" }}>
            ULTIMATE EDITION · 10 LEVELS
          </div>

          {/* Stats */}
          <div style={{ display:"flex", gap:"1rem", marginBottom:"2.5rem", flexWrap:"wrap", justifyContent:"center" }}>
            {([["🏦","COINS",`${totalCoins}🪙`],["🏆","BEST",leaderboard[0]?.score ?? "--"],["🎮","LEVELS","10"]] as [string,string,string|number][]).map(([ic,lb,val]) => (
              <div key={lb} style={{ background:"rgba(99,102,241,0.12)", border:"1px solid rgba(99,102,241,0.4)", borderRadius:14, padding:"0.8rem 1.6rem", minWidth:100 }}>
                <div style={{ fontSize:"1.5rem" }}>{ic}</div>
                <div style={{ color:"#8b8bcd", fontSize:"0.68rem" }}>{lb}</div>
                <div style={{ fontWeight:900, fontSize:"1.1rem", color:"#a855f7" }}>{val}</div>
              </div>
            ))}
          </div>

          <div style={{ display:"flex", flexDirection:"column", gap:"0.8rem", width:"100%", maxWidth:320 }}>
            <button onClick={() => startGame(0)} style={{ background:"linear-gradient(135deg,#7c3aed,#a855f7)", border:"none", color:"#fff", padding:"1rem 2rem", borderRadius:13, fontSize:"1.2rem", fontWeight:900, cursor:"pointer", animation:"glow 2s infinite", letterSpacing:"0.1em" }}>
              ▶ START GAME
            </button>
            <button onClick={() => setScreen("levelselect")} className="nb" style={{ background:"rgba(99,102,241,0.1)", border:"1px solid rgba(99,102,241,0.4)", color:"#a855f7", padding:"0.75rem 2rem", borderRadius:12, fontSize:"1rem", fontWeight:700, cursor:"pointer", transition:"background 0.2s" }}>
              🎯 SELECT LEVEL
            </button>
            <button onClick={() => getLeaderboard().then(b => { setLeaderboard(b); setScreen("leaderboard"); })} className="nb" style={{ background:"rgba(99,102,241,0.1)", border:"1px solid rgba(99,102,241,0.4)", color:"#a855f7", padding:"0.75rem 2rem", borderRadius:12, fontSize:"1rem", fontWeight:700, cursor:"pointer", transition:"background 0.2s" }}>
              🏆 LEADERBOARD
            </button>
          </div>

          <div style={{ marginTop:"2rem", display:"flex", alignItems:"center", gap:"0.75rem" }}>
            <span style={{ color:"#555" }}>🎵 Music</span>
            <div onClick={() => setMusicOn(m => !m)} style={{ width:48, height:24, borderRadius:12, background:musicOn?"#7c3aed":"#333", cursor:"pointer", transition:"background 0.3s", position:"relative" }}>
              <div style={{ position:"absolute", top:2, left:musicOn?26:2, width:20, height:20, borderRadius:"50%", background:"#fff", transition:"left 0.3s" }}/>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════ LEVEL SELECT ═══════════════════ */}
      {screen === "levelselect" && (
        <div style={{ position:"relative", zIndex:1, padding:"2rem", maxWidth:820, margin:"0 auto" }}>
          <button onClick={() => setScreen("menu")} style={{ background:"rgba(99,102,241,0.2)", border:"1px solid rgba(99,102,241,0.4)", color:"#a855f7", padding:"0.5rem 1rem", borderRadius:8, cursor:"pointer", marginBottom:"2rem" }}>← Back</button>
          <h2 style={{ fontSize:"2rem", fontWeight:900, textAlign:"center", marginBottom:"2rem", animation:"neonText 2s infinite" }}>SELECT LEVEL</h2>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(230px,1fr))", gap:"1rem" }}>
            {LEVELS.map((lvl, i) => (
              <div key={lvl.id} className="lvl-card" onClick={() => startGame(i)}
                style={{ background:"rgba(99,102,241,0.1)", border:`1px solid rgba(${i===9?"250,204,21":"99,102,241"},0.4)`, borderRadius:12, padding:"1.25rem", cursor:"pointer", transition:"all 0.2s", position:"relative" }}>
                {i === 9 && <div style={{ position:"absolute", top:8, right:8, background:"#facc15", color:"#000", borderRadius:4, padding:"0.1rem 0.4rem", fontSize:"0.62rem", fontWeight:900 }}>MAX</div>}
                <div style={{ fontSize:"2rem", marginBottom:"0.5rem" }}>{lvl.emoji}</div>
                <div style={{ fontWeight:900, fontSize:"1.1rem", color:i===9?"#facc15":"#a855f7" }}>LV{lvl.id} · {lvl.name}</div>
                <div style={{ color:"#888", fontSize:"0.78rem", marginTop:"0.25rem" }}>{lvl.description}</div>
                <div style={{ color:"#facc15", fontSize:"0.78rem", marginTop:"0.5rem" }}>💰 {lvl.coinsPerHit} coins/hit</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ═══════════════════ PLAYING ═══════════════════ */}
      {screen === "playing" && (
        <div style={{ position:"relative", zIndex:1, display:"flex", flexDirection:"column", alignItems:"center", minHeight:"100vh", padding:"1rem 1rem 2rem", animation:"slideUp 0.3s ease" }}>

          {/* HUD */}
          <div style={{ display:"flex", gap:"0.5rem", width:"100%", maxWidth:640, marginBottom:"0.8rem", flexWrap:"wrap", justifyContent:"center" }}>
            {([["SCORE",score,"#a855f7"],["LIVES","❤️".repeat(lives),"#ef4444"],["COMBO",`x${Math.min(combo,5)}`,combo>2?"#facc15":"#a855f7"],["COINS",coins,"#facc15"]] as [string,string|number,string][]).map(([lb,val,col]) => (
              <div key={lb} style={{ background:"rgba(0,0,0,0.55)", border:"1px solid rgba(99,102,241,0.3)", borderRadius:10, padding:"0.45rem 0.7rem", textAlign:"center", minWidth:68 }}>
                <div style={{ fontSize:"0.58rem", color:"#8b8bcd", letterSpacing:"0.1em" }}>{lb}</div>
                <div style={{ fontWeight:900, fontSize:"0.92rem", color:col }}>{val}</div>
              </div>
            ))}
            <button onClick={() => setMusicOn(m => !m)} style={{ background:"rgba(0,0,0,0.55)", border:"1px solid rgba(99,102,241,0.3)", borderRadius:10, padding:"0.45rem 0.7rem", color:"#a855f7", cursor:"pointer", fontSize:"1.2rem" }}>
              {musicOn ? "🔊" : "🔇"}
            </button>
          </div>

          {/* Level + progress */}
         {currentLevel && (
  <div style={{ display:"flex", alignItems:"center", gap:"0.75rem", marginBottom:"0.6rem" }}>
    <div style={{ fontSize:"1.4rem" }}>{currentLevel.emoji}</div>
    <div>
      <div style={{ fontWeight:900, color:"#a855f7", fontSize:"0.88rem", letterSpacing:"0.15em" }}>
        LV{currentLevel.id} · {currentLevel.name.toUpperCase()}
      </div>
      <div style={{ display:"flex", gap:3, marginTop:3 }}>
        {Array.from({length:5}).map((_,i) => (
          <div
            key={i}
            style={{
              width:26,
              height:4,
              borderRadius:2,
              background:i<roundsThisLevel?"#a855f7":"rgba(99,102,241,0.2)",
              transition:"background 0.3s"
            }}
          />
        ))}
      </div>
    </div>
  </div>
)}

          {/* Timer bar */}
          {currentLevel && currentLevel.showTimer && (
  <div
    style={{
      width:"100%",
      maxWidth:480,
      height:7,
      background:"rgba(255,255,255,0.08)",
      borderRadius:4,
      marginBottom:"0.6rem",
      overflow:"hidden"
    }}
  >
    <div
      style={{
        height:"100%",
        width:`${timerPct}%`,
        background:`linear-gradient(90deg,${timerColor},${timerColor}bb)`,
        borderRadius:4,
        transition:"width 0.9s linear, background 0.5s",
        boxShadow:`0 0 7px ${timerColor}`
      }}
    />
  </div>
)}
          <div style={{ fontSize:"1.7rem", fontWeight:900, color:timerColor, marginBottom:"0.8rem", textShadow:`0 0 14px ${timerColor}` }}>
            ⏱ {timeLeft}
          </div>

          

          {/* Instruction */}
          <div style={{
            padding:"0.5rem 1.4rem", marginBottom:"1rem",
            background: flashCard==="correct"?"rgba(34,197,94,0.18)":flashCard==="wrong"?"rgba(239,68,68,0.18)":"rgba(99,102,241,0.1)",
            border:`1px solid ${flashCard==="correct"?"rgba(34,197,94,0.5)":flashCard==="wrong"?"rgba(239,68,68,0.5)":"rgba(99,102,241,0.3)"}`,
            borderRadius:10, fontSize:"0.9rem", fontWeight:700, letterSpacing:"0.1em",
            transition:"all 0.2s", color:flashCard==="correct"?"#22c55e":flashCard==="wrong"?"#ef4444":"#8b8bcd",
            animation: flashCard==="wrong"?"shake 0.4s":"none",
          }}>
            {flashCard==="correct"?"✅ CORRECT!":flashCard==="wrong"?"❌ WRONG!":"👀 TAP THE ODD ONE OUT"}
          </div>

          {/* Grid */}
          <div style={{
            display:"grid",
            gridTemplateColumns:`repeat(${cols}, 1fr)`,
            gap:"0.55rem", maxWidth:520, width:"100%",
            opacity: !flickerVisible ? 0 : 1,
            transition: "opacity 0.1s",
          }}>
            {question.map((item, i) => {
              const isHint = hintIdx === i;
              const isWrong = wrongIdx === i;
              return (
                <button
                  key={`${item}-${i}`}
                  className="card-btn"
                  onClick={e => handleClick(item, i, e)}
                  style={{
                    background: isHint ? "rgba(250,204,21,0.25)" : isWrong ? "rgba(239,68,68,0.22)" : "rgba(255,255,255,0.05)",
                    border: `2px solid ${isHint?"#facc15":isWrong?"#ef4444":"rgba(255,255,255,0.12)"}`,
                    borderRadius:14, padding:"0.8rem", cursor:"pointer",
                    fontSize: question.length > 10 ? "1.6rem" : "2.2rem",
                    display:"flex", alignItems:"center", justifyContent:"center",
                    transform: `rotate(${rotations[i] ?? 0}deg)`,
                    transition:"transform 0.6s ease, background 0.2s, border 0.2s, scale 0.15s",
                    boxShadow: isHint ? "0 0 14px rgba(250,204,21,0.5)" : isWrong ? "0 0 14px rgba(239,68,68,0.5)" : "none",
                    animation: isHint ? "hintBounce 0.6s ease infinite" : "none",
                    userSelect:"none",
                    backdropFilter:"blur(4px)",
                    minHeight: question.length > 10 ? 55 : 70,
                  }}
                >
                  {item}
                </button>
              );
            })}
          </div>

          {/* Powerups */}
          <div style={{ display:"flex", gap:"0.5rem", marginTop:"1.2rem", flexWrap:"wrap", justifyContent:"center" }}>
            {POWERUPS.map(pu => {
              const can = coins >= pu.cost;
              return (
                <button key={pu.id} className="pup-btn" onClick={() => usePowerup(pu.id)} style={{
                  background: can ? "rgba(99,102,241,0.18)" : "rgba(0,0,0,0.3)",
                  border:`1px solid ${can?"rgba(99,102,241,0.5)":"rgba(255,255,255,0.08)"}`,
                  color: can ? "#a855f7" : "#555",
                  padding:"0.4rem 0.6rem", borderRadius:8, cursor:can?"pointer":"not-allowed",
                  fontSize:"0.74rem", transition:"all 0.2s", lineHeight:1.6,
                }}>
                  {pu.emoji} {pu.label}<br/>
                  <span style={{ fontSize:"0.63rem", color:can?"#facc15":"#444" }}>🪙{pu.cost}</span>
                </button>
              );
            })}
          </div>

          <button onClick={() => { if(timerRef.current)clearInterval(timerRef.current); audioRef.current?.stopMusic(); setScreen("menu"); }}
            style={{ marginTop:"0.9rem", background:"transparent", border:"none", color:"#444", cursor:"pointer", fontSize:"0.78rem" }}>
            ✕ Quit
          </button>
        </div>
      )}

      {/* ═══════════════════ GAME OVER ═══════════════════ */}
      {screen === "gameover" && (
        <div style={{ position:"relative", zIndex:1, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", minHeight:"100vh", padding:"2rem", textAlign:"center", animation:"slideUp 0.5s ease" }}>
          <div style={{ fontSize:"4rem", marginBottom:"1rem", animation:"popIn 0.5s ease" }}>
            {score >= 100 ? "🏆" : score >= 50 ? "🥈" : "💀"}
          </div>
          <h2 style={{ fontSize:"3rem", fontWeight:900, marginBottom:"0.5rem", animation:"neonText 2s infinite" }}>GAME OVER</h2>
          <div style={{ color:"#a855f7", fontSize:"1rem", letterSpacing:"0.2em", marginBottom:"2rem" }}>
           {currentLevel && (
  <>
    REACHED LV{currentLevel.id} · {currentLevel.name.toUpperCase()}
  </>
)}
          </div>

         <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"1rem", marginBottom:"2rem", width:"100%", maxWidth:360 }}>
  {(
    [
      ["⭐ SCORE", score],
      ["🪙 COINS", coins],
      ["🔥 TOP COMBO", `x${Math.min(combo,5)}`],
      ["🏅 LEVEL", `${levelId}/10`]
    ] as [string,string|number][]
  ).map(([lb,val]) => (
    <div
      key={lb}
      style={{
        background:"rgba(99,102,241,0.1)",
        border:"1px solid rgba(99,102,241,0.3)",
        borderRadius:12,
        padding:"1rem"
      }}
    >
      <div style={{ color:"#8b8bcd", fontSize:"0.68rem", letterSpacing:"0.1em" }}>{lb}</div>
      <div style={{ fontWeight:900, fontSize:"1.5rem", color:"#a855f7" }}>{val}</div>
    </div>
  ))}
</div>

          {!scoresSaved ? (
            <div style={{ marginBottom:"1.5rem", width:"100%", maxWidth:360 }}>
              <div style={{ display:"flex", gap:"0.5rem", marginBottom:"0.75rem" }}>
                <input value={playerName} onChange={e => setPlayerName(e.target.value)} placeholder="Your Name" maxLength={16}
                  style={{ flex:1, background:"rgba(99,102,241,0.1)", border:"1px solid rgba(99,102,241,0.4)", color:"#fff", borderRadius:8, padding:"0.6rem", fontSize:"1rem", outline:"none" }}/>
                <button onClick={handleSaveScore} disabled={savingScore}
                  style={{ background:"linear-gradient(135deg,#7c3aed,#a855f7)", border:"none", color:"#fff", padding:"0.6rem 1rem", borderRadius:8, cursor:"pointer", fontWeight:700, fontSize:"0.9rem", whiteSpace:"nowrap" }}>
                  {savingScore ? "💾..." : "💾 SAVE"}
                </button>
              </div>
              <div style={{ color:"#555", fontSize:"0.7rem" }}>🌐 Saves to shared leaderboard</div>
            </div>
          ) : (
            <div style={{ marginBottom:"1.5rem", padding:"0.75rem 1.5rem", background:"rgba(34,197,94,0.15)", border:"1px solid rgba(34,197,94,0.4)", borderRadius:10, color:"#22c55e", fontWeight:700 }}>
              ✅ Score saved! Total coins: {totalCoins}🪙
            </div>
          )}

          <div style={{ display:"flex", gap:"0.75rem", flexWrap:"wrap", justifyContent:"center" }}>
            <button onClick={() => startGame(0)} style={{ background:"linear-gradient(135deg,#7c3aed,#a855f7)", border:"none", color:"#fff", padding:"0.9rem 1.8rem", borderRadius:12, fontSize:"1rem", fontWeight:900, cursor:"pointer" }}>
              ▶ PLAY AGAIN
            </button>
            <button onClick={() => getLeaderboard().then(b => { setLeaderboard(b); setScreen("leaderboard"); })} style={{ background:"rgba(99,102,241,0.15)", border:"1px solid rgba(99,102,241,0.4)", color:"#a855f7", padding:"0.9rem 1.8rem", borderRadius:12, fontSize:"1rem", fontWeight:700, cursor:"pointer" }}>
              🏆 SCORES
            </button>
            <button onClick={() => setScreen("menu")} style={{ background:"rgba(0,0,0,0.3)", border:"1px solid rgba(255,255,255,0.1)", color:"#666", padding:"0.9rem 1.8rem", borderRadius:12, fontSize:"1rem", cursor:"pointer" }}>
              🏠 MENU
            </button>
          </div>
        </div>
      )}

      {/* ═══════════════════ LEADERBOARD ═══════════════════ */}
      {screen === "leaderboard" && (
        <div style={{ position:"relative", zIndex:1, padding:"2rem", maxWidth:600, margin:"0 auto", animation:"slideUp 0.3s ease" }}>
          <button onClick={() => setScreen("menu")} style={{ background:"rgba(99,102,241,0.2)", border:"1px solid rgba(99,102,241,0.4)", color:"#a855f7", padding:"0.5rem 1rem", borderRadius:8, cursor:"pointer", marginBottom:"2rem" }}>← Back</button>
          <h2 style={{ fontSize:"2.5rem", fontWeight:900, textAlign:"center", marginBottom:"0.5rem", animation:"neonText 2s infinite" }}>🏆 LEADERBOARD</h2>
          <p style={{ textAlign:"center", color:"#555", fontSize:"0.78rem", marginBottom:"2rem" }}>🌐 Shared · All players</p>

          {leaderboard.length === 0 ? (
            <div style={{ textAlign:"center", color:"#555", padding:"3rem" }}>No scores yet. Be the first! 👀</div>
          ) : (
            <div style={{ display:"flex", flexDirection:"column", gap:"0.6rem" }}>
              {leaderboard.map((entry, i) => (
                <div key={i} style={{
                  display:"flex", alignItems:"center", gap:"1rem",
                  background:i===0?"rgba(250,204,21,0.1)":i===1?"rgba(200,200,200,0.08)":i===2?"rgba(180,120,60,0.08)":"rgba(99,102,241,0.05)",
                  border:`1px solid ${i===0?"rgba(250,204,21,0.35)":i===1?"rgba(200,200,200,0.2)":i===2?"rgba(180,120,60,0.25)":"rgba(99,102,241,0.15)"}`,
                  borderRadius:12, padding:"0.9rem 1.2rem",
                }}>
                  <div style={{ fontSize:"1.5rem", minWidth:32, textAlign:"center" }}>
                    {i===0?"🥇":i===1?"🥈":i===2?"🥉":`#${i+1}`}
                  </div>
                  <div style={{ flex:1 }}>
                    <div style={{ fontWeight:900, fontSize:"1rem", color:i===0?"#facc15":"#fff" }}>{entry.name}</div>
                    <div style={{ color:"#555", fontSize:"0.68rem" }}>LV: {entry.level} · {entry.date}</div>
                  </div>
                  <div style={{ textAlign:"right" }}>
                    <div style={{ fontWeight:900, fontSize:"1.2rem", color:"#a855f7" }}>{entry.score}</div>
                    <div style={{ color:"#facc15", fontSize:"0.72rem" }}>🪙{entry.coins}</div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div style={{ textAlign:"center", marginTop:"2rem" }}>
            <button onClick={() => startGame(0)} style={{ background:"linear-gradient(135deg,#7c3aed,#a855f7)", border:"none", color:"#fff", padding:"0.9rem 2rem", borderRadius:12, fontSize:"1rem", fontWeight:900, cursor:"pointer" }}>
              ▶ PLAY NOW
            </button>
          </div>
        </div>
      )}
    </div>
  );
}