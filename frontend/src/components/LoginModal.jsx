import { useState } from 'react';
import apiClient from '../api/apiClient';

export default function LoginModal({ onClose, onSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await apiClient.post('/auth/login', { username: email, password });
      onSuccess(res.data.accessToken, res.data.refreshToken);
    } catch (err) {
      setError(err.response?.data?.message || 'Email hoặc mật khẩu không đúng');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-backdrop-custom active" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal-content-custom">
        <button className="modal-close-btn" onClick={onClose}>&times;</button>

        <div style={{ marginBottom: '24px' }}>
          <h6 style={{
            fontFamily: 'var(--font-display)', fontWeight: 700,
            color: 'var(--text-primary)', fontSize: '1.1rem', marginBottom: '6px'
          }}>
            <i className="bi bi-speedometer2" style={{ marginRight: '8px', background: 'var(--grad-main)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}></i>
            Dashboard Login
          </h6>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
            Đăng nhập để truy cập admin panel
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="rev-label">Email</label>
            <input
              type="email"
              className="rev-input"
              placeholder="admin@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label className="rev-label">Mật khẩu</label>
            <input
              type="password"
              className="rev-input"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && (
            <div style={{
              background: 'rgba(255,107,107,0.1)', border: '1px solid rgba(255,107,107,0.25)',
              borderRadius: '8px', padding: '10px 14px', marginBottom: '16px',
              fontSize: '0.82rem', color: 'var(--accent3)', display: 'flex', alignItems: 'center', gap: '8px'
            }}>
              <i className="bi bi-exclamation-circle-fill"></i> {error}
            </div>
          )}

          <div style={{ display: 'flex', gap: '10px' }}>
            <button type="submit" className="rev-submit" disabled={loading} style={{ flex: 1 }}>
              {loading ? <><i className="bi bi-arrow-repeat" style={{ animation: 'spin 1s linear infinite' }}></i> Đang đăng nhập...</> : <><i className="bi bi-box-arrow-in-right"></i> Đăng nhập</>}
            </button>
            <button type="button" className="rev-submit outline" onClick={onClose}>Huỷ</button>
          </div>
        </form>
      </div>
    </div>
  );
}
