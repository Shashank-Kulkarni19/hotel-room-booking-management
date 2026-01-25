import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className={`navbar navbar-expand-lg fixed-top transition-all duration-300 ${scrolled ? 'navbar-light bg-white shadow-sm' : 'navbar-dark bg-transparent'}`} style={{ height: '70px' }}>
      <div className="container">
        <Link className="navbar-brand d-flex align-items-center gap-2" to="/">
          <span style={{ fontSize: '1.5rem' }}>🏨</span>
          <span className="fw-bold tracking-tight" style={{ fontStyle: 'Outfit' }}>LUXE STAY</span>
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto align-items-center gap-2">
            <li className="nav-item">
              <Link className="nav-link px-3 fw-medium" to="/">Home</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link px-3 fw-medium" to="/rooms">Rooms</Link>
            </li>
            {user && !isAdmin() && (
              <li className="nav-item">
                <Link className="nav-link px-3 fw-medium" to="/my-bookings">My Bookings</Link>
              </li>
            )}
            {isAdmin() && (
              <li className="nav-item">
                <Link className="nav-link px-3 fw-medium text-primary fw-bold" to="/admin/dashboard">Admin Dashboard</Link>
              </li>
            )}

            <div className="ms-lg-4 d-flex align-items-center gap-3">
              {user ? (
                <>
                  <span className={`small d-none d-lg-inline ${scrolled ? 'text-muted' : 'text-white-50'}`}>
                    Hello, <span className="fw-bold text-dark">{user.name}</span>
                  </span>
                  <button className="btn btn-primary btn-sm px-4 rounded-pill" onClick={handleLogout}>
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link className={`nav-link fw-medium ${scrolled ? 'text-dark' : 'text-white'}`} to="/login">Login</Link>
                  <Link className="btn btn-primary btn-sm px-4 rounded-pill" to="/register">Register</Link>
                </>
              )}
            </div>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
