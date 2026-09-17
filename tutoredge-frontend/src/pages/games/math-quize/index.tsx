import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import Link from "next/link";
import { motion, AnimatePresence, useAnimationControls } from "framer-motion";

/* ══════════════════════════════════════════════
   TYPES
══════════════════════════════════════════════ */
type Question = { q: string; answer: number; options: number[];   op: string; difficulty: "easy" | "medium" | "hard" };
type FeedbackType = "correct" | "wrong" | "timeout" | null;
type PowerUpType = "freeze" | "fifty" | "double" | null;
type Achievement = { id: string; label: string; emoji: string; unlocked: boolean };

/* ══════════════════════════════════════════════
   CONSTANTS
══════════════════════════════════════════════ */
const MAX_TIME = 15;
const MASCOT_MOODS = {
  idle:    { emoji: "🦉", msg: "Ready to solve? 🎯" },
  correct: { emoji: "🦉", msg: "Brilliant! Keep going! 🌟" },
  wrong:   { emoji: "🦉", msg: "Oops! You got this! 💪" },
  streak:  { emoji: "🦉", msg: "ON FIRE! Incredible! 🔥" },
  timeout: { emoji: "🦉", msg: "Faster next time! ⚡" },
  hint:    { emoji: "🦉", msg: "Here's a little clue! 🔍" },
  gameover:{ emoji: "🦉", msg: "Great effort! Try again! 🏆" },
};

const POWER_UP_INFO = {
  freeze:  { emoji: "❄️", label: "Time Freeze",    desc: "+10s added!",        color: "#06B6D4" },
  fifty:   { emoji: "🎯", label: "50/50",           desc: "2 wrong removed!",   color: "#F59E0B" },
  double:  { emoji: "⚡", label: "Double Points",   desc: "2× score this Q!",   color: "#A855F7" },
};

const INITIAL_ACHIEVEMENTS: Achievement[] = [
  { id: "first_correct", label: "First Answer!",    emoji: "🎯", unlocked: false },
  { id: "streak_3",      label: "Hot Streak x3",    emoji: "🔥", unlocked: false },
  { id: "streak_5",      label: "On Fire! x5",      emoji: "💥", unlocked: false },
  { id: "streak_10",     label: "Unstoppable! x10", emoji: "⚡", unlocked: false },
  { id: "score_50",      label: "50 Points!",       emoji: "⭐", unlocked: false },
  { id: "score_100",     label: "Century!",         emoji: "💯", unlocked: false },
  { id: "score_200",     label: "Legend!",          emoji: "🏆", unlocked: false },
  { id: "level_5",       label: "Level 5 Reached",  emoji: "🚀", unlocked: false },
  { id: "no_hint",       label: "No Hints!",        emoji: "🧠", unlocked: false },
  { id: "speed_demon",   label: "Speed Demon",      emoji: "⚡", unlocked: false },
];

