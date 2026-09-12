import { Menu, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import LogoMark from './LogoMark';

const LINKS = ['Home', 'About', 'Skills', 'Projects', 'Contact'];

export default function Navbar() {
  const [active, setActive] = useState('home');
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const sections = LINKS.map(label => document.getElementById(label.toLowerCase())).filter(Boolean);
    const observer = new IntersectionObserver(
      entries => entries.forEach(entry => entry.isIntersecting && setActive(entry.target.id)),
      { rootMargin: '-35% 0px -55% 0px' },
    );
    sections.forEach(section => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  return (
    <header className="site-header">
      <nav className="site-nav" aria-label="Primary navigation">
        <a className="site-logo" href="#home" aria-label="Go to home">
          <LogoMark />
        </a>
        <button className="menu-toggle" type="button" onClick={() => setOpen(!open)} aria-label="Toggle menu">
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
        <div className={`site-menu ${open ? 'is-open' : ''}`}>
          {LINKS.map(label => (
            <a
              className={active === label.toLowerCase() ? 'active' : ''}
              key={label}
              href={`#${label.toLowerCase()}`}
              onClick={() => setOpen(false)}
            >
              {label}
            </a>
          ))}
        </div>
      </nav>
    </header>
  );
}
