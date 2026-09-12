import { CircleUserRound, Link, SquareTerminal } from 'lucide-react';
import { portfolio } from '../data/portfolioConfig';
import LogoMark from './LogoMark';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div className="footer-brand">
          <LogoMark />
          <span>Built with passion. Always learning.</span>
        </div>
        <i aria-hidden="true"></i>
        <div className="footer-socials">
          <a href={portfolio.github} target="_blank" rel="noreferrer" aria-label="GitHub"><SquareTerminal size={18} /></a>
          <a href={portfolio.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn"><Link size={18} /></a>
          <a href={portfolio.instagram} target="_blank" rel="noreferrer" aria-label="Instagram"><CircleUserRound size={18} /></a>
          <span>Turn ideas into opportunities.</span>
        </div>
      </div>
    </footer>
  );
}
