import { useState, useEffect, useRef, useCallback } from 'react';
import apiClient from '../api/apiClient';

const USER_ID = 1;

const getErrorMessage = (err) => {
  if (!err) return 'Đã xảy ra lỗi không xác định';
  return err.response?.data?.message || 
         (typeof err.response?.data === 'string' ? err.response.data : null) || 
         err.message || 
         'Đã xảy ra lỗi không xác định';
};

/* ─── Inline SVG Line Chart ─────────────────────────────── */
function VisitChart({ data }) {
  if (!data || data.length === 0) {
    return (
      <div style={{ height: 220, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: '0.82rem' }}>
        <i className="bi bi-bar-chart" style={{ fontSize: '2rem', display: 'block', marginBottom: 8 }} />
        Chưa có dữ liệu truy cập
      </div>
    );
  }

  const W = 800, H = 220, PAD = { top: 20, right: 20, bottom: 50, left: 48 };
  const chartW = W - PAD.left - PAD.right;
  const chartH = H - PAD.top - PAD.bottom;
  const actualMax = Math.max(...data.map(d => d.totalVisits), 0);
  const maxVal = actualMax === 0 ? 10 : actualMax;
  const step = chartW / (data.length - 1 || 1);

  const pts = data.map((d, i) => ({
    x: PAD.left + i * step,
    y: PAD.top + chartH - (d.totalVisits / maxVal) * chartH,
    v: d.totalVisits,
    label: d.date,
  }));

  const linePath = pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ');
  const areaPath = `${linePath} L${pts[pts.length - 1].x.toFixed(1)},${(PAD.top + chartH).toFixed(1)} L${PAD.left},${(PAD.top + chartH).toFixed(1)} Z`;

  // Y grid lines
  const yLines = [0, 0.25, 0.5, 0.75, 1].map(t => ({
    y: PAD.top + chartH - t * chartH,
    label: Math.round(maxVal * t),
  }));

  // X labels (show every N-th)
  const showEvery = data.length > 10 ? Math.ceil(data.length / 7) : 1;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid meet"
      style={{ width: '100%', height: 'auto', overflow: 'visible' }}>
      <defs>
        <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgba(108,99,255,0.35)" />
          <stop offset="100%" stopColor="rgba(108,99,255,0)" />
        </linearGradient>
        <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#6c63ff" />
          <stop offset="100%" stopColor="#a855f7" />
        </linearGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>

      {/* Grid lines */}
      {yLines.map((gl, i) => (
        <g key={i}>
          <line x1={PAD.left} y1={gl.y} x2={W - PAD.right} y2={gl.y}
            stroke="rgba(255,255,255,0.05)" strokeWidth="1" strokeDasharray="4,4" />
          <text x={PAD.left - 8} y={gl.y + 4} textAnchor="end"
            fontSize="10" fill="rgba(255,255,255,0.3)" fontFamily="monospace">{gl.label}</text>
        </g>
      ))}

      {/* Area fill */}
      <path d={areaPath} fill="url(#chartGrad)" />

      {/* Line */}
      <path d={linePath} fill="none" stroke="url(#lineGrad)" strokeWidth="2.5"
        strokeLinejoin="round" strokeLinecap="round" filter="url(#glow)" />

      {/* X axis labels */}
      {pts.filter((_, i) => i % showEvery === 0 || i === pts.length - 1).map((p, i) => {
        const d = new Date(p.label);
        const label = `${d.getDate()}/${d.getMonth() + 1}`;
        return (
          <text key={i} x={p.x} y={PAD.top + chartH + 20} textAnchor="middle"
            fontSize="10" fill="rgba(255,255,255,0.4)" fontFamily="monospace">{label}</text>
        );
      })}

      {/* Data points */}
      {pts.map((p, i) => (
        <g key={i}>
          <circle cx={p.x} cy={p.y} r="4" fill="#6c63ff" stroke="rgba(108,99,255,0.3)" strokeWidth="6" />
          <circle cx={p.x} cy={p.y} r="2.5" fill="#fff" />
        </g>
      ))}
    </svg>
  );
}

