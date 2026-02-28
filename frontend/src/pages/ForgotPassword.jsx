import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authApi } from '../api/authApi';

const ForgotPassword = () => {
    const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: Reset Password
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSendOtp = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');
        setLoading(true);
        try {
            const response = await authApi.forgotPassword(email);
            setMessage(response.message);
            setStep(2);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to send OTP. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');
        setLoading(true);
        try {
            const response = await authApi.verifyOtp(email, parseInt(otp));
            setMessage(response.message);
            setStep(3);
        } catch (err) {
            setError(err.response?.data?.message || 'Invalid OTP. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        setLoading(true);
        try {
            const response = await authApi.resetPassword(email, password);
            setMessage(response.message);
            setTimeout(() => {
                navigate('/login');
            }, 2000);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to reset password. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-vh-100 d-flex align-items-center justify-content-center pt-navbar" style={{ background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)' }}>
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-md-5">
                        <div className="glass-card p-5 animate-fade-in">
                            <div className="text-center mb-5">
                                <span className="display-4">🔐</span>
                                <h2 className="mt-3 display-6 fw-bold">
                                    {step === 1 && 'Forgot Password'}
                                    {step === 2 && 'Verify OTP'}
                                    {step === 3 && 'Reset Password'}
                                </h2>
                                <p className="text-muted">
                                    {step === 1 && 'Enter your email to receive a password reset OTP'}
                                    {step === 2 && `Enter the 6-digit OTP sent to ${email}`}
                                    {step === 3 && 'Enter your new password'}
                                </p>
                            </div>

                            {error && (
                                <div className="alert badge-danger border-0 p-3 mb-4 rounded-3 d-flex align-items-center gap-2" role="alert">
                                    <span>⚠️</span> {error}
                                </div>
                            )}

                            {message && (step !== 3 || !error) && (
                                <div className="alert badge-success border-0 p-3 mb-4 rounded-3 d-flex align-items-center gap-2" role="alert">
                                    <span>✅</span> {message}
                                </div>
                            )}

                            {step === 1 && (
                                <form onSubmit={handleSendOtp}>
                                    <div className="mb-4">
                                        <label htmlFor="email" className="form-label small fw-bold text-uppercase tracking-wider">Email Address</label>
                                        <input
                                            type="email"
                                            className="form-control form-control-lg bg-white border-0 shadow-sm"
                                            id="email"
                                            placeholder="name@example.com"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
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
                                                Sending OTP...
                                            </>
                                        ) : 'Send OTP'}
                                    </button>
                                </form>
                            )}

                            {step === 2 && (
                                <form onSubmit={handleVerifyOtp}>
                                    <div className="mb-4">
                                        <label htmlFor="otp" className="form-label small fw-bold text-uppercase tracking-wider">OTP</label>
                                        <input
                                            type="text"
                                            className="form-control form-control-lg bg-white border-0 shadow-sm text-center"
                                            id="otp"
                                            placeholder="123456"
                                            maxLength="6"
                                            value={otp}
                                            onChange={(e) => setOtp(e.target.value)}
                                            required
                                            style={{ letterSpacing: '8px', fontSize: '1.5rem', fontWeight: 'bold' }}
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
                                                Verifying...
                                            </>
                                        ) : 'Verify OTP'}
                                    </button>
                                    <div className="text-center mt-3">
                                        <button
                                            type="button"
                                            className="btn btn-link text-decoration-none"
                                            onClick={handleSendOtp}
                                            disabled={loading}
                                        >
                                            Resend OTP
                                        </button>
                                    </div>
                                </form>
                            )}

                            {step === 3 && (
                                <form onSubmit={handleResetPassword}>
                                    <div className="mb-4">
                                        <label htmlFor="password" className="form-label small fw-bold text-uppercase tracking-wider">New Password</label>
                                        <input
                                            type="password"
                                            className="form-control form-control-lg bg-white border-0 shadow-sm"
                                            id="password"
                                            placeholder="••••••••"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="mb-5">
                                        <label htmlFor="confirmPassword" className="form-label small fw-bold text-uppercase tracking-wider">Confirm Password</label>
                                        <input
                                            type="password"
                                            className="form-control form-control-lg bg-white border-0 shadow-sm"
                                            id="confirmPassword"
                                            placeholder="••••••••"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
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
                                                Resetting...
                                            </>
                                        ) : 'Reset Password'}
                                    </button>
                                </form>
                            )}

                            <div className="text-center mt-5">
                                <Link to="/login" className="text-primary fw-bold text-decoration-none border-bottom border-primary border-2">Back to Login</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
