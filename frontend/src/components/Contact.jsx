import { useState } from 'react';
import apiClient from '../api/apiClient';

export default function Contact() {
  const [status, setStatus] = useState('');
  const [sending, setSending] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.checkValidity()) return;

    setSending(true);
    setStatus('');
    try {
      await apiClient.post('/contact', Object.fromEntries(new FormData(form)));
      form.reset();
      setStatus('Message sent successfully.');
    } catch {
      setStatus('Unable to send your message. Please try again.');
    } finally {
      setSending(false);
    }
  };

  return (
    <section className="section contact" id="contact">
      <div className="container contact-grid">
        <div>
          <p className="eyebrow">GET IN TOUCH</p>
          <h2>Let's build something<br />together</h2>
          <p>Have a project in mind, a question, or just want to connect? I'd love to hear from you.</p>
        </div>

        <form className="contact-form" onSubmit={handleSubmit}>
          <label>
            <span>Name</span>
            <input name="name" type="text" placeholder="Your Name" required />
          </label>
          <label>
            <span>Email</span>
            <input name="email" type="email" placeholder="Your Email" required />
          </label>
          <label>
            <span>Message</span>
            <textarea name="message" rows="5" placeholder="Your Message" required></textarea>
          </label>
          <input className="contact-honeypot" name="contactGuard" type="text" tabIndex="-1" autoComplete="off" aria-hidden="true" />
          <button type="submit" disabled={sending}>
            {sending ? 'Sending...' : 'Send Message'} <span aria-hidden="true">-&gt;</span>
          </button>
          {status && <p className="form-status" role="status">{status}</p>}
        </form>
      </div>
    </section>
  );
}
