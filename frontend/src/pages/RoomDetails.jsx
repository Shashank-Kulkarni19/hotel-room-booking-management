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

  useEffect(() => {
    loadRoom();
  }, [id]);

  const loadRoom = async () => {
    try {
      setLoading(true);
      const data = await roomApi.getRoomById(id);
      setRoom(data);
      setError('');
    } catch (err) {
      setError('Failed to load room details');
      console.error(err);
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

  if (error || !room) {
    return (
      <div className="container my-5">
        <div className="alert alert-danger" role="alert">
          {error || 'Room not found'}
        </div>
        <Link to="/rooms" className="btn btn-primary">
          Back to Rooms
        </Link>
      </div>
    );
  }

  return (
    <div className="container my-5">
      <Link to="/rooms" className="btn btn-secondary mb-3">
        ← Back to Rooms
      </Link>

      <div className="row">
        <div className="col-md-6">
          {room.imageBase64 && (
            <img
              src={`data:image/jpeg;base64,${room.imageBase64}`}
              className="img-fluid rounded"
              alt={room.roomType}
            />
          )}
        </div>
        <div className="col-md-6">
          <h1>{room.roomType}</h1>
          <p className="text-muted">Room Number: {room.roomNumber}</p>
          <h3 className="text-primary">${room.price}/night</h3>
          <div className="mb-3">
            <span
              className={`badge ${room.available ? 'bg-success' : 'bg-danger'} fs-6`}
            >
              {room.available ? 'Available' : 'Unavailable'}
            </span>
          </div>
          <p className="mb-3">
            <strong>Availability:</strong> {room.availableRooms} of {room.totalRooms} rooms
          </p>
          <p className="mb-4">{room.description}</p>
          {room.amenities && room.amenities.length > 0 && (
            <div className="mb-4">
              <h5>Amenities</h5>
              <div>
                {room.amenities.map((a) => (
                  <span key={a} className="badge bg-light text-dark me-2">{a}</span>
                ))}
              </div>
            </div>
          )}
          {isAuthenticated() ? (
            <Link
              to={`/rooms/${room.id}/book`}
              className={`btn btn-primary btn-lg ${!room.available ? 'disabled' : ''}`}
            >
              Book Now
            </Link>
          ) : (
            <div>
              <p className="text-muted mb-2">Please login to book this room</p>
              <Link to="/login" className="btn btn-primary btn-lg">
                Login to Book
              </Link>
            </div>
          )}
        </div>
      </div>

      <div className="row mt-5">
        <div className="col-md-8">
          <RatingComponent roomId={room.id} onRatingAdded={() => loadRoom()} />
        </div>
      </div>
    </div>
  );
};

export default RoomDetails;

