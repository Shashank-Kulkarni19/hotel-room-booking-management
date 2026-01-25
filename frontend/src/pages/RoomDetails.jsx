import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { roomApi } from '../api/roomApi';
import { useAuth } from '../context/AuthContext';
import RatingComponent from '../components/RatingComponent';

const RoomDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => { loadRoom(); }, [id]);

  const loadRoom = async () => {
    try {
      setLoading(true);
      const data = await roomApi.getRoomById(id);
      setRoom(data);
    } catch (err) {
      setError('Failed to load room details');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center">
      <div className="spinner-grow text-primary" role="status"></div>
    </div>
  );

  if (error || !room) return (
    <div className="container py-5 pt-navbar">
      <div className="alert alert-danger rounded-4">{error || 'Room not found'}</div>
      <Link to="/rooms" className="btn btn-primary mt-3">Back to Rooms</Link>
    </div>
  );

  return (
    <div className="container py-5 pt-navbar animate-fade-in">
      {/* Breadcrumb / Navigation */}
      <nav className="mb-4 d-flex align-items-center gap-2">
        <Link to="/rooms" className="text-muted text-decoration-none small">Rooms</Link>
        <span className="text-muted small">/</span>
        <span className="small text-primary fw-bold font-outfit uppercase tracking-tighter">{room.roomType}</span>
      </nav>

      <div className="row g-5">
        <div className="col-lg-7">
          <div className="glass-card overflow-hidden h-100">
            <img
              src={room.imageBase64 ? `data:image/jpeg;base64,${room.imageBase64}` : '/images/room-demo.png'}
              className="img-fluid w-100 h-100 object-fit-cover shadow-lg rounded-4"
              alt={room.roomType}
              style={{ minHeight: '500px' }}
            />
          </div>
        </div>
        <div className="col-lg-5">
          <div className="sticky-top" style={{ top: '100px' }}>
            <div className="d-flex justify-content-between align-items-start mb-2">
              <h1 className="display-4 mb-0">{room.roomType}</h1>
              <span className={`badge ${room.available ? 'badge-success' : 'badge-danger'} py-2 px-3`}>
                {room.available ? 'Ready for Check-in' : 'Sold Out'}
              </span>
            </div>
            <p className="text-muted mb-4 fs-5">Premium Suite # {room.roomNumber}</p>

            <div className="card border-0 bg-light p-4 rounded-4 mb-4">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <p className="text-muted mb-0">Total price per night</p>
                  <h2 className="text-primary mb-0">₹{room.price}</h2>
                </div>
                <div className="text-end">
                  <p className="small text-muted mb-0">Inventory</p>
                  <p className="fw-bold mb-0">{room.availableRooms} / {room.totalRooms} left</p>
                </div>
              </div>
            </div>

            <div className="mb-4">
              <h5 className="font-outfit mb-3">About this room</h5>
              <p className="text-secondary leading-relaxed">
                {room.description || 'Experience the pinnacle of luxury in this masterfully appointed suite. Every detail has been curated to provide you with an unforgettable stay, from high-thread-count linens to ambient smart lighting.'}
              </p>
            </div>

            <div className="mb-5">
              <h5 className="font-outfit mb-3">Room Amenities</h5>
              <div className="d-flex flex-wrap gap-2">
                {room.amenities && room.amenities.map((a) => (
                  <div key={a} className="d-flex align-items-center bg-white border px-3 py-2 rounded-3 gap-2">
                    <span className="text-primary">✦</span>
                    <span className="small fw-medium">{a}</span>
                  </div>
                ))}
              </div>
            </div>

            {isAuthenticated() ? (
              <Link
                to={`/rooms/${room.id}/book`}
                className={`btn btn-primary btn-lg w-100 py-3 shadow-lg rounded-pill ${!room.available ? 'disabled' : ''}`}
              >
                Confirm Booking Details
              </Link>
            ) : (
              <div className="glass-card p-4 text-center">
                <p className="text-muted mb-3">Join us to book this premiere experience</p>
                <Link to="/login" className="btn btn-primary w-100 py-3 rounded-pill">Login to Reserve</Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Ratings Section */}
      <div className="mt-5 pt-5 border-top">
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <RatingComponent roomId={room.id} onRatingAdded={() => loadRoom()} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomDetails;
