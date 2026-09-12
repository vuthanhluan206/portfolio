import { portfolio } from '../data/portfolioConfig';
import LogoMark from './LogoMark';

export default function Footer() {
  const { accountName, accountNumber, bankBin } = portfolio.payment;
  const qrUrl = `https://img.vietqr.io/image/${bankBin}-${accountNumber}-qr_only.png?accountName=${encodeURIComponent(accountName)}`;

  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div className="footer-brand">
          <LogoMark />
          <div>
            <p>© 2026 Vũ Thành Luân. All rights reserved.</p>
            <span>Built with passion. Always learning.</span>
            <span>Turn ideas into opportunities together.</span>
          </div>
        </div>
        <figure className="footer-qr">
          <img src={qrUrl} alt="Payment QR code" />
        </figure>
        <div className="footer-contact">
          <a href={`mailto:${portfolio.email}`}>{portfolio.email}</a>
          <a href={`tel:${portfolio.phones[0]}`}>{portfolio.phones[0]}</a>
          <a href={`tel:${portfolio.phones[1]}`}>{portfolio.phones[1]}</a>
          <nav className="footer-links" aria-label="Footer links">
            <a href={portfolio.github} target="_blank" rel="noreferrer">GitHub</a>
            <span aria-hidden="true">·</span>
            <a href={`mailto:${portfolio.email}`}>Email</a>
            <span aria-hidden="true">·</span>
            <a href="#home">Back to top ↑</a>
          </nav>
        </div>
      </div>
    </footer>
  );
}
