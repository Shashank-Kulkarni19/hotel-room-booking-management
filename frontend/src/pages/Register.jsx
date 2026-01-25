import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    setLoading(true);
    const result = await register(formData.name, formData.email, formData.password);
    setLoading(false);
    if (result.success) navigate('/');
    else setError(result.error);
  };

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center pt-navbar" style={{ background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)' }}>
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-5">
            <div className="glass-card p-5 animate-fade-in shadow-lg">
              <div className="text-center mb-5">
                <span className="display-4">✨</span>
                <h2 className="mt-3 display-6 fw-bold">Create Account</h2>
                <p className="text-muted">Join our exclusive hotel community</p>
              </div>

              {error && (
                <div className="alert badge-danger border-0 p-3 mb-4 rounded-3 d-flex align-items-center gap-2" role="alert">
                  <span>⚠️</span> {error}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label htmlFor="name" className="form-label small fw-bold text-uppercase tracking-wider">Full Name</label>
                  <input
                    type="text"
                    className="form-control form-control-lg bg-white border-0 shadow-sm"
                    id="name"
                    name="name"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="email" className="form-label small fw-bold text-uppercase tracking-wider">Email Address</label>
                  <input
                    type="email"
                    className="form-control form-control-lg bg-white border-0 shadow-sm"
                    id="email"
                    name="email"
                    placeholder="john@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="password" className="form-label small fw-bold text-uppercase tracking-wider">Password</label>
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
                <div className="mb-5">
                  <label htmlFor="confirmPassword" className="form-label small fw-bold text-uppercase tracking-wider">Confirm Password</label>
                  <input
                    type="password"
                    className="form-control form-control-lg bg-white border-0 shadow-sm"
                    id="confirmPassword"
                    name="confirmPassword"
                    placeholder="••••••••"
                    value={formData.confirmPassword}
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
                      Creating account...
                    </>
                  ) : 'Register Now'}
                </button>
              </form>

              <div className="text-center mt-5">
                <p className="text-muted mb-0">
                  Already have an account? <Link to="/login" className="text-primary fw-bold text-decoration-none border-bottom border-primary border-2">Sign In</Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
