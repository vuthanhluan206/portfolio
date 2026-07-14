import { useEffect, useState, useCallback } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import './index.css';

import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Skills from './components/Skills';
import Projects from './components/Projects';
import Reviews from './components/Reviews';
import Contact from './components/Contact';
import CVModal from './components/CVModal';
import { useAuth } from './hooks/useAuth';
import apiClient from './api/apiClient';
import StarBackground from './components/StarBackground';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';


function PortfolioHome({ isLoggedIn }) {
  const navigate = useNavigate();
  const [theme, setTheme] = useState('dark');
  const [cursorEnabled, setCursorEnabled] = useState(true);
  const [showCV, setShowCV] = useState(false);
  const [toasts, setToasts] = useState([]);
  const [user, setUser] = useState(() => {
    try {
      const cached = localStorage.getItem('cached_user');
      return cached ? JSON.parse(cached) : null;
    } catch {
      return null;
    }
  });

  const fetchUser = useCallback(async () => {
    try {
      const res = await apiClient.get('/user?id=1');
      setUser(res.data);
      localStorage.setItem('cached_user', JSON.stringify(res.data));
    } catch {
      // silently ignore
    }
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  // ── Ghi nhận lượt truy cập của khách (không phải admin) ──
  useEffect(() => {
    if (isLoggedIn) return;
    if (sessionStorage.getItem('visit_counted')) return;
    const today = new Date().toISOString().split('T')[0];
    apiClient.post(`/daily-visit-stat/increment?date=${today}`)
      .then(() => sessionStorage.setItem('visit_counted', '1'))
      .catch(() => {});
  }, [isLoggedIn]);

  // ── Theme ──
  useEffect(() => {
    document.body.classList.toggle('light-theme', theme === 'light');
  }, [theme]);

  // ── Toggle cursor-disabled class khi tắt coffee cursor ──
  useEffect(() => {
    document.body.classList.toggle('cursor-disabled', !cursorEnabled);
  }, [cursorEnabled]);

  // ── Coffee cursor ──
  useEffect(() => {
    if (!cursorEnabled) return;

    const coffee = document.getElementById('cursorCoffee');
    const ring = document.getElementById('cursorRing');
    let ringX = 0, ringY = 0;
    let animId;
    let steamCooldown = 0;

    const onMove = (e) => {
      if (coffee) { coffee.style.left = e.clientX + 'px'; coffee.style.top = e.clientY + 'px'; }
      const now = Date.now();
      if (now - steamCooldown > 180) {
        steamCooldown = now;
        const steam = document.createElement('div');
        steam.className = 'cursor-steam';
        const drift = (Math.random() - 0.5) * 22;
        steam.style.setProperty('--sx', drift + 'px');
        steam.style.left = e.clientX + 'px';
        steam.style.top = (e.clientY - 20) + 'px';
        steam.textContent = ['·', '°', '˚', '•'][Math.floor(Math.random() * 4)];
        document.body.appendChild(steam);
        setTimeout(() => steam.remove(), 1300);
      }
    };

    const animRing = () => {
      ringX += ((window._mx || 0) - ringX) * 0.1;
      ringY += ((window._my || 0) - ringY) * 0.1;
      if (ring) { ring.style.left = ringX + 'px'; ring.style.top = ringY + 'px'; }
      animId = requestAnimationFrame(animRing);
    };

    const onMove2 = (e) => { window._mx = e.clientX; window._my = e.clientY; };

    window.addEventListener('mousemove', onMove, { passive: true });
    window.addEventListener('mousemove', onMove2, { passive: true });
    animRing();

    const addCodeMode = () => {
      document.querySelectorAll('a, button, .project-card, .contact-btn, .nav-link').forEach(el => {
        el.addEventListener('mouseenter', () => { coffee?.classList.add('code-mode'); ring?.classList.add('code-mode'); });
        el.addEventListener('mouseleave', () => { coffee?.classList.remove('code-mode'); ring?.classList.remove('code-mode'); });
      });
    };
    addCodeMode();

    document.addEventListener('mouseleave', () => { if (coffee) coffee.style.opacity = '0'; if (ring) ring.style.opacity = '0'; });
    document.addEventListener('mouseenter', () => { if (coffee) coffee.style.opacity = '1'; if (ring) ring.style.opacity = '1'; });

    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mousemove', onMove2);
      cancelAnimationFrame(animId);
    };
  }, [cursorEnabled]);

  // ── Scroll Reveal ──
  useEffect(() => {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); } });
    }, { threshold: 0.1 });
    document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
    return () => obs.disconnect();
  });

  // ── Scroll indicator hide ──
  useEffect(() => {
    const ind = document.getElementById('scrollIndicator');
    const onScroll = () => { if (ind) ind.classList.toggle('hidden', window.scrollY > 100); };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // ── Toast ──
  const dismissToast = useCallback((id) => {
    setToasts(t => t.map(x => x.id === id ? { ...x, exiting: true } : x));
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 400);
  }, []);

  const showToast = useCallback((message, type = 'success') => {
    const id = Date.now();
    const duration = type === 'success' ? 2000 : 4000;
    setToasts(t => [...t, { id, message, type, exiting: false, duration }]);
    setTimeout(() => dismissToast(id), duration);
  }, [dismissToast]);

  // ── Dashboard click → navigate ──
  const handleDashboardClick = () => {
    if (isLoggedIn) {
      navigate('/dashboard');
    } else {
      navigate('/login');
    }
  };

  return (
    <>
      <StarBackground />
      {/* Coffee cursor elements */}
      {cursorEnabled && (
        <>
          <div className="cursor-coffee" id="cursorCoffee">☕</div>
          <div className="cursor-ring" id="cursorRing"></div>
        </>
      )}

      {/* Navbar */}
      <Navbar
        isLoggedIn={isLoggedIn}
        onDashboardClick={handleDashboardClick}
        onCVClick={() => setShowCV(true)}
        theme={theme}
        onThemeToggle={() => setTheme(t => t === 'dark' ? 'light' : 'dark')}
        cursorEnabled={cursorEnabled}
        onCursorToggle={() => setCursorEnabled(e => !e)}
      />

      {/* Main content */}
      <main>
        <Hero user={user} />
        <About user={user} />
        <Skills />
        <Projects />
        <Reviews />
        <Contact />
      </main>

      {/* CV Modal */}
      {showCV && (
        <CVModal onClose={() => setShowCV(false)} />
      )}

      {/* Toast notifications */}
      <div className="toast-container">
        {toasts.map(t => (
          <div key={t.id} className={`toast ${t.type}${t.exiting ? ' exiting' : ''}`}>
            <i className={`bi ${t.type === 'success' ? 'bi-check-circle-fill' : 'bi-exclamation-circle-fill'}`} style={{ fontSize: '1.1rem', flexShrink: 0 }}></i>
            <span style={{ flex: 1 }}>{t.message}</span>
            <button
              onClick={() => dismissToast(t.id)}
              className="toast-close-btn"
              title="Đóng"
            >
              <i className="bi bi-x-lg" />
            </button>
            <div className={`toast-progress ${t.type}`} style={{ animationDuration: t.duration ? `${t.duration}ms` : '4000ms' }} />
          </div>
        ))}
      </div>
    </>
  );
}


export default function App() {
  const { isLoggedIn } = useAuth();

  return (
    <Routes>
      <Route path="/" element={<PortfolioHome isLoggedIn={isLoggedIn} />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/dashboard" element={<DashboardPage />} />
      {/* Fallback */}
      <Route path="*" element={<PortfolioHome isLoggedIn={isLoggedIn} />} />
    </Routes>
  );
}
