import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

/* ======================
   TYPES
====================== */
interface OrbitArcProps {
  size: number;
  duration: number;
  clockwise: boolean;
  color: string;
  thickness?: number;
  delay?: number;
}

interface ParticleProps {
  x: number;
  y: number;
  delay: number;
  size: number;
  color: string;
}


type StartupLoaderProps = {
  isLoading: boolean;
};
/* ======================
   PARTICLE DOT
====================== */
function Particle({ x, y, delay, size, color }: ParticleProps) {
  return (
    <motion.div
      className="absolute rounded-full"
      style={{
        width: size,
        height: size,
        left: `calc(50% + ${x}px)`,
        top: `calc(50% + ${y}px)`,
        background: color,
        boxShadow: `0 0 ${size * 3}px ${color}`,
      }}
      initial={{ scale: 0, opacity: 0 }}
      animate={{
        scale: [0, 1.5, 0],
        opacity: [0, 1, 0],
        y: [0, -20, -40],
      }}
      transition={{
        duration: 2.5,
        delay,
        repeat: Infinity,
        ease: "easeOut",
      }}
    />
  );
}

/* ======================
   ORBIT ARC
====================== */
function OrbitArc({
  size,
  duration,
  clockwise,
  color,
  thickness = 3,
  delay = 0,
}: OrbitArcProps) {
  return (
    <motion.div
      className="absolute rounded-full"
      style={{ width: size, height: size }}
      initial={{ opacity: 0, scale: 0.6 }}
      animate={{ opacity: 1, scale: 1, rotate: clockwise ? 360 : -360 }}
      transition={{
        opacity: { duration: 0.6, delay },
        scale: { duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] },
        rotate: { repeat: Infinity, duration, ease: "linear", delay },
      }}
    >
      {/* Arc track (ghost) */}
      <div
        className="absolute inset-0 rounded-full opacity-10"
        style={{
          border: `${thickness}px solid ${color}`,
        }}
      />
      {/* Arc glow segment */}
      <div
        className="absolute inset-0 rounded-full"
        style={{
          border: `${thickness}px solid transparent`,
          borderTopColor: color,
          borderRightColor: color,
          filter: `drop-shadow(0 0 8px ${color}) drop-shadow(0 0 16px ${color}80)`,
        }}
      />
      {/* Leading dot */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: thickness * 3,
          height: thickness * 3,
          background: color,
          boxShadow: `0 0 12px ${color}, 0 0 24px ${color}`,
          top: -thickness * 1.5 + 1,
          right: size * 0.3,
        }}
      />
    </motion.div>
  );
}

