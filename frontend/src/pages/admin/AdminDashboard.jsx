import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { roomApi } from '../../api/roomApi';
import { bookingApi } from '../../api/bookingApi';
import { userApi } from '../../api/userApi';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalRooms: 0,
    availableRooms: 0,
    totalBookings: 0,
    totalUsers: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const [rooms, bookings, users] = await Promise.all([
        roomApi.getAllRooms(),
        bookingApi.getAllBookings(),
        userApi.getAllUsers(),
      ]);

      const availableRooms = rooms.filter((r) => r.available).length;
      const activeBookings = bookings.filter((b) => b.status === 'BOOKED').length;

      setStats({
        totalRooms: rooms.length,
        availableRooms,
        totalBookings: activeBookings,
        totalUsers: users.length,
      });
    } catch (err) {
      console.error('Failed to load stats:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container my-5">
        <div className="d-flex justify-content-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container my-5">
      <h1 className="mb-4">Admin Dashboard</h1>

      <div className="row mb-4">
        <div className="col-md-3 mb-3">
          <div className="card text-center">
            <div className="card-body">
              <h3>{stats.totalRooms}</h3>
              <p className="card-text">Total Rooms</p>
              <Link to="/admin/rooms" className="btn btn-sm btn-primary">
                Manage Rooms
              </Link>
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="card text-center">
            <div className="card-body">
              <h3>{stats.availableRooms}</h3>
              <p className="card-text">Available Rooms</p>
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="card text-center">
            <div className="card-body">
              <h3>{stats.totalBookings}</h3>
              <p className="card-text">Active Bookings</p>
              <Link to="/admin/bookings" className="btn btn-sm btn-primary">
                Manage Bookings
              </Link>
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="card text-center">
            <div className="card-body">
              <h3>{stats.totalUsers}</h3>
              <p className="card-text">Total Users</p>
              <Link to="/admin/users" className="btn btn-sm btn-primary">
                Manage Users
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-md-4 mb-3">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Quick Actions</h5>
              <Link to="/admin/rooms" className="btn btn-primary w-100 mb-2">
                Manage Rooms
              </Link>
              <Link to="/admin/bookings" className="btn btn-primary w-100 mb-2">
                View All Bookings
              </Link>
              <Link to="/admin/users" className="btn btn-primary w-100">
                Manage Users
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

