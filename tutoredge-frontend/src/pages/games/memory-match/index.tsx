import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

/* ═══════════════════════════════════════════════════════════════
   MEGA EMOJI POOLS — 1000+ emojis across many themed categories
   Har baar randomly 8 pick honge → fresh game every restart!
═══════════════════════════════════════════════════════════════ */

const EMOJI_POOLS: Record<string, string[]> = {

  /* ── Animals ── */
  animals: [
    "🐶","🐱","🐭","🐹","🐰","🦊","🐻","🐼","🐨","🐯","🦁","🐮","🐷","🐸","🐵",
    "🙈","🙉","🙊","🐔","🐧","🐦","🐤","🦆","🦅","🦉","🦇","🐺","🐗","🐴","🦄",
    "🐝","🐛","🦋","🐌","🐞","🐜","🦟","🦗","🦂","🐢","🐍","🦎","🦕","🦖","🦑",
    "🐙","🦐","🦞","🦀","🐡","🐟","🐠","🐬","🐳","🐋","🦈","🐊","🐅","🐆","🦓",
    "🦍","🦧","🦣","🐘","🦛","🦏","🐪","🐫","🦒","🦘","🦬","🐃","🐂","🐄","🐎",
    "🐖","🐏","🐑","🦙","🐐","🦌","🐕","🐩","🦮","🐕‍🦺","🐈","🐈‍⬛","🐓","🦃","🦤",
    "🦚","🦜","🦢","🦩","🕊","🐇","🦝","🦨","🦡","🦫","🦦","🦥","🐁","🐀","🐿",
    "🦔","🐾","🐉","🦕","🦖","🐲","🌵","🌲","🌳","🌴",
  ],

  /* ── Fruits & Veggies ── */
  fruits: [
    "🍎","🍊","🍋","🍇","🍓","🫐","🍒","🍑","🥭","🍍","🥥","🥝","🍅","🍆","🥑",
    "🫒","🥦","🥬","🥒","🌶","🫑","🧄","🧅","🥕","🌽","🍠","🥔","🧆","🥜","🫘",
    "🌰","🫚","🍌","🍉","🍈","🍏","🍐","🫙","🥗","🥙","🥫","🫕","🍓","🍒","🍋‍🟩",
    "🍈","🍑","🍒","🍓","🍔","🌮","🌯","🫔","🧆","🫙","🥤","🧃","🍵","🧉","🍶",
    "🍄","🌿","🪴","🌱","🌾","🌻","🌺","🌸","🌼","🌹",
  ],

  /* ── Space & Cosmos ── */
  space: [
    "🚀","🌙","⭐","🌍","☄️","🛸","🌟","🪐","🌌","🔭","👨‍🚀","👩‍🚀","🛰","🌠","🌑",
    "🌒","🌓","🌔","🌕","🌖","🌗","🌘","🌚","🌝","🌛","🌜","🌞","🪨","🌏","🌎",
    "💫","✨","⚡","🌈","🌊","🌬","🌀","🌪","🌤","⛅","🌦","🌧","⛈","🌩","❄",
    "☃️","⛄","🌬","💨","🌫","🌈","☀️","🌤","⭐","🌙","💫","🪐","🔭","🛰","🚀",
  ],

  /* ── Food & Drinks ── */
  food: [
    "🍕","🍔","🌮","🌯","🥗","🍜","🍝","🍛","🍣","🍱","🥡","🍙","🍘","🍢","🥟",
    "🍤","🦪","🍦","🍧","🍨","🍩","🍪","🎂","🍰","🧁","🥧","🍫","🍬","🍭","🍮",
    "🍯","🍰","🥂","🍷","🍸","🍹","🧉","🍺","🍻","☕","🍵","🧃","🥤","🧋","🍼",
    "🫖","🧊","🥛","🍶","🫗","🥃","🍾","🫘","🧆","🥙","🌶","🫕","🍲","🥘","🍗",
    "🍖","🥩","🥓","🌭","🥪","🫓","🧀","🍳","🥚","🧈","🥞","🧇","🥐","🥖","🫒",
    "🥨","🥯","🍞","🫙","🧈","🥜","🫑","🧄","🧅","🥔",
  ],

  /* ── Sports & Activities ── */
  sports: [
    "⚽","🏀","🏈","⚾","🥎","🏐","🏉","🥏","🎾","🏓","🏸","🥊","🥋","🎽","🛹",
    "🛼","🛷","⛸","🏋","🤼","🤺","🤸","⛹","🤾","🏌","🏇","🧘","🏄","🏊","🚴",
    "🏆","🥇","🥈","🥉","🏅","🎖","🎗","🎯","🎱","🪀","🏓","🏸","🎳","🎻","🎸",
    "🎹","🥁","🎷","🎺","🎸","🪗","🎵","🎶","🎼","🎤","🎧","🎷","🎻","🎹","🎺",
    "🤿","🏊","🚵","🧗","🏇","🤸","🤼","🤺","🥊","🥋","🏋","⛹","🏌","🏄","🚴",
  ],

  /* ── Vehicles & Transport ── */
  vehicles: [
    "🚗","🚕","🚙","🚌","🚎","🏎","🚓","🚑","🚒","🚐","🛻","🚚","🚛","🚜","🏍",
    "🛵","🚲","🛴","🛺","🚁","🛻","✈️","🛩","🚀","🛸","🚂","🚃","🚄","🚅","🚆",
    "🚇","🚈","🚉","🚊","🚝","🚞","🚋","🚌","🚍","🚎","🏎","🚐","🚑","🚒","🛻",
    "⛵","🚤","🛥","🛳","⛴","🚢","🛶","⛽","🚧","🛣","🛤","⛲","🗺","🧭","🚏",
    "🛑","🚦","🚥","🚨","🏗","🛗","🪝","⚓","🪤","🔧","🪛","🔩","🛠","⚙️","🗜",
  ],

  /* ── Faces & Emotions ── */
  faces: [
    "😀","😃","😄","😁","😆","😅","🤣","😂","🙂","🙃","😉","😊","😇","🥰","😍",
    "🤩","😘","😗","☺️","😚","😙","🥲","😋","😛","😜","🤪","😝","🤑","🤗","🤭",
    "🤫","🤔","🤐","🤨","😐","😑","😶","😶‍🌫️","😏","😒","🙄","😬","😮‍💨","🤥","😌",
    "😔","😪","🤤","😴","😷","🤒","🤕","🤢","🤮","🤧","🥵","🥶","🥴","😵","😵‍💫",
    "🤯","🤠","🥳","🥸","😎","🤓","🧐","😕","😟","🙁","☹️","😮","😯","😲","😳",
    "🥺","😦","😧","😨","😰","😥","😢","😭","😱","😖","😣","😞","😓","😩","😫",
    "🥱","😤","😡","😠","🤬","😈","👿","💀","☠️","💩","🤡","👹","👺","👻","👽",
    "👾","🤖","😺","😸","😹","😻","😼","😽","🙀","😿","😾",
  ],

  /* ── Nature & Weather ── */
  nature: [
    "🌵","🌲","🌳","🌴","🌱","🌿","☘️","🍀","🎋","🎍","🍃","🍂","🍁","🪺","🪹",
    "🍄","🌾","💐","🌷","🌹","🥀","🌺","🌸","🌼","🌻","🌞","🌝","🌛","🌜","🌚",
    "🌕","🌖","🌗","🌘","🌑","🌒","🌓","🌔","🌙","🌟","⭐","🌠","🌌","☁️","⛅",
    "🌤","🌥","🌦","🌧","⛈","🌩","🌨","❄️","☃️","⛄","🌬","💨","💧","💦","🌊",
    "🌀","🌈","🔥","💥","⚡","🌪","🌫","🌬","🌊","🏔","⛰","🌋","🗻","🏕","🏖",
    "🏜","🏝","🏞","🌅","🌄","🌠","🎇","🎆","🌇","🌆","🏙","🌃","🌉","🌌","🌁",
  ],

  /* ── Objects & Things ── */
  objects: [
    "📱","💻","⌨️","🖥","🖨","🖱","🖲","💾","💿","📀","📷","📸","📹","🎥","📽",
    "🎞","📞","☎️","📟","📠","📺","📻","🎙","🎚","🎛","🧭","⏱","⏰","🕰","⌚",
    "📡","🔋","🔌","💡","🔦","🕯","🪔","🧯","🛢","💰","💵","💴","💶","💷","💸",
    "💳","💎","⚖️","🪜","🧰","🪤","🔧","🪛","🔩","⚙️","🗜","🔗","⛓","🪝","🧲",
    "🔫","💣","🪃","🗡","⚔️","🛡","🪚","🔨","🪓","⛏","🪝","🪤","🔑","🗝","🔐",
    "🔒","🔓","🚪","🪑","🛋","🛏","🛁","🚿","🪠","🧴","🧷","🧹","🧺","🧻","🪣",
    "🧼","🫧","🪥","🪒","🧽","🧯","🛒","🚽","🚰","🪤","📦","📫","📪","📬","📭",
    "📮","🗳","✏️","✒️","🖊","🖋","📝","📖","📚","📓","📔","📒","📃","📄","📑",
  ],

  /* ── Travel & Places ── */
  travel: [
    "🗺","🧭","🌐","🗾","🧱","🏛","🏗","🏘","🏚","🏠","🏡","🏢","🏣","🏤","🏥",
    "🏦","🏨","🏩","🏪","🏫","🏬","🏭","🏯","🏰","💒","🗼","🗽","⛪","🕌","🛕",
    "🕍","⛩","🕋","⛲","⛺","🏕","🛖","🌁","🌃","🏙","🌄","🌅","🌆","🌇","🌉",
    "🌌","🌠","🎇","🎆","🗺","🧭","🏔","⛰","🌋","🗻","🏝","🏜","🏞","🏖","🏕",
    "🌊","🌈","🌤","⛅","🌥","☁️","🌦","🌧","⛈","🌩","❄️","🌨","🌬","💨","🌪",
    "🗿","🗺","🧱","🏛","🏰","🏯","⛩","🕌","🕍","🛕","⛪","💒","🕋","🛤","🛣",
  ],

  /* ── Celebrations & Party ── */
  celebration: [
    "🎉","🎊","🎈","🎁","🎀","🎗","🎟","🎫","🏆","🥇","🥈","🥉","🏅","🎖","🎗",
    "🎯","🎱","🪀","🎮","🕹","🎲","🧩","🪅","🎭","🎨","🖼","🎪","🎬","🎤","🎧",
    "🎼","🎵","🎶","🎷","🎸","🎹","🎺","🎻","🪗","🥁","🪘","🎙","📻","🎚","🎛",
    "🎠","🎡","🎢","🎪","🎭","🎬","🎥","🎞","📽","🎦","🎫","🎟","🎪","🃏","🀄",
    "🎴","🎰","🎳","🎯","🎮","🕹","🎲","♟","🧩","🪆","🪅","🎁","🎀","🎗","🎊",
  ],

  /* ── Symbols & Signs ── */
  symbols: [
    "❤️","🧡","💛","💚","💙","💜","🖤","🤍","🤎","💔","❣️","💕","💞","💓","💗",
    "💖","💘","💝","💟","☮️","✝️","☪️","🕉","☸️","✡️","🔯","🕎","☯️","☦️","🛐",
    "♈","♉","♊","♋","♌","♍","♎","♏","♐","♑","♒","♓","⛎","🔀","🔁","🔂",
    "▶️","⏩","⏭","⏯","◀️","⏪","⏮","🔼","⏫","🔽","⏬","⏸","⏹","⏺","🎦",
    "🔅","🔆","📶","📳","📴","📵","📴","🔇","🔈","🔉","🔊","📢","📣","📯","🔔",
    "🔕","🎵","🎶","💹","🔱","⚜️","🔰","♻️","✅","❎","🔲","🔳","⬛","⬜","◼",
  ],

  /* ── Clothes & Fashion ── */
  fashion: [
    "👒","🎩","🧢","👑","💍","💎","👗","👘","🥻","🩱","🩲","🩳","👙","👚","👛",
    "👜","👝","🎒","🧳","👓","🕶","🥽","🌂","☂️","🧵","🪡","🧶","🪢","👗","👔",
    "👕","👖","🧣","🧤","🧥","🥼","🦺","👙","👘","🥻","🩴","👞","👟","🥾","🥿",
    "👠","👡","👢","🩰","🥾","🧦","🧤","🧣","🎓","👒","🎩","⛑","💄","💋","👄",
    "🧴","💈","💅","🪮","🪥","🧹","🧺","🧻","🪣","🧼","🫧","🪒","🧽","🧯","🛒",
  ],

  /* ── Science & Tech ── */
  science: [
    "🔬","🔭","🧪","🧫","🧬","💉","🩸","🩹","🩺","🩻","🏥","🧠","🦷","🦴","👁",
    "👃","👅","👋","🦾","🦿","🦻","💊","🩺","🩹","🧪","🧫","🔭","🔬","🧬","💉",
    "🩸","⚗️","🔩","🪛","🔧","🗜","⚙️","🧰","🪤","🧲","💡","🔋","🔌","💻","🖥",
    "🖨","⌨️","🖱","💾","📡","📱","☎️","📺","📻","🎙","📷","📹","🎥","🧮","🕰",
    "🔭","⏱","⌛","⏳","📡","🛰","🚀","🌌","⚛️","🔋","💡","🔌","🧲","⚗️","🔭",
  ],

};

