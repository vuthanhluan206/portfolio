import { portfolio } from '../data/portfolioConfig';

export default function About() {
  return (
    <section className="section about-section" id="about">
      <div className="container about-grid">
        <div>
          <p className="eyebrow">GET TO KNOW ME</p>
          <h2>About Me</h2>
          <p className="about-copy">{portfolio.about}</p>
          <a className="btn btn-outline" href="#contact">Let's Talk</a>
        </div>
        <div className="traits">
          <span>CURIOUS</span>
          <span>DISCIPLINED</span>
          <span>ALWAYS LEARNING</span>
        </div>
      </div>
    </section>
  );
}
