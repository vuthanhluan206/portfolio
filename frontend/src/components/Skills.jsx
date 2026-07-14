import { useEffect } from 'react';

const LAYERS = [
  {
    id: 1, badge: 'badge-systems', badgeLabel: 'Layer 1', title: 'Programming Foundations',
    skills: [{ group: 'systems', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cplusplus/cplusplus-original.svg', name: 'C / C++', desc: 'Tư duy lập trình & Cấu trúc dữ liệu', badge: 'badge-adv', badgeLabel: 'Advanced', pct: 85 }]
  },
  {
    id: 2, badge: 'badge-backend-db', badgeLabel: 'Layer 2', title: 'Backend & Database',
    skills: [
      { group: 'backend', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg', name: 'Java', desc: 'OOP, Core Java & Java 17', badge: 'badge-prof', badgeLabel: 'Proficient', pct: 75 },
      { group: 'backend', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/spring/spring-original.svg', name: 'Spring Boot', desc: 'MVC, API, Security & JPA', badge: 'badge-prof', badgeLabel: 'Proficient', pct: 70 },
      { group: 'database', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg', name: 'MySQL', desc: 'Thiết kế DB & truy vấn SQL', badge: 'badge-prof', badgeLabel: 'Proficient', pct: 70 },
      { group: 'database', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg', name: 'PostgreSQL', desc: 'Quan hệ dữ liệu nâng cao', badge: 'badge-inter', badgeLabel: 'Intermediate', pct: 60 },
    ]
  },
  {
    id: 3, badge: 'badge-frontend', badgeLabel: 'Layer 3', title: 'Frontend',
    skills: [
      { group: 'frontend', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg', name: 'HTML', desc: 'Cấu trúc giao diện web', badge: 'badge-adv', badgeLabel: 'Advanced', pct: 80 },
      { group: 'frontend', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg', name: 'CSS', desc: 'Styling, Grid, Flexbox', badge: 'badge-prof', badgeLabel: 'Proficient', pct: 75 },
      { group: 'frontend', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg', name: 'Tailwind CSS', desc: 'Responsive CSS framework', badge: 'badge-prof', badgeLabel: 'Proficient', pct: 70 },
      { group: 'frontend-js', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg', name: 'JavaScript', desc: 'Xử lý logic, DOM events', badge: 'badge-inter', badgeLabel: 'Intermediate', pct: 65 },
    ]
  },
  {
    id: 4, badge: 'badge-tools', badgeLabel: 'Layer 4', title: 'DevOps & Tools',
    skills: [
      { group: 'tools', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg', name: 'GitHub', desc: 'Quản lý phiên bản code', badge: 'badge-prof', badgeLabel: 'Proficient', pct: 75, invertIcon: true },
      { group: 'tools', icon: 'https://www.vectorlogo.zone/logos/getpostman/getpostman-icon.svg', name: 'Postman', desc: 'Kiểm thử API, REST Clients', badge: 'badge-prof', badgeLabel: 'Proficient', pct: 70 },
      { group: 'tools', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg', name: 'Docker', desc: 'Container hóa ứng dụng', badge: 'badge-inter', badgeLabel: 'Intermediate', pct: 50 },
    ]
  },
  {
    id: 5, badge: 'badge-learning', badgeLabel: 'Layer 5', title: 'Present · Learning', current: true,
    skills: [
      { group: 'learning', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg', name: 'TypeScript', desc: 'Mở rộng logic kiểu dữ liệu', badge: 'badge-learn', badgeLabel: 'Learning', pct: 40, highlight: true },
      { group: 'learning', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg', name: 'React', desc: 'Xây dựng Single Page App', badge: 'badge-learn', badgeLabel: 'Learning', pct: 35, highlight: true },
    ]
  },
];

export default function Skills() {
  // Animate progress bars on scroll
  useEffect(() => {
    const bars = document.querySelectorAll('.bar-fill');
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const pct = entry.target.getAttribute('data-pct');
          entry.target.style.width = pct + '%';
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });
    bars.forEach(b => obs.observe(b));
    return () => obs.disconnect();
  }, []);

  return (
    <section className="section-block section-dark" id="skills" style={{ position: 'relative', overflow: 'visible' }}>
      <div className="container-fluid px-lg-5">
        <div className="section-header text-center mb-5">
          <span className="section-label">02 — Skills · Roadmap</span>
          <h2 className="section-heading">From Foundations to Present</h2>
          <p className="section-sub mt-2">15 Technologies — Layered Dependency Roadmap</p>
        </div>

        <div className="roadmap-wrapper">
          {LAYERS.map((layer) => (
            <div key={layer.id} className={`roadmap-layer${layer.current ? ' current-learning-layer' : ''}`} data-layer={layer.id}>
              <div className="layer-info">
                <span className={`layer-badge ${layer.badge}`}>{layer.badgeLabel}</span>
                <h3 className="layer-title">{layer.title}</h3>
              </div>
              <div className="layer-grid">
                {layer.skills.map((skill) => (
                  <div key={skill.name} className={`skill-card group-${skill.group}${skill.highlight ? ' highlight-learning' : ''}`} data-pct={skill.pct}>
                    <span className="skill-icon">
                      <img src={skill.icon} alt={skill.name} className={skill.invertIcon ? 'icon-light' : ''} />
                    </span>
                    <div className="card-body">
                      <h4 className="skill-title">{skill.name}</h4>
                      <p className="skill-desc">{skill.desc}</p>
                    </div>
                    <span className={`skill-badge ${skill.badge}`}>{skill.badgeLabel}</span>
                    <div className="progress-container">
                      <div className="progress-bar-bg">
                        <div className="bar-fill" data-pct={skill.pct} style={{ width: 0 }}></div>
                      </div>
                      <span className="pct-text">{skill.pct}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
