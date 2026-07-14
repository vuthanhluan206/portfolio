import { useEffect, useState, useRef } from 'react';

export default function Navbar({ isLoggedIn, onDashboardClick, onCVClick, theme, onThemeToggle, cursorEnabled, onCursorToggle }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 30);
      // detect active section
      const sections = ['home', 'about', 'skills', 'projects', 'reviews', 'contact'];
      for (const id of sections.reverse()) {
        const el = document.getElementById(id);
        if (el && window.scrollY >= el.offsetTop - 100) {
          setActiveSection(id);
          break;
        }
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navLinks = [
    { href: '#home', label: 'Home' },
    { href: '#about', label: 'About' },
    { href: '#skills', label: 'Skills' },
    { href: '#projects', label: 'Projects' },
    { href: '#reviews', label: 'Reviews' },
    { href: '#contact', label: 'Contact' },
  ];

  return (
    <nav className={`navbar navbar-expand-md fixed-top${scrolled ? ' scrolled' : ''}`} id="mainNav">
      <div className="container">
        <a className="navbar-brand" href="#home">VTL<span>.</span>dev</a>

        <button
          className="navbar-toggler"
          type="button"
          onClick={() => setMenuOpen(!menuOpen)}
          style={{ border: '1px solid var(--border)', background: 'rgba(108,99,255,0.05)' }}
        >
          <i className="bi bi-list" style={{ color: 'var(--text-primary)', fontSize: '1.4rem' }}></i>
        </button>

        <div className={`collapse navbar-collapse${menuOpen ? ' show' : ''}`} id="navMenu">
          <ul className="navbar-nav ms-auto align-items-md-center gap-md-1">
            {navLinks.map(({ href, label }) => (
              <li key={href} className="nav-item">
                <a
                  className={`nav-link${activeSection === href.slice(1) ? ' active' : ''}`}
                  href={href}
                  onClick={() => setMenuOpen(false)}
                >
                  {label}
                </a>
              </li>
            ))}

            <li className="nav-item ms-md-3 d-flex align-items-center gap-2 mt-2 mt-md-0">
              {/* Theme toggle */}
              <button className="btn-theme-toggle" onClick={onThemeToggle} title="Chuyển chế độ Sáng/Tối">
                <i className={`bi ${theme === 'dark' ? 'bi-moon-stars-fill' : 'bi-sun-fill'}`}></i>
              </button>

              {/* Cursor toggle */}
              <button className="btn-cursor-toggle" onClick={onCursorToggle} title="Bật/Tắt con trỏ cà phê">
                <i className="bi bi-cursor-fill"></i>
              </button>

              {/* CV button */}
              <button className="btn-theme-toggle ms-md-2" onClick={onCVClick} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', borderRadius: 10, background: 'rgba(0, 217, 255, 0.08)', border: '1px solid rgba(0, 217, 255, 0.2)', color: 'rgba(0, 217, 255, 0.9)', fontSize: '0.82rem', fontFamily: 'var(--font-mono)', cursor: 'none' }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(0, 217, 255, 0.18)'}
                onMouseLeave={e => e.currentTarget.style.background = 'rgba(0, 217, 255, 0.08)'}>
                CV
              </button>

              {/* Dashboard button */}
              <button className="btn-dashboard" onClick={onDashboardClick}>
               
                {isLoggedIn ? 'Dashboard' : 'Dashboard'}
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
