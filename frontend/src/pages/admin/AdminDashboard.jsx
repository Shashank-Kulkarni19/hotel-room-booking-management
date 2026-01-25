import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { roomApi } from '../../api/roomApi';
import { bookingApi } from '../../api/bookingApi';
import { userApi } from '../../api/userApi';
import { useAuth } from '../../context/AuthContext';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalRooms: 0,
    availableRooms: 0,
    totalBookings: 0,
    totalUsers: 0,
    recentBookings: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);
      const [rooms, bookings, users] = await Promise.all([
        roomApi.getAllRooms(),
        bookingApi.getAllBookings(),
        userApi.getAllUsers(),
      ]);

      const availableRooms = (rooms || []).filter((r) => r.available).length;
      const sortedBookings = (bookings || []).sort((a, b) => new Date(b.bookingDate) - new Date(a.bookingDate));

      setStats({
        totalRooms: (rooms || []).length,
        availableRooms,
        totalBookings: (bookings || []).length,
        totalUsers: (users || []).length,
        recentBookings: sortedBookings.slice(0, 5)
      });
    } catch (err) {
      console.error('Failed to load stats:', err);
      setError('Failed to fetch dashboard data. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center pt-navbar">
        <div className="text-center">
          <div className="spinner-grow text-primary mb-3" role="status"></div>
          <p className="text-muted fw-medium">Preparing your dashboard...</p>
        </div>
      </div>
    );
  }

  const statCards = [
    { title: 'Total Rooms', value: stats.totalRooms, icon: '🏨', color: 'primary', link: '/admin/rooms' },
    { title: 'Available', value: stats.availableRooms, icon: '✨', color: 'success', link: '/admin/rooms' },
    { title: 'Bookings', value: stats.totalBookings, icon: '📅', color: 'warning', link: '/admin/bookings' },
    { title: 'Users', value: stats.totalUsers, icon: '👥', color: 'info', link: '/admin/users' },
  ];

  return (
    <div className="min-vh-100 bg-light pt-navbar pb-5">
      <div className="container">
        {/* Header Section */}
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-5 animate-fade-in">
          <div>
            <h1 className="display-5 fw-bold mb-1">Admin <span className="text-primary">Console</span></h1>
            <p className="text-muted mb-0">Welcome back, {user?.name}. Here's what's happening today.</p>
          </div>
          <div className="mt-3 mt-md-0">
            <button onClick={loadStats} className="btn btn-white shadow-sm border me-2">
              <span>🔄</span> Refresh Data
            </button>
            <Link to="/admin/rooms" className="btn btn-primary">
              <span>➕</span> Add New Room
            </Link>
          </div>
        </div>

        {error && (
          <div className="alert badge-danger border-0 p-3 mb-4 rounded-3 d-flex align-items-center gap-2">
            <span>⚠️</span> {error}
          </div>
        )}

        {/* Stats Grid */}
        <div className="row g-4 mb-5">
          {statCards.map((card, i) => (
            <div className="col-md-6 col-lg-3 animate-fade-in" key={i} style={{ animationDelay: `${i * 0.1}s` }}>
              <div className="glass-card p-4 h-100 position-relative border-0 shadow-sm overflow-hidden">
                <div className={`position-absolute top-0 end-0 p-3 opacity-10 display-4`}>{card.icon}</div>
                <div className="position-relative z-index-1">
                  <p className="text-muted small text-uppercase fw-bold tracking-wider mb-1">{card.title}</p>
                  <h2 className="display-6 fw-bold mb-3">{card.value}</h2>
                  <Link to={card.link} className="text-primary text-decoration-none small fw-bold d-flex align-items-center gap-1">
                    Manage Details <span>→</span>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="row g-4">
          {/* Quick Actions */}
          <div className="col-lg-4 animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <div className="glass-card p-4 border-0 shadow-sm h-100">
              <h4 className="mb-4">Quick Operations</h4>
              <div className="d-grid gap-3">
                <Link to="/admin/rooms" className="btn btn-light bg-white border text-start p-3 d-flex align-items-center gap-3">
                  <span className="fs-4">🛏️</span>
                  <div>
                    <div className="fw-bold">Room Inventory</div>
                    <div className="small text-muted">Update prices and availability</div>
                  </div>
                </Link>
                <Link to="/admin/bookings" className="btn btn-light bg-white border text-start p-3 d-flex align-items-center gap-3">
                  <span className="fs-4">📝</span>
                  <div>
                    <div className="fw-bold">Booking Requests</div>
                    <div className="small text-muted">Manage guest reservations</div>
                  </div>
                </Link>
                <Link to="/admin/users" className="btn btn-light bg-white border text-start p-3 d-flex align-items-center gap-3">
                  <span className="fs-4">👤</span>
                  <div>
                    <div className="fw-bold">User Directory</div>
                    <div className="small text-muted">Control account permissions</div>
                  </div>
                </Link>
              </div>
            </div>
          </div>

          {/* Recent Bookings Table */}
          <div className="col-lg-8 animate-fade-in" style={{ animationDelay: '0.5s' }}>
            <div className="glass-card border-0 shadow-sm overflow-hidden">
              <div className="p-4 d-flex justify-content-between align-items-center border-bottom bg-white">
                <h4 className="mb-0">Recent Activity</h4>
                <Link to="/admin/bookings" className="btn btn-sm btn-outline-primary">View All</Link>
              </div>
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                  <thead className="bg-light">
                    <tr>
                      <th className="px-4 py-3 border-0 small text-uppercase text-muted">Guest</th>
                      <th className="py-3 border-0 small text-uppercase text-muted">Room</th>
                      <th className="py-3 border-0 small text-uppercase text-muted">Date</th>
                      <th className="py-3 border-0 small text-uppercase text-muted text-end">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.recentBookings.length > 0 ? (
                      stats.recentBookings.map((booking) => (
                        <tr key={booking.id}>
                          <td className="px-4 py-3">
                            <div className="fw-bold">{booking.userName}</div>
                            <div className="small text-muted">{booking.userEmail}</div>
                          </td>
                          <td className="py-3">
                            <div className="small fw-medium">{booking.roomType}</div>
                            <div className="small text-muted">#{booking.roomNumber}</div>
                          </td>
                          <td className="py-3">
                            <div className="small">{new Date(booking.bookingDate).toLocaleDateString()}</div>
                          </td>
                          <td className="py-3 text-end">
                            <div className="fw-bold text-primary px-4">₹{booking.totalAmount}</div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="4" className="text-center py-5 text-muted">
                          No recent booking activity found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
