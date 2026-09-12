import { Menu, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import LogoMark from './LogoMark';

const LINKS = ['Home', 'About', 'Skills', 'Projects', 'Contact'];

export default function Navbar({ currentView = 'home', onHomeClick, onCvClick }) {
  const [active, setActive] = useState('home');
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (currentView !== 'home') return undefined;
    let frameId = 0;

    const setActiveFromScroll = () => {
      cancelAnimationFrame(frameId);
      frameId = requestAnimationFrame(() => {
        const sections = LINKS.map(label => document.getElementById(label.toLowerCase())).filter(Boolean);
        const current = sections.findLast(section => section.getBoundingClientRect().top <= 120);
        const atPageEnd = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4;
        const nextActive = atPageEnd ? 'contact' : current?.id ?? 'home';
        setActive(previous => (previous === nextActive ? previous : nextActive));
      });
    };

    setActiveFromScroll();
    window.addEventListener('scroll', setActiveFromScroll, { passive: true });
    window.addEventListener('resize', setActiveFromScroll);
    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('scroll', setActiveFromScroll);
      window.removeEventListener('resize', setActiveFromScroll);
    };
  }, [currentView]);

  return (
    <header className="site-header">
      <nav className="site-nav" aria-label="Primary navigation">
        <a className="site-logo" href="#home" aria-label="Go to home" onClick={onHomeClick}>
          <LogoMark />
        </a>
        <button className="menu-toggle" type="button" onClick={() => setOpen(!open)} aria-label="Toggle menu">
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
        <div className={`site-menu ${open ? 'is-open' : ''}`}>
          {LINKS.map(label => (
            <a
              className={currentView === 'home' && active === label.toLowerCase() ? 'active' : ''}
              key={label}
              href={`#${label.toLowerCase()}`}
              onClick={(event) => {
                const sectionId = label.toLowerCase();
                event.preventDefault();
                onHomeClick?.();
                setOpen(false);
                setTimeout(() => document.getElementById(sectionId)?.scrollIntoView(), 0);
              }}
            >
              {label}
            </a>
          ))}
          <button
            className={`nav-cv-button ${currentView === 'cv' ? 'active' : ''}`}
            type="button"
            onClick={() => {
              onCvClick?.();
              setOpen(false);
            }}
          >
            CV
          </button>
        </div>
      </nav>
    </header>
  );
}
