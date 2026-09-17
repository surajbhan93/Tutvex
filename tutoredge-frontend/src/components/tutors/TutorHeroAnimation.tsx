import React, { useEffect, useRef } from "react";

export const TutorHeroAnimation: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 450);

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight || 450;
    };
    window.addEventListener("resize", handleResize);

    // Light speed ray particles
    const raysCount = 45;
    const rays = Array.from({ length: raysCount }).map(() => ({
      x: Math.random() * width,
      y: Math.random() * height,
      length: Math.random() * 120 + 60,
      speed: Math.random() * 2 + 1,
      angle: Math.atan2(height / 2 - Math.random() * height, width / 2 - Math.random() * width),
      opacity: Math.random() * 0.6 + 0.2,
      width: Math.random() * 2.5 + 0.8,
      color: Math.random() > 0.5 ? "37, 99, 235" : "99, 102, 241", // Blue & Indigo
    }));

    let time = 0;

    const render = () => {
      time += 0.015;
      ctx.clearRect(0, 0, width, height);

      // Radial Vignette Glow Base
      const gradient = ctx.createRadialGradient(
        width / 2,
        height / 2,
        20,
        width / 2,
        height / 2,
        width / 1.4
      );
      gradient.addColorStop(0, "rgba(30, 27, 75, 0.45)");
      gradient.addColorStop(0.5, "rgba(15, 23, 42, 0.6)");
      gradient.addColorStop(1, "rgba(7, 10, 18, 0.95)");

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      // Light Speed Rays
      ctx.globalCompositeOperation = "screen";

      rays.forEach((ray) => {
        ray.y -= ray.speed * 0.8;
        ray.x += Math.sin(time + ray.y * 0.01) * 0.5;

        if (ray.y < -100) {
          ray.y = height + 100;
          ray.x = Math.random() * width;
        }

        const rayGrad = ctx.createLinearGradient(
          ray.x,
          ray.y,
          ray.x + Math.cos(ray.angle) * ray.length,
          ray.y + Math.sin(ray.angle) * ray.length
        );

        const alpha = (Math.sin(time * 2 + ray.x) * 0.3 + 0.7) * ray.opacity;
        rayGrad.addColorStop(0, `rgba(${ray.color}, ${alpha})`);
        rayGrad.addColorStop(0.5, `rgba(56, 189, 248, ${alpha * 0.7})`);
        rayGrad.addColorStop(1, "transparent");

        ctx.strokeStyle = rayGrad;
        ctx.lineWidth = ray.width;
        ctx.beginPath();
        ctx.moveTo(ray.x, ray.y);
        ctx.lineTo(
          ray.x + Math.cos(ray.angle) * ray.length,
          ray.y + Math.sin(ray.angle) * ray.length
        );
        ctx.stroke();
      });

      // Animated Light Speed Horizon Pulse
      const pulseY = height / 2 + Math.sin(time * 1.5) * 20;
      const horizonGrad = ctx.createLinearGradient(0, pulseY, width, pulseY);
      horizonGrad.addColorStop(0, "transparent");
      horizonGrad.addColorStop(0.3, "rgba(99, 102, 241, 0.15)");
      horizonGrad.addColorStop(0.5, "rgba(56, 189, 248, 0.35)");
      horizonGrad.addColorStop(0.7, "rgba(99, 102, 241, 0.15)");
      horizonGrad.addColorStop(1, "transparent");

      ctx.fillStyle = horizonGrad;
      ctx.fillRect(0, pulseY - 40, width, 80);

      ctx.globalCompositeOperation = "source-over";
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none z-0 opacity-80 transition-opacity duration-500"
      style={{ filter: "contrast(110%) brightness(105%)" }}
    />
  );
};

export default TutorHeroAnimation;
