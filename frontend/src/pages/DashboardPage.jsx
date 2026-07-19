import { useEffect, useState, useCallback, Suspense, lazy } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import apiClient from '../api/apiClient';

const AdminPanel = lazy(() => import('../components/AdminPanel'));

export default function DashboardPage() {
  const { isLoggedIn, logout } = useAuth();
  const navigate = useNavigate();
  const [toasts, setToasts] = useState([]);

  // Redirect nếu chưa đăng nhập
  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login', { replace: true });
    }
  }, [isLoggedIn, navigate]);

  // Reset cursor về bình thường khi vào Dashboard (không có coffee cursor)
  useEffect(() => {
    document.body.style.cursor = 'auto';
    document.documentElement.style.cursor = 'auto';
    // Override CSS cursor: none trên toàn trang
    const style = document.createElement('style');
    style.id = 'dashboard-cursor-override';
    style.textContent = 'body, body * { cursor: auto !important; } body a, body button { cursor: pointer !important; }';
    document.head.appendChild(style);
    return () => {
      document.body.style.cursor = '';
      document.documentElement.style.cursor = '';
      document.getElementById('dashboard-cursor-override')?.remove();
    };
  }, []);

  // ── Toast ──
  const dismissToast = useCallback((id) => {
    setToasts(t => t.map(x => x.id === id ? { ...x, exiting: true } : x));
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 400);
  }, []);

  const showToast = useCallback((message, type = 'success') => {
    const id = Date.now();
    const duration = type === 'success' ? 2000 : 4000;
    setToasts(t => [...t, { id, message, type, exiting: false, duration }]);
    setTimeout(() => dismissToast(id), duration);
  }, [dismissToast]);

  const handleLogout = async () => {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken) {
        await apiClient.post('/auth/logout', { refreshToken });
      }
    } catch {
      // silently ignore
    }
    logout();
    showToast('Đã đăng xuất', 'success');
    setTimeout(() => navigate('/', { replace: true }), 500);
  };

  const handleClose = () => {
    navigate('/', { replace: true });
  };

  const handleProfileUpdate = useCallback(async () => {
    // Profile updated callback — refresh data nếu cần
  }, []);

  if (!isLoggedIn) return null;

  return (
    <>
      <Suspense fallback={
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: '#0b0c10', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
          <i className="bi bi-arrow-repeat" style={{ fontSize: '2.5rem', animation: 'spin 1.5s linear infinite', color: 'var(--accent)', marginBottom: 16 }} />
          <div style={{ fontSize: '0.88rem', letterSpacing: '0.05em' }}>ĐANG TẢI BẢNG ĐIỀU KHIỂN...</div>
        </div>
      }>
        <AdminPanel
          onClose={handleClose}
          onLogout={handleLogout}
          showToast={showToast}
          onProfileUpdate={handleProfileUpdate}
        />
      </Suspense>

      {/* Toast notifications */}
      <div className="toast-container">
        {toasts.map(t => (
          <div key={t.id} className={`toast ${t.type}${t.exiting ? ' exiting' : ''}`}>
            <i className={`bi ${t.type === 'success' ? 'bi-check-circle-fill' : 'bi-exclamation-circle-fill'}`} style={{ fontSize: '1.1rem', flexShrink: 0 }} />
            <span style={{ flex: 1 }}>{t.message}</span>
            <button
              onClick={() => dismissToast(t.id)}
              className="toast-close-btn"
              title="Đóng"
            >
              <i className="bi bi-x-lg" />
            </button>
            <div className={`toast-progress ${t.type}`} style={{ animationDuration: t.duration ? `${t.duration}ms` : '4000ms' }} />
          </div>
        ))}
      </div>
    </>
  );
}
