import React, { useState, useEffect } from 'react';
import { bookingApi } from '../api/bookingApi';

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    try {
      setLoading(true);
      const data = await bookingApi.getMyBookings();
      setBookings(data);
      setError('');
    } catch (err) {
      setError('Failed to load bookings');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) {
      return;
    }

    try {
      await bookingApi.cancelBooking(id);
      loadBookings();
    } catch (err) {
      const errorMsg = err.formattedMessage || 
                       err.response?.data?.message || 
                       'Failed to cancel booking';
      alert(errorMsg);
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
      <h1 className="mb-4">My Bookings</h1>

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      {bookings.length === 0 ? (
        <div className="alert alert-info" role="alert">
          You have no bookings yet.
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped">
            <thead>
              <tr>
                <th>Room Type</th>
                <th>Room Number</th>
                <th>Check-in</th>
                <th>Check-out</th>
                <th>Total Amount</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking) => (
                <tr key={booking.id}>
                  <td>{booking.roomType}</td>
                  <td>{booking.roomNumber}</td>
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
                  <td>
                    {booking.status === 'BOOKED' && (
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleCancel(booking.id)}
                      >
                        Cancel
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default MyBookings;

