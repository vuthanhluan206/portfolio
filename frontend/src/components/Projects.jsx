import proctoringImage from '../assets/projects/project-proctoring.png';
import studentsImage from '../assets/projects/project-students.png';
import portfolioImage from '../assets/projects/project-portfolio.png';
import { portfolio } from '../data/portfolioConfig';

const images = [proctoringImage, studentsImage, portfolioImage];

export default function Projects() {
  return (
    <section className="section projects" id="projects">
      <div className="container">
        <div className="projects-heading">
          <div>
            <p className="eyebrow">REAL PROJECTS, REAL PROGRESS</p>
            <h2>Selected Works</h2>
          </div>
          <a href="#projects">View All Projects <span aria-hidden="true">-&gt;</span></a>
        </div>

        <div className="projects-grid">
          {portfolio.projects.map((project, index) => (
            <article className="project-card" key={project.name}>
              <a className="project-preview" href={project.href} aria-label={project.name}>
                <img src={images[index]} alt={`${project.name} preview`} />
              </a>
              <div className="project-body">
                <h3>{project.name}</h3>
                <p>{project.desc}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
