import { useEffect, useRef, useState } from 'react';

const TYPEWRITER_TEXTS = ['Java Backend Developer', 'Spring Boot Enthusiast', 'Fullstack Learner 🚀', 'Coffee Lover ☕'];

export default function Hero({ user }) {
  const [typeText, setTypeText] = useState('');
  const [textIdx, setTextIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [deleting, setDeleting] = useState(false);
  const particleCanvasRef = useRef(null);
  const robotCanvasRef = useRef(null);

  // Typewriter effect
  useEffect(() => {
    const current = TYPEWRITER_TEXTS[textIdx];
    const delay = deleting ? 50 : 100;
    const timer = setTimeout(() => {
      if (!deleting) {
        if (charIdx < current.length) {
          setTypeText(current.slice(0, charIdx + 1));
          setCharIdx(c => c + 1);
        } else {
          setTimeout(() => setDeleting(true), 2000);
        }
      } else {
        if (charIdx > 0) {
          setTypeText(current.slice(0, charIdx - 1));
          setCharIdx(c => c - 1);
        } else {
          setDeleting(false);
          setTextIdx(i => (i + 1) % TYPEWRITER_TEXTS.length);
        }
      }
    }, delay);
    return () => clearTimeout(timer);
  }, [charIdx, deleting, textIdx]);

  // Particle canvas
  useEffect(() => {
    const canvas = particleCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let particles = [];
    let animId;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();

    const PARTICLE_COUNT = 70;
    const CONNECT_DIST = 120;

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 1.4 + 0.4,
        dx: (Math.random() - 0.5) * 0.22,
        dy: (Math.random() - 0.5) * 0.22,
        o: Math.random() * 0.5 + 0.15,
        hue: Math.random() > 0.5 ? 252 : 192  // violet or cyan
      });
    }

    // Mouse repel
    let mx = -9999, my = -9999;
    const onMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mx = e.clientX - rect.left;
      my = e.clientY - rect.top;
    };
    const onMouseLeave = () => { mx = -9999; my = -9999; };

    canvas.parentElement.addEventListener('mousemove', onMouseMove);
    canvas.parentElement.addEventListener('mouseleave', onMouseLeave);

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw connection lines
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < CONNECT_DIST) {
            const alpha = (1 - dist / CONNECT_DIST) * 0.18;
            const grad = ctx.createLinearGradient(particles[i].x, particles[i].y, particles[j].x, particles[j].y);
            grad.addColorStop(0, `hsla(${particles[i].hue}, 80%, 65%, ${alpha})`);
            grad.addColorStop(1, `hsla(${particles[j].hue}, 80%, 65%, ${alpha})`);
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = grad;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }

      // Draw particles
      particles.forEach(p => {
        const dxm = p.x - mx;
        const dym = p.y - my;
        const dm = Math.sqrt(dxm * dxm + dym * dym);
        if (dm < 80) {
          p.x += (dxm / dm) * 1.2;
          p.y += (dym / dm) * 1.2;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue}, 80%, 75%, ${p.o})`;
        ctx.fill();

        p.x += p.dx;
        p.y += p.dy;
        if (p.x < 0 || p.x > canvas.width) p.dx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.dy *= -1;
      });

      animId = requestAnimationFrame(draw);
    };
    draw();

    window.addEventListener('resize', resize);
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
      if (canvas.parentElement) {
        canvas.parentElement.removeEventListener('mousemove', onMouseMove);
        canvas.parentElement.removeEventListener('mouseleave', onMouseLeave);
      }
    };
  }, []);

  // Robot / Interactive Card Canvas
  useEffect(() => {
    const canvas = robotCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;

    // Load SVG Icons
    const githubIcon = new Image();
    githubIcon.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="%23ffffff" viewBox="0 0 16 16"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z"/></svg>';

    const fbIcon = new Image();
    fbIcon.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="%23ffffff" viewBox="0 0 16 16"><path d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951z"/></svg>';

    const tiktokIcon = new Image();
    tiktokIcon.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="%23ffffff" viewBox="0 0 16 16"><path d="M9 0h1.98c.144.715.54 1.617 1.235 2.512C12.895 3.38 13.94 4 15 4v1.98c-1.44 0-2.512-.676-3.235-1.512C11.105 3.82 10.5 3 10.5 3v8.5a4.5 4.5 0 1 1-9-0c0-1.82 1.09-3.39 2.66-4.11V9.43A2.5 2.5 0 1 0 6 11.5V0h3z"/></svg>';

    // Load User Photo
    const photoImg = new Image();
    let isPhotoLoaded = false;

    // Chỉ dùng avatar nếu user.avatar không trống
    const avatarSrc = user?.avatar && user.avatar.trim() !== ''
      ? user.avatar + (user.avatar.includes('?') ? '&' : '?') + 't=' + Date.now()
      : null;

    if (avatarSrc) {
      photoImg.src = avatarSrc;
      photoImg.onload = () => {
        isPhotoLoaded = true;
      };
      photoImg.onerror = () => {
        // Nếu load ảnh lỗi, không hiển thị và chuyển sang vẽ silhouette placeholder
        isPhotoLoaded = false;
      };
    } else {
      isPhotoLoaded = false;
    }

    // Card Dimensions
    const cardWidth = 280;
    const cardHeight = 420;

    let canvasWidth = window.innerWidth;
    let canvasHeight = window.innerHeight;
    const isMobile = () => window.innerWidth <= 767;

    let cardX = isMobile() ? canvasWidth * 0.5 : canvasWidth * 0.73;
    let cardY = isMobile() ? 130 : 150;
    let prevCardX = cardX;
    let prevCardY = cardY;
    let vx = 0;
    let vy = 0;
    let cardAngle = 0;

    let isDragging = false;
    let dragOffsetX = 0;
    let dragOffsetY = 0;
    let realMouseX = canvasWidth * 0.73;
    let realMouseY = 300;

    let anchorX = isMobile() ? canvasWidth * 0.5 : canvasWidth * 0.73;
    let anchorY = 0;

    const buttons = [
      { name: 'github', icon: githubIcon, x: -60, y: 186, r: 18, link: user?.github || 'https://github.com/vuthanhluan206', color: 'rgba(36, 41, 46, 0.9)', hoverColor: 'rgba(108, 99, 255, 0.95)' },
      { name: 'facebook', icon: fbIcon, x: 0, y: 186, r: 18, link: user?.facebook || 'https://www.facebook.com/vuthanh.luan.52493', color: 'rgba(24, 119, 242, 0.9)', hoverColor: 'rgba(0, 217, 255, 0.95)' },
      { name: 'tiktok', icon: tiktokIcon, x: 60, y: 186, r: 18, link: user?.tiktok || 'https://www.tiktok.com/@_thahh.laun_', color: 'rgba(1, 1, 1, 0.9)', hoverColor: 'rgba(255, 0, 80, 0.95)' }
    ];

    let hoveredButton = null;
    const heroEl = document.getElementById('home');

    // Resize
    const resizeRobotCanvas = () => {
      const dpr = window.devicePixelRatio || 1;
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const mobile = vw <= 767;

      const rl = mobile ? vh * 0.10 : vh * 0.29;
      const restCardY = rl + cardHeight / 2 + 10;
      const cardZoneH = Math.ceil(restCardY + cardHeight / 2 + 40);

      canvasWidth = vw;
      canvasHeight = mobile ? cardZoneH : vh;

      canvas.width = canvasWidth * dpr;
      canvas.height = canvasHeight * dpr;
      canvas.style.height = canvasHeight + 'px';

      ctx.resetTransform();
      ctx.scale(dpr, dpr);

      anchorX = mobile ? vw * 0.5 : vw * 0.73;
      anchorY = 0;

      cardX = anchorX;
      cardY = restCardY;
      vx = 0; vy = 0;

      if (heroEl) {
        if (mobile) {
          heroEl.style.paddingTop = cardZoneH + 'px';
        } else {
          heroEl.style.paddingTop = '';
        }
      }
    };
    resizeRobotCanvas();
    window.addEventListener('resize', resizeRobotCanvas);

    // Mouse events
    const onMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;

      const dx = mx - cardX;
      const dy = my - cardY;
      const cos = Math.cos(-cardAngle);
      const sin = Math.sin(-cardAngle);
      const scaleFactor = isMobile() ? 0.65 : 1.0;
      const localX = (dx * cos - dy * sin) / scaleFactor;
      const localY = (dx * sin + dy * cos) / scaleFactor;

      const insideCard = (Math.abs(localX) < cardWidth / 2 && Math.abs(localY) < cardHeight / 2);

      hoveredButton = null;
      if (insideCard) {
        buttons.forEach(btn => {
          const dist = Math.sqrt((localX - btn.x) * (localX - btn.x) + (localY - btn.y) * (localY - btn.y));
          if (dist < btn.r) hoveredButton = btn;
        });
      }

      if (isDragging || insideCard) {
        canvas.style.pointerEvents = 'auto';
        canvas.style.cursor = isDragging ? 'grabbing' : (hoveredButton ? 'pointer' : 'grab');
      } else {
        canvas.style.pointerEvents = 'none';
        canvas.style.cursor = 'none';
      }

      if (!isNaN(mx) && isFinite(mx) && !isNaN(my) && isFinite(my)) {
        realMouseX = mx;
        realMouseY = my;

        if (isDragging) {
          cardX = realMouseX - dragOffsetX;
          cardY = realMouseY - dragOffsetY;
          cardX = Math.max(cardWidth / 2, Math.min(canvasWidth - cardWidth / 2, cardX));
          cardY = Math.max(cardHeight / 2, Math.min(canvasHeight - cardHeight / 2, cardY));
        }
      }
    };

    const onMouseDown = (e) => {
      const rect = canvas.getBoundingClientRect();
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;

      const dx = mx - cardX;
      const dy = my - cardY;

      const cos = Math.cos(-cardAngle);
      const sin = Math.sin(-cardAngle);
      const scaleFactor = isMobile() ? 0.65 : 1.0;
      const localX = (dx * cos - dy * sin) / scaleFactor;
      const localY = (dx * sin + dy * cos) / scaleFactor;

      if (Math.abs(localX) < cardWidth / 2 && Math.abs(localY) < cardHeight / 2) {
        let clickedBtn = null;
        buttons.forEach(btn => {
          const dist = Math.sqrt((localX - btn.x) * (localX - btn.x) + (localY - btn.y) * (localY - btn.y));
          if (dist < btn.r) clickedBtn = btn;
        });

        if (clickedBtn) return;

        isDragging = true;
        dragOffsetX = dx;
        dragOffsetY = dy;
        prevCardX = cardX;
        prevCardY = cardY;
      }
    };

    const onClick = (e) => {
      const rect = canvas.getBoundingClientRect();
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;

      const dx = mx - cardX;
      const dy = my - cardY;

      const cos = Math.cos(-cardAngle);
      const sin = Math.sin(-cardAngle);
      const scaleFactor = isMobile() ? 0.65 : 1.0;
      const localX = (dx * cos - dy * sin) / scaleFactor;
      const localY = (dx * sin + dy * cos) / scaleFactor;

      if (Math.abs(localX) < cardWidth / 2 && Math.abs(localY) < cardHeight / 2) {
        buttons.forEach(btn => {
          const dist = Math.sqrt((localX - btn.x) * (localX - btn.x) + (localY - btn.y) * (localY - btn.y));
          if (dist < btn.r) {
            window.open(btn.link, '_blank');
          }
        });
      }
    };

    const onMouseUp = () => { isDragging = false; };

    // Touch events for mobile
    const onTouchStart = (e) => {
      const touch = e.touches[0];
      const mx = touch.clientX;
      const my = touch.clientY;

      const dx = mx - cardX;
      const dy = my - cardY;
      const cos = Math.cos(-cardAngle);
      const sin = Math.sin(-cardAngle);
      const scaleFactor = isMobile() ? 0.65 : 1.0;
      const localX = (dx * cos - dy * sin) / scaleFactor;
      const localY = (dx * sin + dy * cos) / scaleFactor;

      if (Math.abs(localX) < cardWidth / 2 && Math.abs(localY) < cardHeight / 2) {
        e.preventDefault();
        isDragging = true;
        dragOffsetX = dx;
        dragOffsetY = dy;
        prevCardX = cardX;
        prevCardY = cardY;
      }
    };

    const onTouchMove = (e) => {
      if (!isDragging) return;
      e.preventDefault();
      const touch = e.touches[0];
      const mx = touch.clientX;
      const my = touch.clientY;

      prevCardX = cardX;
      prevCardY = cardY;
      cardX = mx - dragOffsetX;
      cardY = my - dragOffsetY;
      cardX = Math.max(cardWidth / 2, Math.min(canvasWidth - cardWidth / 2, cardX));
      cardY = Math.max(cardHeight / 2, Math.min(canvasHeight - cardHeight / 2, cardY));

      vx = cardX - prevCardX;
      vy = cardY - prevCardY;
    };

    const onTouchEnd = () => { isDragging = false; };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    canvas.addEventListener('mousedown', onMouseDown);
    canvas.addEventListener('click', onClick);
    window.addEventListener('mouseup', onMouseUp);

    canvas.addEventListener('touchstart', onTouchStart, { passive: false });
    window.addEventListener('touchmove', onTouchMove, { passive: false });
    window.addEventListener('touchend', onTouchEnd);

    // 9D Physics state
    let S = { rx: 0, ry: 0, rz: 0, sx: 1, sy: 1, tz: 0, w: 0, tau: 0, chroma: 0 };


    const FISH_LIST = [
      { name: 'Java', h: 22, s: 100, l: 60, orbit: 240, speed: 0.007, tilt: 0.50, phase: 0.0, angle: 0.0, group: 'backend', logoUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg' },
      { name: 'Spring Boot', h: 120, s: 75, l: 55, orbit: 246, speed: -0.006, tilt: 0.38, phase: 1.1, angle: 1.1, group: 'backend', logoUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/spring/spring-original.svg' },
      { name: 'JavaScript', h: 53, s: 93, l: 54, orbit: 252, speed: 0.009, tilt: 0.65, phase: 2.3, angle: 2.3, group: 'frontend-js', logoUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg' },
      { name: 'React', h: 193, s: 95, l: 68, orbit: 258, speed: -0.008, tilt: 0.30, phase: 3.1, angle: 3.1, group: 'learning', logoUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg' },
      { name: 'TypeScript', h: 204, s: 80, l: 58, orbit: 264, speed: 0.0055, tilt: 0.55, phase: 0.7, angle: 0.7, group: 'learning', logoUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg' },
      { name: 'C++', h: 220, s: 85, l: 57, orbit: 270, speed: -0.007, tilt: 0.42, phase: 1.8, angle: 1.8, group: 'systems', logoUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cplusplus/cplusplus-original.svg' },
      { name: 'Docker', h: 200, s: 80, l: 55, orbit: 276, speed: 0.008, tilt: 0.48, phase: 2.9, angle: 2.9, group: 'tools', logoUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg' },
      { name: 'MySQL', h: 195, s: 78, l: 52, orbit: 282, speed: -0.0065, tilt: 0.62, phase: 4.0, angle: 4.0, group: 'database', logoUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg' },
    ];

    FISH_LIST.forEach(fish => {
      fish.img = new Image();
      fish.img.src = fish.logoUrl;
      fish.isLoaded = false;
      fish.img.onload = () => { fish.isLoaded = true; };
    });

    const hueShift = (baseHue, shift) => (baseHue + shift + 360) % 360;

    const drawGrid = (c, state) => {
      c.save();
      c.strokeStyle = 'rgba(40, 80, 160, 0.04)';
      c.lineWidth = 1;
      const spacing = 60;
      for (let gx = 0; gx < canvasWidth; gx += spacing) {
        c.beginPath(); c.moveTo(gx, 0); c.lineTo(gx, canvasHeight); c.stroke();
      }
      for (let gy = 0; gy < canvasHeight; gy += spacing) {
        c.beginPath(); c.moveTo(0, gy); c.lineTo(canvasWidth, gy); c.stroke();
      }
      c.strokeStyle = 'rgba(60, 120, 255, 0.02)';
      c.lineWidth = 0.8;
      const points = [
        { x: 0, y: 0 }, { x: canvasWidth * 0.5, y: 0 }, { x: canvasWidth, y: 0 },
        { x: canvasWidth, y: canvasHeight * 0.5 }, { x: canvasWidth, y: canvasHeight },
        { x: canvasWidth * 0.5, y: canvasHeight }, { x: 0, y: canvasHeight },
        { x: 0, y: canvasHeight * 0.5 }
      ];
      points.forEach(pt => {
        c.beginPath(); c.moveTo(cardX, cardY); c.lineTo(pt.x, pt.y); c.stroke();
      });
      c.restore();
    };


    const drawCursor = (c, cx, cy) => {
      c.save();
      c.strokeStyle = 'rgba(0, 217, 255, 0.7)';
      c.lineWidth = 1.5;
      c.beginPath(); c.arc(cx, cy, 5, 0, Math.PI * 2); c.stroke();
      c.fillStyle = '#00d9ff';
      c.beginPath(); c.arc(cx, cy, 1.8, 0, Math.PI * 2); c.fill();
      c.beginPath();
      c.moveTo(cx, cy - 8); c.lineTo(cx, cy - 13);
      c.moveTo(cx, cy + 8); c.lineTo(cx, cy + 13);
      c.moveTo(cx - 8, cy); c.lineTo(cx - 13, cy);
      c.moveTo(cx + 8, cy); c.lineTo(cx + 13, cy);
      c.stroke();
      c.restore();
    };

    const drawFish = (c, fish, px, py, scale, alpha, fishColor, time) => {
      c.save();
      c.translate(px, py);
      c.scale(scale, scale);
      c.rotate(Math.sin(time * 1.5 + fish.phase) * 0.08);
      c.globalAlpha = alpha;

      let glowGrad = c.createRadialGradient(0, 0, 0, 0, 0, 26);
      glowGrad.addColorStop(0, fishColor);
      glowGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      c.fillStyle = glowGrad;
      c.beginPath(); c.arc(0, 0, 26, 0, Math.PI * 2); c.fill();

      if (fish.isLoaded) {
        c.drawImage(fish.img, -17, -17, 34, 34);
      } else {
        c.fillStyle = fishColor;
        c.beginPath(); c.arc(0, 0, 10, 0, Math.PI * 2); c.fill();
      }
      c.restore();

      c.save();
      c.translate(px, py);
      c.font = `bold ${Math.max(9, Math.round(11 * scale))}px var(--font-mono)`;
      c.textAlign = 'center';
      const isLight = document.body.classList.contains('light-theme');
      c.shadowColor = isLight ? 'rgba(0,0,0,0.04)' : fishColor;
      c.shadowBlur = isLight ? 2 : 8 * scale;
      c.fillStyle = isLight ? `rgba(24, 24, 27, ${alpha})` : `rgba(232, 234, 246, ${alpha})`;
      c.fillText(fish.name, 0, -24 * scale);
      c.restore();
    };

    const drawLanyard = (c, hx, hy) => {
      c.save();
      const strapY = hy - 18;
      const dx = hx - anchorX;
      const dy = hy - anchorY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const restLength = isMobile() ? window.innerHeight * 0.10 : window.innerHeight * 0.29;

      let sag = 0;
      if (dist < restLength) sag = (restLength - dist) * 0.25;

      // Left strap
      c.beginPath();
      c.moveTo(anchorX - 10, 0);
      c.bezierCurveTo(anchorX - 10, strapY * 0.4 + sag, hx - 25, strapY * 0.6 + sag, hx, strapY);
      c.strokeStyle = '#4e43be'; c.lineWidth = 9; c.stroke();
      c.strokeStyle = '#6c63ff'; c.lineWidth = 6; c.stroke();
      c.strokeStyle = '#a78bfa'; c.lineWidth = 1.5; c.setLineDash([5, 5]); c.stroke(); c.setLineDash([]);

      // Right strap
      c.beginPath();
      c.moveTo(anchorX + 10, 0);
      c.bezierCurveTo(anchorX + 10, strapY * 0.4 + sag, hx + 25, strapY * 0.6 + sag, hx, strapY);
      c.strokeStyle = '#00a5c4'; c.lineWidth = 9; c.stroke();
      c.strokeStyle = '#00d9ff'; c.lineWidth = 6; c.stroke();
      c.strokeStyle = '#e0f7fa'; c.lineWidth = 1.5; c.setLineDash([5, 5]); c.stroke(); c.setLineDash([]);

      // Swivel hook swivel
      let metal = c.createLinearGradient(hx - 6, 0, hx + 6, 0);
      metal.addColorStop(0, '#757575'); metal.addColorStop(0.3, '#bdbdbd'); metal.addColorStop(0.5, '#f5f5f5'); metal.addColorStop(0.8, '#9e9e9e'); metal.addColorStop(1, '#424242');
      c.fillStyle = metal; c.strokeStyle = '#373737'; c.lineWidth = 1;
      c.beginPath(); c.arc(hx, strapY, 7, Math.PI, 0); c.lineTo(hx - 7, strapY); c.fill(); c.stroke();
      c.beginPath(); c.roundRect(hx - 3, strapY, 6, 4, 1); c.fill(); c.stroke();
      c.beginPath(); c.moveTo(hx - 4.5, strapY + 4); c.lineTo(hx - 4.5, hy - 4); c.arc(hx, hy - 4, 4.5, Math.PI, 0); c.lineTo(hx + 4.5, strapY + 4); c.closePath(); c.fill(); c.stroke();
      c.restore();
    };

    const drawEmployeeCard = (c, cx, cy, angle, time) => {
      c.save();
      c.translate(cx, cy);
      c.rotate(angle);
      const scale = isMobile() ? 0.65 : 1.0;
      c.scale(scale, scale);

      const isLight = document.body.classList.contains('light-theme');
      c.shadowColor = isLight ? 'rgba(0, 0, 0, 0.08)' : 'rgba(108, 99, 255, 0.35)';
      c.shadowBlur = 40;
      c.shadowOffsetX = -angle * 20;
      c.shadowOffsetY = 20;

      // Card Base
      c.fillStyle = isLight ? 'rgba(255, 255, 255, 0.95)' : 'rgba(8, 12, 26, 0.94)';
      c.strokeStyle = isLight ? 'rgba(0, 0, 0, 0.08)' : 'rgba(108, 99, 255, 0.45)';
      c.lineWidth = 3.5;
      c.beginPath(); c.roundRect(-cardWidth / 2, -cardHeight / 2, cardWidth, cardHeight, 20); c.fill(); c.stroke();
      c.shadowColor = 'transparent';

      // Outer border highlights
      c.strokeStyle = isLight ? 'rgba(0, 0, 0, 0.03)' : 'rgba(255, 255, 255, 0.08)';
      c.lineWidth = 1.5;
      c.beginPath(); c.roundRect(-cardWidth / 2 + 5, -cardHeight / 2 + 5, cardWidth - 10, cardHeight - 10, 16); c.stroke();

      // Corner brackets
      c.strokeStyle = isLight ? 'rgba(79, 70, 229, 0.25)' : 'rgba(0, 217, 255, 0.35)';
      c.lineWidth = 1.5;
      const pad = 12, len = 12;
      const w2 = cardWidth / 2 - pad, h2 = cardHeight / 2 - pad;
      c.beginPath(); c.moveTo(-w2, -h2 + len); c.lineTo(-w2, -h2); c.lineTo(-w2 + len, -h2); c.stroke();
      c.beginPath(); c.moveTo(w2, -h2 + len); c.lineTo(w2, -h2); c.lineTo(w2 - len, -h2); c.stroke();
      c.beginPath(); c.moveTo(-w2, h2 - len); c.lineTo(-w2, h2); c.lineTo(-w2 + len, h2); c.stroke();
      c.beginPath(); c.moveTo(w2, h2 - len); c.lineTo(w2, h2); c.lineTo(w2 - len, h2); c.stroke();

      // Tech Grid patterns
      c.strokeStyle = isLight ? 'rgba(0, 0, 0, 0.015)' : 'rgba(108, 99, 255, 0.03)';
      c.lineWidth = 1;
      for (let lx = -cardWidth / 2 + 20; lx < cardWidth / 2; lx += 24) {
        c.beginPath(); c.moveTo(lx, -cardHeight / 2 + 6); c.lineTo(lx, cardHeight / 2 - 6); c.stroke();
      }
      for (let ly = -cardHeight / 2 + 20; ly < cardHeight / 2; ly += 24) {
        c.beginPath(); c.moveTo(-cardWidth / 2 + 6, ly); c.lineTo(cardWidth / 2 - 6, ly); c.stroke();
      }

      // Header Banner Stripe
      let headerGrad = c.createLinearGradient(-cardWidth / 2, 0, cardWidth / 2, 0);
      headerGrad.addColorStop(0, 'rgba(108, 99, 255, 0.85)');
      headerGrad.addColorStop(1, 'rgba(0, 217, 255, 0.85)');
      c.fillStyle = headerGrad;
      c.beginPath(); c.roundRect(-cardWidth / 2, -cardHeight / 2, cardWidth, 36, [20, 20, 0, 0]); c.fill();

      // Header Text
      c.fillStyle = '#ffffff'; c.font = 'bold 10px var(--font-mono)'; c.textAlign = 'center'; c.textBaseline = 'middle';
      c.fillText('EMPLOYEE ID CARD', 0, -cardHeight / 2 + 18);

      // Hanger slots
      c.fillStyle = isLight ? '#eaeaea' : '#050816';
      c.beginPath(); c.roundRect(-15, -cardHeight / 2 + 24, 30, 6, 3); c.fill();
      c.strokeStyle = isLight ? 'rgba(0, 0, 0, 0.06)' : 'rgba(108, 99, 255, 0.45)'; c.lineWidth = 1; c.stroke();

      // 3:4 User Photo frame
      const photoW = 180, photoH = 240, photoY = -cardHeight / 2 + 45, photoX = -photoW / 2;
      c.fillStyle = isLight ? '#f4f4f5' : '#02050f';
      c.strokeStyle = isLight ? 'rgba(0, 0, 0, 0.06)' : 'rgba(0, 217, 255, 0.35)'; c.lineWidth = 2.5;
      c.beginPath(); c.roundRect(photoX, photoY, photoW, photoH, 8); c.fill(); c.stroke();

      if (isPhotoLoaded) {
        c.save();
        c.beginPath(); c.roundRect(photoX, photoY, photoW, photoH, 8); c.clip();
        c.imageSmoothingEnabled = true; c.imageSmoothingQuality = 'high';

        const imgRatio = photoImg.width / photoImg.height;
        const frameRatio = photoW / photoH;
        let sx = 0, sy = 0, sw = photoImg.width, sh = photoImg.height;
        if (imgRatio > frameRatio) {
          sw = photoImg.height * frameRatio; sx = (photoImg.width - sw) / 2;
        } else {
          sh = photoImg.width / frameRatio; sy = (photoImg.height - sh) / 2;
        }
        c.drawImage(photoImg, sx, sy, sw, sh, photoX, photoY, photoW, photoH);
        c.restore();
      } else {
        c.fillStyle = isLight ? 'rgba(0, 0, 0, 0.03)' : 'rgba(255, 255, 255, 0.02)';
        c.fillRect(photoX, photoY, photoW, photoH);
        
        // Vẽ hình bóng người dùng (user silhouette) chuyên nghiệp
        c.save();
        c.beginPath();
        c.roundRect(photoX, photoY, photoW, photoH, 8);
        c.clip();
        
        c.fillStyle = isLight ? 'rgba(0, 0, 0, 0.08)' : 'rgba(255, 255, 255, 0.08)';
        // Đầu
        c.beginPath();
        c.arc(0, photoY + photoH / 2 - 12, 30, 0, Math.PI * 2);
        c.fill();
        // Vai/Thân
        c.beginPath();
        c.arc(0, photoY + photoH / 2 + 55, 50, 0, Math.PI, true);
        c.fill();
        c.restore();
        
        c.fillStyle = isLight ? 'rgba(79, 70, 229, 0.3)' : 'rgba(0, 217, 255, 0.3)';
        c.font = 'bold 11px var(--font-mono)';
        c.textAlign = 'center';
        c.textBaseline = 'middle';
        c.fillText('NO AVATAR', 0, photoY + photoH - 24);
      }

      // Inner bevel
      c.strokeStyle = isLight ? 'rgba(0, 0, 0, 0.02)' : 'rgba(255, 255, 255, 0.06)'; c.lineWidth = 1;
      c.strokeRect(photoX + 1, photoY + 1, photoW - 2, photoH - 2);

      // Student Details text
      c.fillStyle = isLight ? '#18181b' : '#ffffff'; c.font = 'bold 15px var(--font-display)'; c.textAlign = 'center'; c.textBaseline = 'alphabetic';
      c.fillText(user?.fullname?.toUpperCase() || 'VŨ THÀNH LUÂN', 0, 105);

      c.fillStyle = isLight ? '#4f46e5' : 'rgba(0, 217, 255, 0.9)'; c.font = 'bold 10px var(--font-mono)';
      c.fillText('ROLE: INTERN JAVA BACKEND', 0, 132);

      // Active status pill
      const badgeW = 74, badgeH = 18, badgeX = -badgeW / 2, badgeY = 148;
      c.fillStyle = 'rgba(34, 197, 94, 0.1)'; c.strokeStyle = 'rgba(34, 197, 94, 0.4)'; c.lineWidth = 1.2;
      c.beginPath(); c.roundRect(badgeX, badgeY, badgeW, badgeH, 9); c.fill(); c.stroke();

      c.fillStyle = '#22c55e'; c.beginPath(); c.arc(-22, 157, 3.5, 0, Math.PI * 2); c.fill();
      c.strokeStyle = 'rgba(34, 197, 94, 0.4)'; c.lineWidth = 1.5;
      c.beginPath(); c.arc(-22, 157, 3.5 + Math.sin(time * 6) * 2, 0, Math.PI * 2); c.stroke();

      c.fillStyle = '#22c55e'; c.font = 'bold 9px var(--font-mono)'; c.textAlign = 'left';
      c.fillText('ACTIVE', -12, 160);

      // Embedded Social Buttons inside card
      buttons.forEach(btn => {
        const isHovered = (hoveredButton === btn);
        c.save(); c.translate(btn.x, btn.y);
        if (isHovered) {
          c.shadowColor = btn.hoverColor; c.shadowBlur = 12;
        } else {
          c.shadowColor = isLight ? 'rgba(0, 0, 0, 0.05)' : 'rgba(0, 0, 0, 0.2)'; c.shadowBlur = 4;
        }

        let btnGrad = c.createRadialGradient(0, 0, 0, 0, 0, btn.r);
        btnGrad.addColorStop(0, isHovered ? btn.hoverColor : (isLight ? 'rgba(79, 70, 229, 0.08)' : 'rgba(108, 99, 255, 0.15)'));
        btnGrad.addColorStop(1, isHovered ? btn.color : (isLight ? 'rgba(244, 244, 245, 0.95)' : 'rgba(8, 12, 26, 0.6)'));
        c.fillStyle = btnGrad;
        c.strokeStyle = isHovered ? (isLight ? '#4f46e5' : '#ffffff') : (isLight ? 'rgba(0, 0, 0, 0.06)' : 'rgba(108, 99, 255, 0.35)');
        c.lineWidth = 1.5;
        c.beginPath(); c.arc(0, 0, btn.r, 0, Math.PI * 2); c.fill(); c.stroke();
        c.shadowBlur = 0;

        c.drawImage(btn.icon, -10, -10, 20, 20);
        c.restore();
      });

      // Shine gloss reflection
      let glossGrad = c.createLinearGradient(-cardWidth, -cardHeight, cardWidth, cardHeight);
      const shineShift = cardAngle * 0.4;
      glossGrad.addColorStop(0, 'rgba(255, 255, 255, 0)');
      glossGrad.addColorStop(0.40 + shineShift, 'rgba(255, 255, 255, 0)');
      glossGrad.addColorStop(0.44 + shineShift, 'rgba(255, 255, 255, 0.04)');
      glossGrad.addColorStop(0.50 + shineShift, 'rgba(255, 255, 255, 0.12)');
      glossGrad.addColorStop(0.56 + shineShift, 'rgba(255, 255, 255, 0.04)');
      glossGrad.addColorStop(0.60 + shineShift, 'rgba(255, 255, 255, 0)');
      glossGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
      c.fillStyle = glossGrad;
      c.beginPath(); c.roundRect(-cardWidth / 2, -cardHeight / 2, cardWidth, cardHeight, 20); c.fill();
      c.restore();
    };

    let t = 0;
    let smx = window.innerWidth * 0.73;
    let smy = 300;

    const frame = () => {
      t += 0.016;
      smx += (realMouseX - smx) * 0.07;
      smy += (realMouseY - smy) * 0.07;

      if (!isDragging) {
        const rad = cardAngle;
        const localHoleY = -cardHeight / 2 + 24;
        let cx = cardX - Math.sin(rad) * localHoleY;
        let cy = cardY + Math.cos(rad) * localHoleY;

        let dx = cx - anchorX;
        let dy = cy - anchorY;
        let dist = Math.sqrt(dx * dx + dy * dy);

        let gravity = 0.28;
        let ax = 0;
        let ay = gravity;

        const restLength = isMobile() ? window.innerHeight * 0.10 : window.innerHeight * 0.29;
        if (dist > restLength) {
          let tension = (dist - restLength) * 0.25;
          ax -= (dx / dist) * tension;
          ay -= (dy / dist) * tension;
        }

        ax -= dx * 0.0025;
        vx = (vx + ax) * 0.9;
        vy = (vy + ay) * 0.9;

        cardX += vx;
        cardY += vy;

        if (isMobile()) {
          const mobileRestLen = window.innerHeight * 0.10;
          const maxCardY = mobileRestLen + (cardHeight * 0.65) / 2 + 10;
          if (cardY > maxCardY) {
            cardY = maxCardY;
            vy = Math.min(vy, 0);
          }
        }

        const targetAngle = Math.atan2(cardX - anchorX, cardY - (-cardHeight / 2 + 24)) * 0.75;
        cardAngle += (targetAngle - cardAngle) * 0.15;
      } else {
        vx = cardX - prevCardX;
        vy = cardY - prevCardY;
        prevCardX = cardX;
        prevCardY = cardY;

        const targetAngle = Math.min(Math.max(vx * 0.05, -0.6), 0.6);
        cardAngle += (targetAngle - cardAngle) * 0.2;
      }

      S.rx = (cardY - 300) / 300 * 0.42;
      S.ry = (cardX - 400) / 400 * 0.62;
      S.rz = cardAngle * 0.2;
      S.chroma = S.ry * 80;

      if (isMobile() && heroEl) {
        const cardBottom = Math.ceil(cardY + (cardHeight * 0.65) / 2) + 20;
        heroEl.style.paddingTop = cardBottom + 'px';
      } else if (!isMobile() && heroEl) {
        heroEl.style.paddingTop = '';
      }

      ctx.clearRect(0, 0, canvasWidth, canvasHeight);

      drawGrid(ctx, S);

      const rad = cardAngle;
      const localHoleY = -cardHeight / 2 + 24;
      const hx = cardX - Math.sin(rad) * localHoleY;
      const hy = cardY + Math.cos(rad) * localHoleY;

      const computedFish = FISH_LIST.map(fish => {
        fish.angle += fish.speed * (1 + 0.28 * Math.sin(t * 0.5 + fish.phase));
        const wVal = Math.sin(t * 0.4 + fish.phase) * 0.8;
        const wScale = 2.2 / (2.2 - wVal * 0.5);

        const rx = fish.orbit + Math.sin(t * 0.7 + fish.phase) * 12;
        const ry = fish.orbit * 0.36;

        const px = cardX + Math.cos(fish.angle) * rx;
        const py = cardY + Math.sin(fish.angle) * ry * Math.cos(fish.tilt) + Math.cos(fish.angle) * ry * Math.sin(fish.tilt) * 0.25;

        const depth = Math.sin(fish.angle) * Math.cos(fish.tilt);
        let scale = Math.min(Math.max((0.68 + depth * 0.32) * wScale, 0.3), 1.6);
        let alpha = Math.min(Math.max(0.4 + depth * 0.55, 0.25), 1.0);

        if (fish.isHighlighted) { scale *= 1.35; alpha = 1.0; }
        else if (fish.isDimmed) { alpha = 0.15; }

        const shiftedHue = hueShift(fish.h, S.chroma + depth * 18);
        const fishColor = `hsla(${shiftedHue}, ${fish.s}%, ${fish.l}%, ${alpha})`;

        return { fish, px, py, scale, alpha, depth, fishColor };
      });

      const backFish = computedFish.filter(f => f.depth < 0).sort((a, b) => a.depth - b.depth);
      const frontFish = computedFish.filter(f => f.depth >= 0).sort((a, b) => a.depth - b.depth);

      backFish.forEach(f => {
        drawFish(ctx, f.fish, f.px, f.py, f.scale, f.alpha, f.fishColor, t);
      });

      drawLanyard(ctx, hx, hy);
      drawEmployeeCard(ctx, cardX, cardY, cardAngle, t);

      frontFish.forEach(f => {
        drawFish(ctx, f.fish, f.px, f.py, f.scale, f.alpha, f.fishColor, t);
      });

      ctx.fillStyle = 'rgba(120, 160, 220, 0.3)';
      ctx.font = '11px var(--font-mono)';
      ctx.textAlign = 'center';
      ctx.fillText("Click & kéo thẻ sinh viên — Dây đeo co dãn · Lực quán tính & trọng lực · Skill Logos 4D", canvasWidth / 2, canvasHeight - 20);

      drawCursor(ctx, smx, smy);

      animId = requestAnimationFrame(frame);
    };
    animId = requestAnimationFrame(frame);

    // Link dynamic roadmap skill-cards hover listener
    const skillCards = document.querySelectorAll('.skill-card');
    const skillHandlers = [];

    skillCards.forEach(card => {
      let groupName = '';
      card.classList.forEach(cls => {
        if (cls.startsWith('group-')) groupName = cls.replace('group-', '');
      });

      if (!groupName) return;

      const enterHandler = () => {
        FISH_LIST.forEach(fish => {
          let match = false;
          if (fish.group === groupName) match = true;
          else if (groupName === 'frontend-js' && fish.group === 'frontend') match = true;
          else if (groupName === 'systems' && fish.group === 'systems') match = true;
          else if (groupName === 'backend' && fish.group === 'backend') match = true;
          else if (groupName === 'database' && (fish.group === 'database' || fish.group === 'backend')) match = true;
          else if (groupName === 'tools' && fish.group === 'tools') match = true;

          if (match) { fish.isHighlighted = true; fish.isDimmed = false; }
          else { fish.isHighlighted = false; fish.isDimmed = true; }
        });
      };

      const leaveHandler = () => {
        FISH_LIST.forEach(fish => { fish.isHighlighted = false; fish.isDimmed = false; });
      };

      card.addEventListener('mouseenter', enterHandler);
      card.addEventListener('mouseleave', leaveHandler);
      skillHandlers.push({ el: card, enter: enterHandler, leave: leaveHandler });
    });

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resizeRobotCanvas);
      window.removeEventListener('mousemove', onMouseMove);
      canvas.removeEventListener('mousedown', onMouseDown);
      canvas.removeEventListener('click', onClick);
      window.removeEventListener('mouseup', onMouseUp);

      canvas.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);

      skillHandlers.forEach(h => {
        h.el.removeEventListener('mouseenter', h.enter);
        h.el.removeEventListener('mouseleave', h.leave);
      });
    };
  }, [user]);

  return (
    <section className="hero-section" id="home">
      <canvas ref={particleCanvasRef} id="particleCanvas"></canvas>
      <canvas ref={robotCanvasRef} id="robotCanvas"></canvas>

      <div className="container py-5" style={{ position: 'relative', zIndex: 2 }}>
        <div className="row align-items-center justify-content-center text-center text-md-start">

          <div className="col-md-7 col-lg-6 order-2 order-md-1 mt-5 mt-md-0">
            <span className="hero-badge">
              <i className="bi bi-code-slash"></i> Hi there, I'm
              <span className="available-badge">
                <span className="pulse-dot"></span> Available
              </span>
            </span>

            <h1 className="hero-name mt-3">
              {user?.fullname ? (
                <>
                  {user.fullname.split(' ').slice(0, -1).join(' ')}<br />
                  <span className="text-accent">{user.fullname.split(' ').slice(-1)}</span>
                </>
              ) : (
                <>Vũ Thành<br /><span className="text-accent">Luân</span></>
              )}
            </h1>

            <h2 className="hero-role mt-2 mb-3" style={{ fontSize: '1rem' }}>
              <span className="typewriter-text" id="typewriterText">{typeText}</span>
              <span className="typewriter-cursor"></span>
            </h2>

            <p className="hero-desc mb-4">
              A third-year Information Technology student on a journey toward{' '}
              <strong style={{ color: 'var(--text-primary)' }}>Fullstack Development</strong>.
              Solid backend foundation with Java &amp; Spring Boot, actively expanding into Frontend with React.
            </p>

            <div className="row g-3 justify-content-center justify-content-md-start mb-4 hero-stats" style={{ maxWidth: 500 }}>
              {[{ n: '3+', label: 'Years Study' }, { n: '5+', label: 'Projects' }, { n: '99%', label: 'Commit' }].map(s => (
                <div key={s.label} className="col-4">
                  <div className="hero-stat-number">{s.n}</div>
                  <div className="hero-stat-label">{s.label}</div>
                </div>
              ))}
            </div>

            <div className="d-flex flex-wrap gap-3 justify-content-center justify-content-md-start">
              <a href="#about" className="btn-hero-primary" id="btn-about">
                <i className="bi bi-person-lines-fill"></i>About Me
              </a>
              <a href="#contact" className="btn-hero-outline" id="btn-contact">
                <i className="bi bi-send"></i>Get In Touch
              </a>
            </div>
          </div>

          <div className="col-md-5 col-lg-5 order-1 order-md-2 text-center d-flex flex-column align-items-center justify-content-center">
            {/* Space reserved for robot canvas */}
          </div>
        </div>
      </div>

      <div className="scroll-indicator" id="scrollIndicator">
        <span>Scroll</span>
        <i className="bi bi-chevron-down"></i>
      </div>
    </section>
  );
}