/* Pick N unique random items from array */
function pickRandom<T>(arr: T[], n: number): T[] {
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, n);
}

/* ── Levels — now each level randomly picks from multiple pools ── */
const LEVEL_CONFIGS = [
  { name: "Animals 🐾",     pools: ["animals"],              color: "#22C55E", from: "#22C55E", to: "#06B6D4" },
  { name: "Fruits 🍎",      pools: ["fruits","food"],        color: "#F59E0B", from: "#F59E0B", to: "#EF4444" },
  { name: "Space 🚀",       pools: ["space","science"],      color: "#6366F1", from: "#6366F1", to: "#EC4899" },
  { name: "Sports ⚽",      pools: ["sports","celebration"], color: "#EF4444", from: "#EF4444", to: "#F97316" },
  { name: "Travel 🌍",      pools: ["travel","nature"],      color: "#10B981", from: "#10B981", to: "#3B82F6" },
];

// Pick 3 random levels for each game session
function pickLevels() {
  return pickRandom(LEVEL_CONFIGS, 3).map(cfg => ({
    ...cfg,
    emojis: pickRandom(
      cfg.pools.flatMap(p => EMOJI_POOLS[p] ?? []),
      8
    ),
  }));
}

type LevelDef = ReturnType<typeof pickLevels>[number];
type Card = { id: number; emoji: string; matched: boolean; flipped: boolean };

