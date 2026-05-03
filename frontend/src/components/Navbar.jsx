import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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

  const closeMenu = () => {
    if (isMenuOpen) {
      document.querySelector('.navbar-toggler').click();
    }
  };

  return (
    <nav className={`navbar navbar-expand-lg fixed-top transition-all duration-300 ${(scrolled || isMenuOpen) ? 'navbar-light bg-white shadow-sm' : 'navbar-dark bg-transparent'}`} style={{ minHeight: '70px' }}>
      <div className="container">
        <Link className="navbar-brand d-flex align-items-center gap-2" to="/" onClick={closeMenu}>
          <span style={{ fontSize: '1.5rem' }}>🏨</span>
          <span className="fw-bold tracking-tight" style={{ fontStyle: 'Outfit' }}>LUXE STAY</span>
        </Link>
        <button
          className="navbar-toggler border-0 shadow-none"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse py-3 py-lg-0 text-center" id="navbarNav">
          <ul className="navbar-nav ms-auto align-items-center gap-3 gap-lg-2">
            <li className="nav-item">
              <Link className="nav-link px-3 fw-medium" to="/" onClick={closeMenu}>Home</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link px-3 fw-medium" to="/rooms" onClick={closeMenu}>Rooms</Link>
            </li>
            {user && !isAdmin() && (
              <li className="nav-item">
                <Link className="nav-link px-3 fw-medium" to="/my-bookings" onClick={closeMenu}>My Bookings</Link>
              </li>
            )}
            {isAdmin() && (
              <>
                <li className="nav-item">
                  <Link className="nav-link px-3 fw-medium text-primary fw-bold" to="/admin/dashboard" onClick={closeMenu}>Admin Dashboard</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link px-3 fw-medium text-primary fw-bold" to="/admin/analytics" onClick={closeMenu}>Analytics</Link>
                </li>
              </>
            )}

            <div className="ms-lg-4 d-flex flex-column flex-lg-row align-items-center gap-3 mt-3 mt-lg-0">
              {user ? (
                <>
                  <span className={`small ${scrolled || isMenuOpen ? 'text-muted' : 'text-white-50'}`}>
                    Hello, <span className="fw-bold text-dark">{user.name}</span>
                  </span>
                  <button className="btn btn-primary btn-sm px-4 rounded-pill" onClick={() => { handleLogout(); closeMenu(); }}>
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link className={`nav-link fw-medium ${scrolled || isMenuOpen ? 'text-dark' : 'text-white'}`} to="/login" onClick={closeMenu}>Login</Link>
                  <Link className="btn btn-primary btn-sm px-4 rounded-pill" to="/register" onClick={closeMenu}>Register</Link>
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
