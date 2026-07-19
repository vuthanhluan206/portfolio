import { useState, useEffect } from 'react';

const accessKey = import.meta.env.VITE_WEB3FORMS_ACCESS_KEY || '';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState({ success: null, message: '' });
  const [copiedText, setCopiedText] = useState(false);

  // 3D Card Hover Tilt Effect
  useEffect(() => {
    const handleMouseMove = (e) => {
      const cards = document.querySelectorAll('.contact-glass-card');
      const mouseX = e.clientX;
      const mouseY = e.clientY;
      
      cards.forEach(card => {
        const rect = card.getBoundingClientRect();
        const cardCenterX = rect.left + rect.width / 2;
        const cardCenterY = rect.top + rect.height / 2;
        
        const deltaX = (mouseX - cardCenterX) / window.innerWidth;
        const deltaY = (mouseY - cardCenterY) / window.innerHeight;
        
        if (window.innerWidth > 768) {
          card.style.transform = `perspective(1000px) rotateY(${deltaX * 10}deg) rotateX(${-deltaY * 10}deg)`;
        } else {
          card.style.transform = 'none';
        }
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleCopyEmail = () => {
    navigator.clipboard.writeText("Vuthanhluan4326@gmail.com");
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      setSubmitStatus({ success: false, message: 'Please fill in all required fields.' });
      return;
    }
    
    if (accessKey === "YOUR_ACCESS_KEY_HERE" || !accessKey) {
      setSubmitStatus({ 
        success: false, 
        message: 'Web3Forms ACCESS_KEY is not configured. Please get a key at web3forms.com and update the code or .env file.' 
      });
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus({ success: null, message: '' });

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({
          access_key: accessKey,
          name: formData.name,
          email: formData.email,
          subject: formData.subject || "Contact from Portfolio",
          message: formData.message
        })
      });

      const result = await response.json();
      if (result.success) {
        setSubmitStatus({ success: true, message: 'Thank you! Your message has been sent successfully.' });
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        setSubmitStatus({ success: false, message: result.message || 'An error occurred. Please try again later.' });
      }
    } catch (error) {
      setSubmitStatus({ success: false, message: 'Could not connect to the server. Please check your network connection.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <section className="section-block" id="contact" style={{ padding: '40px 0' }}>
        <div className="container">
          <div className="reveal">
            
            {/* Centered Section Header */}
            <div className="section-header text-center mb-4">
              <span className="section-label">05 — Contact</span>
              <h2 className="section-heading">Let's make something amazing together</h2>
              <p className="section-sub mt-2 mx-auto" style={{ maxWidth: '580px', fontSize: '0.9rem' }}>
                I am always open to discussing new projects, creative ideas, or collaboration opportunities in the tech world. Let's connect to bring your vision to life.
              </p>
            </div>
            
            <div className="contact-grid">
              {/* Left Side: Content & Workflow */}
              <div className="pe-lg-3 d-flex flex-column gap-3">
                {/* Process Steps */}
                <div>
                  <h3 className="contact-label uppercase tracking-widest opacity-50 mb-2" style={{ fontSize: '0.72rem' }}>Work Process</h3>
                  <div className="d-flex flex-column gap-1">
                    <div className="contact-workflow-step">
                      <div className="contact-step-num">1</div>
                      <div>
                        <h4 className="contact-step-title">Connect &amp; Discuss</h4>
                        <p className="contact-step-desc">Send your request and we will have a brief discussion.</p>
                      </div>
                    </div>
                    <div className="contact-workflow-step">
                      <div className="contact-step-num">2</div>
                      <div>
                        <h4 className="contact-step-title">Plan &amp; Solution</h4>
                        <p className="contact-step-desc">Analyze requirements and propose the optimal roadmap.</p>
                      </div>
                    </div>
                    <div className="contact-workflow-step">
                      <div className="contact-step-num">3</div>
                      <div>
                        <h4 className="contact-step-title">Collaborate &amp; Implement</h4>
                        <p className="contact-step-desc">Start development with continuous interaction.</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Social Premium Tiles */}
                <div>
                  <h3 className="contact-label uppercase tracking-widest opacity-50 mb-2" style={{ fontSize: '0.72rem' }}>Connect With Me</h3>
                  <div className="contact-social-grid mt-1">
                    <button 
                      onClick={handleCopyEmail}
                      className={`contact-social-tile copy-tooltip ${copiedText ? 'copied' : ''}`}
                      style={{ border: 'none', background: 'var(--bg-card)', textAlign: 'left', width: '100%' }}
                    >
                      <div className="contact-tile-icon">
                        <i className="bi bi-envelope"></i>
                      </div>
                      <div>
                        <h4 className="contact-tile-title">Direct Email</h4>
                        <p className="contact-tile-sub">Vuthanhluan4326@gmail.com</p>
                      </div>
                    </button>
                    
                    <a 
                      href="https://github.com/vuthanhluan206" 
                      target="_blank" 
                      rel="noreferrer" 
                      className="contact-social-tile"
                    >
                      <div className="contact-tile-icon">
                        <i className="bi bi-github"></i>
                      </div>
                      <div>
                        <h4 className="contact-tile-title">GitHub Profile</h4>
                        <p className="contact-tile-sub">View my repos</p>
                      </div>
                    </a>

                    <a 
                      href="https://www.facebook.com/vuthanh.luan.52493" 
                      target="_blank" 
                      rel="noreferrer" 
                      className="contact-social-tile"
                    >
                      <div className="contact-tile-icon">
                        <i className="bi bi-facebook"></i>
                      </div>
                      <div>
                        <h4 className="contact-tile-title">Facebook</h4>
                        <p className="contact-tile-sub">Connect with me</p>
                      </div>
                    </a>

                    <a 
                      href="https://www.tiktok.com/@_thahh.laun_" 
                      target="_blank" 
                      rel="noreferrer" 
                      className="contact-social-tile"
                    >
                      <div className="contact-tile-icon">
                        <i className="bi bi-tiktok"></i>
                      </div>
                      <div>
                        <h4 className="contact-tile-title">TikTok</h4>
                        <p className="contact-tile-sub">Creative content</p>
                      </div>
                    </a>
                  </div>
                </div>
              </div>

              {/* Right Side: Contact Form Only */}
              <div className="w-100">
                {/* Contact Form Card */}
                <div className="contact-glass-card contact-premium-border">
                  <div className="contact-orb" style={{ top: '-100px', right: '-100px' }}></div>
                  <h3 className="section-heading mb-3 text-start" style={{ fontSize: '1.4rem' }}>Send a Quick Message</h3>
                  <form onSubmit={handleSubmit} className="mt-2">
                    <div className="row g-3">
                      <div className="col-md-6">
                        <label className="contact-label">Full Name *</label>
                        <input 
                          type="text" 
                          name="name" 
                          value={formData.name} 
                          onChange={handleChange} 
                          className="contact-input" 
                          placeholder="John Doe" 
                          required 
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="contact-label">Email *</label>
                        <input 
                          type="email" 
                          name="email" 
                          value={formData.email} 
                          onChange={handleChange} 
                          className="contact-input" 
                          placeholder="example@gmail.com" 
                          required 
                        />
                      </div>
                    </div>
                    
                    <div className="mt-2">
                      <label className="contact-label">Subject</label>
                      <input 
                        type="text" 
                        name="subject" 
                        value={formData.subject} 
                        onChange={handleChange} 
                        className="contact-input" 
                        placeholder="New project collaboration" 
                      />
                    </div>
                    
                    <div className="mt-2">
                      <label className="contact-label">Message *</label>
                      <textarea 
                        name="message" 
                        value={formData.message} 
                        onChange={handleChange} 
                        className="contact-input" 
                        rows="4" 
                        placeholder="Briefly describe your project or idea..." 
                        required 
                      ></textarea>
                    </div>

                    {submitStatus.message && (
                      <div 
                        className={`alert mt-2 ${submitStatus.success ? 'alert-success' : 'alert-danger'}`} 
                        role="alert" 
                        style={{ 
                          background: submitStatus.success ? 'rgba(16, 185, 129, 0.12)' : 'rgba(239, 68, 68, 0.12)', 
                          borderColor: submitStatus.success ? 'rgba(16, 185, 129, 0.25)' : 'rgba(239, 68, 68, 0.25)', 
                          color: submitStatus.success ? '#34d399' : '#f87171',
                          padding: '8px 12px',
                          fontSize: '0.85rem'
                        }}
                      >
                        {submitStatus.message}
                      </div>
                    )}
                    
                    <button 
                      type="submit" 
                      disabled={isSubmitting} 
                      className="contact-submit-btn mt-3"
                    >
                      {isSubmitting ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                          <span>Sending...</span>
                        </>
                      ) : (
                        <>
                          <span>Send Message Now</span>
                          <i className="bi bi-send-fill contact-submit-icon"></i>
                        </>
                      )}
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="footer">
        <div className="container">
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-center gap-3">
            <div className="footer-brand">VTL<span style={{ color: 'var(--text-muted)' }}>.</span>dev</div>
            <p className="mb-0 footer-copy">© 2026 Vu Thanh Luan · Built with ☕ Java &amp; Spring Boot</p>
            <div className="d-flex gap-3">
              <a href="https://github.com/vuthanhluan206" target="_blank" rel="noreferrer" className="footer-link">GitHub</a>
              <a href="https://www.facebook.com/vuthanh.luan.52493" className="footer-link">Facebook</a>
              <a href="mailto:Vuthanhluan4326@gmail.com" className="footer-link">Vuthanhluan4326@gmail.com</a>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
