"use client";

import { motion, Variants } from "framer-motion";
import Image from "next/image";
import React from "react";

const stepsData = [
  {
    id: 1,
    img: "/images/how-it-works/demo.svg",
    title: "1 to 3 Tutors give a demo session to your child",
    accent: "#FF6B9D",
    accentLight: "rgba(255,107,157,0.12)",
    accentBorder: "rgba(255,107,157,0.25)",
    label: "Demo",
    emoji: "🎓",
  },
  {
    id: 2,
    img: "/images/how-it-works/selection.svg",
    title: "Parents select the best tutor based on demo",
    accent: "#F59E0B",
    accentLight: "rgba(245,158,11,0.12)",
    accentBorder: "rgba(245,158,11,0.25)",
    label: "Selection",
    emoji: "✅",
  },
  {
    id: 3,
    img: "/images/how-it-works/test.svg",
    title: "Tutor conducts monthly test series on our platform",
    accent: "#3B82F6",
    accentLight: "rgba(59,130,246,0.12)",
    accentBorder: "rgba(59,130,246,0.25)",
    label: "Testing",
    emoji: "📝",
  },
  {
    id: 4,
    img: "/images/how-it-works/analytics.svg",
    title: "Student's scorecard displayed on dashboard",
    accent: "#10B981",
    accentLight: "rgba(16,185,129,0.12)",
    accentBorder: "rgba(16,185,129,0.25)",
    label: "Analytics",
    emoji: "📊",
  },
];

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 60, scale: 0.95 },
  visible: (i: number) => ({
    opacity: 1, y: 0, scale: 1,
    transition: { delay: i * 0.15, duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  }),
};

const HowItWorks = () => {
  return (
 <section
  id="how-it-works"
  style={{
    position: "relative",
    left: "50%",
    right: "50%",
    marginLeft: "-50vw",
    marginRight: "-50vw",
    width: "100vw",
    overflow: "hidden",
    background:
      "linear-gradient(160deg, #0f0c29 0%, #1e1456 45%, #0d1b3e 100%)",
    padding: "100px 0 120px",
    fontFamily: "'Sora', 'Nunito', sans-serif",
  }}
>
      <style>{`
     
        @keyframes pulse-orb {
          0%, 100% { opacity: 0.35; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(1.08); }
        }
          .steps-grid {
  grid-template-columns: repeat(4, 1fr);
}

@media (max-width: 1024px) {
  .steps-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 640px) {
  .steps-grid {
    grid-template-columns: 1fr;
  }
}
        @keyframes dash-move {
          to { stroke-dashoffset: -40; }
        }
        .step-card:hover .step-img-wrap {
          transform: scale(1.08) translateY(-4px);
        }
        .step-img-wrap {
          transition: transform 0.4s cubic-bezier(0.22, 1, 0.36, 1);
        }
      `}</style>

      {/* Background orbs */}
      <div style={{ position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none" }}>
        <div style={{ position: "absolute", top: "-15%", left: "-10%", width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle, rgba(139,92,246,0.2) 0%, transparent 70%)", animation: "pulse-orb 7s ease-in-out infinite" }} />
        <div style={{ position: "absolute", bottom: "-10%", right: "-8%", width: 600, height: 600, borderRadius: "50%", background: "radial-gradient(circle, rgba(59,130,246,0.15) 0%, transparent 70%)", animation: "pulse-orb 9s ease-in-out infinite 2s" }} />
        <div style={{ position: "absolute", top: "50%", left: "50%", width: 400, height: 400, borderRadius: "50%", transform: "translate(-50%,-50%)", background: "radial-gradient(circle, rgba(255,107,157,0.1) 0%, transparent 70%)", animation: "pulse-orb 6s ease-in-out infinite 1s" }} />
        {/* Grid */}
        <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)", backgroundSize: "60px 60px" }} />
      </div>

      <div style={{ position: "relative", zIndex: 1, maxWidth: 1200, margin: "0 auto" }}>

        {/* ── Heading ── */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.65 }}
          style={{ textAlign: "center", marginBottom: 80 }}
        >
          <span style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            background: "linear-gradient(135deg, rgba(139,92,246,0.15), rgba(59,130,246,0.15))",
            border: "1px solid rgba(139,92,246,0.3)",
            borderRadius: 50, padding: "6px 20px",
            fontSize: 11, fontWeight: 700, color: "#a78bfa",
            letterSpacing: 2, textTransform: "uppercase", marginBottom: 20,
          }}>
            ✦ Our Process
          </span>

          <h2 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "clamp(32px, 4.5vw, 52px)",
            fontWeight: 800, color: "#fff",
            margin: "0 0 16px", lineHeight: 1.2, letterSpacing: "-0.5px",
          }}>
            How{" "}
            <span style={{
              background: "linear-gradient(135deg, #a78bfa, #60a5fa)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
            }}>
              Tutvex Works
            </span>
          </h2>

          <p style={{ fontSize: 16, color: "rgba(255,255,255,0.5)", maxWidth: 500, margin: "0 auto", lineHeight: 1.8, fontWeight: 400 }}>
            A simple, transparent and result-driven learning journey — from demo sessions to performance tracking.
          </p>
        </motion.div>

        {/* ── Steps ── */}
        <div style={{ position: "relative" }}>

          {/* Connector line — Desktop */}
          <div style={{
            position: "absolute", top: 72, left: "8%", right: "8%", height: 2,
            background: "linear-gradient(90deg, #FF6B9D44, #F59E0B44, #3B82F644, #10B98144)",
            display: "none",
            zIndex: 0,
          }} className="desktop-line" />
          <style>{`@media(min-width:768px){ .desktop-line{ display:block !important; } }`}</style>

          <div
  className="steps-grid"
  style={{
    display: "grid",
    gap: 28,
    position: "relative",
    zIndex: 1,
  }}
