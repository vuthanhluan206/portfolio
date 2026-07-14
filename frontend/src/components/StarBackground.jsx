import { useEffect, useRef } from 'react';

export default function StarBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;
    let stars = [];

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      ctx.resetTransform();
      ctx.scale(dpr, dpr);
    };

    resize();
    window.addEventListener('resize', resize);

    // Initialize stars (fewer on mobile for better scroll performance)
    const isMobile = window.innerWidth < 768;
    const STAR_COUNT = isMobile ? 60 : 160;
    for (let i = 0; i < STAR_COUNT; i++) {
      stars.push({
        x: Math.random() * 1920,
        y: Math.random() * 1080,
        r: 0.6 + Math.random() * 1.5,
        phase: Math.random() * Math.PI * 2,
        speed: 0.03 + Math.random() * 0.04
      });
    }

    let lastScrollY = window.scrollY;

    const draw = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      ctx.clearRect(0, 0, width, height);

      const isLight = document.body.classList.contains('light-theme');

      // Twinkling stars drawing
      ctx.save();
      if (!isLight) {
        ctx.shadowBlur = 4;
        ctx.shadowColor = 'rgba(0, 217, 255, 0.4)';
      }

      const time = Date.now() * 0.001;
      const scrollY = window.scrollY;

      stars.forEach(star => {
        // Slow vertical drift
        star.y -= 0.03;
        if (star.y < 0) star.y = 1080;

        // Map virtual coordinates (1920x1080) to screen size
        const sx = (star.x / 1920) * width;
        
        // Add parallax scroll effect
        const rawY = (star.y / 1080) * height;
        const sy = (rawY - scrollY * 0.12 + height * 10) % height;

        const alpha = isLight
          ? 0.1 + 0.18 * Math.sin(time * 1.5 + star.phase)
          : 0.35 + 0.45 * Math.sin(time * 2.2 + star.phase);

        ctx.fillStyle = isLight
          ? `rgba(79, 70, 229, ${alpha})`
          : `rgba(255, 255, 255, ${alpha})`;

        ctx.beginPath();
        ctx.arc(sx, sy, star.r, 0, Math.PI * 2);
        ctx.fill();
      });

      ctx.restore();
      lastScrollY = scrollY;
      animId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        inset: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: 0,
      }}
    />
  );
}
