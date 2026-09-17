import { useEffect, useRef, useState, useCallback } from "react";

/* ═══════════════════════════════════════════════════════════════
   TYPES & CONSTANTS
═══════════════════════════════════════════════════════════════ */
type Point = { x: number; y: number };
type Direction = "UP" | "DOWN" | "LEFT" | "RIGHT";
type GameState = "IDLE" | "PLAYING" | "PAUSED" | "DEAD" | "LEVEL_UP";
type FoodType = "NORMAL" | "BONUS" | "POISON" | "SPEED" | "SLOW" | "GHOST";
type PowerupType = "SHIELD" | "MAGNET" | "DOUBLE" | "FREEZE";
type Theme = "NEON" | "RETRO" | "FOREST" | "LAVA";

interface Food {
  pos: Point;
  type: FoodType;
  value: number;
  emoji: string;
  expiresAt?: number;
  pulsePhase: number;
}

interface Powerup {
  pos: Point;
  type: PowerupType;
  emoji: string;
  spawnedAt: number;
}

interface Particle {
  x: number; y: number;
  vx: number; vy: number;
  life: number; maxLife: number;
  color: string; size: number;
  text?: string;
}

interface ActiveEffect {
  type: PowerupType;
  endsAt: number;
}

interface SnakeSegment extends Point {
  isGhost?: boolean;
}

const GRID = 24;
const CELL = 20;
const CANVAS = GRID * CELL;

const FOOD_CONFIG: Record<FoodType, { emoji: string; value: number; color: string; ttl?: number }> = {
  NORMAL: { emoji: "🍎", value: 10,  color: "#ef4444" },
  BONUS:  { emoji: "💎", value: 50,  color: "#a855f7", ttl: 8000 },
  POISON: { emoji: "💀", value: -20, color: "#6b7280", ttl: 10000 },
  SPEED:  { emoji: "⚡", value: 15,  color: "#eab308", ttl: 7000 },
  SLOW:   { emoji: "🧊", value: 15,  color: "#3b82f6", ttl: 7000 },
  GHOST:  { emoji: "👻", value: 20,  color: "#e879f9", ttl: 6000 },
};

const POWERUP_CONFIG: Record<PowerupType, { emoji: string; color: string; duration: number; label: string }> = {
  SHIELD: { emoji: "🛡️", color: "#22d3ee", duration: 6000,  label: "SHIELD" },
  MAGNET: { emoji: "🧲", color: "#f97316", duration: 5000,  label: "MAGNET" },
  DOUBLE: { emoji: "✨", color: "#fbbf24", duration: 8000,  label: "2X SCORE" },
  FREEZE: { emoji: "❄️", color: "#93c5fd", duration: 4000,  label: "FREEZE" },
};

const THEMES: Record<Theme, { bg: string; grid: string; snakeHead: string; snakeBody: string; snakeTail: string; glow: string; label: string }> = {
  NEON:   { bg: "#050a0e",   grid: "rgba(0,255,200,0.04)",  snakeHead: "#00ffcc", snakeBody: "#00c896",  snakeTail: "#007a5e",  glow: "rgba(0,255,200,0.6)",   label: "⚡ Neon" },
  RETRO:  { bg: "#0f0a00",   grid: "rgba(255,200,0,0.05)",  snakeHead: "#ffd700", snakeBody: "#cc9900",  snakeTail: "#7a5c00",  glow: "rgba(255,200,0,0.6)",   label: "👾 Retro" },
  FOREST: { bg: "#030d03",   grid: "rgba(0,255,50,0.04)",   snakeHead: "#4ade80", snakeBody: "#16a34a",  snakeTail: "#14532d",  glow: "rgba(74,222,128,0.6)",  label: "🌿 Forest" },
  LAVA:   { bg: "#0d0302",   grid: "rgba(255,80,0,0.05)",   snakeHead: "#ff6b35", snakeBody: "#cc3300",  snakeTail: "#7a1500",  glow: "rgba(255,100,0,0.6)",   label: "🔥 Lava" },
};

const LEVEL_THRESHOLDS = [0, 80, 200, 400, 700, 1100, 1600, 2200, 3000, 4000];
const BASE_SPEED = 140;