/* ─── Tab: Analytics ─────────────────────────────────────── */
function AnalyticsTab({ showToast }) {
  const [period, setPeriod] = useState(14);
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadData = useCallback(async (days) => {
    setLoading(true);
    try {
      const toDate = new Date();
      const fromDate = new Date();
      fromDate.setDate(fromDate.getDate() - days + 1);
      const fmt = d => d.toISOString().split('T')[0];

      // Tạo skeleton đủ ngày, mặc định 0 lượt
      const skeleton = {};
      for (let i = 0; i < days; i++) {
        const d = new Date(fromDate);
        d.setDate(d.getDate() + i);
        skeleton[fmt(d)] = 0;
      }

      // Merge dữ liệu thực từ API vào skeleton
      const res = await apiClient.get(`/daily-visit-stat?from=${fmt(fromDate)}&to=${fmt(toDate)}`);
      (res.data || []).forEach(r => { skeleton[r.date] = r.totalVisits; });

      // Chuyển sang mảng theo thứ tự ngày
      const merged = Object.entries(skeleton)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([date, totalVisits]) => ({ date, totalVisits }));

      setChartData(merged);
    } catch {
      showToast('Không thể tải dữ liệu truy cập', 'error');
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => { loadData(period); }, [period, loadData]);

  const totalVisits = chartData.reduce((s, d) => s + d.totalVisits, 0);
  const avgVisits = chartData.length ? Math.round(totalVisits / chartData.length) : 0;
  const maxDay = chartData.reduce((a, d) => d.totalVisits > (a?.totalVisits || 0) ? d : a, null);
  const todayStr = new Date().toISOString().split('T')[0];
  const todayVisits = chartData.find(d => d.date === todayStr)?.totalVisits || 0;

  return (
    <div className="admin-body">
      {/* Stats Cards */}
      <div className="stats-grid">
        {[
          { label: `Tổng ${period} ngày`, value: totalVisits.toLocaleString(), sub: 'lượt truy cập', icon: 'bi-eye-fill' },
          { label: 'Hôm nay', value: todayVisits.toLocaleString(), sub: 'lượt truy cập', icon: 'bi-calendar-day' },
          { label: 'Trung bình / ngày', value: avgVisits.toLocaleString(), sub: 'lượt / ngày', icon: 'bi-graph-up' },
          { label: 'Ngày cao nhất', value: maxDay ? maxDay.totalVisits.toLocaleString() : '—', sub: maxDay ? `(${new Date(maxDay.date).toLocaleDateString('vi-VN')})` : 'Chưa có', icon: 'bi-trophy-fill' },
        ].map((s, i) => (
          <div className="stat-card" key={i}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div className="stat-card-label">{s.label}</div>
              <i className={`bi ${s.icon}`} style={{ color: 'var(--accent)', opacity: 0.7, fontSize: '1rem' }} />
            </div>
            <div className="stat-card-value">{s.value}</div>
            <div className="stat-card-sub">{s.sub}</div>
          </div>
        ))}
      </div>

      {/* Chart */}
      <div className="chart-container">
        <div className="chart-header">
          <div className="chart-title">
            <i className="bi bi-bar-chart-line-fill" />
            Lượt truy cập theo ngày
          </div>
          <div className="chart-periods">
            {[7, 14, 30].map(d => (
              <button key={d}
                className={`chart-period-btn${period === d ? ' active' : ''}`}
                onClick={() => setPeriod(d)}>
                {d} ngày
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div style={{ height: 220, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
            <i className="bi bi-arrow-repeat" style={{ animation: 'spin 1s linear infinite', fontSize: '1.5rem' }} />
          </div>
        ) : (
          <VisitChart data={chartData} />
        )}
      </div>

      {/* Visit Table */}
      {chartData.length > 0 && (
        <div className="chart-container">
          <div className="chart-title" style={{ marginBottom: 16 }}>
            <i className="bi bi-table" /> Chi tiết theo ngày
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem', fontFamily: 'var(--font-mono)' }}>
              <thead>
                <tr>
                  {['Ngày', 'Lượt truy cập', 'So hôm qua'].map(h => (
                    <th key={h} style={{ padding: '8px 12px', textAlign: 'left', color: 'var(--text-muted)', borderBottom: '1px solid var(--border)', fontWeight: 600, fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[...chartData].reverse().map((d, i, arr) => {
                  const prev = arr[i + 1]?.totalVisits || 0;
                  const diff = d.totalVisits - prev;
                  return (
                    <tr key={d.date} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                      <td style={{ padding: '10px 12px', color: 'var(--text-secondary)' }}>
                        {new Date(d.date).toLocaleDateString('vi-VN', { weekday: 'short', day: '2-digit', month: '2-digit', year: 'numeric' })}
                      </td>
                      <td style={{ padding: '10px 12px', color: 'var(--text-primary)', fontWeight: 700 }}>
                        {d.totalVisits.toLocaleString()}
                      </td>
                      <td style={{ padding: '10px 12px', color: diff > 0 ? '#22c55e' : diff < 0 ? '#f87171' : 'var(--text-muted)' }}>
                        {i === arr.length - 1 ? '—' : `${diff > 0 ? '+' : ''}${diff}`}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── Tab: Profile ───────────────────────────────────────── */

// Regex kiểm tra độ mạnh mật khẩu
const PW_RULES = [
  { id: 'len',     label: 'Ít nhất 8 ký tự',          test: (v) => v.length >= 8 },
  { id: 'letter',  label: 'Có chữ cái (a-z / A-Z)',   test: (v) => /[a-zA-Z]/.test(v) },
  { id: 'number',  label: 'Có chữ số (0-9)',           test: (v) => /[0-9]/.test(v) },
  { id: 'special', label: 'Có ký tự đặc biệt (!@#…)', test: (v) => /[^a-zA-Z0-9]/.test(v) },
];

function PasswordStrength({ password }) {
  if (!password) return null;
  const passed = PW_RULES.filter(r => r.test(password)).length;
  const colors = ['#ff4444', '#ff9a56', '#fbbf24', '#22c55e'];
  const labels = ['Rất yếu', 'Yếu', 'Trung bình', 'Mạnh'];
  const barColor = colors[passed - 1] || '#ff4444';

  return (
    <div style={{ marginTop: 10 }}>
      {/* Strength bar */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 8 }}>
        {[0, 1, 2, 3].map(i => (
          <div key={i} style={{
            flex: 1, height: 4, borderRadius: 4,
            background: i < passed ? barColor : 'rgba(255,255,255,0.08)',
            transition: 'background 0.3s',
          }} />
        ))}
      </div>
      {/* Strength label */}
      <div style={{ fontSize: '0.72rem', color: barColor, fontFamily: 'var(--font-mono)', marginBottom: 8, fontWeight: 600 }}>
        {passed > 0 ? labels[passed - 1] : ''}
      </div>
      {/* Checklist */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        {PW_RULES.map(r => {
          const ok = r.test(password);
          return (
            <div key={r.id} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.73rem', fontFamily: 'var(--font-mono)', color: ok ? '#22c55e' : 'var(--text-muted)', transition: 'color 0.2s' }}>
              <i className={`bi ${ok ? 'bi-check-circle-fill' : 'bi-circle'}`} style={{ fontSize: '0.7rem' }} />
              {r.label}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ProfileTab({ showToast, onProfileUpdate, currentAvatar, user }) {
  const [profile, setProfile] = useState({ fullname: '', bio: '', facebook: '', github: '', tiktok: '', instagram: '' });
  const [saving, setSaving] = useState(false);

  // ── Đổi mật khẩu ──
  const [pwForm, setPwForm] = useState({ newPw: '', confirmPw: '' });
  const [showNewPw, setShowNewPw]         = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);
  const [savingPw, setSavingPw]           = useState(false);
  const [pwError, setPwError]             = useState('');

  useEffect(() => {
    if (user) {
      setProfile({
        fullname: user.fullname || '',
        bio: user.bio || '',
        facebook: user.facebook || '',
        github: user.github || '',
        tiktok: user.tiktok || '',
        instagram: user.instagram || ''
      });
    }
  }, [user]);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = { username: localStorage.getItem('adminEmail') || '', password: '***', ...profile };
      await apiClient.put(`/user/update/${USER_ID}`, payload);
      showToast('Cập nhật thông tin thành công!', 'success');
      if (onProfileUpdate) onProfileUpdate();
    } catch (err) {
      showToast('Cập nhật thất bại: ' + getErrorMessage(err), 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleChangePw = async (e) => {
    e.preventDefault();
    setPwError('');

    // Client-side validation
    const { newPw, confirmPw } = pwForm;
    const failed = PW_RULES.filter(r => !r.test(newPw));
    if (failed.length > 0) {
      setPwError('Mật khẩu chưa đạt: ' + failed.map(r => r.label.toLowerCase()).join(', '));
      return;
    }
    if (newPw !== confirmPw) {
      setPwError('Mật khẩu xác nhận không khớp');
      return;
    }

    setSavingPw(true);
    try {
      await apiClient.put(`/user/update/${USER_ID}`, {
        username: localStorage.getItem('adminEmail') || '',
        password: newPw,
        ...profile,
      });
      showToast('Đổi mật khẩu thành công!', 'success');
      setPwForm({ newPw: '', confirmPw: '' });
    } catch (err) {
      setPwError('Đổi mật khẩu thất bại: ' + getErrorMessage(err));
    } finally {
      setSavingPw(false);
    }
  };

  const fields = [
    { key: 'fullname', label: 'Họ và tên', placeholder: 'Vũ Thành Luân' },
    { key: 'bio', label: 'Bio / Giới thiệu', placeholder: 'Java Backend Developer...', textarea: true },
    { key: 'facebook', label: 'Facebook URL', placeholder: 'https://facebook.com/...' },
    { key: 'github', label: 'GitHub URL', placeholder: 'https://github.com/...' },
    { key: 'tiktok', label: 'TikTok URL', placeholder: 'https://tiktok.com/...' },
    { key: 'instagram', label: 'Instagram URL', placeholder: 'https://instagram.com/...' },
  ];

  return (
    <div className="admin-body">
      {/* Current avatar preview in profile tab */}
      {currentAvatar && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '16px 20px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 14 }}>
          <img src={currentAvatar} alt="avatar" style={{ width: 56, height: 56, borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--accent)' }} />
          <div>
            <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-primary)' }}>{profile.fullname || 'Vũ Thành Luân'}</div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', marginTop: 2 }}>{profile.bio || 'Developer'}</div>
          </div>
        </div>
      )}

      {/* ── Thông tin cá nhân ── */}
      <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {fields.map(({ key, label, placeholder, textarea }) => (
          <div key={key} className="admin-field">
            <label className="admin-label">{label}</label>
            {textarea ? (
              <textarea className="admin-textarea" placeholder={placeholder} value={profile[key]}
                onChange={e => setProfile({ ...profile, [key]: e.target.value })} rows={3} />
            ) : (
              <input className="admin-input" type="text" placeholder={placeholder} value={profile[key]}
                onChange={e => setProfile({ ...profile, [key]: e.target.value })} />
            )}
          </div>
        ))}
        <div style={{ paddingTop: 8 }}>
          <button type="submit" className="admin-btn" disabled={saving}>
            {saving ? <><i className="bi bi-arrow-repeat" style={{ animation: 'spin 1s linear infinite' }} /> Đang lưu...</> : <><i className="bi bi-check-lg" /> Lưu thay đổi</>}
          </button>
        </div>
      </form>

      {/* ── Divider ── */}
      <div style={{ borderTop: '1px solid var(--border)', margin: '24px 0' }} />

      {/* ── Đổi mật khẩu ── */}
      <div style={{ fontSize: '0.78rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 16 }}>
        <i className="bi bi-shield-lock-fill" style={{ marginRight: 6, color: 'var(--accent)' }} />
        Đổi mật khẩu
      </div>

      <form onSubmit={handleChangePw} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {/* Mật khẩu mới */}
        <div className="admin-field">
          <label className="admin-label">Mật khẩu mới</label>
          <div style={{ position: 'relative' }}>
            <input
              className="admin-input"
              type={showNewPw ? 'text' : 'password'}
              placeholder="Nhập mật khẩu mới..."
              value={pwForm.newPw}
              onChange={e => { setPwForm({ ...pwForm, newPw: e.target.value }); setPwError(''); }}
              style={{ paddingRight: 44 }}
            />
            <button type="button" onClick={() => setShowNewPw(v => !v)}
              style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '0.9rem', display: 'flex', alignItems: 'center' }}>
              <i className={`bi ${showNewPw ? 'bi-eye-slash-fill' : 'bi-eye-fill'}`} />
            </button>
          </div>
          {/* Strength indicator */}
          <PasswordStrength password={pwForm.newPw} />
        </div>

        {/* Xác nhận mật khẩu */}
        <div className="admin-field">
          <label className="admin-label">Xác nhận mật khẩu mới</label>
          <div style={{ position: 'relative' }}>
            <input
              className="admin-input"
              type={showConfirmPw ? 'text' : 'password'}
              placeholder="Nhập lại mật khẩu..."
              value={pwForm.confirmPw}
              onChange={e => { setPwForm({ ...pwForm, confirmPw: e.target.value }); setPwError(''); }}
              style={{ paddingRight: 44 }}
            />
            <button type="button" onClick={() => setShowConfirmPw(v => !v)}
              style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '0.9rem', display: 'flex', alignItems: 'center' }}>
              <i className={`bi ${showConfirmPw ? 'bi-eye-slash-fill' : 'bi-eye-fill'}`} />
            </button>
          </div>
          {/* Match indicator */}
          {pwForm.confirmPw && (
            <div style={{ marginTop: 6, fontSize: '0.73rem', fontFamily: 'var(--font-mono)', display: 'flex', alignItems: 'center', gap: 5, color: pwForm.newPw === pwForm.confirmPw ? '#22c55e' : '#f87171' }}>
              <i className={`bi ${pwForm.newPw === pwForm.confirmPw ? 'bi-check-circle-fill' : 'bi-x-circle-fill'}`} />
              {pwForm.newPw === pwForm.confirmPw ? 'Mật khẩu khớp' : 'Mật khẩu không khớp'}
            </div>
          )}
        </div>

        {pwError && (
          <div style={{ background: 'rgba(255,107,107,0.08)', border: '1px solid rgba(255,107,107,0.2)', borderRadius: 10, padding: '10px 14px', fontSize: '0.82rem', color: 'var(--accent3)', display: 'flex', alignItems: 'center', gap: 8 }}>
            <i className="bi bi-exclamation-circle-fill" /> {pwError}
          </div>
        )}

        <button type="submit" className="admin-btn" disabled={savingPw || !pwForm.newPw || !pwForm.confirmPw}
          style={{ background: 'linear-gradient(135deg, #6c63ff 0%, #a855f7 100%)' }}>
          {savingPw
            ? <><i className="bi bi-arrow-repeat" style={{ animation: 'spin 1s linear infinite' }} /> Đang đổi...</>
            : <><i className="bi bi-shield-check" /> Đổi mật khẩu</>
          }
        </button>
      </form>
    </div>
  );
}

/* ─── Tab: Avatar ────────────────────────────────────────── */
function AvatarTab({ showToast, onProfileUpdate, currentAvatar, setCurrentAvatar, user }) {
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [avatarFile, setAvatarFile]       = useState(null);
  const [uploading, setUploading]         = useState(false);
  const fileInputRef = useRef();

  const history = user?.avatarHistory || [];
  const loadingHistory = !user;

  // ── Chọn avatar từ history (0 tốn R2) ──
  const handleSelectFromHistory = async (url) => {
    if (url === currentAvatar) return; // đã dùng rồi
    setUploading(true);
    try {
      await apiClient.post(`/user/avatar/select?id=${USER_ID}`, { url });
      setCurrentAvatar(url);
      showToast('Đã đổi avatar!', 'success');
      if (onProfileUpdate) onProfileUpdate();
    } catch (err) {
      showToast('Đổi avatar thất bại: ' + getErrorMessage(err), 'error');
    } finally {
      setUploading(false);
    }
  };

  // ── Xóa URL khỏi history ──
  const handleRemoveFromHistory = async (url, e) => {
    e.stopPropagation();
    if (!window.confirm('Xóa ảnh này khỏi lịch sử?')) return;
    try {
      await apiClient.delete(`/user/avatar/history?id=${USER_ID}`, { data: { url } });
      showToast('Đã xóa khỏi lịch sử', 'success');
      if (onProfileUpdate) onProfileUpdate();
    } catch (err) {
      showToast('Xóa thất bại: ' + getErrorMessage(err), 'error');
    }
  };

  // ── Upload ảnh mới lên R2 ──
  const handleChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const handleUpload = async () => {
    if (!avatarFile) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('file', avatarFile);
      await apiClient.post(`/user/avatar?id=${USER_ID}`, fd, {
        headers: { 'Content-Type': undefined },
        timeout: 60000, // Tăng timeout cho upload ảnh
      });
      showToast('Upload avatar thành công!', 'success');
      setAvatarFile(null);
      setAvatarPreview(null);
      if (onProfileUpdate) onProfileUpdate();
    } catch (err) {
      showToast('Upload thất bại: ' + getErrorMessage(err), 'error');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="admin-body">

      {/* ── Gallery lịch sử ── */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <div style={{ fontSize: '0.78rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            <i className="bi bi-images" style={{ marginRight: 6, color: 'var(--accent)' }} />
            Lịch sử avatar ({history.length})
          </div>
          <button onClick={onProfileUpdate} style={{ background: 'none', border: 'none', color: 'var(--accent)', fontSize: '0.78rem', fontFamily: 'var(--font-mono)', cursor: 'none', display: 'flex', alignItems: 'center', gap: 4 }}>
            <i className="bi bi-arrow-clockwise" /> Làm mới
          </button>
        </div>

        {loadingHistory ? (
          <div style={{ textAlign: 'center', padding: '32px 0', color: 'var(--text-muted)' }}>
            <i className="bi bi-arrow-repeat" style={{ animation: 'spin 1s linear infinite', fontSize: '1.5rem' }} />
          </div>
        ) : history.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '32px 0', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: '0.82rem', border: '1px dashed var(--border)', borderRadius: 12 }}>
            <i className="bi bi-images" style={{ fontSize: '2rem', display: 'block', marginBottom: 8, opacity: 0.4 }} />
            Chưa có ảnh nào trong lịch sử.<br />Upload ảnh đầu tiên bên dưới.
          </div>
        ) : (
          <div className="avatar-history-grid">
            {history.map((url) => {
              const isActive = url === currentAvatar;
              return (
                <div
                  key={url}
                  className={`avatar-history-item${isActive ? ' active' : ''}`}
                  onClick={() => handleSelectFromHistory(url)}
                  title={isActive ? 'Đang sử dụng' : 'Click để dùng ảnh này'}
                >
                  <img src={url} alt="avatar" />

                  {/* Badge "Đang dùng" */}
                  {isActive && (
                    <div className="avatar-history-badge">
                      <i className="bi bi-check-circle-fill" /> Đang dùng
                    </div>
                  )}

                  {/* Nút xóa khỏi history */}
                  <button
                    className="avatar-history-remove"
                    onClick={(e) => handleRemoveFromHistory(url, e)}
                    title="Xóa khỏi lịch sử"
                  >
                    <i className="bi bi-x" />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Divider */}
      <div style={{ borderTop: '1px solid var(--border)', marginBottom: 20 }} />

      {/* ── Upload ảnh mới ── */}
      <div style={{ fontSize: '0.78rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>
        <i className="bi bi-cloud-upload" style={{ marginRight: 6, color: 'var(--accent)' }} />
        Upload ảnh mới
      </div>
      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', marginBottom: 10 }}>
        Ảnh mới sẽ được lưu vào Cloudflare R2 và thêm vào gallery. Tối đa 10MB, JPG/PNG/WEBP.
      </div>

      <div className="avatar-upload-zone"
        onClick={() => fileInputRef.current?.click()}
        onDragOver={e => { e.preventDefault(); e.currentTarget.classList.add('drag-over'); }}
        onDragLeave={e => e.currentTarget.classList.remove('drag-over')}
        onDrop={e => {
          e.preventDefault();
          e.currentTarget.classList.remove('drag-over');
          const file = e.dataTransfer.files[0];
          if (file) { setAvatarFile(file); setAvatarPreview(URL.createObjectURL(file)); }
        }}>
        <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/webp" onChange={handleChange} style={{ display: 'none' }} />
        {avatarPreview ? (
          <>
            <img src={avatarPreview} alt="preview" className="avatar-preview" />
            <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>{avatarFile?.name}</div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', marginTop: 4 }}>Click hoặc kéo thả để đổi ảnh</div>
          </>
        ) : (
          <>
            <i className="bi bi-cloud-upload" style={{ fontSize: '2rem', color: 'var(--accent)', marginBottom: 10, display: 'block' }} />
            <div style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: 4 }}>Kéo thả hoặc click để chọn ảnh</div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>JPG, PNG, WEBP · Tối đa 10MB</div>
          </>
        )}
      </div>

      {avatarFile && (
        <button className="admin-btn" onClick={handleUpload} disabled={uploading} style={{ width: '100%', marginTop: 10 }}>
          {uploading
            ? <><i className="bi bi-arrow-repeat" style={{ animation: 'spin 1s linear infinite' }} /> Đang upload...</>
            : <><i className="bi bi-cloud-upload" /> Upload ảnh mới</>
          }
        </button>
      )}
    </div>
  );
}

/* ─── Tab: Reviews ───────────────────────────────────────── */
function ReviewsTab({ showToast }) {
  const [reviews, setReviews] = useState([]);
  const load = () => {
    apiClient.get('/review').then(r => setReviews(r.data)).catch(() => showToast('Không thể tải reviews', 'error'));
  };
  useEffect(load, []);

  const deleteReview = async (id) => {
    if (!window.confirm('Xóa review này?')) return;
    try {
      await apiClient.delete(`/review/delete/${id}`);
      setReviews(p => p.filter(r => r.id !== id));
      showToast('Đã xóa review', 'success');
    } catch { showToast('Xóa thất bại', 'error'); }
  };

  const stars = (n) => Array.from({ length: 5 }, (_, i) => (
    <i key={i} className="bi bi-star-fill" style={{ fontSize: '0.75rem', color: i < n ? '#fbbf24' : 'rgba(108,99,255,0.2)' }} />
  ));

  return (
    <div className="admin-body">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>{reviews.length} reviews</div>
        <button onClick={load} style={{ background: 'none', border: 'none', color: 'var(--accent)', fontSize: '0.78rem', fontFamily: 'var(--font-mono)', cursor: 'none', display: 'flex', alignItems: 'center', gap: 4 }}>
          <i className="bi bi-arrow-clockwise" /> Làm mới
        </button>
      </div>

      {reviews.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '48px 0', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: '0.82rem' }}>
          <i className="bi bi-inbox" style={{ fontSize: '2rem', display: 'block', marginBottom: 10 }} />
          Chưa có review nào
        </div>
      ) : (
        reviews.map(r => (
          <div key={r.id} className="admin-review-item">
            <div className="admin-review-info">
              <div className="admin-review-name">{r.name}</div>
              <div className="admin-review-role">{r.role} · {r.email}</div>
              <div style={{ display: 'flex', gap: 2, margin: '4px 0' }}>{stars(r.star)}</div>
              <div className="admin-review-text">{r.content}</div>
            </div>
            <button className="admin-btn danger" style={{ padding: '6px 12px', fontSize: '0.72rem', flexShrink: 0 }} onClick={() => deleteReview(r.id)}>
              <i className="bi bi-trash3" />
            </button>
          </div>
        ))
      )}
    </div>
  );
}

/* ─── Tab: Projects ─────────────────────────────────────── */
const EMPTY_PROJECT = { name: '', description: '', duration: '', skills: '', category: 'fullstack', github: '', liveDemo: '' };

function ProjectsTab({ showToast }) {
  const [projects, setProjects] = useState([]);
  const [editing, setEditing] = useState(null); // null = ẩn form, object = đang edit/tạo mới
  const [saving, setSaving] = useState(false);

  const load = () => {
    apiClient.get('/project').then(r => setProjects(r.data || [])).catch(() => showToast('Không thể tải projects', 'error'));
  };
  useEffect(load, []);

  const handleSave = async () => {
    if (!editing.name.trim()) return showToast('Tên project không được trống', 'error');
    setSaving(true);
    try {
      if (editing.id) {
        await apiClient.put(`/project/update/${editing.id}`, editing);
        showToast('Đã cập nhật project!', 'success');
      } else {
        await apiClient.post('/project/create', editing);
        showToast('Đã thêm project mới!', 'success');
      }
      setEditing(null);
      load();
    } catch (err) {
      showToast('Lưu thất bại: ' + getErrorMessage(err), 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Xóa project này?')) return;
    try {
      await apiClient.delete(`/project/delete/${id}`);
      showToast('Đã xóa project', 'success');
      load();
    } catch { showToast('Xóa thất bại', 'error'); }
  };

  const field = (key, label, placeholder, opts = {}) => (
    <div className="admin-field">
      <label className="admin-label">{label}</label>
      {opts.textarea ? (
        <textarea className="admin-textarea" rows={3} placeholder={placeholder}
          value={editing[key] || ''} onChange={e => setEditing({ ...editing, [key]: e.target.value })} />
      ) : opts.select ? (
        <select className="admin-input" value={editing[key] || ''}
          onChange={e => setEditing({ ...editing, [key]: e.target.value })}>
          {opts.options.map(o => <option key={o} value={o}>{o.charAt(0).toUpperCase() + o.slice(1)}</option>)}
        </select>
      ) : (
        <input className="admin-input" type="text" placeholder={placeholder}
          value={editing[key] || ''} onChange={e => setEditing({ ...editing, [key]: e.target.value })} />
      )}
    </div>
  );

  return (
    <div className="admin-body">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>Quản lý {projects.length} project</div>
        <button className="admin-btn" onClick={() => setEditing({ ...EMPTY_PROJECT })} style={{ padding: '7px 14px', fontSize: '0.8rem' }}>
          <i className="bi bi-plus-lg" /> Thêm project
        </button>
      </div>

      {/* Form tạo/sửa */}
      {editing && (
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--accent)', borderRadius: 14, padding: '20px', marginBottom: 20 }}>
          <div style={{ fontWeight: 700, marginBottom: 16, color: 'var(--accent)', fontSize: '0.9rem', fontFamily: 'var(--font-mono)' }}>
            {editing.id ? '✏️ Sửa project' : '➕ Thêm project mới'}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {field('name', 'Tên project *', 'Vd: Spring Boot REST API')}
            {field('description', 'Mô tả', 'Mô tả ngắn về project...', { textarea: true })}
            {field('duration', 'Thời gian', 'Vd: 03/2026 hoặc 2 tháng')}
            {field('skills', 'Kỹ năng / Tech Stack', 'Vd: Java,Spring Boot,MySQL (phân cách bằng dấu phẩy)')}
            {field('category', 'Danh mục', '', { select: true, options: ['backend', 'frontend', 'fullstack'] })}
            {field('github', 'GitHub URL (để trống nếu không có)', 'https://github.com/...')}
            {field('liveDemo', 'Live Demo URL (để trống nếu không có)', 'https://...')}
          </div>
          <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
            <button className="admin-btn" onClick={handleSave} disabled={saving}>
              {saving ? <><i className="bi bi-arrow-repeat" style={{ animation: 'spin 1s linear infinite' }} /> Đang lưu...</> : <><i className="bi bi-check-lg" /> Lưu</>}
            </button>
            <button className="admin-btn" onClick={() => setEditing(null)}
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', color: 'var(--text-secondary)' }}>
              <i className="bi bi-x-lg" /> Hủy
            </button>
          </div>
        </div>
      )}

      {/* Danh sách projects */}
      {projects.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: '0.82rem' }}>
          <i className="bi bi-folder2-open" style={{ fontSize: '2rem', display: 'block', marginBottom: 8 }} />
          Chưa có project nào. Nhấn "Thêm project" để bắt đầu.
        </div>
      ) : (
        projects.map(p => (
          <div key={p.id} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: '14px 16px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 12, marginBottom: 10 }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-primary)', marginBottom: 2 }}>{p.name}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', marginBottom: 4 }}>
                <span style={{ background: 'var(--accent)', color: '#fff', borderRadius: 4, padding: '1px 6px', marginRight: 6, fontSize: '0.68rem' }}>{p.category}</span>
                {p.duration && <><i className="bi bi-calendar3" /> {p.duration} &nbsp;</>}
                {p.github && <><i className="bi bi-github" /> GitHub &nbsp;</>}
                {p.liveDemo && <><i className="bi bi-globe" /> Live</>}
              </div>
              {p.skills && <div style={{ fontSize: '0.73rem', color: 'var(--text-muted)' }}>{p.skills}</div>}
            </div>
            <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
              <button className="admin-btn" style={{ padding: '6px 10px', fontSize: '0.72rem' }}
                onClick={() => setEditing({ ...p, github: p.github || '', liveDemo: p.liveDemo || '' })}>
                <i className="bi bi-pencil" />
              </button>
              <button className="admin-btn danger" style={{ padding: '6px 10px', fontSize: '0.72rem' }}
                onClick={() => handleDelete(p.id)}>
                <i className="bi bi-trash3" />
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

/* ─── Main Admin Panel ───────────────────────────────────── */
const TAB_PAGES = [
  { id: 'analytics', icon: 'bi-bar-chart-fill',  label: 'Analytics' },
  { id: 'profile',   icon: 'bi-person-fill',     label: 'Profile' },
  { id: 'avatar',    icon: 'bi-image-fill',       label: 'Avatar' },
  { id: 'projects',  icon: 'bi-grid-fill',        label: 'Projects' },
  { id: 'reviews',   icon: 'bi-star-fill',        label: 'Reviews' },
];

const TAB_TITLES = {
  analytics: 'Thống kê truy cập',
  profile:   'Chỉnh sửa Profile',
  avatar:    'Quản lý Avatar',
  projects:  'Quản lý Projects',
  reviews:   'Quản lý Reviews',
};

export default function AdminPanel({ onClose, onLogout, showToast, onProfileUpdate }) {
  const [activeTab, setActiveTab] = useState('analytics');
  const [user, setUser] = useState(null);
  const [currentAvatar, setCurrentAvatar] = useState('');

  const fetchUser = useCallback(async () => {
    try {
      const res = await apiClient.get(`/user?id=${USER_ID}`);
      setUser(res.data);
      setCurrentAvatar(res.data?.avatar || '');
    } catch {
      showToast('Không thể tải thông tin admin', 'error');
    }
  }, [showToast]);

  useEffect(() => {
    fetchUser();
    showToast('Đã mở Admin Dashboard!', 'success');
  }, [fetchUser, showToast]);

  const handleProfileUpdate = () => {
    fetchUser();
    if (onProfileUpdate) onProfileUpdate();
  };

  return (
    <>
      {/* Full-screen panel – no overlay needed since it covers everything */}
      <div className="admin-panel active">

        {/* ── Sidebar ── */}
        <aside className="admin-sidebar">
          <div className="admin-logo-wrapper">
            <i className="bi bi-speedometer2" />
            <div className="admin-logo-text">Admin<span>Hub</span></div>
          </div>

          <nav className="admin-sidebar-nav">
            {TAB_PAGES.map(tab => (
              <button key={tab.id}
                className={`admin-sidebar-btn${activeTab === tab.id ? ' active' : ''}`}
                onClick={() => setActiveTab(tab.id)}>
                <i className={`bi ${tab.icon}`} />
                {tab.label}
              </button>
            ))}
          </nav>

          <div className="admin-sidebar-footer">
            <div className="admin-user-info">
              {currentAvatar
                ? <img src={currentAvatar} alt="avatar" className="admin-user-avatar" />
                : <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--grad-main)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '1rem' }}><i className="bi bi-person-fill" /></div>}
              <div className="admin-user-name-detail">
                <div className="admin-user-name">Vũ Thành Luân</div>
                <div className="admin-user-role">Administrator</div>
              </div>
            </div>
            <button
              onClick={onLogout}
              style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(255,107,107,0.08)', border: '1px solid rgba(255,107,107,0.2)', borderRadius: 10, color: 'var(--accent3)', padding: '9px 14px', fontSize: '0.82rem', fontFamily: 'var(--font-mono)', cursor: 'none', transition: 'all 0.2s', width: '100%' }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,107,107,0.18)'}
              onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,107,107,0.08)'}>
              <i className="bi bi-box-arrow-right" /> Đăng xuất
            </button>
          </div>
        </aside>

        {/* ── Workspace ── */}
        <main className="admin-workspace">
          <div className="admin-workspace-header">
            <div className="admin-workspace-title">{TAB_TITLES[activeTab]}</div>
            <button className="admin-workspace-close" onClick={onClose} title="Đóng Dashboard">
              <i className="bi bi-x-lg" />
            </button>
          </div>

          <div className="admin-workspace-body">
            {activeTab === 'analytics' && <AnalyticsTab showToast={showToast} />}
            {activeTab === 'profile'   && <ProfileTab showToast={showToast} onProfileUpdate={handleProfileUpdate} currentAvatar={currentAvatar} user={user} />}
            {activeTab === 'avatar'    && <AvatarTab showToast={showToast} onProfileUpdate={handleProfileUpdate} currentAvatar={currentAvatar} setCurrentAvatar={setCurrentAvatar} user={user} />}
            {activeTab === 'projects'  && <ProjectsTab showToast={showToast} />}
            {activeTab === 'reviews'   && <ReviewsTab showToast={showToast} />}
          </div>
        </main>
      </div>
    </>
  );
}
