import LogoMark from './LogoMark';
import SocialLinks from './SocialLinks';

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
          <SocialLinks />
          <span>Turn ideas into opportunities.</span>
        </div>
      </div>
    </footer>
  );
}
