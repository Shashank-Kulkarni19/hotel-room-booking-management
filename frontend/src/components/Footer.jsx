import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="footer bg-dark text-white py-5 mt-auto">
      <div className="container">
        <div className="row g-4">
          <div className="col-lg-4">
            <h4 className="font-outfit text-white mb-4">LUXE STAY</h4>
            <p className="text-white-50 leading-relaxed mb-4">
              Providing premium hospitality and unforgettable stays since 2024. Your comfort is our priority.
            </p>
            <div className="d-flex gap-3">
              {['fb', 'tw', 'ig', 'li'].map(s => (
                <div key={s} className="bg-white-10 rounded-circle d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px', background: 'rgba(255,255,255,0.1)' }}>
                  <span className="small">{s}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="col-6 col-lg-2">
            <h6 className="text-uppercase tracking-wider fw-bold mb-4">Explore</h6>
            <ul className="list-unstyled">
              <li className="mb-2"><Link to="/" className="text-white-50 text-decoration-none">Home</Link></li>
              <li className="mb-2"><Link to="/rooms" className="text-white-50 text-decoration-none">Rooms</Link></li>
              <li className="mb-2"><Link to="/offers" className="text-white-50 text-decoration-none">Special Offers</Link></li>
            </ul>
          </div>
          <div className="col-6 col-lg-2">
            <h6 className="text-uppercase tracking-wider fw-bold mb-4">Support</h6>
            <ul className="list-unstyled">
              <li className="mb-2"><Link to="/faq" className="text-white-50 text-decoration-none">FAQ</Link></li>
              <li className="mb-2"><Link to="/contact" className="text-white-50 text-decoration-none">Contact Us</Link></li>
              <li className="mb-2"><Link to="/privacy" className="text-white-50 text-decoration-none">Privacy Policy</Link></li>
            </ul>
          </div>
          <div className="col-lg-4">
            <h6 className="text-uppercase tracking-wider fw-bold mb-4">Newsletter</h6>
            <p className="text-white-50 small mb-4">Subscribe to receive updates on new rooms and special offers.</p>
            <div className="input-group">
              <input type="email" className="form-control bg-dark border-secondary text-white" placeholder="Email address" />
              <button className="btn btn-primary" type="button">Join</button>
            </div>
          </div>
        </div>
        <hr className="my-5 border-secondary" />
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-center gap-3">
          <p className="mb-0 text-white-50 small">&copy; 2024 LUXE STAY. All rights reserved.</p>
          <p className="mb-0 text-white-50 small">Crafted with ❤️ for premium hospitality.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
