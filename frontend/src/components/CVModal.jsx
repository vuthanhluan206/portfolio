import { useRef, useEffect } from 'react';

/* ─────────────────────── CV DATA MODEL ─────────────────────── */
const CV = {
  name: 'Vũ Thành Luân',
  title: 'Intern Java Backend',
  contacts: [
    { icon: '📞', label: '0388 891 293',              href: 'tel:0388891293' },
    { icon: '✉️', label: 'vuthanhluan4326@gmail.com', href: 'mailto:vuthanhluan4326@gmail.com' },
    { icon: '🌐', label: 'vuthanhluan.bond',           href: 'https://vuthanhluan.bond' },
    { icon: '📍', label: 'Phú Diễn, Hà Nội',          href: null },
  ],
  summary:
    'Third-year Software Engineering student with a strong foundation in Object-Oriented Programming (OOP) and Java backend development. Passionate about system design and performance optimization. Seeking a Java Backend Intern position to contribute technical skills in Spring Boot, database management, and problem-solving to real-world projects, while further developing business logic and systems thinking skills.',
  skills: [
    {
      group: 'Languages & Frameworks',
      accent: true,
      items: ['Java', 'Spring Boot', 'Spring MVC', 'Spring Security', 'Spring JPA / Hibernate', 'RESTful APIs', 'JWT / OAuth2'],
    },
    {
      group: 'Data & Infrastructure',
      accent: false,
      items: ['MySQL', 'PostgreSQL', 'Redis', 'Docker', 'GitHub', 'Railway / Render'],
    },
    {
      group: 'Methodology & Soft Skills',
      accent: false,
      items: ['OOP', 'Design Patterns', 'Problem Solving', 'Teamwork', 'Self-learning'],
    },
  ],
  education: [
    {
      school: 'HaNoi University of Natural Resource and Environment',
      degree: 'Software Engineering',
      period: '2024 — 2028',
      gpa: 'GPA: 8.33 / 10  (3.47 / 4.0)',
    },
  ],
  projects: [
    {
      name: 'Appliance Sales & Repair System',
      role: 'Backend Developer',
      period: 'JUN 2026 – JUL 2026',
      description:
        'Backend for a fullstack appliance sales & repair platform with AI-powered RAG chatbot. Responsible for all server-side logic, APIs, and infrastructure.',
      stack: ['Spring Boot', 'PostgreSQL', 'Redis', 'Spring Security', 'Spring AI', 'Cloudinary', 'Docker'],
      links: [
        { label: 'GitHub', href: 'https://github.com/vuthanhluan206/Appliance_Sales_System', icon: '⎔' },
        { label: 'Live',   href: 'https://dienlanhdongtrieu24h.com',                           icon: '🔗' },
      ],
      bullets: [
        { bold: 'API & Core Logic:', text: 'Designed RESTful APIs across 17 controllers covering product catalog, cart, order, payment, discount, review, and post management.' },
        { bold: 'Service Operations:', text: 'Built a separate domain for repair services including technician assignment, appointment scheduling, and warranty tracking.' },
        { bold: 'Authentication:', text: 'Implemented stateless JWT authentication with RefreshToken rotation via Spring Security.' },
        { bold: 'AI Integration:', text: 'Integrated a RAG chatbot using Spring AI, Google Gemini, and PGVector to answer queries grounded in real product data.' },
        { bold: 'Cloud Image Storage:', text: 'Used Cloudinary to store all product & service images, offloading binary data from PostgreSQL and significantly reducing database size.' },
        { bold: 'Infrastructure:', text: 'Applied Redis for caching hot data; containerized with Docker and deployed on Railway.' },
      ],
    },
    {
      name: 'Personal Portfolio Website',
      role: 'Backend Developer',
      period: 'JUL 2026',
      description:
        'Backend for a modern developer portfolio site with admin panel, JWT auth, Cloudflare-powered storage & DNS, and a review system.',
      stack: ['Spring Boot', 'Cloudflare R2', 'Cloudflare DNS', 'PostgreSQL', 'Spring Security', 'Docker'],
      links: [
        { label: 'Live', href: 'https://vuthanhluan.bond', icon: '🔗' },
      ],
      bullets: [
        { bold: 'Auth & Security:', text: 'JWT + Refresh Token rotation, role-based access control, and secured admin-only routes via Spring Security.' },
        { bold: 'Cloud Storage:', text: 'Integrated Cloudflare R2 (S3-compatible) for presigned upload/download of all media assets, eliminating local file storage.' },
        { bold: 'DNS & Domain:', text: 'Managed domain vuthanhluan.bond DNS records through Cloudflare, enabling SSL, DDoS protection, and global CDN delivery.' },
        { bold: 'Admin API:', text: 'Exposed full CRUD REST endpoints for projects, skills, and reviews, consumed by the React frontend admin panel.' },
        { bold: 'CI/CD:', text: 'Dockerized backend, deployed on Railway with automated deployment pipeline.' },
      ],
    },
  ],
};