/* ═══════════════════════════════════════════════════════════════
   AUDIO ENGINE
═══════════════════════════════════════════════════════════════ */
function useAudio() {
  const ctxRef = useRef<AudioContext | null>(null);

  const getCtx = () => {
    if (!ctxRef.current) {
      ctxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return ctxRef.current;
  };

  const playTone = useCallback((freq: number, duration: number, type: OscillatorType = "square", vol = 0.15) => {
    try {
      const ctx = getCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(vol, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + duration);
    } catch (_) {}
  }, []);

  const sounds = {
    eat:      () => { playTone(523, 0.08, "square", 0.12); setTimeout(() => playTone(659, 0.08, "square", 0.1), 60); },
    bonus:    () => { [523,659,784,1047].forEach((f,i) => setTimeout(() => playTone(f, 0.1, "sine", 0.15), i*50)); },
    poison:   () => { playTone(150, 0.3, "sawtooth", 0.2); },
    powerup:  () => { [392,494,587,740].forEach((f,i) => setTimeout(() => playTone(f, 0.12, "sine", 0.15), i*60)); },
    die:      () => { [300,250,200,150].forEach((f,i) => setTimeout(() => playTone(f, 0.2, "sawtooth", 0.2), i*100)); },
    levelup:  () => { [523,659,784,1047,1319].forEach((f,i) => setTimeout(() => playTone(f, 0.15, "sine", 0.18), i*80)); },
    move:     () => { playTone(200, 0.02, "square", 0.02); },
  };

  return sounds;
}

/* ═══════════════════════════════════════════════════════════════
   HELPER: random position not on snake/foods
═══════════════════════════════════════════════════════════════ */
function randomPos(occupied: Point[]): Point {
  let pos: Point;
  do {
    pos = { x: Math.floor(Math.random() * GRID), y: Math.floor(Math.random() * GRID) };
  } while (occupied.some(p => p.x === pos.x && p.y === pos.y));
  return pos;
}

function dirToVector(d: Direction): Point {
  return { UP: {x:0,y:-1}, DOWN: {x:0,y:1}, LEFT: {x:-1,y:0}, RIGHT: {x:1,y:0} }[d];
}

function oppositeDir(d: Direction): Direction {
  return { UP:"DOWN", DOWN:"UP", LEFT:"RIGHT", RIGHT:"LEFT" }[d] as Direction;
}

/* ═══════════════════════════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════════════════════════ */
export default function SnakeGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef    = useRef<number>(0);
  const lastRef   = useRef<number>(0);

  // Game state refs (mutable, used in game loop)
  const snakeRef     = useRef<SnakeSegment[]>([{x:12,y:12}]);
  const dirRef       = useRef<Direction>("RIGHT");
  const nextDirRef   = useRef<Direction>("RIGHT");
  const foodsRef     = useRef<Food[]>([]);
  const powerupsRef  = useRef<Powerup[]>([]);
  const particlesRef = useRef<Particle[]>([]);
  const effectsRef   = useRef<ActiveEffect[]>([]);
  const scoreRef     = useRef(0);
  const levelRef     = useRef(1);
  const stateRef     = useRef<GameState>("IDLE");
  const frameRef     = useRef(0);
  const comboRef     = useRef(0);
  const lastEatRef   = useRef(0);
  const wallsRef     = useRef<Point[]>([]);
  const obstaclesRef = useRef<Point[]>([]);
  const ghostRef     = useRef(false);
  const magnetRef    = useRef(false);
  const shieldRef    = useRef(false);

  // React state (for UI only)
  const [uiScore, setUiScore]       = useState(0);
  const [uiBest, setUiBest]         = useState(0);
  const [uiLevel, setUiLevel]       = useState(1);
  const [uiState, setUiState]       = useState<GameState>("IDLE");
  const [uiEffects, setUiEffects]   = useState<ActiveEffect[]>([]);
  const [uiCombo, setUiCombo]       = useState(0);
  const [theme, setTheme]           = useState<Theme>("NEON");
  const [muted, setMuted]           = useState(false);
  const themeRef = useRef<Theme>("NEON");
  const mutedRef = useRef(false);

  const sounds = useAudio();
  const play = useCallback((fn: () => void) => { if (!mutedRef.current) fn(); }, []);

  // Sync refs
  useEffect(() => { themeRef.current = theme; }, [theme]);
  useEffect(() => { mutedRef.current = muted; }, [muted]);

  // Load best
  useEffect(() => {
    try { setUiBest(parseInt(localStorage.getItem("snake_best_v2") || "0")); } catch(_){}
  }, []);

  /* ── Spawn foods ── */
const spawnFood = useCallback((count = 1) => {
  const occupied: Point[] = [
    ...snakeRef.current,
    ...foodsRef.current.map(f => f.pos),
    ...powerupsRef.current.map(p => p.pos),
    ...obstaclesRef.current,
    ...wallsRef.current,
  ];

  for (let i = 0; i < count; i++) {
    const roll = Math.random();
    let type: FoodType = "NORMAL";
    const l = levelRef.current;

    if (roll < 0.05 && l >= 2)      type = "POISON";
    else if (roll < 0.12 && l >= 2) type = "BONUS";
    else if (roll < 0.20 && l >= 3) type = "SPEED";
    else if (roll < 0.27 && l >= 4) type = "SLOW";
    else if (roll < 0.33 && l >= 5) type = "GHOST";

    const cfg = FOOD_CONFIG[type];

    // 🔥 Create object first (important fix)
    const newFood: Food = {
      pos: randomPos(occupied),
      type,
      value: cfg.value,
      emoji: cfg.emoji,
      expiresAt: cfg.ttl ? Date.now() + cfg.ttl : undefined,
      pulsePhase: Math.random() * Math.PI * 2,
    };

    // Push safely
    foodsRef.current.push(newFood);

    // Add position to occupied safely
    occupied.push(newFood.pos);
  }
}, []);

 const spawnPowerup = useCallback(() => {
  const types: PowerupType[] = ["SHIELD","MAGNET","DOUBLE","FREEZE"];
  const type = types[Math.floor(Math.random()*types.length)]!;

  const occupied = [
    ...snakeRef.current,
    ...foodsRef.current.map(f=>f.pos),
    ...powerupsRef.current.map(p=>p.pos),
    ...obstaclesRef.current
  ];

  const newPowerup: Powerup = {
    pos: randomPos(occupied),
    type,
    emoji: POWERUP_CONFIG[type].emoji,
    spawnedAt: Date.now(),
  };

  powerupsRef.current.push(newPowerup);
}, []);

  /* ── Build level obstacles / walls ── */
  const buildLevel = useCallback((level: number) => {
    obstaclesRef.current = [];
    wallsRef.current = [];
    if (level < 2) return;
    // Add cross obstacle at level 2
    if (level >= 2) {
      for (let i = 8; i <= 16; i++) obstaclesRef.current.push({x:i,y:12});
    }
    // Add extra obstacles later
    if (level >= 4) {
      for (let i = 4; i <= 8;  i++) obstaclesRef.current.push({x:4,y:i});
      for (let i = 4; i <= 8;  i++) obstaclesRef.current.push({x:19,y:i});
    }
    if (level >= 6) {
      for (let i = 15; i <= 20; i++) obstaclesRef.current.push({x:i,y:18});
    }
    if (level >= 8) {
      for (let i = 3; i <= 7; i++) obstaclesRef.current.push({x:i,y:17});
    }
    // Remove positions too close to snake start
    obstaclesRef.current = obstaclesRef.current.filter(o => Math.abs(o.x-12)>3 || Math.abs(o.y-12)>3);
  }, []);

  /* ── Reset / Start ── */
  const startGame = useCallback((lvl = 1) => {
    snakeRef.current     = [{x:12,y:12},{x:11,y:12},{x:10,y:12}];
    dirRef.current       = "RIGHT";
    nextDirRef.current   = "RIGHT";
    foodsRef.current     = [];
    powerupsRef.current  = [];
    particlesRef.current = [];
    effectsRef.current   = [];
    scoreRef.current     = 0;
    levelRef.current     = lvl;
    comboRef.current     = 0;
    ghostRef.current     = false;
    magnetRef.current    = false;
    shieldRef.current    = false;
    stateRef.current     = "PLAYING";

    buildLevel(lvl);
    spawnFood(2);

    setUiScore(0);
    setUiLevel(lvl);
    setUiState("PLAYING");
    setUiEffects([]);
    setUiCombo(0);
  }, [buildLevel, spawnFood]);

  /* ── Particles ── */
  const burst = useCallback((x: number, y: number, color: string, count = 10, text?: string) => {
    const px = x * CELL + CELL/2;
    const py = y * CELL + CELL/2;
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const speed = 1.5 + Math.random() * 2.5;
      particlesRef.current.push({
        x: px, y: py,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 1, maxLife: 1,
        color,
        size: 2 + Math.random() * 3,
        text: i === 0 ? text : undefined,
      });
    }
  }, []);

  /* ── Collision ── */
  const isBlocked = useCallback((p: Point) => {
    if (p.x < 0 || p.y < 0 || p.x >= GRID || p.y >= GRID) return "wall";
    if (obstaclesRef.current.some(o => o.x===p.x && o.y===p.y)) return "obstacle";
    if (!ghostRef.current && snakeRef.current.slice(1).some(s => s.x===p.x && s.y===p.y)) return "self";
    return null;
  }, []);

  /* ── Magnet: pull nearby food ── */
  const applyMagnet = useCallback(() => {
  if (!magnetRef.current) return;

  const head = snakeRef.current[0];
  if (!head) return; // 🔥 TS safe guard

  foodsRef.current = foodsRef.current.map(f => {
    const dx = head.x - f.pos.x;
    const dy = head.y - f.pos.y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist <= 3 && dist > 1) {
      return {
        ...f,
        pos: {
          x: f.pos.x + Math.sign(dx),
          y: f.pos.y + Math.sign(dy),
        },
      };
    }

    return f;
  });
}, []);

  /* ── Main game tick ── */
  const tick = useCallback((now: number) => {
    if (stateRef.current !== "PLAYING") return;

    const level = levelRef.current;
    const speedReduction = effectsRef.current.some(e=>e.type==="FREEZE") ? 60 : 0;
    const speedBoost     = effectsRef.current.some(e=>e.type==="SHIELD") ? 0 : 0;
    const speed = Math.max(60, BASE_SPEED - (level-1)*10 - speedBoost + speedReduction);

    if (now - lastRef.current < speed) return;
    lastRef.current = now;
    frameRef.current++;

   const dir = nextDirRef.current;
dirRef.current = dir;

const vec = dirToVector(dir);

const head = snakeRef.current[0];
if (!head) return; // 🔥 TS safe guard

const next: Point = {
  x: head.x + vec.x,
  y: head.y + vec.y
};
    // Expire effects
    const activeEffects = effectsRef.current.filter(e => e.endsAt > now);
    effectsRef.current = activeEffects;
    ghostRef.current  = activeEffects.some(e=>e.type==="SHIELD");
    magnetRef.current = activeEffects.some(e=>e.type==="MAGNET");

    // Expire timed food
    foodsRef.current = foodsRef.current.filter(f => !f.expiresAt || f.expiresAt > now);

    // Ensure minimum food
    if (foodsRef.current.length < 1) spawnFood(1);
    if (Math.random() < 0.003 * level) spawnFood(1);
    if (Math.random() < 0.005) spawnPowerup();

    applyMagnet();

    // Collision check
    const blocked = isBlocked(next);
    if (blocked) {
      if (shieldRef.current) {
        // Shield absorbs one hit
        shieldRef.current = false;
        effectsRef.current = effectsRef.current.filter(e=>e.type!=="SHIELD");
        burst(next.x, next.y, "#22d3ee", 12, "BLOCKED!");
        setUiEffects([...effectsRef.current]);
        return;
      }
      // Die
      play(sounds.die);
      stateRef.current = "DEAD";
      setUiState("DEAD");
      const s = scoreRef.current;
      try {
        const b = parseInt(localStorage.getItem("snake_best_v2")||"0");
        if (s > b) { localStorage.setItem("snake_best_v2", s.toString()); setUiBest(s); }
      } catch(_){}
      burst(head.x, head.y, "#ef4444", 20);
      return;
    }

    // Move snake
    const newSnake: SnakeSegment[] = [{ x: next.x, y: next.y, isGhost: ghostRef.current }, ...snakeRef.current];

    // Check food
    let ate = false;
    for (let i = 0; i < foodsRef.current.length; i++) {
      const f = foodsRef.current[i];
       if (!f) continue; // 🔥 TS safety guard
      if (f.pos.x === next.x && f.pos.y === next.y) {
        // Combo
        const timeDiff = now - lastEatRef.current;
        if (timeDiff < 2000) comboRef.current = Math.min(comboRef.current+1, 8);
        else comboRef.current = 1;
        lastEatRef.current = now;

        const mult = effectsRef.current.some(e=>e.type==="DOUBLE") ? 2 : 1;
        const rawScore = f.value > 0 ? f.value * mult * comboRef.current : f.value;
        scoreRef.current = Math.max(0, scoreRef.current + rawScore);
        setUiScore(scoreRef.current);
        setUiCombo(comboRef.current);

        const cfg = FOOD_CONFIG[f.type];
        burst(f.pos.x, f.pos.y, cfg.color, 12, rawScore > 0 ? `+${rawScore}` : `${rawScore}`);

        if (f.type === "POISON") {
          play(sounds.poison);
          // Shrink snake
          if (newSnake.length > 3) newSnake.splice(newSnake.length-2, 2);
        } else if (f.type === "BONUS") {
          play(sounds.bonus);
        } else if (f.type === "SPEED") {
          play(sounds.eat);
          // temp speed boost handled by effect
          effectsRef.current.push({ type: "FREEZE", endsAt: now + 3000 }); // "freeze" slows, reuse as speed buff visual
        } else if (f.type === "SLOW") {
          play(sounds.eat);
          effectsRef.current.push({ type: "FREEZE", endsAt: now + 4000 });
        } else if (f.type === "GHOST") {
          play(sounds.powerup);
          effectsRef.current.push({ type: "SHIELD", endsAt: now + 4000 });
          ghostRef.current = true;
        } else {
          play(sounds.eat);
        }





        
        // Level up check
        const threshold = LEVEL_THRESHOLDS[levelRef.current] || (levelRef.current * 500);
        if (scoreRef.current >= threshold && levelRef.current < 10) {
          const newLevel = levelRef.current + 1;
          levelRef.current = newLevel;
          setUiLevel(newLevel);
          play(sounds.levelup);
          buildLevel(newLevel);
          stateRef.current = "LEVEL_UP";
          setUiState("LEVEL_UP");
          setTimeout(() => {
            stateRef.current = "PLAYING";
            setUiState("PLAYING");
            spawnFood(2);
          }, 1800);
        }

        foodsRef.current.splice(i, 1);
        ate = true;
        break;
      }
    }

    // Check powerup
    for (let i = 0; i < powerupsRef.current.length; i++) {
      const p = powerupsRef.current[i];
      if (!p) continue;
      if (p.pos.x === next.x && p.pos.y === next.y) {
        play(sounds.powerup);
        const cfg = POWERUP_CONFIG[p.type];
        effectsRef.current.push({ type: p.type, endsAt: now + cfg.duration });
        if (p.type === "SHIELD") { shieldRef.current = true; ghostRef.current = true; }
        if (p.type === "MAGNET") magnetRef.current = true;
        burst(p.pos.x, p.pos.y, cfg.color, 16, cfg.label);
        powerupsRef.current.splice(i, 1);
        setUiEffects([...effectsRef.current]);
        ate = true;
        break;
      }
    }

    if (!ate) newSnake.pop();
    snakeRef.current = newSnake;
    setUiEffects([...effectsRef.current]);
  }, [spawnFood, spawnPowerup, applyMagnet, isBlocked, burst, buildLevel, play, sounds]);

  /* ── Canvas draw ── */
  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    const t = THEMES[themeRef.current];
    const now = Date.now();

    // BG
    ctx.fillStyle = t.bg;
    ctx.fillRect(0, 0, CANVAS, CANVAS);

    // Grid
    ctx.strokeStyle = t.grid;
    ctx.lineWidth = 0.5;
    for (let i = 0; i <= GRID; i++) {
      ctx.beginPath(); ctx.moveTo(i*CELL, 0); ctx.lineTo(i*CELL, CANVAS); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(0, i*CELL); ctx.lineTo(CANVAS, i*CELL); ctx.stroke();
    }

    // Obstacles
    obstaclesRef.current.forEach(o => {
      ctx.fillStyle = "rgba(100,100,100,0.6)";
      ctx.fillRect(o.x*CELL+1, o.y*CELL+1, CELL-2, CELL-2);
      ctx.fillStyle = "rgba(150,150,150,0.3)";
      ctx.fillRect(o.x*CELL+3, o.y*CELL+3, CELL-6, CELL-6);
    });

    // Foods
    foodsRef.current.forEach(f => {
      const pulse = Math.sin(now * 0.004 + f.pulsePhase) * 0.15 + 0.85;
      const cx = f.pos.x * CELL + CELL/2;
      const cy = f.pos.y * CELL + CELL/2;
      const cfg = FOOD_CONFIG[f.type];

      // Glow
      const grd = ctx.createRadialGradient(cx, cy, 0, cx, cy, CELL*0.9*pulse);
      grd.addColorStop(0, cfg.color + "55");
      grd.addColorStop(1, "transparent");
      ctx.fillStyle = grd;
      ctx.beginPath(); ctx.arc(cx, cy, CELL*0.9*pulse, 0, Math.PI*2); ctx.fill();

      // TTL bar
      if (f.expiresAt) {
        const pct = Math.max(0, (f.expiresAt - now) / (FOOD_CONFIG[f.type].ttl||8000));
        ctx.fillStyle = "rgba(255,255,255,0.15)";
        ctx.fillRect(f.pos.x*CELL, f.pos.y*CELL + CELL - 3, CELL, 3);
        ctx.fillStyle = cfg.color;
        ctx.fillRect(f.pos.x*CELL, f.pos.y*CELL + CELL - 3, CELL * pct, 3);
      }

      ctx.font = `${CELL*0.72}px serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(f.emoji, cx, cy);
    });

    // Powerups
    powerupsRef.current.forEach(p => {
      const age = now - p.spawnedAt;
      const fade = Math.min(1, age / 300);
      const bob = Math.sin(now * 0.003) * 2;
      const cx = p.pos.x * CELL + CELL/2;
      const cy = p.pos.y * CELL + CELL/2 + bob;
      const cfg = POWERUP_CONFIG[p.type];

      // Ring
      ctx.globalAlpha = fade * 0.6;
      ctx.strokeStyle = cfg.color;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(cx, cy, CELL*0.55, 0, Math.PI*2);
      ctx.stroke();
      ctx.globalAlpha = 1;

      ctx.font = `${CELL*0.72}px serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.globalAlpha = fade;
      ctx.fillText(p.emoji, cx, cy);
      ctx.globalAlpha = 1;
    });

    // Snake
    const snake = snakeRef.current;
    snake.forEach((seg, i) => {
      const isHead = i === 0;
      const cx = seg.x * CELL + CELL/2;
      const cy = seg.y * CELL + CELL/2;
      const isGhostMode = ghostRef.current;

      ctx.globalAlpha = isGhostMode ? 0.55 : 1;

      if (isHead) {
        // Head glow
        const grd = ctx.createRadialGradient(cx, cy, 0, cx, cy, CELL*1.2);
        grd.addColorStop(0, t.glow);
        grd.addColorStop(1, "transparent");
        ctx.fillStyle = grd;
        ctx.beginPath(); ctx.arc(cx, cy, CELL*1.2, 0, Math.PI*2); ctx.fill();

        // Head
        ctx.fillStyle = t.snakeHead;
        ctx.beginPath();
        ctx.roundRect(seg.x*CELL+1, seg.y*CELL+1, CELL-2, CELL-2, 5);
        ctx.fill();

        // Shield ring
        if (shieldRef.current) {
          const pulse2 = Math.sin(now * 0.006) * 2;
          ctx.strokeStyle = "#22d3ee";
          ctx.lineWidth = 2;
          ctx.globalAlpha = 0.8;
          ctx.beginPath();
          ctx.arc(cx, cy, CELL*0.7 + pulse2, 0, Math.PI*2);
          ctx.stroke();
          ctx.globalAlpha = isGhostMode ? 0.55 : 1;
        }

        // Eyes
        const d = dirRef.current;
        const eyeOffset = CELL * 0.22;
        const eyeSize   = CELL * 0.13;
        let eyes: [number,number,number,number][] = [];
        if (d === "RIGHT")  eyes = [[cx+eyeOffset,cy-eyeOffset,0,0],[cx+eyeOffset,cy+eyeOffset,0,0]];
        if (d === "LEFT")   eyes = [[cx-eyeOffset,cy-eyeOffset,0,0],[cx-eyeOffset,cy+eyeOffset,0,0]];
        if (d === "UP")     eyes = [[cx-eyeOffset,cy-eyeOffset,0,0],[cx+eyeOffset,cy-eyeOffset,0,0]];
        if (d === "DOWN")   eyes = [[cx-eyeOffset,cy+eyeOffset,0,0],[cx+eyeOffset,cy+eyeOffset,0,0]];
        ctx.fillStyle = t.bg;
        eyes.forEach(([ex,ey]) => { ctx.beginPath(); ctx.arc(ex, ey, eyeSize, 0, Math.PI*2); ctx.fill(); });
        ctx.fillStyle = "#fff";
        eyes.forEach(([ex,ey]) => { ctx.beginPath(); ctx.arc(ex, ey, eyeSize*0.5, 0, Math.PI*2); ctx.fill(); });
      } else {
        const fade2 = 1 - (i / snake.length) * 0.55;
        ctx.fillStyle = i % 2 === 0 ? t.snakeBody : t.snakeTail;
        ctx.globalAlpha = (isGhostMode ? 0.4 : 1) * fade2;
        ctx.beginPath();
        ctx.roundRect(seg.x*CELL+2, seg.y*CELL+2, CELL-4, CELL-4, 3);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    });

    // Particles
    particlesRef.current = particlesRef.current.filter(p => p.life > 0);
    particlesRef.current.forEach(p => {
      ctx.globalAlpha = p.life;
      if (p.text) {
        ctx.font = `bold 11px monospace`;
        ctx.textAlign = "center";
        ctx.fillStyle = p.color;
        ctx.fillText(p.text, p.x, p.y);
      } else {
        ctx.fillStyle = p.color;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI*2); ctx.fill();
      }
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.06;
      p.life -= 0.025;
    });
    ctx.globalAlpha = 1;

    // Magnet indicator
  // Magnet indicator
