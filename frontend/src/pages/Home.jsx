import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="container my-5">
      <div className="row">
        <div className="col-lg-8 mx-auto text-center">
          <h1 className="display-4 mb-4">Welcome to Hotel Booking System</h1>
          <p className="lead mb-4">
            Book your perfect stay with ease. Browse our selection of comfortable rooms
            and make your reservation today.
          </p>
          {!isAuthenticated() && (
            <div className="mt-4">
              <Link to="/register" className="btn btn-primary btn-lg me-2">
                Get Started
              </Link>
              <Link to="/login" className="btn btn-outline-primary btn-lg">
                Login
              </Link>
            </div>
          )}
          <div className="mt-5">
            <Link to="/rooms" className="btn btn-success btn-lg">
              Browse Rooms
            </Link>
          </div>
        </div>
      </div>

      <div className="row mt-5">
        <div className="col-md-4 mb-4">
          <div className="card h-100">
            <div className="card-body text-center">
              <h3 className="card-title">🏨 Comfortable Rooms</h3>
              <p className="card-text">
                Choose from a variety of room types to suit your needs.
              </p>
            </div>
          </div>
        </div>
        <div className="col-md-4 mb-4">
          <div className="card h-100">
            <div className="card-body text-center">
              <h3 className="card-title">💰 Best Prices</h3>
              <p className="card-text">
                Get the best value for your money with our competitive pricing.
              </p>
            </div>
          </div>
        </div>
        <div className="col-md-4 mb-4">
          <div className="card h-100">
            <div className="card-body text-center">
              <h3 className="card-title">✅ Easy Booking</h3>
              <p className="card-text">
                Simple and secure booking process with instant confirmation.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;