>
            {stepsData.map((step, index) => (
              <motion.div
                key={step.id}
                custom={index}
                variants={cardVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-80px" }}
                className="step-card"
                style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}
              >
                {/* Step number bubble */}
                <div style={{
                  position: "relative", zIndex: 2,
                  width: 52, height: 52, borderRadius: "50%",
                  background: `linear-gradient(135deg, ${step.accent}, ${step.accent}bb)`,
                  boxShadow: `0 0 0 6px ${step.accentLight}, 0 8px 24px ${step.accent}55`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontFamily: "'Sora', sans-serif", fontSize: 18, fontWeight: 800, color: "#fff",
                  marginBottom: 20,
                }}>
                  {step.id}
                </div>

                {/* Card */}
                <div style={{
                  width: "100%",
                  background: "linear-gradient(145deg, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0.03) 100%)",
                  border: `1px solid ${step.accentBorder}`,
                  borderRadius: 28,
                  padding: "32px 24px",
                  backdropFilter: "blur(16px)",
                  WebkitBackdropFilter: "blur(16px)",
                  transition: "all 0.35s cubic-bezier(0.22, 1, 0.36, 1)",
                  position: "relative",
                  overflow: "hidden",
                }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLElement).style.transform = "translateY(-8px)";
                    (e.currentTarget as HTMLElement).style.boxShadow = `0 24px 56px rgba(0,0,0,0.4), 0 0 0 1px ${step.accent}44`;
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLElement).style.transform = "none";
                    (e.currentTarget as HTMLElement).style.boxShadow = "none";
                  }}
                >
                  {/* Inner glow */}
                  <div style={{
                    position: "absolute", top: 0, left: 0,
                    width: 160, height: 160,
                    background: `radial-gradient(circle, ${step.accent}18 0%, transparent 70%)`,
                    borderRadius: "50%", transform: "translate(-30%, -30%)",
                    pointerEvents: "none",
                  }} />

                  {/* Label badge */}
                  <div style={{
                    display: "inline-flex", alignItems: "center", gap: 5,
                    background: step.accentLight,
                    border: `1px solid ${step.accentBorder}`,
                    borderRadius: 50, padding: "3px 12px",
                    fontSize: 10, fontWeight: 700,
                    color: step.accent, letterSpacing: 1.2,
                    textTransform: "uppercase", marginBottom: 20,
                  }}>
                    {step.label}
                  </div>

                  {/* Image */}
                  <div className="step-img-wrap" style={{
                    display: "flex", justifyContent: "center", marginBottom: 22,
                  }}>
                    <div style={{
                      width: 88, height: 88, borderRadius: 22,
                      background: "rgba(255,255,255,0.06)",
                      border: "1px solid rgba(255,255,255,0.1)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      boxShadow: `0 8px 24px ${step.accent}22`,
                    }}>
                      <Image
                        src={step.img}
                        alt={`Step ${step.id} - ${step.title}`}
                        width={56}
                        height={56}
                        className="object-contain"
                        style={{ filter: "brightness(1.1)" }}
                      />
                    </div>
                  </div>

                  {/* Divider */}
                  <div style={{
                    height: 1, marginBottom: 16,
                    background: `linear-gradient(90deg, ${step.accent}33, transparent)`,
                  }} />

                  {/* Title */}
                  <p style={{
                    fontSize: 14, fontWeight: 600,
                    color: "rgba(255,255,255,0.85)",
                    lineHeight: 1.7, margin: 0,
                    fontFamily: "'Sora', sans-serif",
                  }}>
                    {step.title}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Bottom note */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
          style={{
            textAlign: "center", marginTop: 64,
            fontSize: 13, color: "rgba(255,255,255,0.25)",
            fontWeight: 400, letterSpacing: 0.5,
          }}
        >
          ✦ Trusted by 5000+ families · Transparent process · Result driven
        </motion.p>
      </div>
    </section>
  );
};

export default HowItWorks;