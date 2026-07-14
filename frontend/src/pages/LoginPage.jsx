import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import apiClient from '../api/apiClient';
import StarBackground from '../components/StarBackground';

export default function LoginPage() {
  const { isLoggedIn, login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPw, setShowPw] = useState(false);

  // Nếu đã đăng nhập thì chuyển thẳng vào dashboard
  useEffect(() => {
    if (isLoggedIn) {
      navigate('/dashboard', { replace: true });
    }
  }, [isLoggedIn, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await apiClient.post('/auth/login', { username: email, password });
      login(res.data.accessToken, res.data.refreshToken);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'Email hoặc mật khẩu không đúng');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <StarBackground />

      <div className="login-page-card">
        {/* Logo / Header */}
        <div className="login-page-logo">
          <div className="login-page-logo-icon">
            <i className="bi bi-speedometer2" />
          </div>
          <div>
            <h1 className="login-page-title">Admin<span>Hub</span></h1>
            <p className="login-page-subtitle">Đăng nhập để truy cập dashboard</p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="login-page-form">
          <div className="login-page-field">
            <label className="login-page-label">
              <i className="bi bi-envelope-fill" /> Email
            </label>
            <input
              type="email"
              className="login-page-input"
              placeholder="admin@example.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              autoComplete="username"
              required
            />
          </div>

          <div className="login-page-field">
            <label className="login-page-label">
              <i className="bi bi-lock-fill" /> Mật khẩu
            </label>
            <div className="login-page-pw-wrapper">
              <input
                type={showPw ? 'text' : 'password'}
                className="login-page-input"
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                autoComplete="current-password"
                required
              />
              <button
                type="button"
                className="login-page-pw-toggle"
                onClick={() => setShowPw(v => !v)}
                tabIndex={-1}
              >
                <i className={`bi ${showPw ? 'bi-eye-slash-fill' : 'bi-eye-fill'}`} />
              </button>
            </div>
          </div>

          {error && (
            <div className="login-page-error">
              <i className="bi bi-exclamation-circle-fill" />
              <span>{error}</span>
            </div>
          )}

          <button type="submit" className="login-page-btn" disabled={loading}>
            {loading
              ? <><i className="bi bi-arrow-repeat" style={{ animation: 'spin 1s linear infinite' }} /> Đang đăng nhập...</>
              : <><i className="bi bi-box-arrow-in-right" /> Đăng nhập</>
            }
          </button>
        </form>

        {/* Back link */}
        <div className="login-page-back">
          <Link to="/" className="login-page-back-link">
            <i className="bi bi-arrow-left" /> Quay về trang chủ
          </Link>
        </div>
      </div>
    </div>
  );
}
