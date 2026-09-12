import { useEffect, useState } from 'react';
import heroPortrait from '../assets/hero-portrait.png';

const roles = ['a software engineer.', 'a web developer.'];

export default function Hero() {
  const [roleIndex, setRoleIndex] = useState(0);
  const [charCount, setCharCount] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) {
      setCharCount(roles[0].length);
      return undefined;
    }

    const current = roles[roleIndex];
    const doneTyping = !deleting && charCount === current.length;
    const doneDeleting = deleting && charCount === 0;
    const delay = doneTyping ? 1200 : deleting ? 45 : 85;

    const timer = setTimeout(() => {
      if (doneTyping) {
        setDeleting(true);
      } else if (doneDeleting) {
        setDeleting(false);
        setRoleIndex(index => (index + 1) % roles.length);
      } else {
        setCharCount(count => count + (deleting ? -1 : 1));
      }
    }, delay);

    return () => clearTimeout(timer);
  }, [charCount, deleting, roleIndex]);

  return (
    <section className="hero" id="home">
      <div className="container hero-grid">
        <div className="hero-copy">
          <p className="eyebrow">IT STUDENT &amp; SOFTWARE ENGINEER</p>
          <h1>I'm Thanh Luan</h1>
          <h6 className="typewriter">{roles[roleIndex].slice(0, charCount)}</h6>
          <p className="hero-text">
            I build modern, user-focused web experiences while continuously learning and exploring new technologies.
          </p>
          <div className="hero-actions">
            <a className="btn btn-primary" href="#projects">View Projects</a>
            <a className="btn btn-outline" href="#contact">Let's Talk</a>
          </div>
          <div className="side-note side-note-left">IDEAS<br />CODE<br />A BETTER TOMORROW</div>
        </div>

        <div className="hero-portrait-wrap">
          <img className="hero-portrait" src={heroPortrait} alt="VTL portrait" />
          <div className="side-note side-note-right">SMALL<br />STEPS<br />BIG CHANGES</div>
        </div>
      </div>
    </section>
  );
}
