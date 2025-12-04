import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { roomApi } from '../api/roomApi';

const Rooms = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all'); // all, available
  const [roomTypes, setRoomTypes] = useState([]);
  const [selectedType, setSelectedType] = useState(''); // Filter by room type
  const [typesLoading, setTypesLoading] = useState(true);

  useEffect(() => {
    loadRoomTypes();
  }, []);

  useEffect(() => {
    loadRooms();
  }, [filter, selectedType]);

  const loadRoomTypes = async () => {
    try {
      const types = await roomApi.getAllRoomTypes();
      setRoomTypes(types);
    } catch (err) {
      console.error('Failed to load room types', err);
    } finally {
      setTypesLoading(false);
    }
  };

  const loadRooms = async () => {
    try {
      setLoading(true);
      let data;
      
      if (selectedType) {
        // Filter by room type
        data = filter === 'available'
          ? await roomApi.getAvailableRoomsByType(selectedType)
          : await roomApi.getRoomsByType(selectedType);
      } else {
        // No type filter
        data = filter === 'available' 
          ? await roomApi.getAvailableRooms()
          : await roomApi.getAllRooms();
      }
      setRooms(data);
      setError('');
    } catch (err) {
      setError('Failed to load rooms');
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

  return (
    <div className="container my-5">
      <div className="mb-4">
        <h1 className="mb-4">Available Rooms</h1>
        
        {/* Filters Section */}
        <div className="row mb-4">
          <div className="col-md-12">
            <div className="card p-3">
              <div className="row align-items-end">
                {/* Room Type Filter */}
                <div className="col-md-4 mb-3 mb-md-0">
                  <label className="form-label fw-bold">Room Type</label>
                  <select
                    className="form-select"
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                  >
                    <option value="">All Types</option>
                    {roomTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Availability Filter */}
                <div className="col-md-4 mb-3 mb-md-0">
                  <label className="form-label fw-bold">Availability</label>
                  <div>
                    <button
                      className={`btn ${filter === 'all' ? 'btn-primary' : 'btn-outline-primary'} me-2`}
                      onClick={() => setFilter('all')}
                    >
                      All Rooms
                    </button>
                    <button
                      className={`btn ${filter === 'available' ? 'btn-primary' : 'btn-outline-primary'}`}
                      onClick={() => setFilter('available')}
                    >
                      Available Only
                    </button>
                  </div>
                </div>

                {/* Results Count */}
                <div className="col-md-4 text-md-end">
                  <span className="text-muted">
                    {rooms.length} room{rooms.length !== 1 ? 's' : ''} found
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      {rooms.length === 0 ? (
        <div className="alert alert-info" role="alert">
          No rooms found.
        </div>
      ) : (
        <div className="row">
          {rooms.map((room) => (
            <div key={room.id} className="col-md-4 mb-4">
              <div className="card room-card h-100">
                {room.imageBase64 && (
                  <img
                    src={`data:image/jpeg;base64,${room.imageBase64}`}
                    className="card-img-top room-image"
                    alt={room.roomType}
                  />
                )}
                <div className="card-body">
                  <h5 className="card-title">{room.roomType}</h5>
                  <p className="card-text">
                    <strong>Room Number:</strong> {room.roomNumber}
                  </p>
                  <p className="card-text">
                    <strong>Price:</strong> ${room.price}/night
                  </p>
                  <p className="card-text">
                    <strong>Available:</strong> {room.availableRooms}/{room.totalRooms}
                  </p>
                  <p className="card-text text-muted">{room.description}</p>
                  {room.amenities && room.amenities.length > 0 && (
                    <div className="mb-2">
                      {room.amenities.map((a) => (
                        <span key={a} className="badge bg-light text-dark me-2">{a}</span>
                      ))}
                    </div>
                  )}
                  <div className="mb-2">
                    <span
                      className={`badge ${room.available ? 'bg-success' : 'bg-danger'}`}
                    >
                      {room.available ? 'Available' : 'Unavailable'}
                    </span>
                  </div>
                  <Link
                    to={`/rooms/${room.id}`}
                    className="btn btn-primary w-100"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Rooms;

