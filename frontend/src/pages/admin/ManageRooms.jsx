import React, { useState, useEffect } from 'react';
import { roomApi } from '../../api/roomApi';

const ManageRooms = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);
  const [formData, setFormData] = useState({
    roomType: '',
    roomNumber: '',
    description: '',
    price: '',
    totalRooms: '',
  });
  const [selectedAmenities, setSelectedAmenities] = useState([]);
  const [image, setImage] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    loadRooms();
  }, []);

  const loadRooms = async () => {
    try {
      setLoading(true);
      const data = await roomApi.getAllRooms();
      setRooms(data);
    } catch (err) {
      setError('Failed to load rooms');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      if (editingRoom) {
        await roomApi.updateRoom(editingRoom.id, { ...formData, amenities: selectedAmenities }, image);
      } else {
        await roomApi.createRoom({ ...formData, amenities: selectedAmenities }, image);
      }
      setShowModal(false);
      resetForm();
      loadRooms();
    } catch (err) {
      const errorMsg = err.formattedMessage || 
                       err.response?.data?.message || 
                       (err.response?.data && typeof err.response.data === 'object' 
                         ? Object.values(err.response.data)[0] 
                         : 'Failed to save room');
      setError(errorMsg);
    }
  };

  const handleEdit = (room) => {
    setEditingRoom(room);
    setFormData({
      roomType: room.roomType,
      roomNumber: room.roomNumber,
      description: room.description || '',
      price: room.price.toString(),
      totalRooms: room.totalRooms.toString(),
    });
    setImage(null);
    setSelectedAmenities(room.amenities || []);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this room?')) {
      return;
    }

    try {
      await roomApi.deleteRoom(id);
      loadRooms();
    } catch (err) {
      const errorMsg = err.formattedMessage || 
                       err.response?.data?.message || 
                       'Failed to delete room';
      alert(errorMsg);
    }
  };

  const resetForm = () => {
    setFormData({
      roomType: '',
      roomNumber: '',
      description: '',
      price: '',
      totalRooms: '',
    });
    setImage(null);
    setEditingRoom(null);
    setError('');
    setSelectedAmenities([]);
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
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Manage Rooms</h1>
        <button
          className="btn btn-primary"
          onClick={() => {
            resetForm();
            setShowModal(true);
          }}
        >
          Add New Room
        </button>
      </div>

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      <div className="table-responsive">
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Room Type</th>
              <th>Room Number</th>
              <th>Price</th>
              <th>Total Rooms</th>
              <th>Available</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {rooms.map((room) => (
              <tr key={room.id}>
                <td>{room.roomType}</td>
                <td>{room.roomNumber}</td>
                <td>${room.price}</td>
                <td>{room.totalRooms}</td>
                <td>{room.availableRooms}</td>
                <td>
                  <span
                    className={`badge ${room.available ? 'bg-success' : 'bg-danger'}`}
                  >
                    {room.available ? 'Available' : 'Unavailable'}
                  </span>
                </td>
                <td>
                  <button
                    className="btn btn-sm btn-primary me-2"
                    onClick={() => handleEdit(room)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => handleDelete(room.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div
          className="modal show"
          style={{ display: 'block' }}
          tabIndex="-1"
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {editingRoom ? 'Edit Room' : 'Add New Room'}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
                  }}
                ></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  {error && (
                    <div className="alert alert-danger" role="alert">
                      {error}
                    </div>
                  )}
                  <div className="mb-3">
                    <label className="form-label">Room Type</label>
                    <input
                      type="text"
                      className="form-control"
                      name="roomType"
                      value={formData.roomType}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Room Number</label>
                    <input
                      type="text"
                      className="form-control"
                      name="roomNumber"
                      value={formData.roomNumber}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Description</label>
                    <textarea
                      className="form-control"
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Price per Night</label>
                    <input
                      type="number"
                      step="0.01"
                      className="form-control"
                      name="price"
                      value={formData.price}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Total Rooms</label>
                    <input
                      type="number"
                      className="form-control"
                      name="totalRooms"
                      value={formData.totalRooms}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Amenities</label>
                    <div className="d-flex flex-wrap">
                      {[
                        'AC',
                        'Free Wi-Fi',
                        'Television',
                        'Attached Bathroom',
                        'Hot & Cold Water',
                        'Room Heater',
                        'Drinking Water',
                        'Towels & Toiletries',
                      ].map((amenity) => (
                        <div className="form-check me-3" key={amenity}>
                          <input
                            className="form-check-input"
                            type="checkbox"
                            value={amenity}
                            id={`amenity-${amenity}`}
                            checked={selectedAmenities.includes(amenity)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedAmenities((prev) => [...prev, amenity]);
                              } else {
                                setSelectedAmenities((prev) => prev.filter((a) => a !== amenity));
                              }
                            }}
                          />
                          <label className="form-check-label" htmlFor={`amenity-${amenity}`}>
                            {amenity}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Room Image</label>
                    <input
                      type="file"
                      className="form-control"
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => {
                      setShowModal(false);
                      resetForm();
                    }}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    {editingRoom ? 'Update' : 'Create'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
      {showModal && <div className="modal-backdrop show"></div>}
    </div>
  );
};

export default ManageRooms;

