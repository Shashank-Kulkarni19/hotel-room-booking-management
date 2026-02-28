import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { roomApi } from '../api/roomApi';
import { bookingApi } from '../api/bookingApi';
import { createOrder, verifyPayment } from '../api/paymentApi';

const BookRoom = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [room, setRoom] = useState(null);
  const [formData, setFormData] = useState({
    checkInDate: '',
    checkOutDate: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [availableRooms, setAvailableRooms] = useState([]);

  useEffect(() => {
    loadRoom();
  }, [id]);

  useEffect(() => {
    if (formData.checkInDate && formData.checkOutDate) {
      checkAvailability();
    }
  }, [formData.checkInDate, formData.checkOutDate]);

  const loadRoom = async () => {
    try {
      const data = await roomApi.getRoomById(id);
      setRoom(data);
    } catch (err) {
      setError('Failed to load room details');
    }
  };

  const checkAvailability = async () => {
    try {
      const data = await roomApi.getAvailableRoomsForDateRange(
        formData.checkInDate,
        formData.checkOutDate
      );
      const isAvailable = data.some((r) => r.id === parseInt(id));
      setAvailableRooms(data);
      if (!isAvailable) {
        setError('Room is not available for the selected dates');
      } else {
        setError('');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to check availability');
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const calculateTotal = () => {
    if (!formData.checkInDate || !formData.checkOutDate || !room) {
      return 0;
    }
    const checkIn = new Date(formData.checkInDate);
    const checkOut = new Date(formData.checkOutDate);
    const days = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
    return days > 0 ? days * room.price : 0;
  };

  /**
   * Handle Razorpay payment
   */
  const handlePayment = async (bookingId, amount) => {
    try {
      // Step 1: Create Razorpay order
      const orderData = await createOrder(bookingId, amount);

      // Step 2: Configure Razorpay options
      const options = {
        key: orderData.razorpayKeyId, // Razorpay key from backend
        amount: orderData.amount * 100, // Amount in paise
        currency: orderData.currency,
        name: 'Hotel Booking System',
        description: `Booking for Room #${room.roomNumber}`,
        order_id: orderData.orderId,
        handler: async function (response) {
          // Step 3: Payment successful - verify on backend
          try {
            setLoading(true);
            const verificationResult = await verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });

            if (verificationResult.success) {
              alert('Payment successful! Your booking is confirmed.');
              navigate('/my-bookings');
            } else {
              setError('Payment verification failed. Booking has been cancelled.');
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
            setError('Payment cancelled by user');
          }
        }
      };

      // Step 4: Open Razorpay checkout
      const razorpay = new window.Razorpay(options);
      razorpay.open();

    } catch (err) {
      setLoading(false);
      setError('Failed to initiate payment: ' + (err.formattedMessage || err.message));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Step 1: Create booking
      const res = await bookingApi.createBooking({
        roomId: parseInt(id),
        checkInDate: formData.checkInDate,
        checkOutDate: formData.checkOutDate,
      });

      // Handle both cases: response being the data itself or nested in 'data'
      const booking = res.data || res;

      if (!booking || !booking.id) {
        throw new Error('Failed to create booking - no ID returned from server');
      }

      // Step 2: Initiate payment
      const totalAmount = calculateTotal();
      if (totalAmount <= 0) {
        throw new Error('Total amount must be greater than zero');
      }

      await handlePayment(booking.id, totalAmount);

    } catch (err) {
      console.error('Booking Submission Error:', err);
      const errorMsg = err.formattedMessage ||
        err.response?.data?.message ||
        err.message ||
        'Failed to process booking';
      setError(errorMsg);
      setLoading(false);
    }
  };

  const today = new Date().toISOString().split('T')[0];

  if (!room) {
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
      <h2 className="mb-4">Book {room.roomType}</h2>

      <div className="row">
        <div className="col-md-6">
          {room.imageBase64 && (
            <img
              src={`data:image/jpeg;base64,${room.imageBase64}`}
              className="img-fluid rounded mb-3"
              alt={room.roomType}
            />
          )}
          <p>
            <strong>Room Number:</strong> {room.roomNumber}
          </p>
          <p>
            <strong>Price per night:</strong> Rs{room.price}
          </p>
        </div>
        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <h4 className="card-title">Booking Details</h4>
              {error && (
                <div className="alert alert-danger" role="alert">
                  {error}
                </div>
              )}
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="checkInDate" className="form-label">
                    Check-in Date
                  </label>
                  <input
                    type="date"
                    className="form-control"
                    id="checkInDate"
                    name="checkInDate"
                    value={formData.checkInDate}
                    onChange={handleChange}
                    min={today}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="checkOutDate" className="form-label">
                    Check-out Date
                  </label>
                  <input
                    type="date"
                    className="form-control"
                    id="checkOutDate"
                    name="checkOutDate"
                    value={formData.checkOutDate}
                    onChange={handleChange}
                    min={formData.checkInDate || today}
                    required
                  />
                </div>
                <div className="mb-3">
                  <h5>Total Amount: Rs{calculateTotal().toFixed(2)}</h5>
                </div>
                <button
                  type="submit"
                  className="btn btn-primary w-100"
                  disabled={loading || !formData.checkInDate || !formData.checkOutDate}
                >
                  {loading ? 'Processing...' : 'Proceed to Payment'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookRoom;