/* ══════════════════════════════════════════════
   HELPERS
══════════════════════════════════════════════ */
function rand(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getDifficulty(level: number): "easy" | "medium" | "hard" {
  if (level <= 2) return "easy";
  if (level <= 5) return "medium";
  return "hard";
}

function makeQuestion(level: number): Question {
  const ops = level < 3 ? ["+", "−"] : level < 6 ? ["+", "−", "×"] : ["+", "−", "×", "÷"];
const op = ops[Math.floor(Math.random() * ops.length)]!;
  let a: number, b: number, answer: number;

  if (op === "+") {
    a = rand(1, 10 * level); b = rand(1, 10 * level); answer = a + b;
  } else if (op === "−") {
    a = rand(10, 10 * level + 10); b = rand(1, a); answer = a - b;
  } else if (op === "×") {
    a = rand(2, 12); b = rand(2, 12); answer = a * b;
  } else {
    b = rand(2, 10); answer = rand(2, 12); a = answer * b;
  }

  const wrongs = new Set<number>();
  while (wrongs.size < 3) {
    const delta = rand(1, Math.max(6, Math.floor(answer * 0.3)));
    const w = Math.random() > 0.5 ? answer + delta : answer - delta;
    if (w !== answer && w > 0) wrongs.add(w);
  }
  const options = Array.from(wrongs).concat(answer).sort(() => Math.random() - 0.5);
  return { q: `${a} ${op} ${b} = ?`, answer, options, op, difficulty: getDifficulty(level) };
}

/* ══════════════════════════════════════════════
   FLOATING SCORE POP
══════════════════════════════════════════════ */
interface ScorePop { id: number; value: number; x: number; y: number }

function ScorePopLayer({ pops }: { pops: ScorePop[] }) {
  return (
    <div className="pointer-events-none fixed inset-0 z-40 overflow-hidden">
      <AnimatePresence>
        {pops.map((p) => (
          <motion.div
            key={p.id}
            initial={{ opacity: 1, scale: 0.6, x: p.x, y: p.y }}
            animate={{ opacity: 0, scale: 1.4, y: p.y - 100 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.0, ease: "easeOut" }}
            className="absolute font-black text-2xl select-none"
            style={{
              fontFamily: "'Baloo 2', cursive",
              color: p.value > 0 ? "#FBBF24" : "#F87171",
              textShadow: "0 2px 12px rgba(0,0,0,0.8)",
            }}
          >
            {p.value > 0 ? `+${p.value}` : `${p.value}`}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

/* ══════════════════════════════════════════════
   CONFETTI BURST
══════════════════════════════════════════════ */
function ConfettiBurst({ active }: { active: boolean }) {
  if (!active) return null;
  const SHAPES = ["⭐", "✨", "🎉", "💫", "🌟", "🎊", "🎈", "🏆"];
  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
      {Array.from({ length: 24 }).map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 1, x: "50vw", y: "50vh", scale: 0, rotate: 0 }}
          animate={{
            opacity: 0,
            x: `${5 + Math.random() * 90}vw`,
            y: `${5 + Math.random() * 90}vh`,
            scale: rand(8, 16) / 10,
            rotate: rand(-180, 180),
          }}
          transition={{ duration: 0.9, ease: "easeOut", delay: i * 0.02 }}
          className="absolute text-2xl select-none"
        >
          {SHAPES[i % SHAPES.length]}
        </motion.div>
      ))}
    </div>
  );
}

/* ══════════════════════════════════════════════
   ACHIEVEMENT TOAST
══════════════════════════════════════════════ */
function AchievementToast({ achievement, onDone }: { achievement: Achievement | null; onDone: () => void }) {
useEffect(() => {
  if (!achievement) return;

  const t = setTimeout(onDone, 3000);
  return () => clearTimeout(t);

}, [achievement, onDone]);

  return (
    <AnimatePresence>
      {achievement && (
        <motion.div
          initial={{ opacity: 0, y: -60, scale: 0.85 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -40, scale: 0.9 }}
          className="fixed top-6 left-1/2 -translate-x-1/2 z-[60] flex items-center gap-3 rounded-2xl px-6 py-4 shadow-2xl"
          style={{
            background: "linear-gradient(135deg,rgba(251,191,36,0.95),rgba(245,158,11,0.95))",
            backdropFilter: "blur(20px)",
            border: "1.5px solid rgba(255,255,255,0.3)",
            boxShadow: "0 8px 40px rgba(251,191,36,0.5)",
            minWidth: 260,
          }}
        >
          <span style={{ fontSize: 32 }}>{achievement.emoji}</span>
          <div>
            <p style={{ fontFamily: "'Baloo 2',cursive", fontWeight: 900, color: "#1C1917", fontSize: 14, margin: 0 }}>
              Achievement Unlocked!
            </p>
            <p style={{ fontFamily: "'Nunito',sans-serif", fontWeight: 700, color: "#44403C", fontSize: 13, margin: 0 }}>
              {achievement.label}
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ══════════════════════════════════════════════
   MASCOT COMPONENT
══════════════════════════════════════════════ */
function Mascot({ mood }: { mood: keyof typeof MASCOT_MOODS }) {
  const data = MASCOT_MOODS[mood];
  const ctrl = useAnimationControls();

  useEffect(() => {
    ctrl.start({ scale: [1, 1.25, 0.95, 1.1, 1], rotate: [0, -8, 6, -3, 0], transition: { duration: 0.5 } });
  }, [mood, ctrl]);

  return (
    <div className="flex items-center gap-3 mb-5">
      <motion.div animate={ctrl} style={{ fontSize: 44, display: "inline-block", lineHeight: 1 }}>
        {data.emoji}
      </motion.div>
      <motion.div
        key={mood}
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        className="rounded-2xl px-4 py-2.5 relative"
        style={{
          background: "rgba(255,255,255,0.07)",
          border: "1px solid rgba(255,255,255,0.12)",
          fontFamily: "'Nunito',sans-serif",
          fontSize: 13,
          fontWeight: 700,
          color: "rgba(255,255,255,0.8)",
          maxWidth: 200,
        }}
      >
        {/* Speech bubble tail */}
        <span
          style={{
            position: "absolute",
            left: -8,
            top: "50%",
            transform: "translateY(-50%)",
            width: 0,
            height: 0,
            borderTop: "6px solid transparent",
            borderBottom: "6px solid transparent",
            borderRight: "8px solid rgba(255,255,255,0.07)",
          }}
        />
        {data.msg}
      </motion.div>
    </div>
  );
}

/* ══════════════════════════════════════════════
   POWER-UP BUTTON
══════════════════════════════════════════════ */
function PowerUpBtn({
  type, count, active, onUse, disabled,
}: {
  type: PowerUpType & string;
  count: number;
  active: boolean;
  onUse: (t: PowerUpType & string) => void;
  disabled: boolean;
}) {
  const info = POWER_UP_INFO[type as keyof typeof POWER_UP_INFO];
  return (
    <motion.button
      whileHover={count > 0 && !disabled ? { scale: 1.08, y: -3 } : {}}
      whileTap={count > 0 && !disabled ? { scale: 0.92 } : {}}
      onClick={() => count > 0 && !disabled && onUse(type)}
      className="relative flex flex-col items-center justify-center rounded-2xl pt-2 pb-2 px-2 transition"
      style={{
        width: 72,
        background: active ? `${info.color}33` : count > 0 ? "rgba(255,255,255,0.07)" : "rgba(255,255,255,0.03)",
        border: `1.5px solid ${active ? info.color : count > 0 ? "rgba(255,255,255,0.15)" : "rgba(255,255,255,0.06)"}`,
        cursor: count > 0 && !disabled ? "pointer" : "not-allowed",
        opacity: count === 0 ? 0.4 : 1,
      }}
    >
      <span style={{ fontSize: 22 }}>{info.emoji}</span>
      <span style={{ fontFamily: "'Nunito',sans-serif", fontSize: 10, fontWeight: 700, color: count > 0 ? info.color : "rgba(255,255,255,0.3)", marginTop: 2 }}>
        {info.label.split(" ")[0]}
      </span>
      {count > 0 && (
        <span
          className="absolute -top-1.5 -right-1.5 flex items-center justify-center rounded-full font-black text-xs"
          style={{ width: 18, height: 18, background: info.color, color: "#fff", fontFamily: "'Baloo 2',cursive", fontSize: 11 }}
        >
          {count}
        </span>
      )}
    </motion.button>
  );
}

/* ══════════════════════════════════════════════
   STATS PANEL (end screen)
══════════════════════════════════════════════ */
function StatRow({ label, value, color }: { label: string; value: string | number; color?: string }) {
  return (
    <div className="flex items-center justify-between py-2" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
      <span style={{ fontFamily: "'Nunito',sans-serif", fontSize: 13, color: "rgba(255,255,255,0.45)" }}>{label}</span>
      <span style={{ fontFamily: "'Baloo 2',cursive", fontSize: 15, fontWeight: 800, color: color || "rgba(255,255,255,0.85)" }}>{value}</span>
    </div>
  );
}

/* ══════════════════════════════════════════════
   MAIN GAME COMPONENT
══════════════════════════════════════════════ */
export default function MathQuize() {
  const router = useRouter();

  /* ── Player ── */
  const [player, setPlayer] = useState("");

  /* ── Score ── */
  const [score, setScore]   = useState(0);
  const [highScore, setHighScore] = useState(0);

  /* ── Question ── */
  const [level, setLevel]   = useState(1);
  const [question, setQuestion] = useState<Question | null>(null);
  const [visibleOptions, setVisibleOptions] = useState<number[]>([]);

  /* ── Interaction ── */
  const [selected, setSelected]   = useState<number | null>(null);
  const [feedback, setFeedback]   = useState<FeedbackType>(null);

  /* ── Streak / combo ── */
  const [streak, setStreak]       = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [comboMulti, setComboMulti] = useState(1);

  /* ── Timer ── */
  const [timeLeft, setTimeLeft]   = useState(MAX_TIME);
  const [timerFrozen, setTimerFrozen] = useState(false);

  /* ── Lives ── */
  const [lives, setLives]         = useState(3);

  /* ── Progress ── */
  const [answered, setAnswered]   = useState(0);
  const [correct, setCorrect]     = useState(0);
  const [, setWrong] = useState(0);

  /* ── Hint ── */
  const [hint, setHint]           = useState("");
  const [hintLoading, setHintLoading] = useState(false);
  const [hintUsed, setHintUsed]   = useState(false);

  /* ── Power-ups ── */
  const [powerUps, setPowerUps]   = useState({ freeze: 1, fifty: 1, double: 1 });
  const [activeDouble, setActiveDouble] = useState(false);

  /* ── Game state ── */
  const [gameOver, setGameOver]   = useState(false);
  const [mascotMood, setMascotMood] = useState<keyof typeof MASCOT_MOODS>("idle");

  /* ── Achievements ── */
  const [achievements, setAchievements] = useState<Achievement[]>(INITIAL_ACHIEVEMENTS);
  const [toastAchievement, setToastAchievement] = useState<Achievement | null>(null);
  const achievementQueue = useRef<Achievement[]>([]);
  const [showAchievements, setShowAchievements] = useState(false);

  /* ── Visual FX ── */
  const [confetti, setConfetti]   = useState(false);
  const [scorePops, setScorePops] = useState<ScorePop[]>([]);
  const popId = useRef(0);

  /* ── Session stats ── */
  const [sessionStart]            = useState(Date.now());

  /* ════════════ INIT ════════════ */
  useEffect(() => {
    const p = localStorage.getItem("kg_player") || "";
    if (!p) { router.push("/games"); return; }
    setPlayer(p);
    const hs = parseInt(localStorage.getItem("kg_hs_math") || "0", 10);
    setHighScore(hs);
    const savedAch = localStorage.getItem("kg_achievements");
    if (savedAch) setAchievements(JSON.parse(savedAch));
    const q = makeQuestion(1);
    setQuestion(q);
    setVisibleOptions(q.options);
  }, []);

  /* ════════════ TIMER ════════════ */
  useEffect(() => {
    if (!question || feedback !== null || gameOver || timerFrozen) return;
    if (timeLeft <= 0) { onTimeout(); return; }
    const t = setTimeout(() => setTimeLeft((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [timeLeft, feedback, gameOver, question, timerFrozen]);

  /* ════════════ HELPERS ════════════ */
  const addScorePop = (value: number) => {
    const id = popId.current++;
    const x = window.innerWidth / 2 + rand(-80, 80);
    const y = window.innerHeight / 2 + rand(-60, 60);
    setScorePops((prev) => [...prev, { id, value, x, y }]);
    setTimeout(() => setScorePops((prev) => prev.filter((p) => p.id !== id)), 1100);
  };

  const unlockAchievement = useCallback((id: string) => {
    setAchievements((prev) => {
      const already = prev.find((a) => a.id === id);
      if (!already || already.unlocked) return prev;
      const updated = prev.map((a) => a.id === id ? { ...a, unlocked: true } : a);
      localStorage.setItem("kg_achievements", JSON.stringify(updated));
      const found = updated.find((a) => a.id === id)!;
      achievementQueue.current.push(found);
      if (!toastAchievement) {
        setToastAchievement(achievementQueue.current.shift()!);
      }
      return updated;
    });
  }, [toastAchievement]);

  const checkAchievements = useCallback((
  newScore: number,
  newStreak: number,
  newLevel: number
) => {
    if (newStreak >= 1) unlockAchievement("first_correct");
    if (newStreak >= 3) unlockAchievement("streak_3");
    if (newStreak >= 5) unlockAchievement("streak_5");
    if (newStreak >= 10) unlockAchievement("streak_10");
    if (newScore >= 50) unlockAchievement("score_50");
    if (newScore >= 100) unlockAchievement("score_100");
    if (newScore >= 200) unlockAchievement("score_200");
    if (newLevel >= 5) unlockAchievement("level_5");
  }, [unlockAchievement]);

  /* ════════════ NEXT QUESTION ════════════ */
  const nextQuestion = useCallback((currentAnswered: number) => {
    const lv = Math.min(Math.floor(currentAnswered / 4) + 1, 8);
    const q = makeQuestion(lv);
    setLevel(lv);
    setQuestion(q);
    setVisibleOptions(q.options);
    setSelected(null);
    setFeedback(null);
    setTimeLeft(Math.max(MAX_TIME - lv, 7));
    setHint("");
    setActiveDouble(false);
    setTimerFrozen(false);
    setMascotMood("idle");
  }, []);

  /* ════════════ ON TIMEOUT ════════════ */
  const onTimeout = useCallback(() => {
    setFeedback("timeout");
    setStreak(0);
    setComboMulti(1);
    setMascotMood("timeout");
    addScorePop(-2);
    setScore((s) => Math.max(0, s - 2));
    const nl = lives - 1;
    setLives(nl);
    if (nl <= 0) { setTimeout(() => { setGameOver(true); setMascotMood("gameover"); }, 1200); return; }
    setTimeout(() => nextQuestion(answered), 1400);
  }, [lives, answered, nextQuestion]);

  /* ════════════ WRONG ANSWER ════════════ */
  const onWrong = useCallback(() => {
    setFeedback("wrong");
    setStreak(0);
    setComboMulti(1);
    setMascotMood("wrong");
    setWrong((w) => w + 1);
    addScorePop(-5);
    setScore((s) => Math.max(0, s - 5));
    const nl = lives - 1;
    setLives(nl);
    if (nl <= 0) { setTimeout(() => { setGameOver(true); setMascotMood("gameover"); }, 1300); return; }
    setTimeout(() => nextQuestion(answered), 1300);
  }, [lives, answered, nextQuestion]);

  /* ════════════ PICK ANSWER ════════════ */
  const pick = useCallback((opt: number) => {
    if (selected !== null || feedback !== null || gameOver || !question) return;
    setSelected(opt);

    if (opt === question.answer) {
      const timeBonus = Math.ceil(timeLeft / 3);
      const base = feedback === null && timeLeft >= MAX_TIME - 3 ? 20 : 10; // speed demon bonus
      const multi = activeDouble ? 2 : comboMulti;
      const pts = (base + timeBonus) * multi;
      const isSpeedDemon = timeLeft >= MAX_TIME - 4;

      setScore((s) => {
        const ns = s + pts;
        if (ns > highScore) {
          setHighScore(ns);
          localStorage.setItem("kg_hs_math", String(ns));
        }
        return ns;
      });

      const newStreak = streak + 1;
      setStreak(newStreak);
      setBestStreak((b) => Math.max(b, newStreak));
      setCorrect((c) => c + 1);

      const newMulti = newStreak >= 5 ? 3 : newStreak >= 3 ? 2 : 1;
      setComboMulti(newMulti);

      setFeedback("correct");
      setMascotMood(newStreak >= 3 ? "streak" : "correct");
      setConfetti(true);
      setTimeout(() => setConfetti(false), 1000);
      addScorePop(pts);

      const na = answered + 1;
      setAnswered(na);

      if (isSpeedDemon) unlockAchievement("speed_demon");
      checkAchievements(score + pts, newStreak, level);

      // Award power-up every 5 correct
     if (na % 5 === 0) {
  const types: (keyof typeof powerUps)[] = ["freeze", "fifty", "double"];
  const t = types[Math.floor(Math.random() * types.length)]!;
  setPowerUps((p) => ({ ...p, [t]: p[t] + 1 }));
}

      setTimeout(() => nextQuestion(na), 1100);
    } else {
      onWrong();
    }
  }, [selected, feedback, gameOver, question, timeLeft, streak, comboMulti, activeDouble, score, level, hintUsed, answered, highScore, checkAchievements, nextQuestion, onWrong, unlockAchievement]);

  /* ════════════ POWER-UP USE ════════════ */
  const usePowerUp = (type: PowerUpType & string) => {
    if (!powerUps[type as keyof typeof powerUps] || !question) return;
    setPowerUps((p) => ({ ...p, [type]: p[type as keyof typeof p] - 1 }));

    if (type === "freeze") {
      setTimerFrozen(true);
      setTimeLeft((t) => Math.min(t + 10, MAX_TIME));
      setTimeout(() => setTimerFrozen(false), 8000);
    } else if (type === "fifty") {
      const wrong2 = visibleOptions.filter((o) => o !== question.answer);
      const removed = wrong2.sort(() => Math.random() - 0.5).slice(0, 2);
      setVisibleOptions(visibleOptions.filter((o) => !removed.includes(o)));
    } else if (type === "double") {
      setActiveDouble(true);
    }
  };

  /* ════════════ AI HINT ════════════ */
  const getHint = async () => {
    if (hintLoading || hint || !question) return;
    setHintLoading(true);
    setHintUsed(true);
    setMascotMood("hint");
    setScore((s) => Math.max(0, s - 5));
    addScorePop(-5);
    try {
      const r = await fetch("/api/game-hint", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "math", question: question.q }),
      });
      const d = await r.json();
      setHint(d.hint);
    } catch {
      setHint("Break the problem into smaller steps and try again! 💪");
    }
    setHintLoading(false);
  };

  /* ════════════ SAVE & EXIT ════════════ */
  const saveExit = () => {
    const s = JSON.parse(localStorage.getItem("kg_scores") || "{}");
    s["math-quize"] = Math.max(score, s["math-quize"] ?? 0);
    localStorage.setItem("kg_scores", JSON.stringify(s));
    if (!hintUsed && correct >= 5) unlockAchievement("no_hint");
    router.push("/games");
  };

  /* ════════════ RESTART ════════════ */
  const restart = () => {
    setScore(0); setLevel(1); setLives(3); setStreak(0); setComboMulti(1);
    setAnswered(0); setCorrect(0); setWrong(0); setGameOver(false);
    setFeedback(null); setSelected(null); setHint(""); setHintUsed(false);
    setTimeLeft(MAX_TIME); setActiveDouble(false); setTimerFrozen(false);
    setPowerUps({ freeze: 1, fifty: 1, double: 1 });
    setMascotMood("idle"); setBestStreak(0);
    const q = makeQuestion(1);
    setQuestion(q);
    setVisibleOptions(q.options);
  };

  /* ════════════ RENDER GUARDS ════════════ */
  if (!question) return null;

  const timerPct = (timeLeft / MAX_TIME) * 100;
  const timerColor = timerFrozen ? "#06B6D4" : timeLeft > 8 ? "#22C55E" : timeLeft > 4 ? "#F59E0B" : "#EF4444";
  const accuracy = answered > 0 ? Math.round((correct / answered) * 100) : 0;
  const sessionSec = Math.floor((Date.now() - sessionStart) / 1000);
  const diffColors = { easy: "#22C55E", medium: "#F59E0B", hard: "#EF4444" };
  const unlockedCount = achievements.filter((a) => a.unlocked).length;

  /* ══════════════════════════════════════════
     JSX
  ══════════════════════════════════════════ */
  return (
    <>
      <Head>
        <title>Math Quiz 🧮 · Kids Game Zone</title>
        <link
          href="https://fonts.googleapis.com/css2?family=Baloo+2:wght@700;800;900&family=Nunito:wght@400;600;700;800&display=swap"
          rel="stylesheet"
        />
        <style>{`
          *, *::before, *::after { box-sizing: border-box; }
          body { margin: 0; background: #0a0520; font-family: 'Nunito', sans-serif; }
          .font-display { font-family: 'Baloo 2', cursive; }
          .font-body    { font-family: 'Nunito', sans-serif; }

          @keyframes orb-pulse  { 0%,100%{opacity:.25;transform:scale(1)}   50%{opacity:.5;transform:scale(1.06)} }
          @keyframes spin-slow  { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
          @keyframes timer-ring { 0%{stroke-dashoffset:0} 100%{stroke-dashoffset:283} }
          @keyframes bg-shift   {
            0%   { background-position: 0% 50%; }
            50%  { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
          @keyframes neon-glow {
            0%,100% { box-shadow: 0 0 8px rgba(251,191,36,0.3); }
            50%     { box-shadow: 0 0 24px rgba(251,191,36,0.7); }
          }
          @keyframes shake {
            0%,100%{transform:translateX(0)}
            20%{transform:translateX(-8px)}
            40%{transform:translateX(8px)}
            60%{transform:translateX(-5px)}
            80%{transform:translateX(5px)}
          }

          .orb        { animation: orb-pulse 7s ease-in-out infinite; }
          .spin-slow  { animation: spin-slow 20s linear infinite; }
          .neon-glow  { animation: neon-glow 2s ease-in-out infinite; }
          .shake-anim { animation: shake 0.4s ease; }

          .glass-card {
            background: rgba(255,255,255,0.055);
            border: 1px solid rgba(255,255,255,0.11);
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
            border-radius: 24px;
          }

          .option-btn {
            display: flex; align-items: center; justify-content: center;
            border-radius: 18px;
            padding: 18px 8px;
            font-family: 'Baloo 2', cursive;
            font-weight: 900;
            font-size: clamp(22px, 5vw, 30px);
            cursor: pointer;
            transition: transform 0.15s ease, box-shadow 0.15s ease;
            border: 1.5px solid rgba(255,255,255,0.12);
            background: rgba(255,255,255,0.065);
            color: #fff;
            width: 100%;
          }
          .option-btn:hover { transform: translateY(-4px) scale(1.03); }
          .option-btn:active { transform: scale(0.96); }
          .option-btn.correct { background: rgba(34,197,94,0.22); border-color: #22C55E; color: #86EFAC; }
          .option-btn.wrong   { background: rgba(239,68,68,0.22); border-color: #EF4444; color: #FCA5A5; animation: shake 0.4s ease; }
          .option-btn.reveal  { background: rgba(34,197,94,0.13); border-color: rgba(34,197,94,0.4); color: #86EFAC; }
          .option-btn.faded   { opacity: 0.2; cursor: not-allowed; }
          .option-btn.disabled { cursor: default; }
          .option-btn.double-active { box-shadow: 0 0 0 2px #A855F7, 0 0 16px rgba(168,85,247,0.4); }
        `}</style>
      </Head>

      {/* FX layers */}
      <ConfettiBurst active={confetti} />
      <ScorePopLayer pops={scorePops} />
      <AchievementToast
        achievement={toastAchievement}
        onDone={() => {
          setToastAchievement(null);
          if (achievementQueue.current.length > 0) {
            setTimeout(() => setToastAchievement(achievementQueue.current.shift()!), 300);
          }
        }}
      />

      {/* ── ACHIEVEMENT PANEL (overlay) ── */}
      <AnimatePresence>
        {showAchievements && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] flex items-center justify-center p-4"
            style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)" }}
            onClick={() => setShowAchievements(false)}
          >
            <motion.div
              initial={{ scale: 0.85, y: 40 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.85, y: 40 }}
              className="glass-card p-6 w-full max-w-sm"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="font-display text-white font-black text-xl mb-4 text-center">
                🏅 Achievements ({unlockedCount}/{achievements.length})
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {achievements.map((a) => (
                  <div
                    key={a.id}
                    className="flex items-center gap-2 rounded-xl p-3 transition"
                    style={{
                      background: a.unlocked ? "rgba(251,191,36,0.12)" : "rgba(255,255,255,0.04)",
                      border: `1px solid ${a.unlocked ? "rgba(251,191,36,0.4)" : "rgba(255,255,255,0.08)"}`,
                      opacity: a.unlocked ? 1 : 0.45,
                    }}
                  >
                    <span style={{ fontSize: 22 }}>{a.emoji}</span>
                    <span className="font-body text-xs font-bold" style={{ color: a.unlocked ? "#FCD34D" : "rgba(255,255,255,0.4)", lineHeight: 1.3 }}>
                      {a.label}
                    </span>
                  </div>
                ))}
              </div>
              <button
                onClick={() => setShowAchievements(false)}
                className="font-body mt-4 w-full py-3 rounded-2xl text-white/60 font-semibold text-sm hover:text-white/90 transition"
                style={{ border: "1px solid rgba(255,255,255,0.12)" }}
              >
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── MAIN BACKGROUND ── */}
      <div
        className="min-h-screen relative overflow-hidden flex flex-col items-center px-4 py-8"
        style={{ background: "linear-gradient(160deg,#0a0520 0%,#1a0c30 50%,#0d1f4e 100%)" }}
      >
        {/* Orbs */}
        <div className="orb pointer-events-none fixed rounded-full"
          style={{ width: 500, height: 500, top: "-12%", left: "-10%", background: "radial-gradient(circle,rgba(245,158,11,0.14) 0%,transparent 70%)" }} />
        <div className="orb pointer-events-none fixed rounded-full"
          style={{ width: 550, height: 550, bottom: "-14%", right: "-10%", background: "radial-gradient(circle,rgba(168,85,247,0.12) 0%,transparent 70%)", animationDelay: "3s" }} />
        <div className="orb pointer-events-none fixed rounded-full"
          style={{ width: 350, height: 350, top: "35%", left: "60%", background: "radial-gradient(circle,rgba(6,182,212,0.1) 0%,transparent 70%)", animationDelay: "6s" }} />
        {/* Dot grid */}
        <div className="pointer-events-none fixed inset-0 opacity-[0.022]"
          style={{ backgroundImage: "radial-gradient(circle,rgba(255,255,255,1) 1px,transparent 1px)", backgroundSize: "40px 40px" }} />

        {/* ══ CONTENT ══ */}
        <div className="relative z-10 w-full max-w-md">

          {/* ── TOP BAR ── */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between mb-4"
          >
            <Link href="/games" style={{ textDecoration: "none" }}>
              <button
                className="font-body text-white/35 hover:text-white/75 text-sm font-semibold transition rounded-xl px-3 py-2"
                style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}
              >
                ← Back
              </button>
            </Link>

            {/* Lives */}
            <div className="flex gap-1">
              {[...Array(3)].map((_, i) => (
                <motion.span
                  key={i}
                  animate={i === lives ? { scale: [1, 1.4, 0.8, 1] } : {}}
                  className="text-xl select-none"
                  style={{ opacity: i < lives ? 1 : 0.18, filter: i < lives ? "drop-shadow(0 0 6px rgba(239,68,68,0.7))" : "none" }}
                >
                  ❤️
                </motion.span>
              ))}
            </div>

            {/* Score + HiScore */}
            <div className="text-right">
              <div className="font-display font-black text-2xl" style={{ color: "#FBBF24", lineHeight: 1, textShadow: "0 0 12px rgba(251,191,36,0.5)" }}>
                {score}
              </div>
              <div className="font-body text-white/25 text-xs">Best: {highScore}</div>
            </div>
          </motion.div>

          {/* ── LEVEL / DIFF / STREAK / ACHIEVEMENTS ── */}
          <div className="flex items-center gap-2 mb-3 flex-wrap">
            <span className="font-body text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full"
              style={{ background: "rgba(245,158,11,0.18)", color: "#F59E0B" }}>
              Lv {level}
            </span>
            <span className="font-body text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full"
              style={{ background: `${diffColors[question.difficulty]}22`, color: diffColors[question.difficulty] }}>
              {question.difficulty}
            </span>
            <AnimatePresence>
              {streak >= 2 && (
                <motion.span
                  initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
                  className="font-body text-xs font-bold px-3 py-1 rounded-full"
                  style={{ background: "rgba(239,68,68,0.2)", color: "#FCA5A5", border: "1px solid rgba(239,68,68,0.3)" }}
                >
                  🔥 ×{streak}
                </motion.span>
              )}
              {comboMulti > 1 && (
                <motion.span
                  initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
                  className="font-body text-xs font-bold px-3 py-1 rounded-full"
                  style={{ background: "rgba(168,85,247,0.2)", color: "#D8B4FE", border: "1px solid rgba(168,85,247,0.3)" }}
                >
                  ⚡ {comboMulti}× Combo
                </motion.span>
              )}
            </AnimatePresence>
            <button
              onClick={() => setShowAchievements(true)}
              className="font-body ml-auto text-xs font-bold px-3 py-1 rounded-full transition hover:opacity-80"
              style={{ background: "rgba(255,255,255,0.07)", color: "rgba(255,255,255,0.45)", border: "1px solid rgba(255,255,255,0.1)" }}
            >
              🏅 {unlockedCount}
            </button>
          </div>

          {/* ── TIMER BAR ── */}
          <div className="relative w-full h-3 rounded-full mb-4 overflow-hidden"
            style={{ background: "rgba(255,255,255,0.07)", boxShadow: "inset 0 1px 3px rgba(0,0,0,0.4)" }}>
            <motion.div
              className="h-full rounded-full"
              animate={{ width: `${timerPct}%`, backgroundColor: timerColor }}
              transition={{ duration: 1, ease: "linear" }}
              style={{ boxShadow: `0 0 10px ${timerColor}88` }}
            />
            {timerFrozen && (
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="font-body text-cyan-300 text-xs font-black tracking-widest">❄️ FROZEN</span>
              </div>
            )}
          </div>
          <div className="font-body text-white/25 text-xs text-right mb-4" style={{ marginTop: -10 }}>
            {timerFrozen ? "❄️ Time frozen!" : `⏱ ${timeLeft}s`}
          </div>

          {/* ── MASCOT ── */}
          <Mascot mood={mascotMood} />

          {/* ── POWER-UPS ── */}
          <div className="flex items-center gap-2 mb-4">
            <span className="font-body text-white/30 text-xs font-bold uppercase tracking-widest mr-1">Power-ups</span>
            {(["freeze", "fifty", "double"] as const).map((t) => (
              <PowerUpBtn
                key={t}
                type={t}
                count={powerUps[t]}
                active={t === "double" && activeDouble}
                onUse={usePowerUp}
                disabled={!!feedback || gameOver}
              />
            ))}
            {activeDouble && (
              <motion.span
                initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }}
                className="font-body text-xs font-black text-purple-300 ml-1"
              >
                ⚡ 2× active!
              </motion.span>
            )}
          </div>

          {/* ══ GAME OVER CARD ══ */}
          <AnimatePresence mode="wait">
            {gameOver ? (
              <motion.div
                key="gameover"
                initial={{ scale: 0.85, opacity: 0, y: 30 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                className="glass-card p-7"
              >
                <div className="text-center mb-5">
                  <div className="text-6xl mb-3">
                    {score >= 200 ? "🏆" : score >= 100 ? "🌟" : score >= 50 ? "⭐" : "😅"}
                  </div>
                  <h2 className="font-display text-white font-black mb-1" style={{ fontSize: 34 }}>Game Over!</h2>
                  <p className="font-body text-white/40 text-sm">{player}, here's your report:</p>
                </div>

                <div className="mb-5">
                  <StatRow label="Final Score"       value={`${score} pts`}    color="#FBBF24" />
                  <StatRow label="High Score"        value={`${highScore} pts`} color="#FCD34D" />
                  <StatRow label="Questions"         value={answered} />
                  <StatRow label="Accuracy"          value={`${accuracy}%`}    color={accuracy >= 70 ? "#86EFAC" : "#FCA5A5"} />
                  <StatRow label="Best Streak"       value={`${bestStreak}×`}   color="#FCA5A5" />
                  <StatRow label="Highest Level"     value={level} />
                  <StatRow label="Time Played"       value={`${Math.floor(sessionSec / 60)}m ${sessionSec % 60}s`} />
                  <StatRow label="Achievements"      value={`${unlockedCount} / ${achievements.length}`} color="#C4B5FD" />
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  <motion.button
                    whileHover={{ scale: 1.03, y: -2 }} whileTap={{ scale: 0.97 }}
                    onClick={saveExit}
                    className="font-display w-full py-4 rounded-2xl text-white font-black text-lg"
                    style={{ background: "linear-gradient(135deg,#F59E0B,#EF4444)", boxShadow: "0 8px 28px rgba(245,158,11,0.4)" }}
                  >
                    💾 Save & Exit
                  </motion.button>
                  <button
                    onClick={restart}
                    className="font-body w-full py-3 rounded-2xl text-white/55 font-semibold text-sm hover:text-white/85 transition"
                    style={{ border: "1px solid rgba(255,255,255,0.14)" }}
                  >
                    🔄 Play Again
                  </button>
                  <button
                    onClick={() => setShowAchievements(true)}
                    className="font-body w-full py-3 rounded-2xl text-purple-300/70 font-semibold text-sm hover:text-purple-200 transition"
                    style={{ border: "1px solid rgba(168,85,247,0.2)" }}
                  >
                    🏅 View Achievements
                  </button>
                </div>
              </motion.div>

            ) : (
              /* ══ ACTIVE GAME ══ */
              <motion.div
                key={question.q}
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -40 }}
                transition={{ duration: 0.25 }}
              >
                {/* Question card */}
                <div className="glass-card mb-4 overflow-hidden">
                  <div style={{ height: 5, background: `linear-gradient(90deg,#F59E0B,#EF4444,#A855F7)` }} />
                  <div className="p-7 text-center relative">
                    {/* Double active glow */}
                    {activeDouble && (
                      <div
                        className="absolute inset-0 rounded-2xl pointer-events-none"
                        style={{ border: "2px solid rgba(168,85,247,0.5)", boxShadow: "inset 0 0 30px rgba(168,85,247,0.1)" }}
                      />
                    )}
                    <p className="font-body text-white/30 text-xs mb-1 uppercase tracking-widest">
                      Question {answered + 1}
                    </p>
                    <p
                      className="font-display font-black text-white"
                      style={{ fontSize: "clamp(38px,9vw,58px)", lineHeight: 1.1, textShadow: "0 2px 16px rgba(245,158,11,0.3)" }}
                    >
                      {question.q}
                    </p>
                    {activeDouble && (
                      <p className="font-body text-purple-300 text-xs mt-2 font-black">⚡ Double Points Active!</p>
                    )}
                  </div>
                </div>

                {/* Options */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  {question.options.map((opt) => {
                    const notVisible = !visibleOptions.includes(opt);
                    const isSel     = selected === opt;
                    const isCorrect = opt === question.answer;
                    let cls = "option-btn";
                    if (notVisible)                          cls += " faded";
                    else if (isSel && feedback === "correct") cls += " correct";
                    else if (isSel && feedback === "wrong")   cls += " wrong";
                    else if (feedback && isCorrect)           cls += " reveal";
                    if (selected !== null)                   cls += " disabled";
                    if (activeDouble && !selected)           cls += " double-active";

                    return (
                      <button
                        key={opt}
                        className={cls}
                        onClick={() => !notVisible && pick(opt)}
                        disabled={!!selected || notVisible}
                      >
                        {isSel && feedback === "correct" && <span style={{ marginRight: 6 }}>✓</span>}
                        {isSel && feedback === "wrong"   && <span style={{ marginRight: 6 }}>✗</span>}
                        {opt}
                      </button>
                    );
                  })}
                </div>

                {/* Hint */}
                <motion.button
                  whileHover={!hint && !hintLoading ? { scale: 1.02 } : {}}
                  whileTap={!hint && !hintLoading ? { scale: 0.98 } : {}}
                  onClick={getHint}
                  disabled={hintLoading || !!hint}
                  className="font-body w-full py-3 rounded-2xl text-sm font-bold transition"
                  style={{
                    background: "rgba(139,92,246,0.1)",
                    border: "1px solid rgba(139,92,246,0.28)",
                    color: hint ? "rgba(196,181,253,0.5)" : "#C4B5FD",
                    cursor: hintLoading || hint ? "default" : "pointer",
                  }}
                >
                  {hintLoading
                    ? "🤔 AI is thinking..."
                    : hint
                    ? "💡 Hint shown below"
                    : "💡 Ask AI for Hint  (−5 pts)"}
                </motion.button>

                <AnimatePresence>
                  {hint && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, height: 0 }}
                      animate={{ opacity: 1, y: 0, height: "auto" }}
                      exit={{ opacity: 0, y: -4 }}
                      className="font-body mt-3 p-4 rounded-2xl text-sm leading-relaxed"
                      style={{ background: "rgba(139,92,246,0.09)", border: "1px solid rgba(139,92,246,0.2)", color: "#DDD6FE" }}
                    >
                      <span className="font-black text-purple-300">🦉 Owly says: </span>{hint}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Progress mini bar */}
                <div className="mt-4 flex items-center gap-3">
                  <div className="flex-1 h-1 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.07)" }}>
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${Math.min((answered / 20) * 100, 100)}%`, background: "linear-gradient(90deg,#F59E0B,#A855F7)" }}
                    />
                  </div>
                  <span className="font-body text-white/25 text-xs">{answered}/20</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </>
  );
}