import { useState, useEffect } from 'react';
import apiClient from '../api/apiClient';

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [filterKey, setFilterKey] = useState(0);

  useEffect(() => {
    apiClient.get('/project')
      .then(res => setProjects(Array.isArray(res.data) ? res.data : []))
      .catch(() => setProjects([]))
      .finally(() => setLoading(false));
  }, []);

  const handleFilter = (f) => {
    setFilter(f);
    setFilterKey(k => k + 1);
  };

  const filtered = projects.filter(p => filter === 'all' || (p.category || '').toLowerCase() === filter.toLowerCase());

  // Tạo số thứ tự PROJECT_01, PROJECT_02, ...
  const getNumber = (index) => `PROJECT_${String(index + 1).padStart(2, '0')}`;

  // Tách chuỗi skills thành mảng
  const parseTags = (skillsStr) =>
    skillsStr ? skillsStr.split(',').map(s => s.trim()).filter(Boolean) : [];

  return (
    <section className="section-block" id="projects">
      <div className="container">
        <div className="section-header text-center mb-5">
          <span className="section-label">03 — Work</span>
          <h2 className="section-heading">Projects</h2>
          <p className="section-sub mt-2">Things I've built while learning and practicing</p>
        </div>

        <div className="project-filters d-flex justify-content-center flex-wrap gap-2 mb-5">
          {['all', 'backend', 'frontend', 'fullstack'].map(f => (
            <button
              key={f}
              className={`filter-btn${filter === f ? ' active' : ''}`}
              onClick={() => handleFilter(f)}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)' }}>
            <i className="bi bi-arrow-repeat" style={{ fontSize: '2rem', animation: 'spin 1s linear infinite' }} />
            <div style={{ marginTop: 12, fontFamily: 'var(--font-mono)', fontSize: '0.85rem' }}>Đang tải projects...</div>
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)' }}>
            <i className="bi bi-folder2-open" style={{ fontSize: '2.5rem', display: 'block', marginBottom: 12 }} />
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem' }}>
              {projects.length === 0 ? 'Chưa có project nào. Admin có thể thêm từ Dashboard.' : 'Không có project nào trong danh mục này.'}
            </div>
          </div>
        ) : (
          <div className="row g-4 justify-content-center" id="projectGrid" key={filterKey}>
            {filtered.map((p, i) => {
              const tags = parseTags(p.skills);
              return (
                <div key={p.id} className="col-lg-6 col-md-6 project-item">
                  <div className="project-card project-card-enter" style={{ animationDelay: `${i * 0.08}s` }}>
                    <div className="project-body">
                      <div className="project-meta d-flex justify-content-between align-items-center mb-2">
                        <div className="project-number">{getNumber(i)}</div>
                        {p.duration && (
                          <div className="project-date"><i className="bi bi-calendar3"></i> {p.duration}</div>
                        )}
                      </div>
                      <div className="project-title">{p.name}</div>
                      <p className="project-desc">{p.description}</p>
                      {tags.length > 0 && (
                        <div className="project-tags">
                          {tags.map(t => <span key={t} className="project-tag">{t}</span>)}
                        </div>
                      )}
                      <div className="project-links">
                        {p.github ? (
                          <a href={p.github} target="_blank" rel="noreferrer" className="project-link primary">
                            <i className="bi bi-github"></i> Code
                          </a>
                        ) : (
                          <button className="project-link primary" disabled style={{ opacity: 0.4, cursor: 'default' }}>
                            <i className="bi bi-github"></i> Code
                          </button>
                        )}
                        {p.liveDemo ? (
                          <a href={p.liveDemo} target="_blank" rel="noreferrer" className="project-link">
                            <i className="bi bi-globe"></i> Live Demo
                          </a>
                        ) : (
                          <button className="project-link" disabled style={{ opacity: 0.4, cursor: 'default' }}>
                            <i className="bi bi-globe"></i> Live Demo
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