function buildDeck(level: LevelDef): Card[] {
  return [...level.emojis, ...level.emojis]
    .sort(() => Math.random() - 0.5)
    .map((emoji, id) => ({ id, emoji, matched: false, flipped: false }));
}

/* ── Burst particles ── */
function Burst({ active }: { active: boolean }) {
  if (!active) return null;
  return (
    <div className="pointer-events-none fixed inset-0 z-50">
      {Array.from({ length: 12 }).map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 1, x: "50vw", y: "50vh", scale: 0 }}
          animate={{ opacity: 0, scale: 1.3, x: `${10 + Math.random() * 80}vw`, y: `${10 + Math.random() * 80}vh` }}
          transition={{ duration: 0.75 }}
          className="absolute text-xl select-none"
        >
          {["⭐","✨","💫","🎊","🌟","🎉","💥","🪄"][i % 8]}
        </motion.div>
      ))}
    </div>
  );
}

export default function MemoryMatch() {
  const router = useRouter();
  const [, setPlayer]     = useState("");
  const [LEVELS, setLEVELS]     = useState<LevelDef[]>([]);
  const [levelIdx, setLevelIdx] = useState(0);
  const [cards, setCards]       = useState<Card[]>([]);
  const [flipped, setFlipped]   = useState<number[]>([]);
  const [matched, setMatched]   = useState(0);
  const [moves, setMoves]       = useState(0);
  const [score, setScore]       = useState(0);
  const [time, setTime]         = useState(0);
  const [timerOn, setTimerOn]   = useState(true);
  const [won, setWon]           = useState(false);
  const [burst, setBurst]       = useState(false);
  const [levelMsg, setLevelMsg] = useState("");

  const initGame = () => {
    const levels = pickLevels();
    setLEVELS(levels);
    setLevelIdx(0);
    setCards(buildDeck(levels[0]!));
    setFlipped([]); setMatched(0); setMoves(0);
    setScore(0); setTime(0); setTimerOn(true); setWon(false);
  };

  useEffect(() => {
    const p = localStorage.getItem("kg_player") || "";
    if (!p) { router.push("/games"); return; }
    setPlayer(p);
    initGame();
  }, []);

  useEffect(() => {
    if (!timerOn || won) return;
    const t = setInterval(() => setTime(s => s + 1), 1000);
    return () => clearInterval(t);
  }, [timerOn, won]);

const flip = useCallback(
  (id: number) => {
    if (!LEVELS.length) return;

    const card = cards[id];
    if (!card || card.flipped || card.matched || flipped.length >= 2) return;

    const updated = cards.map(c =>
      c.id === id ? { ...c, flipped: true } : c
    );

    setCards(updated);

    const newFlipped = [...flipped, id];
    setFlipped(newFlipped);

    if (newFlipped.length !== 2) return;

    setMoves(m => m + 1);

    const [a, b] = newFlipped;

    if (a === undefined || b === undefined) return;

    const cardA = updated[a];
    const cardB = updated[b];

    if (!cardA || !cardB) return;

    if (cardA.emoji === cardB.emoji) {

      setTimeout(() => {

        setCards(prev =>
          prev.map(c =>
            newFlipped.includes(c.id)
              ? { ...c, matched: true }
              : c
          )
        );

        setFlipped([]);
        setBurst(true);
        setTimeout(() => setBurst(false), 800);

        const newMatched = matched + 1;
        setMatched(newMatched);

        const bonus = Math.max(30 - moves, 5);
        setScore(s => s + bonus);

        const currentLevel = LEVELS[levelIdx];
        if (!currentLevel) return;

        if (newMatched === currentLevel.emojis.length) {

          const nextLevel = levelIdx + 1;

          if (nextLevel >= LEVELS.length) {
            setTimerOn(false);
            setTimeout(() => setWon(true), 900);
            return;
          }

          const nextLevelDef = LEVELS[nextLevel];
          if (!nextLevelDef) return;

          setLevelMsg(`🎉 Level ${nextLevel + 1}: ${nextLevelDef.name}`);

          setTimeout(() => {
            setLevelMsg("");
            setLevelIdx(nextLevel);
            setCards(buildDeck(nextLevelDef));
            setMatched(0);
            setFlipped([]);
          }, 1600);
        }

      }, 600);

    } else {

      setTimeout(() => {
        setCards(prev =>
          prev.map(c =>
            newFlipped.includes(c.id)
              ? { ...c, flipped: false }
              : c
          )
        );
        setFlipped([]);
      }, 950);

    }
  },
  [cards, flipped, matched, moves, levelIdx, LEVELS]
);

  const saveExit = () => {
    const s = JSON.parse(localStorage.getItem("kg_scores") || "{}");
    s["memory-match"] = Math.max(score, s["memory-match"] ?? 0);
    localStorage.setItem("kg_scores", JSON.stringify(s));
    router.push("/games");
  };

  const fmt = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

  if (!LEVELS.length) return null;
const lv = LEVELS[levelIdx]!;

  return (
    <>
      <Head>
        <title>Memory Match 🃏</title>
        <link href="https://fonts.googleapis.com/css2?family=Baloo+2:wght@700;800;900&family=Nunito:wght@400;600;700;800&display=swap" rel="stylesheet" />
        <style>{`
          body{margin:0;background:#0d0720;}
          .font-display{font-family:'Baloo 2',cursive;}
          .font-body{font-family:'Nunito',sans-serif;}
          @keyframes orb-pulse{0%,100%{opacity:.3;transform:scale(1)}50%{opacity:.55;transform:scale(1.07)}}
          .orb{animation:orb-pulse 7s ease-in-out infinite;}
          .card-inner{position:relative;width:100%;height:100%;transform-style:preserve-3d;transition:transform .45s cubic-bezier(.4,0,.2,1);}
          .card-front,.card-back{position:absolute;inset:0;backface-visibility:hidden;display:flex;align-items:center;justify-content:center;border-radius:16px;}
          .card-front{transform:rotateY(180deg);}
          .flipped .card-inner{transform:rotateY(180deg);}
        `}</style>
      </Head>

      <Burst active={burst} />

      <div
        className="min-h-screen relative overflow-hidden flex flex-col items-center px-4 py-8"
        style={{ background: "linear-gradient(145deg,#0d0720,#130a3e,#0a1a35)", fontFamily: "'Nunito',sans-serif" }}
      >
        {/* Background orbs */}
        <div className="orb pointer-events-none fixed rounded-full" style={{ width: 450, height: 450, top: "-10%", left: "-8%", background: `radial-gradient(circle,${lv.color}22 0%,transparent 70%)` }} />
        <div className="orb pointer-events-none fixed rounded-full" style={{ width: 500, height: 500, bottom: "-12%", right: "-8%", background: `radial-gradient(circle,${lv.color}18 0%,transparent 70%)`, animationDelay: "3s" }} />
        <div className="pointer-events-none fixed inset-0 opacity-[0.025]" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,1) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,1) 1px,transparent 1px)", backgroundSize: "52px 52px" }} />

        {/* Level up banner */}
        <AnimatePresence>
          {levelMsg && (
            <motion.div
              initial={{ scale: 0.5, opacity: 0, y: -20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.8, opacity: 0 }}
              className="fixed top-8 left-1/2 -translate-x-1/2 z-50 font-display text-white font-black text-xl px-8 py-4 rounded-2xl whitespace-nowrap"
              style={{ background: `linear-gradient(135deg,${lv.from},${lv.to})`, boxShadow: `0 8px 32px ${lv.color}55` }}
            >
              {levelMsg}
            </motion.div>          )}
        </AnimatePresence>

        <div className="relative z-10 w-full max-w-md">
          {/* Top bar */}
          <div className="flex items-center justify-between mb-5">
            <Link href="/games" style={{ textDecoration: "none" }}>
              <button className="font-body text-white/35 hover:text-white/70 text-sm transition">← Back</button>
            </Link>
            <span className="font-body text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full" style={{ background: `${lv.color}22`, color: lv.color }}>{lv.name}</span>
            <div className="text-right">
              <div className="font-display font-black text-xl" style={{ color: lv.color }}>{score}</div>
              <div className="font-body text-white/30 text-xs">pts</div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-2 mb-4">
            {([["⏱", fmt(time), "Time"], ["🔄", moves, "Moves"], ["✅", `${matched}/${lv.emojis.length}`, "Pairs"]] as [string, string|number, string][]).map(([ic, val, label]) => (
              <div key={label} className="text-center py-3 rounded-2xl" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
                <div className="text-lg">{ic}</div>
                <div className="font-display text-white font-black">{val}</div>
                <div className="font-body text-white/30 text-xs">{label}</div>
              </div>
            ))}
          </div>

          {/* Level progress dots */}
          <div className="flex gap-2 mb-5">
            {LEVELS.map((l, i) => (
              <div key={i} className="flex-1 h-1.5 rounded-full transition-all duration-500" style={{
                background: i < levelIdx ? l.color : i === levelIdx ? `linear-gradient(90deg,${lv.from},${lv.to})` : "rgba(255,255,255,0.1)"
              }} />
            ))}
          </div>

          {/* Win screen */}
          <AnimatePresence>
            {won && (
              <motion.div initial={{ scale: 0.85, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                className="rounded-3xl p-8 text-center mb-5"
                style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", backdropFilter: "blur(20px)" }}>
                <div className="text-7xl mb-4">🏆</div>
                <h2 className="font-display text-white font-black mb-2" style={{ fontSize: 36 }}>You Won!</h2>
                <p className="font-body text-white/50 mb-1">Score: <span style={{ color: lv.color, fontWeight: 800 }}>{score} pts</span></p>
                <p className="font-body text-white/30 text-sm mb-6">Moves: {moves} · Time: {fmt(time)}</p>
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  <motion.button whileHover={{ scale: 1.03, y: -2 }} whileTap={{ scale: 0.97 }} onClick={saveExit}
                    className="font-display w-full py-4 rounded-2xl text-white font-black text-lg"
                    style={{ background: `linear-gradient(135deg,${lv.from},${lv.to})`, boxShadow: `0 8px 24px ${lv.color}44` }}>
                    💾 Save & Exit
                  </motion.button>
                  <button onClick={initGame}
                    className="font-body w-full py-3 rounded-2xl text-white/50 font-semibold text-sm hover:text-white/80 transition"
                    style={{ border: "1px solid rgba(255,255,255,0.15)" }}>
                    🔄 Play Again (New Sets!)
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Card grid */}
          {!won && (
            <div className="grid grid-cols-4 gap-2.5">
              {cards.map((card) => (
                <div
                  key={card.id}
                  onClick={() => flip(card.id)}
                  className={card.flipped || card.matched ? "flipped" : ""}
                  style={{ aspectRatio: "1", cursor: card.flipped || card.matched ? "default" : "pointer" }}
                >
                  <div className="card-inner">
                    {/* Back face */}
                    <div className="card-back" style={{
                      background: `linear-gradient(135deg,${lv.color}30,rgba(255,255,255,0.06))`,
                      border: `1.5px solid ${lv.color}33`,
                    }}>
                      <span style={{ fontSize: 22, opacity: 0.5 }}>❓</span>
                    </div>
                    {/* Front face */}
                    <div className="card-front" style={{
                      background: card.matched ? `${lv.color}22` : "rgba(255,255,255,0.1)",
                      border: `2px solid ${card.matched ? lv.color : "rgba(255,255,255,0.2)"}`,
                      boxShadow: card.matched ? `0 0 16px ${lv.color}44` : "none",
                    }}>
                      <span style={{ fontSize: 28 }}>{card.emoji}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Quick restart button */}
          {!won && (
            <button
              onClick={initGame}
              className="mt-5 w-full font-body text-white/25 hover:text-white/50 text-xs py-2 transition rounded-xl"
              style={{ border: "1px solid rgba(255,255,255,0.07)" }}
            >
              🔁 New Game (fresh emoji sets)
            </button>
          )}
        </div>
      </div>
    </>
  );
}