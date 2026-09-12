import { portfolio } from '../data/portfolioConfig';

const socials = [
  ['GitHub', portfolio.github, 'fa-brands fa-github'],
  ['Facebook', portfolio.facebook, 'fa-brands fa-facebook-f'],
  ['Instagram', portfolio.instagram, 'fa-brands fa-instagram'],
  ['TikTok', portfolio.tiktok, 'fa-brands fa-tiktok'],
];

export default function SocialLinks({ className = '' }) {
  return (
    <div className={`social-links ${className}`}>
      {socials.map(([label, href, icon]) => (
        <a href={href} target="_blank" rel="noreferrer" aria-label={label} key={label}>
          <i className={icon} aria-hidden="true"></i>
        </a>
      ))}
    </div>
  );
}