/* ─────────────────────── SECTION HEADING ─────────────────────── */
function SectionHeading({ children }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 18 }}>
      <h2 style={{
        fontFamily: "'Inter', sans-serif",
        fontSize: '0.62rem',
        fontWeight: 800,
        letterSpacing: '0.2em',
        textTransform: 'uppercase',
        color: '#0f172a',
        whiteSpace: 'nowrap',
        margin: 0,
      }}>
        {children}
      </h2>
      <div style={{ flex: 1, height: 1, background: 'linear-gradient(to right, rgba(0,88,190,0.35), transparent)' }} />
    </div>
  );
}

/* ─────────────────────── CV DOCUMENT ─────────────────────── */
function CVDocument() {
  return (
    <div className="cv-print-area" style={{
      fontFamily: "'Inter', sans-serif",
      background: '#ffffff',
      color: '#1b1b1d',
      padding: '36px 44px',
      display: 'flex',
      flexDirection: 'column',
      gap: 26,
    }}>

      {/* ── HEADER ── */}
      <header>
        <h1 style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: '2.4rem',
          fontWeight: 800,
          letterSpacing: '-0.03em',
          lineHeight: 1,
          background: 'linear-gradient(135deg, #0f172a 0%, #0058be 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          marginBottom: 8,
        }}>
          {CV.name}
        </h1>
        <div style={{
          display: 'inline-block',
          padding: '4px 14px',
          background: 'rgba(0,88,190,0.08)',
          borderRadius: 99,
          marginBottom: 14,
        }}>
          <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#0058be', letterSpacing: '0.02em' }}>
            {CV.title}
          </span>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '7px 22px' }}>
          {CV.contacts.map((c) =>
            c.href ? (
              <a key={c.label} href={c.href}
                style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: '0.73rem', fontWeight: 500, color: '#45464d', textDecoration: 'none' }}>
                <span style={{ fontSize: '0.78rem' }}>{c.icon}</span>{c.label}
              </a>
            ) : (
              <span key={c.label}
                style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: '0.73rem', fontWeight: 500, color: '#45464d' }}>
                <span style={{ fontSize: '0.78rem' }}>{c.icon}</span>{c.label}
              </span>
            )
          )}
        </div>
      </header>

      {/* Divider */}
      <div style={{ height: 1, background: '#e4e2e4' }} />

      {/* ── SUMMARY ── */}
      <section>
        <SectionHeading>Summary</SectionHeading>
        <p style={{ fontSize: '0.8rem', lineHeight: 1.8, color: '#45464d', margin: 0 }}>
          {CV.summary}
        </p>
      </section>

      {/* ── SKILLS ── */}
      <section>
        <SectionHeading>Technical Expertise</SectionHeading>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {CV.skills.map((grp) => (
            <div key={grp.group} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
              <span style={{
                flexShrink: 0, width: 158, fontSize: '0.64rem', fontWeight: 700,
                textTransform: 'uppercase', letterSpacing: '0.06em',
                color: '#0058be', paddingTop: 4,
              }}>
                {grp.group}
              </span>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                {grp.items.map((item, i) => (
                  <span key={item} style={{
                    padding: '3px 10px', borderRadius: 6, fontSize: '0.7rem', fontWeight: 600,
                    background: i === 0 && grp.accent ? '#0f172a' : '#f0edef',
                    color: i === 0 && grp.accent ? '#ffffff' : '#1b1b1d',
                    border: '1px solid', borderColor: i === 0 && grp.accent ? 'transparent' : '#c6c6cd',
                  }}>
                    {item}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── EDUCATION ── */}
      <section>
        <SectionHeading>Education</SectionHeading>
        {CV.education.map((edu) => (
          <div key={edu.school} style={{ display: 'flex', gap: 14 }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 4 }}>
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#0058be', flexShrink: 0 }} />
              <div style={{ flex: 1, width: 2, background: '#e4e2e4', marginTop: 4 }} />
            </div>
            <div style={{ paddingBottom: 8 }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, flexWrap: 'wrap', marginBottom: 4 }}>
                <h3 style={{ fontWeight: 700, fontSize: '0.86rem', color: '#0f172a', margin: 0 }}>{edu.school}</h3>
                <span style={{
                  fontSize: '0.63rem', fontWeight: 700, fontFamily: "'JetBrains Mono', monospace",
                  padding: '2px 8px', borderRadius: 4, background: '#f0edef', color: '#45464d',
                }}>
                  {edu.period}
                </span>
              </div>
              <p style={{ fontSize: '0.76rem', fontWeight: 600, color: '#0058be', marginBottom: 2 }}>{edu.degree}</p>
              <p style={{ fontSize: '0.72rem', color: '#45464d', margin: 0 }}>{edu.gpa}</p>
            </div>
          </div>
        ))}
      </section>

      {/* ── PROJECTS ── */}
      <section>
        <SectionHeading>Featured Projects</SectionHeading>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {CV.projects.map((proj) => (
            <div key={proj.name} style={{
              background: '#f6f3f5', borderRadius: 10,
              padding: '16px 20px', border: '1px solid #e4e2e4',
            }}>
              {/* title row */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8, gap: 8 }}>
                <div>
                  <h3 style={{ fontWeight: 800, fontSize: '0.88rem', color: '#0f172a', marginBottom: 3 }}>{proj.name}</h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#0058be' }}>{proj.role}</span>
                    <span style={{ color: '#c6c6cd' }}>•</span>
                    <span style={{ fontSize: '0.68rem', color: '#45464d' }}>{proj.period}</span>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
                  {proj.links.map((l) => (
                    <a key={l.label} href={l.href} target="_blank" rel="noreferrer" style={{
                      display: 'inline-flex', alignItems: 'center', gap: 4,
                      padding: '3px 9px', borderRadius: 6,
                      background: '#ffffff', border: '1px solid #c6c6cd',
                      fontSize: '0.66rem', fontWeight: 600, color: '#0f172a', textDecoration: 'none',
                    }}>
                      {l.icon} {l.label}
                    </a>
                  ))}
                </div>
              </div>

              {/* description */}
              <p style={{
                fontSize: '0.74rem', color: '#45464d', fontStyle: 'italic',
                marginBottom: 10, paddingLeft: 10,
                borderLeft: '3px solid rgba(0,88,190,0.25)',
              }}>
                {proj.description}
              </p>

              {/* tech stack */}
              <div style={{ marginBottom: 10, display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                {proj.stack.map((t) => (
                  <span key={t} style={{
                    padding: '2px 8px', borderRadius: 5,
                    fontSize: '0.63rem', fontWeight: 700,
                    fontFamily: "'JetBrains Mono', monospace",
                    background: 'rgba(15,23,42,0.06)', color: '#0f172a',
                  }}>
                    {t}
                  </span>
                ))}
              </div>

              {/* bullets */}
              <ul style={{ display: 'flex', flexDirection: 'column', gap: 6, padding: 0, listStyle: 'none' }}>
                {proj.bullets.map((b) => (
                  <li key={b.bold} style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                    <div style={{
                      width: 5, height: 5, borderRadius: '50%',
                      background: '#0058be', marginTop: 7, flexShrink: 0,
                    }} />
                    <p style={{ fontSize: '0.73rem', lineHeight: 1.65, color: '#45464d', margin: 0 }}>
                      <strong style={{ color: '#0f172a' }}>{b.bold}</strong>{' '}{b.text}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

/* ─────────────────────── MODAL WRAPPER ─────────────────────── */
export default function CVModal({ onClose }) {
  const printAreaRef = useRef();
  const sheetRef     = useRef();
  const wrapperRef   = useRef();

  // Scale sheet to fit the wrapper width on narrow viewports
  useEffect(() => {
    const CV_WIDTH = 794;
    const applyScale = () => {
      const wrapper = wrapperRef.current;
      const sheet   = sheetRef.current;
      if (!wrapper || !sheet) return;
      const available = wrapper.clientWidth;
      if (available >= CV_WIDTH) {
        sheet.style.transform = '';
        sheet.style.marginBottom = '';
      } else {
        const s = available / CV_WIDTH;
        sheet.style.transform = `scale(${s})`;
        // Compensate collapsed height after scale (transform-origin: top center)
        const naturalH = sheet.scrollHeight;
        const scaledH  = naturalH * s;
        sheet.style.marginBottom = (scaledH - naturalH) + 'px';
      }
    };
    applyScale();
    const ro = new ResizeObserver(applyScale);
    if (wrapperRef.current) ro.observe(wrapperRef.current);
    return () => ro.disconnect();
  }, []);

  // Prevent background body scroll when CVModal is open
  useEffect(() => {
    const originalStyle = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, []);


  const handlePrint = () => {
    const printWindow = window.open('', '_blank', 'width=900,height=700');
    if (!printWindow) return;
    // Build a fully self-contained compact HTML — no class overrides needed
    const d = CV;
    const row = (b, t) =>
      `<li style="display:flex;gap:6px;align-items:flex-start;margin-bottom:2px">
         <div style="width:3.5px;height:3.5px;border-radius:50%;background:#0058be;margin-top:5px;flex-shrink:0"></div>
         <p style="font-size:0.66rem;line-height:1.4;color:#45464d;margin:0"><strong style="color:#0f172a">${b}</strong> ${t}</p>
       </li>`;

    const tag = (t, mono) =>
      `<span style="padding:1.5px 6px;border-radius:4px;font-size:0.59rem;font-weight:700;
        font-family:${mono ? "'JetBrains Mono',monospace" : "'Inter',sans-serif"};
        background:rgba(15,23,42,0.07);color:#0f172a">${t}</span>`;

    const heading = (label) =>
      `<div style="display:flex;align-items:center;gap:8px;margin-bottom:8px">
         <h2 style="font-size:0.52rem;font-weight:800;letter-spacing:.2em;text-transform:uppercase;
                    color:#0f172a;white-space:nowrap;margin:0">${label}</h2>
         <div style="flex:1;height:1px;background:linear-gradient(to right,rgba(0,88,190,.35),transparent)"></div>
       </div>`;

    const projectsHtml = d.projects.map(p => `
      <div style="background:#f6f3f5;border-radius:6px;padding:9px 13px;border:1px solid #e4e2e4;margin-bottom:6px">
        <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:4px">
          <div>
            <h3 style="font-weight:800;font-size:0.8rem;color:#0f172a;margin-bottom:2px">${p.name}</h3>
            <div style="display:flex;align-items:center;gap:5px">
              <span style="font-size:0.64rem;font-weight:700;color:#0058be">${p.role}</span>
              <span style="color:#c6c6cd">•</span>
              <span style="font-size:0.61rem;color:#45464d">${p.period}</span>
            </div>
          </div>
          <div style="display:flex;gap:4px;flex-shrink:0">
            ${p.links.map(l => `<a href="${l.href}" style="display:inline-flex;align-items:center;gap:3px;
              padding:1.5px 6px;border-radius:4px;background:#fff;border:1px solid #c6c6cd;
              font-size:0.59rem;font-weight:600;color:#0f172a;text-decoration:none">${l.icon} ${l.label}</a>`).join('')}
          </div>
        </div>
        <p style="font-size:0.63rem;color:#45464d;font-style:italic;margin-bottom:5px;
                  padding-left:7px;border-left:2.5px solid rgba(0,88,190,.25)">${p.description}</p>
        <div style="display:flex;flex-wrap:wrap;gap:4px;margin-bottom:5px">
          ${p.stack.map(t => tag(t, true)).join('')}
        </div>
        <ul style="list-style:none;padding:0">${p.bullets.map(b => row(b.bold, b.text)).join('')}</ul>
      </div>`).join('');

    const skillsHtml = d.skills.map(g => `
      <div style="display:flex;gap:8px;align-items:flex-start;margin-bottom:5px">
        <span style="flex-shrink:0;width:135px;font-size:0.56rem;font-weight:700;
                     text-transform:uppercase;letter-spacing:.06em;color:#0058be;padding-top:2px">${g.group}</span>
        <div style="display:flex;flex-wrap:wrap;gap:4px">
          ${g.items.map((item, i) =>
            `<span style="padding:1.5px 7px;border-radius:4px;font-size:0.63rem;font-weight:600;
              background:${i===0&&g.accent?'#0f172a':'#f0edef'};
              color:${i===0&&g.accent?'#fff':'#1b1b1d'};
              border:1px solid ${i===0&&g.accent?'transparent':'#c6c6cd'}">${item}</span>`).join('')}
        </div>
      </div>`).join('');

    const html = `<!DOCTYPE html><html><head><meta charset="utf-8"/>
      <title>CV – ${d.name}</title>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@500&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        body{font-family:'Inter',sans-serif;-webkit-print-color-adjust:exact;print-color-adjust:exact;background:#fff}
        @media print{@page{size:A4;margin:8mm 10mm}}
      </style>
    </head><body>
    <div style="padding:20px 26px;display:flex;flex-direction:column;gap:11px;color:#1b1b1d">

      <!-- HEADER -->
      <header style="margin-bottom:2px">
        <h1 style="font-size:1.9rem;font-weight:800;letter-spacing:-.03em;line-height:1;
                   background:linear-gradient(135deg,#0f172a,#0058be);-webkit-background-clip:text;
                   -webkit-text-fill-color:transparent;margin-bottom:5px">${d.name}</h1>
        <div style="display:inline-block;padding:2px 11px;background:rgba(0,88,190,.08);border-radius:99px;margin-bottom:8px">
          <span style="font-size:0.7rem;font-weight:700;color:#0058be;letter-spacing:.02em">${d.title}</span>
        </div>
        <div style="display:flex;flex-wrap:wrap;gap:4px 16px">
          ${d.contacts.map(c => c.href
            ? `<a href="${c.href}" style="display:flex;align-items:center;gap:3px;font-size:0.66rem;font-weight:500;color:#45464d;text-decoration:none">
                 <span>${c.icon}</span>${c.label}</a>`
            : `<span style="display:flex;align-items:center;gap:3px;font-size:0.66rem;font-weight:500;color:#45464d">
                 <span>${c.icon}</span>${c.label}</span>`).join('')}
        </div>
      </header>

      <div style="height:1px;background:#e4e2e4"></div>

      <!-- SUMMARY -->
      <section>
        ${heading('Summary')}
        <p style="font-size:0.68rem;line-height:1.55;color:#45464d">${d.summary}</p>
      </section>

      <!-- SKILLS -->
      <section>
        ${heading('Technical Expertise')}
        ${skillsHtml}
      </section>

      <!-- EDUCATION -->
      <section>
        ${heading('Education')}
        ${d.education.map(e => `
        <div style="display:flex;gap:11px">
          <div style="display:flex;flex-direction:column;align-items:center;padding-top:3px">
            <div style="width:7.5px;height:7.5px;border-radius:50%;background:#0058be;flex-shrink:0"></div>
          </div>
          <div>
            <div style="display:flex;align-items:baseline;gap:6px;flex-wrap:wrap;margin-bottom:2px">
              <h3 style="font-weight:700;font-size:0.78rem;color:#0f172a">${e.school}</h3>
              <span style="font-size:0.56rem;font-weight:700;font-family:'JetBrains Mono',monospace;
                           padding:1px 6px;border-radius:4px;background:#f0edef;color:#45464d">${e.period}</span>
            </div>
            <p style="font-size:0.68rem;font-weight:600;color:#0058be;margin-bottom:1px">${e.degree}</p>
            <p style="font-size:0.65rem;color:#45464d">${e.gpa}</p>
          </div>
        </div>`).join('')}
      </section>

      <!-- PROJECTS -->
      <section>
        ${heading('Featured Projects')}
        ${projectsHtml}
      </section>
    </div>
    <script>window.onload=()=>{window.print();window.close();}<\/script>
    </body></html>`;

    printWindow.document.write(html);
    printWindow.document.close();
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@500&display=swap');

        @keyframes cvOverlayIn { from{opacity:0} to{opacity:1} }
        @keyframes cvSheetIn {
          from{opacity:0;transform:scale(0.97) translateY(10px)}
          to{opacity:1;transform:scale(1) translateY(0)}
        }

        /* Overlay chiếm đúng toàn màn hình, không overflow ra ngoài */
        .cv-overlay {
          position:fixed;inset:0;
          width:100vw;
          height:100dvh; /* dvh tránh lỗi trên mobile khi address bar co lại */
          background:rgba(9,9,11,0.72);
          backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);
          z-index:10006;
          display:flex;
          flex-direction:column;
          align-items:center;
          overflow:hidden; /* chặn overlay tự scroll */
          animation:cvOverlayIn 0.2s ease-out;
        }
        /* Topbar luôn ở trên, không bị nén */
        .cv-topbar {
          width:100%;
          max-width:860px;
          flex-shrink:0;
          display:flex;justify-content:space-between;align-items:center;
          padding:12px 20px;
          background:rgba(15,15,20,0.94);
          border-bottom:1px solid rgba(255,255,255,0.07);
          backdrop-filter:blur(16px);
          border-radius:0 0 14px 14px;
          box-shadow:0 8px 32px rgba(0,0,0,0.4);
        }
        /* Vùng scroll: chiếm phần còn lại, min-height:0 để flex không vượt quá container */
        .cv-scroll {
          flex:1 1 0;
          min-height:0;
          overflow-y:auto;
          overflow-x:hidden;
          width:100%;
          padding:20px 0 56px;
          scrollbar-width:thin;
          scrollbar-color:rgba(255,255,255,0.12) transparent;
        }
        .cv-scroll::-webkit-scrollbar{width:6px;}
        .cv-scroll::-webkit-scrollbar-thumb{background:rgba(255,255,255,0.12);border-radius:3px;}
        /* Wrapper để tính scale đúng trên mọi viewport */
        .cv-sheet-wrapper {
          width:100%;
          max-width:826px;
          padding:0 16px;
          box-sizing:border-box;
          margin:0 auto; /* Căn giữa */
          display:flex;
          justify-content:center;
          overflow:hidden; /* chặn scale overflow */
        }
        /* Sheet CV — cố định 794px, scale bằng JS */
        .cv-sheet {
          width:794px;
          flex-shrink:0;
          background:#fff;
          border-radius:10px;
          box-shadow:0 32px 80px rgba(0,0,0,0.5),0 0 0 1px rgba(255,255,255,0.04);
          animation:cvSheetIn 0.35s cubic-bezier(0.22,1,0.36,1);
          overflow:hidden;
          transform-origin:top center; /* căn giữa khi scale */
        }
        /* Màn hình hẹp */
        @media (max-width:825px){
          .cv-scroll { padding:12px 0 48px; }
          .cv-sheet-wrapper { padding:0; }
        }
        /* Topbar mobile: thu gọn title, nút nhỏ hơn */
        @media (max-width:540px){
          .cv-topbar { padding:8px 12px; border-radius:0; }
          .cv-topbar-title { display:none; }
          .cv-btn-print { padding:7px 12px; font-size:0.74rem; gap:5px; }
          .cv-btn-print svg { display:none; }
        }
        .cv-btn-print{
          display:inline-flex;align-items:center;gap:8px;
          padding:9px 18px;border-radius:8px;
          background:linear-gradient(135deg,#4f46e5 0%,#06b6d4 100%);
          border:none;color:#fff;font-weight:600;font-size:0.8rem;
          cursor:pointer;font-family:'Inter',sans-serif;
          transition:opacity 0.2s,transform 0.2s;letter-spacing:0.01em;
        }
        .cv-btn-print:hover{opacity:0.88;transform:translateY(-1px);}
        .cv-btn-close{
          width:34px;height:34px;border-radius:8px;
          background:rgba(255,255,255,0.06);
          border:1px solid rgba(255,255,255,0.1);
          color:#a1a1aa;display:flex;align-items:center;
          justify-content:center;cursor:pointer;
          transition:all 0.2s;font-size:0.9rem;
          font-family:'Inter',sans-serif;
        }
        .cv-btn-close:hover{background:rgba(239,68,68,0.15);color:#ef4444;border-color:rgba(239,68,68,0.3);}

        /* ── PRINT: all content on 1 A4 page ── */
        @media print {
          @page { size: A4; margin: 7mm 9mm; }
          .cv-print-area {
            padding: 18px 24px !important;
            gap: 10px !important;
          }
          .cv-print-area header { margin-bottom: 4px; }
          .cv-print-area h1 { font-size: 1.65rem !important; margin-bottom: 5px !important; }
          .cv-print-area h2 { font-size: 0.52rem !important; }
          .cv-print-area h3 { font-size: 0.78rem !important; margin-bottom: 2px !important; }
          .cv-print-area p  { font-size: 0.67rem !important; line-height: 1.45 !important; }
          .cv-print-area span { font-size: 0.64rem !important; }
          .cv-print-area li  { margin-bottom: 1px; }
          .cv-print-area section { margin-bottom: 0 !important; }
          /* project cards */
          .cv-print-area [style*="background: #f6f3f5"],
          .cv-print-area [style*="background:#f6f3f5"] {
            padding: 8px 12px !important;
            margin-bottom: 6px !important;
          }
          /* skill & project stack tags */
          .cv-print-area [style*="padding: '2px 8px'"],
          .cv-print-area [style*="padding: '3px 10px'"] {
            padding: 1px 5px !important;
          }
        }

      `}</style>

      <div className="cv-overlay" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>

        {/* Top bar */}
        <div className="cv-topbar">
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 36, height: 36, borderRadius: 9,
              background: 'linear-gradient(135deg,#4f46e5,#06b6d4)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '1.1rem', flexShrink: 0,
            }}>📄</div>
            <div className="cv-topbar-title">
              <p style={{ margin: 0, fontFamily: "'Inter',sans-serif", fontWeight: 700, fontSize: '0.86rem', color: '#f4f4f5' }}>
                Curriculum Vitae
              </p>
              <p style={{ margin: 0, fontFamily: "'JetBrains Mono',monospace", fontSize: '0.64rem', color: '#71717a', letterSpacing: '0.04em' }}>
                {CV.name} · {CV.title}
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 10 }}>
            <button className="cv-btn-print" onClick={handlePrint}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="6 9 6 2 18 2 18 9"/>
                <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/>
                <rect x="6" y="14" width="12" height="8"/>
              </svg>
              Save PDF / Print
            </button>
            <button className="cv-btn-close" onClick={onClose} title="Đóng CV">✕</button>
          </div>
        </div>

        {/* CV sheet */}
        <div className="cv-scroll">
          <div className="cv-sheet-wrapper" ref={wrapperRef}>
            <div className="cv-sheet" ref={el => { printAreaRef.current = el; sheetRef.current = el; }}>
              <CVDocument />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}