import { Code2, Database, Palette, Settings } from 'lucide-react';

const skills = [
  [Code2, 'Web Development', 'Building modern and responsive web applications'],
  [Database, 'Database', 'Designing and managing efficient databases'],
  [Palette, 'UI/UX Design', 'Creating clean and user-friendly interfaces'],
  [Settings, 'Problem Solving', 'Turning ideas into practical solutions'],
];

export default function Skills() {
  return (
    <section className="section skills-section" id="skills">
      <div className="container">
        <div className="split-heading">
          <div>
            <p className="eyebrow">WHAT I DO</p>
            <h2>My Skills</h2>
          </div>
          <p>A combination of technical skills, problem solving, and a constant willingness to learn helps me build better digital experiences.</p>
        </div>

        <div className="skills-grid">
          {skills.map(([Icon, name, desc]) => (
            <article className="skill-card" key={name}>
              <Icon size={46} strokeWidth={1.7} />
              <div>
                <h3>{name}</h3>
                <p>{desc}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
