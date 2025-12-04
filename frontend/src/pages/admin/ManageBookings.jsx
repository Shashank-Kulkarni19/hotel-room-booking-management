import React, { useState, useEffect } from 'react';
import { bookingApi } from '../../api/bookingApi';

const ManageBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, booked, cancelled

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    try {
      setLoading(true);
      const data = await bookingApi.getAllBookings();
      setBookings(data);
    } catch (err) {
      console.error('Failed to load bookings:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredBookings = bookings.filter((booking) => {
    if (filter === 'all') return true;
    return booking.status === filter.toUpperCase();
  });

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
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Manage Bookings</h1>
        <div>
          <button
            className={`btn ${filter === 'all' ? 'btn-primary' : 'btn-outline-primary'} me-2`}
            onClick={() => setFilter('all')}
          >
            All
          </button>
          <button
            className={`btn ${filter === 'booked' ? 'btn-primary' : 'btn-outline-primary'} me-2`}
            onClick={() => setFilter('booked')}
          >
            Booked
          </button>
          <button
            className={`btn ${filter === 'cancelled' ? 'btn-primary' : 'btn-outline-primary'}`}
            onClick={() => setFilter('cancelled')}
          >
            Cancelled
          </button>
        </div>
      </div>

      <div className="table-responsive">
        <table className="table table-striped">
          <thead>
            <tr>
              <th>ID</th>
              <th>User</th>
              <th>Room</th>
              <th>Check-in</th>
              <th>Check-out</th>
              <th>Total Amount</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredBookings.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center">
                  No bookings found
                </td>
              </tr>
            ) : (
              filteredBookings.map((booking) => (
                <tr key={booking.id}>
                  <td>{booking.id}</td>
                  <td>{booking.userName}</td>
                  <td>
                    {booking.roomType} ({booking.roomNumber})
                  </td>
                  <td>{new Date(booking.checkInDate).toLocaleDateString()}</td>
                  <td>{new Date(booking.checkOutDate).toLocaleDateString()}</td>
                  <td>${booking.totalAmount.toFixed(2)}</td>
                  <td>
                    <span
                      className={`badge ${
                        booking.status === 'BOOKED' ? 'bg-success' : 'bg-secondary'
                      }`}
                    >
                      {booking.status}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageBookings;

