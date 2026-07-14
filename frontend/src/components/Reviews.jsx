import { useEffect, useState } from 'react';
import apiClient from '../api/apiClient';

export default function Reviews() {
  const [reviews, setReviews] = useState([]);
  const [showAddModal, setShowAddModal]       = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal]     = useState(false);

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteEmail, setDeleteEmail]   = useState('');
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError]   = useState('');

  const [editTarget, setEditTarget]   = useState(null);
  const [editForm, setEditForm]       = useState({ email: '', name: '', role: '', rating: 0, comment: '' });
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError]     = useState('');
  const [editMsg, setEditMsg]         = useState('');

  const [form, setForm]           = useState({ name: '', role: '', email: '', rating: 0, comment: '' });
  const [submitting, setSubmitting] = useState(false);
  const [submitMsg, setSubmitMsg]   = useState('');

  const loadReviews = () => {
    apiClient.get('/review').then(res => setReviews(Array.isArray(res.data) ? res.data : [])).catch(() => {});
  };

  useEffect(() => { loadReviews(); }, []);

  // Khóa cuộn trang nền khi mở bất kỳ modal nào
  useEffect(() => {
    const anyOpen = showAddModal || showDeleteModal || showEditModal;
    if (anyOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [showAddModal, showDeleteModal, showEditModal]);

  const marqueeReviews = reviews.length > 0 ? [...reviews, ...reviews] : [];

  /* ── Thêm mới ── */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.rating) { setSubmitMsg('Vui lòng chọn số sao'); return; }
    setSubmitting(true);
    try {
      await apiClient.post('/review/create', {
        name: form.name, role: form.role, email: form.email,
        star: form.rating, content: form.comment
      });
      setSubmitMsg('Cảm ơn bạn đã gửi nhận xét! 🎉');
      loadReviews();
      setTimeout(() => {
        setShowAddModal(false);
        setSubmitMsg('');
        setForm({ name: '', role: '', email: '', rating: 0, comment: '' });
      }, 1500);
    } catch (err) {
      setSubmitMsg(err.response?.data?.message || 'Gửi thất bại. Vui lòng thử lại.');
    } finally {
      setSubmitting(false);
    }
  };

  /* ── Xóa ── */
  const handleDeleteConfirm = async () => {
    if (!deleteEmail) { setDeleteError('Vui lòng nhập email'); return; }
    setDeleteLoading(true); setDeleteError('');
    try {
      await apiClient.delete(`/review/delete-by-email?id=${deleteTarget.id}&email=${encodeURIComponent(deleteEmail)}`);
      setShowDeleteModal(false); setDeleteEmail(''); setDeleteTarget(null);
      loadReviews();
    } catch (err) {
      setDeleteError(err.response?.data || 'Email không khớp hoặc review không tồn tại');
    } finally {
      setDeleteLoading(false);
    }
  };

  /* ── Mở modal sửa ── */
  const openEditModal = (r) => {
    setEditTarget(r);
    setEditForm({ email: '', name: r.name, role: r.role, rating: r.star, comment: r.content });
    setEditError(''); setEditMsg('');
    setShowEditModal(true);
  };

  /* ── Xác nhận sửa ── */
  const handleEditConfirm = async () => {
    if (!editForm.email)   { setEditError('Vui lòng nhập email xác nhận'); return; }
    if (!editForm.rating)  { setEditError('Vui lòng chọn số sao'); return; }
    if (!editForm.comment.trim()) { setEditError('Nội dung nhận xét không được trống'); return; }
    setEditLoading(true); setEditError('');
    try {
      const params = new URLSearchParams({
        id:      editTarget.id,
        email:   editForm.email,
        name:    editForm.name,
        role:    editForm.role,
        star:    editForm.rating,
        content: editForm.comment,
      });
      await apiClient.put(`/review/update-by-email?${params.toString()}`);
      setEditMsg('Cập nhật thành công! ✅');
      loadReviews();
      setTimeout(() => { setShowEditModal(false); setEditMsg(''); }, 1400);
    } catch (err) {
      setEditError(err.response?.data || 'Email không khớp hoặc có lỗi xảy ra');
    } finally {
      setEditLoading(false);
    }
  };

  const renderStars = (star) => {
    const full = Math.floor(star);
    const half = star % 1 >= 0.5;
    return Array.from({ length: 5 }, (_, i) => {
      if (i < full) return <i key={i} className="bi bi-star-fill lit"></i>;
      if (i === full && half) return <i key={i} className="bi bi-star-half-fill lit"></i>;
      return <i key={i} className="bi bi-star-fill"></i>;
    });
  };

  const getInitials = (name) => name?.slice(0, 2)?.toUpperCase() || '??';

  const anyModal = showAddModal || showDeleteModal || showEditModal;

  return (
    <section className={`section-block section-dark${anyModal ? ' reviews-modal-open' : ''}`} id="reviews">
      <div className="container">
        <div className="section-header text-center mb-5">
          <span className="section-label">04 — Reviews</span>
          <h2 className="section-heading">What People Say</h2>
          <p className="section-sub mt-2">Feedback from classmates, mentors &amp; collaborators</p>
        </div>

        {/* Marquee */}
        <div className="reviews-marquee-container overflow-hidden position-relative mb-5 reveal">
          <div className="marquee-track" id="reviewMarqueeTrack">
            {marqueeReviews.map((r, idx) => (
              <div key={`${r.id}-${idx}`} className="review-card-wrapper">
                <div className="review-card" style={{ position: 'relative' }}>
                  <div className="review-quote">"</div>
                  <div className="review-stars">{renderStars(r.star)}</div>
                  <p className="review-text">{r.content}</p>
                  <div className="review-author">
                    <div className="review-avatar">{getInitials(r.name)}</div>
                    <div>
                      <div className="review-name">{r.name}</div>
                      <div className="review-meta">{r.role}</div>
                    </div>
                  </div>

                  {/* Action buttons — hiện khi hover */}
                  <div className="review-action-btns">
                    {/* Nút sửa */}
                    <button
                      className="review-action-btn edit"
                      title="Sửa review"
                      onClick={() => openEditModal(r)}
                    >
                      <i className="bi bi-pencil-fill"></i> Sửa
                    </button>
                    {/* Nút xóa */}
                    <button
                      className="review-action-btn delete"
                      title="Xóa review"
                      onClick={() => { setDeleteTarget(r); setShowDeleteModal(true); setDeleteError(''); setDeleteEmail(''); }}
                    >
                      <i className="bi bi-trash3"></i> Xóa
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Add review button */}
        <div className="text-center mt-5 reveal">
          <button className="review-add-btn-main" onClick={() => setShowAddModal(true)}>
            <i className="bi bi-chat-square-quote-fill"></i> Thêm nhận xét
          </button>
        </div>
      </div>

      {/* ── Modal Thêm review ── */}
      {showAddModal && (
        <div className="modal-backdrop-custom active" onClick={e => e.target === e.currentTarget && setShowAddModal(false)}>
          <div className="modal-content-custom">
            <button className="modal-close-btn" onClick={() => setShowAddModal(false)}>&times;</button>
            <h6 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 20, fontSize: '1rem' }}>
              Thêm nhận xét
            </h6>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="rev-label">Tên của bạn *</label>
                <input className="rev-input" type="text" placeholder="Nguyen Van A" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required />
              </div>
              <div className="mb-3">
                <label className="rev-label">Vai trò / Quan hệ</label>
                <input className="rev-input" type="text" placeholder="vd: Classmate, Mentor, Teammate" value={form.role} onChange={e => setForm({...form, role: e.target.value})} />
              </div>
              <div className="mb-3">
                <label className="rev-label">Email * (dùng để xác nhận khi sửa / xóa sau)</label>
                <input className="rev-input" type="email" placeholder="you@gmail.com" value={form.email} onChange={e => setForm({...form, email: e.target.value})} required />
              </div>
              <div className="mb-3">
                <label className="rev-label">Đánh giá sao</label>
                <div className="rev-star-select">
                  {[1,2,3,4,5].map(v => (
                    <i key={v} className={`bi bi-star-fill${form.rating >= v ? ' active' : ''}`} onClick={() => setForm({...form, rating: v})}></i>
                  ))}
                </div>
              </div>
              <div className="mb-4">
                <label className="rev-label">Nhận xét *</label>
                <textarea className="rev-textarea" placeholder="Chia sẻ trải nghiệm làm việc cùng Luan..." value={form.comment} onChange={e => setForm({...form, comment: e.target.value})} required></textarea>
              </div>
              {submitMsg && (
                <div style={{ padding: '10px', borderRadius: 8, marginBottom: 16, fontSize: '0.82rem', background: submitMsg.includes('🎉') ? 'rgba(34,197,94,0.1)' : 'rgba(255,107,107,0.1)', color: submitMsg.includes('🎉') ? '#22c55e' : 'var(--accent3)', border: `1px solid ${submitMsg.includes('🎉') ? 'rgba(34,197,94,0.3)' : 'rgba(255,107,107,0.3)'}` }}>
                  {submitMsg}
                </div>
              )}
              <div className="d-flex gap-2">
                <button type="submit" className="rev-submit" disabled={submitting} style={{ flex: 1 }}>
                  {submitting ? 'Đang gửi...' : 'Gửi nhận xét'}
                </button>
                <button type="button" className="rev-submit outline" onClick={() => setShowAddModal(false)}>Huỷ</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Modal Sửa review ── */}
      {showEditModal && (
        <div className="modal-backdrop-custom active" onClick={e => e.target === e.currentTarget && setShowEditModal(false)}>
          <div className="modal-content-custom">
            <button className="modal-close-btn" onClick={() => setShowEditModal(false)}>&times;</button>
            <div style={{ marginBottom: 20 }}>
              <h6 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--text-primary)', fontSize: '1rem', marginBottom: 6 }}>
                <i className="bi bi-pencil-fill" style={{ color: 'var(--accent)', marginRight: 8 }}></i>
                Sửa nhận xét
              </h6>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                Của <strong style={{ color: 'var(--text-secondary)' }}>{editTarget?.name}</strong>
              </p>
            </div>

            {/* Email xác nhận — bắt buộc đầu tiên */}
            <div className="mb-3">
              <label className="rev-label">
                <i className="bi bi-shield-lock-fill" style={{ marginRight: 5, color: 'var(--accent)' }}></i>
                Email xác nhận quyền sở hữu *
              </label>
              <input
                className="rev-input"
                type="email"
                placeholder="Email bạn đã dùng khi gửi review"
                value={editForm.email}
                onChange={e => { setEditForm({...editForm, email: e.target.value}); setEditError(''); }}
                autoFocus
              />
            </div>

            <div className="mb-3">
              <label className="rev-label">Tên</label>
              <input
                className="rev-input"
                type="text"
                value={editForm.name}
                onChange={e => setEditForm({...editForm, name: e.target.value})}
              />
            </div>
            <div className="mb-3">
              <label className="rev-label">Vai trò / Quan hệ</label>
              <input
                className="rev-input"
                type="text"
                value={editForm.role}
                onChange={e => setEditForm({...editForm, role: e.target.value})}
              />
            </div>
            <div className="mb-3">
              <label className="rev-label">Đánh giá sao</label>
              <div className="rev-star-select">
                {[1,2,3,4,5].map(v => (
                  <i key={v} className={`bi bi-star-fill${editForm.rating >= v ? ' active' : ''}`} onClick={() => setEditForm({...editForm, rating: v})}></i>
                ))}
              </div>
            </div>
            <div className="mb-4">
              <label className="rev-label">Nội dung nhận xét</label>
              <textarea
                className="rev-textarea"
                value={editForm.comment}
                onChange={e => setEditForm({...editForm, comment: e.target.value})}
              ></textarea>
            </div>

            {editError && (
              <div style={{ padding: '10px', borderRadius: 8, marginBottom: 16, fontSize: '0.82rem', background: 'rgba(255,107,107,0.1)', color: 'var(--accent3)', border: '1px solid rgba(255,107,107,0.3)', display: 'flex', alignItems: 'center', gap: 8 }}>
                <i className="bi bi-exclamation-circle-fill"></i> {editError}
              </div>
            )}
            {editMsg && (
              <div style={{ padding: '10px', borderRadius: 8, marginBottom: 16, fontSize: '0.82rem', background: 'rgba(34,197,94,0.1)', color: '#22c55e', border: '1px solid rgba(34,197,94,0.3)' }}>
                {editMsg}
              </div>
            )}

            <div className="d-flex gap-2">
              <button className="rev-submit" onClick={handleEditConfirm} disabled={editLoading} style={{ flex: 1 }}>
                {editLoading ? 'Đang lưu...' : <><i className="bi bi-check2-circle"></i> Lưu thay đổi</>}
              </button>
              <button className="rev-submit outline" onClick={() => setShowEditModal(false)}>Huỷ</button>
            </div>
          </div>
        </div>
      )}

      {/* ── Modal Xóa review bằng email ── */}
      {showDeleteModal && (
        <div className="modal-backdrop-custom active" onClick={e => e.target === e.currentTarget && setShowDeleteModal(false)}>
          <div className="modal-content-custom">
            <button className="modal-close-btn" onClick={() => setShowDeleteModal(false)}>&times;</button>
            <div style={{ marginBottom: 20 }}>
              <h6 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--text-primary)', fontSize: '1rem', marginBottom: 6 }}>
                <i className="bi bi-trash3" style={{ color: 'var(--accent3)', marginRight: 8 }}></i>
                Xóa review của bạn
              </h6>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                Review của <strong style={{ color: 'var(--text-secondary)' }}>{deleteTarget?.name}</strong>
              </p>
            </div>
            <div className="mb-3">
              <label className="rev-label">Nhập email bạn đã dùng khi gửi review</label>
              <input
                className="rev-input"
                type="email"
                placeholder="you@gmail.com"
                value={deleteEmail}
                onChange={e => { setDeleteEmail(e.target.value); setDeleteError(''); }}
                autoFocus
              />
            </div>
            {deleteError && (
              <div style={{ padding: '10px', borderRadius: 8, marginBottom: 16, fontSize: '0.82rem', background: 'rgba(255,107,107,0.1)', color: 'var(--accent3)', border: '1px solid rgba(255,107,107,0.3)', display: 'flex', alignItems: 'center', gap: 8 }}>
                <i className="bi bi-exclamation-circle-fill"></i> {deleteError}
              </div>
            )}
            <div className="d-flex gap-2">
              <button className="rev-submit danger" onClick={handleDeleteConfirm} disabled={deleteLoading} style={{ flex: 1 }}>
                {deleteLoading ? 'Đang xóa...' : <><i className="bi bi-trash3"></i> Xác nhận xóa</>}
              </button>
              <button className="rev-submit outline" onClick={() => setShowDeleteModal(false)}>Huỷ</button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
