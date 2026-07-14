export default function About({ user }) {
  // Hiển thị bio từ DB dạng nhiều đoạn, tách theo dòng trống
  const bioParagraphs = (user?.bio || '').split(/\n\n+/).filter(p => p.trim());
  return (
    <section className="section-block" id="about">
      <div className="container">
        <div className="section-header mb-4 text-center text-md-start">
          <span className="section-label">01 — Introduction</span>
          <h2 className="section-heading">About Me</h2>
        </div>
        <div className="row g-4">
          <div className="col-lg-8">
            <div className="about-card reveal">
              {bioParagraphs.length > 0 ? (
                bioParagraphs.map((para, i) => (
                  <p key={i} className={i === bioParagraphs.length - 1 ? 'mb-0' : ''}>{para}</p>
                ))
              ) : (
                <p>Hi! I'm <strong>{user?.fullname || 'Vũ Thành Luân'}</strong>, a third-year Information Technology student with a clear goal: becoming a professional <strong>Fullstack Developer</strong>.</p>
              )}
              <p className="mb-0" style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>"There are no shortcuts to mastery" — so I learn every day and keep pushing forward.</p>
            </div>
          </div>
          <div className="col-lg-4">
            <div className="code-card reveal">
              <div className="code-dots">
                <span className="dot-red"></span><span className="dot-yellow"></span><span className="dot-green"></span>
              </div>
              <pre className="code-content" dangerouslySetInnerHTML={{ __html: `<span class="c-kw">public class</span> <span class="c-cl">Developer</span> {
  <span class="c-kw">private</span> String name =
    <span class="c-str">"${user?.fullname || "Vu Thanh Luan"}"</span>;
  <span class="c-kw">private</span> String role =
    <span class="c-str">"Java Backend Developer"</span>;
  <span class="c-kw">private</span> String goal =
    <span class="c-str">"Professional Fullstack"</span>;

  <span class="c-kw">public void</span> <span class="c-fn">code</span>() {
    System.out.println(
      <span class="c-str">"Building... 🚀"</span>
    );
  }
}` }} />
            </div>
            <div className="info-card mt-3 reveal">
              <ul className="info-list">
                <li><i className="bi bi-mortarboard"></i><span>3rd Year — Information Technology</span></li>
                <li><i className="bi bi-geo-alt"></i><span>Vietnam</span></li>
                <li><i className="bi bi-bullseye"></i><span>Goal: Fullstack Developer</span></li>
                <li><i className="bi bi-book"></i><span>Currently learning: React</span></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
