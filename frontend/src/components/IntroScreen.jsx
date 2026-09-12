import { useEffect, useState } from 'react';
import LogoMark from './LogoMark';

const welcomeText = 'Welcome to my portfolio website.';

export default function IntroScreen({ onComplete }) {
  const [charCount, setCharCount] = useState(0);

  useEffect(() => {
    const timer = setTimeout(onComplete, 6200);
    return () => clearTimeout(timer);
  }, [onComplete]);

  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) {
      setCharCount(welcomeText.length);
      return undefined;
    }

    if (charCount >= welcomeText.length) return undefined;
    const delay = charCount === 0 ? 1400 : 2200 / welcomeText.length;
    const timer = setTimeout(() => setCharCount(count => count + 1), delay);
    return () => clearTimeout(timer);
  }, [charCount]);

  return (
    <div className="intro-screen" aria-label="Welcome">
      <LogoMark className="intro-logo" />
      <p>{welcomeText.slice(0, charCount)}</p>
    </div>
  );
}
