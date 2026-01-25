import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const result = await login(formData.email, formData.password);
    setLoading(false);
    if (result.success) {
      if (result.role === 'ROLE_ADMIN') {
        navigate('/admin/dashboard');
      } else {
        navigate('/');
      }
    } else {
      setError(result.error);
    }
  };

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center pt-navbar" style={{ background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)' }}>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-5">
            <div className="glass-card p-5 animate-fade-in">
              <div className="text-center mb-5">
                <span className="display-4">🏨</span>
                <h2 className="mt-3 display-6 fw-bold">Welcome Back</h2>
                <p className="text-muted">Enter your credentials to access your account</p>
              </div>

              {error && (
                <div className="alert badge-danger border-0 p-3 mb-4 rounded-3 d-flex align-items-center gap-2" role="alert">
                  <span>⚠️</span> {error}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label htmlFor="email" className="form-label small fw-bold text-uppercase tracking-wider">Email Address</label>
                  <input
                    type="email"
                    className="form-control form-control-lg bg-white border-0 shadow-sm"
                    id="email"
                    name="email"
                    placeholder="name@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-5">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <label htmlFor="password" className="form-label small fw-bold text-uppercase tracking-wider mb-0">Password</label>
                    <a href="#" className="small text-primary text-decoration-none">Forgot password?</a>
                  </div>
                  <input
                    type="password"
                    className="form-control form-control-lg bg-white border-0 shadow-sm"
                    id="password"
                    name="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="btn btn-primary w-100 btn-lg shadow-lg"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                      Signing in...
                    </>
                  ) : 'Sign In'}
                </button>
              </form>

              <div className="text-center mt-5">
                <p className="text-muted mb-0">
                  Don't have an account? <Link to="/register" className="text-primary fw-bold text-decoration-none border-bottom border-primary border-2">Create Account</Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
