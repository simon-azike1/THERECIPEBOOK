import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loginAdmin, reset } from '../../features/auth/adminSlice';
import './AdminScreen.css';

const AdminLogin = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { admin, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.admin
  );

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errorMsg, setErrorMsg] = useState('');
  const [focused, setFocused] = useState(null);

  useEffect(() => {
    if (isError) setErrorMsg(message);
    if (isSuccess || admin) navigate('/admin/dashboard');
    dispatch(reset());
  }, [admin, isError, isSuccess, message, navigate, dispatch]);

  const handleChange = (e) => {
    setErrorMsg('');
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(loginAdmin(formData));
  };

  return (
    <div className="al-root">
      {/* Ambient grid background */}
      <div className="al-grid" aria-hidden="true" />

      {/* Accent bar */}
      <div className="al-accent-bar" aria-hidden="true" />

      <div className="al-card">
        {/* Left panel — branding */}
        <div className="al-panel al-panel--brand">
          <div className="al-brand-inner">
            <div className="al-badge">SECURE ZONE</div>
            <h1 className="al-brand-title"><em>Admin</em><br />Console</h1>
            <p className="al-brand-sub">
              Restricted access. Authorised personnel only.
            </p>
            <div className="al-brand-deco" aria-hidden="true">
              <span /><span /><span />
            </div>
          </div>
          <div className="al-corner-mark" aria-hidden="true">v2.4.1</div>
        </div>

        {/* Right panel — form */}
        <div className="al-panel al-panel--form">
          <div className="al-form-header">
            <p className="al-eyebrow">Authentication required</p>
            <h2 className="al-form-title">Sign in</h2>
          </div>

          {errorMsg && (
            <div className="al-error" role="alert">
              <span className="al-error-icon">!</span>
              {errorMsg}
            </div>
          )}

          <form className="al-form" onSubmit={handleSubmit} noValidate>
            <div className={`al-field ${focused === 'email' ? 'al-field--focused' : ''} ${formData.email ? 'al-field--filled' : ''}`}>
              <label className="al-label" htmlFor="email">Email address</label>
              <input
                className="al-input"
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                onFocus={() => setFocused('email')}
                onBlur={() => setFocused(null)}
                autoComplete="email"
                required
              />
              <div className="al-field-line" />
            </div>

            <div className={`al-field ${focused === 'password' ? 'al-field--focused' : ''} ${formData.password ? 'al-field--filled' : ''}`}>
              <label className="al-label" htmlFor="password">Password</label>
              <input
                className="al-input"
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                onFocus={() => setFocused('password')}
                onBlur={() => setFocused(null)}
                autoComplete="current-password"
                required
              />
              <div className="al-field-line" />
            </div>

            <button className="al-btn" type="submit" disabled={isLoading}>
              {isLoading ? (
                <span className="al-btn-loader">
                  <span /><span /><span />
                </span>
              ) : (
                <>
                  <span>Authenticate</span>
                  <svg className="al-btn-arrow" viewBox="0 0 20 20" fill="none">
                    <path d="M4 10h12M11 5l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </>
              )}
            </button>
          </form>

          <p className="al-footer">
            Need access? <Link className="al-link" to="/register">Request an account</Link>
          </p>
        </div>
      </div>

      {/* Bottom tagline */}
      <p className="al-tagline">Protected by SimzikTech · All sessions are monitored</p>
    </div>
  );
};

export default AdminLogin;