if (magnetRef.current) {
  const head = snakeRef.current[0];
  if (!head) return; // 🔥 TS safety

  ctx.strokeStyle = "rgba(249,115,22,0.3)";
  ctx.lineWidth = 1;
  ctx.setLineDash([3,3]);
  ctx.beginPath();

  ctx.arc(
    head.x * CELL + CELL / 2,
    head.y * CELL + CELL / 2,
    3 * CELL,
    0,
    Math.PI * 2
  );

  ctx.stroke();
  ctx.setLineDash([]);
}
  }, []);

  /* ── RAF loop ── */
  useEffect(() => {
    const loop = (now: number) => {
      if (stateRef.current === "PLAYING") tick(now);
      draw();
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, [tick, draw]);

  /* ── Keyboard ── */
  useEffect(() => {
    const map: Record<string, Direction> = {
      ArrowUp:"UP", ArrowDown:"DOWN", ArrowLeft:"LEFT", ArrowRight:"RIGHT",
      w:"UP", s:"DOWN", a:"LEFT", d:"RIGHT",
    };
    const onKey = (e: KeyboardEvent) => {
      const d = map[e.key];
      if (d) {
        e.preventDefault();
        if (stateRef.current === "PLAYING" && d !== oppositeDir(dirRef.current)) {
          nextDirRef.current = d;
        }
      }
      if (e.key === " ") {
        e.preventDefault();
        if (stateRef.current === "PLAYING")  { stateRef.current = "PAUSED";  setUiState("PAUSED"); }
        else if (stateRef.current === "PAUSED") { stateRef.current = "PLAYING"; setUiState("PLAYING"); }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  /* ── Touch swipe ── */
 useEffect(() => {
  let sx = 0, sy = 0;

  const onStart = (e: TouchEvent) => {
    if (e.touches.length === 0) return; // 🔥 guard

    const touch = e.touches[0];
    if (!touch) return;

    sx = touch.clientX;
    sy = touch.clientY;
  };

  const onEnd = (e: TouchEvent) => {
    if (stateRef.current !== "PLAYING") return;
    if (e.changedTouches.length === 0) return; // 🔥 guard

    const touch = e.changedTouches[0];
    if (!touch) return;

    const dx = touch.clientX - sx;
    const dy = touch.clientY - sy;

    if (Math.abs(dx) > Math.abs(dy)) {
      const d: Direction =
        dx > 20 ? "RIGHT" :
        dx < -20 ? "LEFT" :
        dirRef.current;

      if (d !== oppositeDir(dirRef.current))
        nextDirRef.current = d;
    } else {
      const d: Direction =
        dy > 20 ? "DOWN" :
        dy < -20 ? "UP" :
        dirRef.current;

      if (d !== oppositeDir(dirRef.current))
        nextDirRef.current = d;
    }
  };

  window.addEventListener("touchstart", onStart, { passive: true });
  window.addEventListener("touchend", onEnd);

  return () => {
    window.removeEventListener("touchstart", onStart);
    window.removeEventListener("touchend", onEnd);
  };
}, []);

  const handleDir = (d: Direction) => {
    if (stateRef.current !== "PLAYING") return;
    if (d !== oppositeDir(dirRef.current)) nextDirRef.current = d;
  };

  const effectTimeLeft = (e: ActiveEffect) => {
    const pct = Math.max(0, (e.endsAt - Date.now()) / POWERUP_CONFIG[e.type].duration * 100);
    return pct;
  };

  /* ═══════════════════════════════════════════════════════════
     RENDER
  ═══════════════════════════════════════════════════════════ */
  return (
    <div className="min-h-screen flex flex-col items-center justify-start py-4 px-3 font-mono select-none"
         style={{ background: "linear-gradient(135deg, #020810 0%, #050d18 50%, #020810 100%)" }}>

      {/* Header */}
      <div className="w-full max-w-lg flex items-center justify-between mb-3">
        <h1 className="text-2xl font-black tracking-widest"
            style={{ color: THEMES[theme].snakeHead, textShadow: `0 0 20px ${THEMES[theme].glow}` }}>
          🐍 SNAKE
        </h1>
        <div className="flex gap-2">
          {(Object.keys(THEMES) as Theme[]).map(t => (
            <button key={t}
              onClick={() => setTheme(t)}
              className={`text-xs px-2 py-1 rounded-md border transition-all ${theme===t ? "border-white/40 bg-white/10 text-white" : "border-white/10 text-white/30 hover:text-white/60"}`}>
              {THEMES[t].label.split(" ")[0]}
            </button>
          ))}
          <button onClick={() => setMuted(m=>!m)}
            className="text-lg ml-1 opacity-60 hover:opacity-100 transition-opacity">
            {muted ? "🔇" : "🔊"}
          </button>
        </div>
      </div>

      {/* Scoreboard */}
      <div className="w-full max-w-lg grid grid-cols-3 gap-2 mb-3">
        {[
          { label: "SCORE", val: uiScore, color: THEMES[theme].snakeHead },
          { label: `LEVEL`, val: uiLevel, color: "#a78bfa" },
          { label: "BEST",  val: uiBest,  color: "#fb923c" },
        ].map(s => (
          <div key={s.label} className="rounded-xl border border-white/10 bg-white/5 backdrop-blur py-2 text-center">
            <div className="text-xs text-white/30 tracking-widest">{s.label}</div>
            <div className="text-xl font-black" style={{ color: s.color }}>{s.val}</div>
          </div>
        ))}
      </div>

      {/* Active Effects */}
      {uiEffects.length > 0 && (
        <div className="flex gap-2 mb-3 flex-wrap justify-center">
          {uiEffects.map((e, i) => {
            const cfg = POWERUP_CONFIG[e.type];
            const pct = effectTimeLeft(e);
            return (
              <div key={i} className="flex items-center gap-1 rounded-lg border px-2 py-1 text-xs"
                   style={{ borderColor: cfg.color + "60", backgroundColor: cfg.color + "15", color: cfg.color }}>
                <span>{cfg.emoji}</span>
                <span className="font-bold">{cfg.label}</span>
                <div className="w-12 h-1 rounded-full bg-white/10 ml-1">
                  <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, backgroundColor: cfg.color }} />
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Combo indicator */}
      {uiCombo >= 2 && uiState === "PLAYING" && (
        <div className="mb-2 text-sm font-black tracking-widest animate-pulse"
             style={{ color: "#fbbf24", textShadow: "0 0 10px rgba(251,191,36,0.8)" }}>
          🔥 x{uiCombo} COMBO!
        </div>
      )}

      {/* Canvas container */}
      <div className="relative rounded-2xl overflow-hidden"
           style={{ boxShadow: `0 0 60px ${THEMES[theme].glow}33, 0 30px 80px rgba(0,0,0,0.8)` }}>
        <canvas
          ref={canvasRef}
          width={CANVAS}
          height={CANVAS}
          className="block"
          style={{ maxWidth: "100%", display: "block" }}
        />

        {/* IDLE overlay */}
        {uiState === "IDLE" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/75 backdrop-blur-sm rounded-2xl gap-4">
            <div className="text-5xl animate-bounce">🐍</div>
            <h2 className="text-3xl font-black tracking-widest" style={{ color: THEMES[theme].snakeHead }}>SNAKE</h2>
            <p className="text-white/40 text-sm text-center px-8">Arrow keys / WASD · Swipe · Space = Pause</p>
            <button onClick={() => startGame(1)}
              className="mt-2 px-8 py-3 rounded-xl font-black text-lg text-black transition-all hover:scale-105 active:scale-95"
              style={{ background: `linear-gradient(135deg, ${THEMES[theme].snakeHead}, ${THEMES[theme].snakeBody})` }}>
              ▶ START
            </button>
          </div>
        )}

        {/* PAUSED overlay */}
        {uiState === "PAUSED" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70 backdrop-blur-sm rounded-2xl gap-4">
            <div className="text-4xl">⏸</div>
            <h2 className="text-2xl font-black text-white/80">PAUSED</h2>
            <button onClick={() => { stateRef.current = "PLAYING"; setUiState("PLAYING"); }}
              className="px-6 py-2 rounded-xl font-bold text-black"
              style={{ background: THEMES[theme].snakeHead }}>
              ▶ Resume
            </button>
          </div>
        )}

        {/* DEAD overlay */}
        {uiState === "DEAD" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm rounded-2xl gap-3">
            <div className="text-5xl">💀</div>
            <h2 className="text-3xl font-black text-red-400">GAME OVER</h2>
            <p className="text-white/60 text-sm">Score: <span className="text-yellow-400 font-bold">{uiScore}</span></p>
            {uiScore >= uiBest && uiScore > 0 && (
              <p className="text-yellow-300 text-sm font-bold animate-pulse">🏆 NEW BEST!</p>
            )}
            <div className="flex gap-3 mt-2">
              <button onClick={() => startGame(1)}
                className="px-6 py-2 rounded-xl font-bold text-black transition-all hover:scale-105"
                style={{ background: `linear-gradient(135deg, ${THEMES[theme].snakeHead}, ${THEMES[theme].snakeBody})` }}>
                ▶ Restart
              </button>
              <button onClick={() => { stateRef.current = "IDLE"; setUiState("IDLE"); }}
                className="px-6 py-2 rounded-xl font-bold bg-white/10 text-white border border-white/20">
                🏠 Menu
              </button>
            </div>
          </div>
        )}

        {/* LEVEL_UP overlay */}
        {uiState === "LEVEL_UP" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70 backdrop-blur-sm rounded-2xl gap-3 pointer-events-none">
            <div className="text-5xl animate-bounce">🎉</div>
            <h2 className="text-3xl font-black animate-pulse" style={{ color: THEMES[theme].snakeHead }}>
              LEVEL {uiLevel}!
            </h2>
            <p className="text-white/60 text-sm">New obstacles incoming...</p>
          </div>
        )}
      </div>

      {/* D-Pad */}
      <div className="grid grid-cols-3 gap-2 mt-4 max-w-[160px]">
        <div />
        <button onTouchStart={e=>{e.preventDefault();handleDir("UP")}} onMouseDown={()=>handleDir("UP")}
          className="flex items-center justify-center rounded-xl py-3 text-lg font-bold text-white border border-white/10 bg-white/5 active:bg-white/15 transition-all">↑</button>
        <div />
        <button onTouchStart={e=>{e.preventDefault();handleDir("LEFT")}} onMouseDown={()=>handleDir("LEFT")}
          className="flex items-center justify-center rounded-xl py-3 text-lg font-bold text-white border border-white/10 bg-white/5 active:bg-white/15 transition-all">←</button>
        <button onTouchStart={e=>{e.preventDefault();handleDir("DOWN")}} onMouseDown={()=>handleDir("DOWN")}
          className="flex items-center justify-center rounded-xl py-3 text-lg font-bold text-white border border-white/10 bg-white/5 active:bg-white/15 transition-all">↓</button>
        <button onTouchStart={e=>{e.preventDefault();handleDir("RIGHT")}} onMouseDown={()=>handleDir("RIGHT")}
          className="flex items-center justify-center rounded-xl py-3 text-lg font-bold text-white border border-white/10 bg-white/5 active:bg-white/15 transition-all">→</button>
      </div>

      {/* Legend */}
      <div className="w-full max-w-lg mt-4 rounded-xl border border-white/10 bg-white/5 p-3">
        <p className="text-xs text-white/30 tracking-widest mb-2">FOOD GUIDE</p>
        <div className="grid grid-cols-3 gap-1 text-xs text-white/50">
          {(Object.entries(FOOD_CONFIG) as [FoodType, typeof FOOD_CONFIG[FoodType]][]).map(([type, cfg]) => (
            <div key={type} className="flex items-center gap-1">
              <span>{cfg.emoji}</span>
              <span>{type === "POISON" ? "−20pts" : type === "BONUS" ? "+50pts⏳" : type === "NORMAL" ? "+10pts" : cfg.value + "pts⏳"}</span>
            </div>
          ))}
        </div>
        <p className="text-xs text-white/30 tracking-widest mt-2 mb-1">POWERUPS</p>
        <div className="grid grid-cols-2 gap-1 text-xs text-white/50">
          {(Object.entries(POWERUP_CONFIG) as [PowerupType, typeof POWERUP_CONFIG[PowerupType]][]).map(([type, cfg]) => (
            <div key={type} className="flex items-center gap-1">
              <span>{cfg.emoji}</span><span style={{color: cfg.color + "cc"}}>{cfg.label}</span>
            </div>
          ))}
        </div>
      </div>

      <p className="text-white/20 text-xs mt-3 tracking-widest">SPACE = PAUSE · WASD / ARROWS · SWIPE</p>
    </div>
  );
}