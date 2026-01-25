import React, { useState, useEffect } from 'react';
import { bookingApi } from '../../api/bookingApi';
import { refundPayment } from '../../api/paymentApi';

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

  const handleRefund = async (bookingId) => {
    if (!window.confirm('Are you sure you want to refund this payment?')) return;

    try {
      setLoading(true);
      await refundPayment(bookingId);
      alert('Refund successful!');
      loadBookings();
    } catch (err) {
      console.error('Failed to process refund:', err);
      alert('Failed to process refund: ' + (err.response?.data || err.message));
    } finally {
      setLoading(false);
    }
  };

  const filteredBookings = bookings.filter((booking) => {
    if (filter === 'all') return true;
    if (filter === 'confirmed') return booking.status === 'CONFIRMED';
    if (filter === 'booked') return booking.status === 'BOOKED' || booking.status === 'CONFIRMED';
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
            className={`btn ${filter === 'confirmed' ? 'btn-primary' : 'btn-outline-primary'} me-2`}
            onClick={() => setFilter('confirmed')}
          >
            Confirmed
          </button>
          <button
            className={`btn ${filter === 'pending' ? 'btn-primary' : 'btn-outline-primary'} me-2`}
            onClick={() => setFilter('pending')}
          >
            Pending
          </button>
          <button
            className={`btn ${filter === 'booked' ? 'btn-primary' : 'btn-outline-primary'} me-2`}
            onClick={() => setFilter('booked')}
          >
            Booked (Old)
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
        <table className="table table-striped table-hover align-middle">
          <thead className="table-dark">
            <tr>
              <th>ID</th>
              <th>User</th>
              <th>Room</th>
              <th>Dates</th>
              <th>Total</th>
              <th>Payment</th>
              <th>Booking Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredBookings.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center py-4">
                  No bookings found
                </td>
              </tr>
            ) : (
              filteredBookings.map((booking) => (
                <tr key={booking.id}>
                  <td>{booking.id}</td>
                  <td>{booking.userName}</td>
                  <td>
                    <div className="fw-bold">{booking.roomType}</div>
                    <small className="text-muted">Room #{booking.roomNumber}</small>
                  </td>
                  <td>
                    <div className="small">
                      In: {new Date(booking.checkInDate).toLocaleDateString()}<br />
                      Out: {new Date(booking.checkOutDate).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="fw-bold text-primary">
                    ${booking.totalAmount?.toFixed(2)}
                  </td>
                  <td>
                    <span className={`badge ${booking.paymentStatus === 'SUCCESS' ? 'bg-success' :
                      booking.paymentStatus === 'FAILED' ? 'bg-danger' :
                        booking.paymentStatus === 'PENDING' ? 'bg-warning text-dark' : 'bg-secondary'
                      }`}>
                      {booking.paymentStatus || 'N/A'}
                    </span>
                  </td>
                  <td>
                    <span className={`badge ${booking.status === 'CONFIRMED' || booking.status === 'BOOKED' ? 'bg-success' :
                      booking.status === 'CANCELLED' ? 'bg-danger' : 'bg-warning text-dark'
                      }`}>
                      {booking.status}
                    </span>
                  </td>
                  <td>
                    {booking.status === 'CANCELLED' && booking.paymentStatus === 'SUCCESS' && booking.refundStatus !== 'REFUNDED' && (
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => handleRefund(booking.id)}
                        disabled={loading}
                      >
                        Refund
                      </button>
                    )}
                    {booking.refundStatus === 'REFUNDED' && (
                      <span className="badge bg-info text-dark">Refunded</span>
                    )}
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

