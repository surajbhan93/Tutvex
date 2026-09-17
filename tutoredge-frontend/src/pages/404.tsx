import { motion } from "framer-motion";
import { useEffect } from "react";
import { useRouter } from "next/router";

export default function Custom404() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace("/");
    }, 5000);
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#1c1c1c] overflow-hidden">
      {/* ORBIT CONTAINER */}
      <div className="relative w-80 h-80 flex items-center justify-center">

        {/* 🌈 PULSE GLOW BEHIND BRAND */}
        <motion.div
          animate={{ scale: [1, 1.25, 1], opacity: [0.3, 0.7, 0.3] }}
          transition={{ repeat: Infinity, duration: 2.5 }}
          className="absolute w-44 h-44 bg-indigo-500/30 rounded-full blur-3xl"
        />

        {/* 🔴 GRADIENT ARC – CLOCKWISE */}
        <OrbitArc
          size={280}
          duration={3}
          clockwise
          gradient="from-red-400 via-pink-500 to-orange-400"
        />

        {/* 🔵 GRADIENT ARC – ANTI CLOCKWISE */}
        <OrbitArc
          size={230}
          duration={3.6}
          clockwise={false}
          gradient="from-sky-400 via-cyan-400 to-indigo-400"
        />

        {/* 🟣 GRADIENT ARC – CLOCKWISE */}
        <OrbitArc
          size={185}
          duration={2.4}
          clockwise
          gradient="from-purple-400 via-fuchsia-500 to-pink-400"
        />

        {/* 🌟 CENTER BRAND */}
        <motion.div
          initial={{ scale: 1.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="relative z-10 text-white text-4xl md:text-5xl font-extrabold tracking-widest"
        >
          Tutvex
        </motion.div>
      </div>
    </div>
  );
}

/* ======================
   ORBIT ARC (GRADIENT + DIRECTION)
====================== */
function OrbitArc({
  size,
  duration,
  clockwise,
  gradient,
}: {
  size: number;
  duration: number;
  clockwise: boolean;
  gradient: string;
}) {
  return (
    <motion.div
      className="absolute rounded-full"
      style={{
        width: size,
        height: size,
        borderWidth: "4px",
        borderStyle: "solid",
        borderColor: "transparent",
        borderRadius: "50%",
        maskImage:
          "linear-gradient(to right, transparent 0%, black 25%, black 75%, transparent 100%)",
        WebkitMaskImage:
          "linear-gradient(to right, transparent 0%, black 25%, black 75%, transparent 100%)",
      }}
      animate={{ rotate: clockwise ? 360 : -360 }}
      transition={{
        repeat: Infinity,
        ease: "linear",
        duration,
      }}
    >
      <div
        className={`absolute inset-0 rounded-full bg-gradient-to-r ${gradient}`}
        style={{ filter: "blur(0.5px)" }}
      />
    </motion.div>
  );
}
