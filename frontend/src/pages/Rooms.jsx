import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { roomApi } from '../api/roomApi';

const Rooms = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');
  const [roomTypes, setRoomTypes] = useState([]);
  const [selectedType, setSelectedType] = useState('');

  useEffect(() => {
    loadRoomTypes();
  }, []);

  useEffect(() => {
    loadRooms();
  }, [filter, selectedType]);

  const loadRoomTypes = async () => {
    try {
      const types = await roomApi.getAllRoomTypes();
      setRoomTypes(types || []);
    } catch (err) {
      console.error('Failed to load room types', err);
    }
  };

  const loadRooms = async () => {
    try {
      setLoading(true);
      let data;
      if (selectedType) {
        data = filter === 'available'
          ? await roomApi.getAvailableRoomsByType(selectedType)
          : await roomApi.getRoomsByType(selectedType);
      } else {
        data = filter === 'available'
          ? await roomApi.getAvailableRooms()
          : await roomApi.getAllRooms();
      }
      setRooms(data || []);
      setError('');
    } catch (err) {
      setError('Failed to load rooms');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5 pt-navbar">
      <div className="row mb-5 align-items-end">

        <div className="col-lg-8">
          <h1 className="display-4 mb-3">Discover Our <span className="text-primary">Accommodations</span></h1>
          <p className="lead text-muted">A selection of high-end rooms tailored for every traveler.</p>
        </div>
        <div className="col-lg-4 text-lg-end">
          <span className="badge bg-primary px-3 py-2 fs-6 rounded-3">
            {rooms.length} room{rooms.length !== 1 ? 's' : ''} found
          </span>
        </div>
      </div>

      <div className="card border-0 shadow-sm p-4 mb-5 bg-white">
        <div className="row g-4 align-items-center">
          <div className="col-md-5">
            <label className="form-label fw-bold">Room Category</label>
            <select className="form-select" value={selectedType} onChange={(e) => setSelectedType(e.target.value)}>
              <option value="">All Categories</option>
              {roomTypes.map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
          <div className="col-md-5">
            <label className="form-label fw-bold">Status</label>
            <div className="btn-group w-100">
              <button className={`btn ${filter === 'all' ? 'btn-primary' : 'btn-outline-secondary'}`} onClick={() => setFilter('all')}>All Rooms</button>
              <button className={`btn ${filter === 'available' ? 'btn-primary' : 'btn-outline-secondary'}`} onClick={() => setFilter('available')}>Available Only</button>
            </div>
          </div>
          <div className="col-md-2 text-end">
            <button className="btn btn-outline-secondary w-100 mt-4" onClick={() => { setSelectedType(''); setFilter('all'); }}>Reset</button>
          </div>
        </div>
      </div>

      {error && <div className="alert alert-danger rounded-4">{error}</div>}

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-grow text-primary" role="status"></div>
        </div>
      ) : rooms.length === 0 ? (
        <div className="text-center py-5">
          <img src="/images/room-demo.png" alt="Empty" className="img-fluid mb-4 opacity-25" style={{ maxWidth: '250px' }} />
          <h3>No Rooms Available</h3>
          <p className="text-muted">We couldn't find any rooms matching your criteria.</p>
        </div>
      ) : (
        <div className="row g-4">
          {rooms.map((room) => (
            <div key={room.id} className="col-md-6 col-lg-4">
              <div className="card shadow-sm h-100 border-0 overflow-hidden">
                <div className="position-relative">
                  <img
                    src={room.imageBase64 ? `data:image/jpeg;base64,${room.imageBase64}` : '/images/room-demo.png'}
                    className="room-image"
                    alt={room.roomType}
                  />
                  <div className="position-absolute top-0 end-0 p-3">
                    <span className={`badge ${room.available ? 'badge-success' : 'badge-danger'}`}>
                      {room.available ? 'Available' : 'Booked'}
                    </span>
                  </div>
                </div>
                <div className="card-body p-4">
                  <div className="d-flex justify-content-between mb-3">
                    <h5 className="card-title mb-0">{room.roomType}</h5>
                    <span className="text-primary fw-bold">₹{room.price}</span>
                  </div>
                  <p className="card-text text-muted small mb-4">{room.description || 'Premium comfort with high-end furniture and luxury bedding.'}</p>

                  <div className="d-flex flex-wrap gap-1 mb-4">
                    {room.amenities && room.amenities.slice(0, 4).map(a => (
                      <span key={a} className="badge bg-light text-dark small">{a}</span>
                    ))}
                  </div>

                  <div className="pt-3 border-top d-flex justify-content-between align-items-center">
                    <span className="text-muted small">#{room.roomNumber}</span>
                    <Link to={`/rooms/${room.id}`} className="btn btn-primary px-4">See Details</Link>
                  </div>
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
