import './index.css';
import './cv.css';

import { GitBranch, Globe2, Mail, MapPin, Phone } from 'lucide-react';
import { useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Skills from './components/Skills';
import Projects from './components/Projects';
import Contact from './components/Contact';
import Footer from './components/Footer';
import IntroScreen from './components/IntroScreen';

const contacts = [
  { icon: Mail, text: 'vuthanhluan4326@gmail.com' },
  { icon: Phone, text: '0388 891 293' },
  { icon: GitBranch, text: 'github.com/vuthanhluan206' },
  { icon: Globe2, text: 'vuthanhluan.bond' },
  { icon: MapPin, text: 'Phú Diễn, Hà Nội' },
];

const skillGroups = [
  {
    title: 'Languages & Frameworks',
    items: 'Java, Spring Boot, Spring MVC, Spring Security, Spring JPA / Hibernate, RESTful APIs, JWT / OAuth2',
  },
  {
    title: 'Data & Infrastructure',
    items: 'MySQL, PostgreSQL, Redis, Docker, GitHub, Railway / Render',
  },
  {
    title: 'Methodology & Soft Skills',
    items: 'OOP, Design Patterns, Problem Solving, Teamwork, Self-learning',
  },
];

const projects = [
  {
    title: 'Appliance Sales & Repair System',
    role: 'Backend Developer',
    period: 'Jun 2026 - Jul 2026',
    description:
      'Backend for a full-stack appliance sales and repair platform with an AI-powered RAG chatbot. Responsible for server-side logic, APIs, and infrastructure.',
    achievements: [
      'Designed RESTful APIs across 17 controllers for products, cart, orders, payments, discounts, reviews, and posts.',
      'Built repair-service workflows for technician assignment, appointment scheduling, and warranty tracking.',
      'Implemented stateless JWT authentication with Refresh Token rotation using Spring Security.',
      'Integrated a RAG chatbot with Spring AI, Google Gemini, and PGVector for product-data-grounded answers.',
      'Used Redis caching, Docker containerization, Cloudinary image storage, and Railway deployment.',
    ],
    stack: 'Spring Boot, PostgreSQL, Redis, Spring Security, Spring AI, Cloudinary, Docker',
    link: 'GitHub - github.com/vuthanhluan206/Appliance_Sales_System',
  },
  {
    title: 'Personal Portfolio Website',
    role: 'Backend Developer',
    period: 'Jul 2026',
    description:
      'Backend for a modern developer portfolio with an admin panel, JWT authentication, Cloudflare storage and DNS, plus a review system.',
    achievements: [
      'Built JWT + Refresh Token rotation, role-based access control, and secured admin routes.',
      'Integrated Cloudflare R2 for presigned media upload and download, eliminating local file storage.',
      'Exposed CRUD REST APIs for projects, skills, and reviews used by a React admin panel.',
      'Dockerized the backend and deployed it on Railway using an automated deployment pipeline.',
    ],
    stack: 'Spring Boot, Cloudflare R2, Cloudflare DNS, PostgreSQL, Spring Security, Docker',
    link: 'Live - vuthanhluan.bond',
  },
];

function CvSection({ title, children }) {
  return (
    <section className="cv-section">
      <h2>{title}</h2>
      {children}
    </section>
  );
}

function CvPage() {
  return (
    <main className="page-wrap">
      <article className="cv-sheet" aria-label="CV for Vu Thanh Luan">
        <aside className="sidebar">
          <div className="portrait" aria-label="Portrait placeholder" />

          <CvSection title="Contact">
            <ul className="contact-list">
              {contacts.map(({ icon: Icon, text }) => (
                <li key={text}>
                  <Icon aria-hidden="true" size={13} strokeWidth={1.8} />
                  <span>{text}</span>
                </li>
              ))}
            </ul>
          </CvSection>

          <CvSection title="Skills">
            <div className="skill-list">
              {skillGroups.map((group) => (
                <div key={group.title}>
                  <h3>{group.title}</h3>
                  <p>{group.items}</p>
                </div>
              ))}
            </div>
          </CvSection>

          <CvSection title="Education">
            <div className="education">
              <strong>HaNoi University of Natural Resource and Environment</strong>
              <span>Software Engineering</span>
              <span>2024 - 2028</span>
              <span>GPA: 8.33 / 10 (3.47 / 4.0)</span>
            </div>
          </CvSection>
        </aside>

        <div className="main-column">
          <header className="cv-header">
            <h1>Vu Thanh Luan</h1>
            <p>Intern Java Backend</p>
          </header>

          <CvSection title="Profile">
            <p className="profile-text">
              Third-year Software Engineering student with a strong foundation in Object-Oriented
              Programming (OOP) and Java backend development. Passionate about system design and
              performance optimization. Seeking a Java Backend Intern position to contribute
              technical skills in Spring Boot, database management, and problem-solving to
              real-world projects, while further developing business logic and systems thinking
              skills.
            </p>
          </CvSection>

          <CvSection title="Projects">
            <div className="projects">
              {projects.map((project) => (
                <article className="project" key={project.title}>
                  <div className="project-heading">
                    <div>
                      <h3>{project.title}</h3>
                      <p>{project.role}</p>
                    </div>
                    <time>{project.period}</time>
                  </div>
                  <p className="project-description">{project.description}</p>
                  <ul>
                    {project.achievements.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                  <p className="tech-line">
                    <strong>Tech stack:</strong> {project.stack}
                  </p>
                  <p className="project-link">{project.link}</p>
                </article>
              ))}
            </div>
          </CvSection>
        </div>
      </article>
    </main>
  );
}

export default function App() {
  const [view, setView] = useState('home');
  const showHome = () => setView('home');

  return (
    <>
      {view === 'home' && <IntroScreen />}
      <Navbar currentView={view} onHomeClick={showHome} onCvClick={() => setView('cv')} />
      {view === 'cv' ? (
        <CvPage />
      ) : (
        <>
          <main>
            <Hero />
            <About />
            <Skills />
            <Projects />
            <Contact />
          </main>
          <Footer />
        </>
      )}
    </>
  );
}