/* ======================
   LOADER DOTS
====================== */
function LoadingDots() {
  return (
    <div className="flex items-center gap-1.5">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="block w-1.5 h-1.5 rounded-full bg-white/40"
          animate={{ opacity: [0.2, 1, 0.2], scale: [0.8, 1.2, 0.8] }}
          transition={{
            duration: 1.2,
            delay: i * 0.2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

/* ======================
   MAIN LOADER
====================== */
export default function StartupLoader({ isLoading }: StartupLoaderProps) {
 const [phase, setPhase] = useState<"in" | "hold" | "out">("in");
  // const [phase, setPhase] = useState<"in" | "hold" | "out">("in");
  // const [visible, setVisible] = useState(true);

  // useEffect(() => {
  //   const t1 = setTimeout(() => setPhase("hold"), 200);
  //   const t2 = setTimeout(() => setPhase("out"),600);
  //   const t3 = setTimeout(() => setVisible(false), 900);
  //   return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  // }, []);


 useEffect(() => {
    if (isLoading) {
      setPhase("in");
    } else {
      setPhase("out");
    }
  }, [isLoading]);

  if (!isLoading) return null;

  const PARTICLES = [
    { x: -90, y: -60, delay: 0.4, size: 4, color: "#f472b6" },
    { x: 100, y: -70, delay: 0.8, size: 3, color: "#818cf8" },
    { x: -110, y: 40, delay: 1.2, size: 5, color: "#34d399" },
    { x: 85, y: 55, delay: 0.6, size: 3, color: "#fb923c" },
    { x: -30, y: -110, delay: 1.0, size: 4, color: "#a78bfa" },
    { x: 40, y: 100, delay: 1.5, size: 3, color: "#38bdf8" },
    { x: 120, y: 10, delay: 0.3, size: 4, color: "#f472b6" },
    { x: -120, y: -10, delay: 1.8, size: 3, color: "#4ade80" },
  ];

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          key="loader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.04 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-hidden select-none"
          style={{ background: "#0a0a0f" }}
          aria-label="Loading Tutvex"
          role="status"
          aria-live="polite"
        >

          {/* ── NOISE TEXTURE OVERLAY ── */}
          <div
            className="absolute inset-0 opacity-[0.03] pointer-events-none"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
              backgroundSize: "128px 128px",
            }}
            aria-hidden="true"
          />

          {/* ── AMBIENT BG GLOW ── */}
          <div aria-hidden="true">
            <motion.div
              className="absolute rounded-full"
              style={{
                width: 600,
                height: 600,
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                background: "radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 65%)",
              }}
              animate={{ scale: [1, 1.15, 1], opacity: [0.6, 1, 0.6] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
              className="absolute rounded-full"
              style={{
                width: 300,
                height: 300,
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                background: "radial-gradient(circle, rgba(236,72,153,0.08) 0%, transparent 70%)",
              }}
              animate={{ scale: [1.1, 1, 1.1], opacity: [0.4, 0.8, 0.4] }}
              transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
            />
          </div>

          {/* ── ORBIT STAGE ── */}
          <div className="relative flex items-center justify-center" style={{ width: 320, height: 320 }}>

            {/* Particles */}
            {PARTICLES.map((p, i) => (
              <Particle key={i} {...p} />
            ))}

            {/* Arcs — staggered entry */}
            <OrbitArc size={290} duration={4.2} clockwise color="#f472b6" thickness={2.5} delay={0} />
            <OrbitArc size={240} duration={3.4} clockwise={false} color="#818cf8" thickness={3} delay={0.15} />
            <OrbitArc size={192} duration={2.6} clockwise color="#34d399" thickness={2.5} delay={0.3} />

            {/* Inner rotating ring */}
            <motion.div
              className="absolute rounded-full"
              style={{
                width: 148,
                height: 148,
                border: "1px dashed rgba(255,255,255,0.08)",
              }}
              animate={{ rotate: -360 }}
              transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
            />

            {/* ── CENTER BRAND ── */}
            <div className="relative z-10 flex flex-col items-center justify-center">

              {/* Logo ring */}
              <motion.div
                className="mb-2 relative flex items-center justify-center"
                initial={{ scale: 0, rotate: -30 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
              >
                {/* Outer ring pulse */}
                <motion.div
                  className="absolute rounded-full"
                  style={{
                    width: 72,
                    height: 72,
                    border: "1.5px solid rgba(129,140,248,0.4)",
                  }}
                  animate={{ scale: [1, 1.18, 1], opacity: [1, 0, 1] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                />

                {/* Logo hex badge */}
                <div
                  className="flex items-center justify-center rounded-2xl"
                  style={{
                    width: 56,
                    height: 56,
                    background: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 50%, #ec4899 100%)",
                    boxShadow: "0 0 32px rgba(99,102,241,0.6), 0 0 60px rgba(99,102,241,0.2), inset 0 1px 0 rgba(255,255,255,0.2)",
                  }}
                >
                  <span
                    className="text-white font-black text-xl"
                    style={{ fontFamily: "'Sora', sans-serif", letterSpacing: "-0.04em" }}
                  >
                    T
                  </span>
                </div>
              </motion.div>

              {/* Brand wordmark */}
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.55, ease: [0.22, 1, 0.36, 1] }}
                className="flex items-baseline gap-0.5"
              >
                <span
                  className="text-white font-black text-3xl tracking-tight"
                  style={{ fontFamily: "'Sora', sans-serif", letterSpacing: "-0.04em" }}
                >
                  Tutvex
                </span>
              </motion.div>

              {/* Tagline */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.85 }}
                className="mt-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-white/30"
              >
                Find · Learn · Excel
              </motion.p>
            </div>
          </div>

          {/* ── BOTTOM STATUS ── */}
          <motion.div
            className="mt-10 flex flex-col items-center gap-3"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.6 }}
          >
            {/* Progress bar */}
            <div className="w-40 h-px rounded-full overflow-hidden bg-white/10">
              <motion.div
                className="h-full rounded-full"
                style={{
                  background: "linear-gradient(90deg, #6366f1, #ec4899, #34d399)",
                }}
                initial={{ width: "0%" }}
                animate={{ width: phase === "in" ? "30%" : phase === "hold" ? "85%" : "100%" }}
                transition={{ duration: phase === "in" ? 0.7 : phase === "hold" ? 1.8 : 0.5, ease: "easeInOut" }}
              />
            </div>

            {/* Dots */}
            <LoadingDots />
          </motion.div>

          {/* Font already loaded via system fonts - no need for Google Font */}
        </motion.div>
      )}
    </AnimatePresence>
  );
}