import React, { useState, useEffect } from 'react';
import { bookingApi } from '../api/bookingApi';
import { createOrder, verifyPayment } from '../api/paymentApi';
import { useNavigate } from 'react-router-dom';

const MyBookings = () => {
  const navigate = useNavigate();
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

  /**
   * Handle Razorpay payment for pending bookings
   */
  const handlePayment = async (booking) => {
    try {
      setLoading(true);
      setError('');

      // Step 1: Create Razorpay order
      const orderData = await createOrder(booking.id, booking.totalAmount);

      // Step 2: Configure Razorpay options
      const options = {
        key: orderData.razorpayKeyId,
        amount: orderData.amount * 100,
        currency: orderData.currency,
        name: 'Hotel Booking System',
        description: `Payment for Room #${booking.roomNumber}`,
        order_id: orderData.orderId,
        handler: async function (response) {
          try {
            setLoading(true);
            const verificationResult = await verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });

            if (verificationResult.success) {
              alert('Payment successful! Your booking is confirmed.');
              loadBookings();
            } else {
              setError('Payment verification failed.');
            }
          } catch (err) {
            setError('Payment verification failed: ' + (err.formattedMessage || err.message));
          } finally {
            setLoading(false);
          }
        },
        prefill: {
          name: JSON.parse(localStorage.getItem('user') || '{}').fullName || '',
          email: JSON.parse(localStorage.getItem('user') || '{}').email || '',
        },
        theme: {
          color: '#0d6efd',
        },
        modal: {
          ondismiss: function () {
            setLoading(false);
          }
        }
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();

    } catch (err) {
      setLoading(false);
      setError('Failed to initiate payment: ' + (err.formattedMessage || err.message));
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
                      className={`badge ${booking.status === 'CONFIRMED' || booking.status === 'BOOKED' ? 'bg-success' :
                          booking.status === 'PENDING' ? 'bg-warning text-dark' : 'bg-secondary'
                        }`}
                    >
                      {booking.status}
                    </span>
                  </td>
                  <td>
                    {(booking.status === 'CONFIRMED' || booking.status === 'BOOKED') && (
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleCancel(booking.id)}
                      >
                        Cancel
                      </button>
                    )}
                    {booking.status === 'PENDING' && (
                      <div className="d-flex gap-2">
                        <button
                          className="btn btn-primary btn-sm"
                          onClick={() => handlePayment(booking)}
                          disabled={loading}
                        >
                          Pay Now
                        </button>
                        <button
                          className="btn btn-outline-danger btn-sm"
                          onClick={() => handleCancel(booking.id)}
                          disabled={loading}
                        >
                          Cancel
                        </button>
                      </div>
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

