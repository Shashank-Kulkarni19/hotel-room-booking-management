import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { roomApi } from '../api/roomApi';

const Home = () => {
  const { isAuthenticated } = useAuth();
  const [rooms, setRooms] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [roomTypes, setRoomTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [selectedType, setSelectedType] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [availability, setAvailability] = useState('all');
  const [selectedAmenities, setSelectedAmenities] = useState([]);

  const AMENITIES = [
    'AC', 'Free Wi-Fi', 'Television', 'Attached Bathroom',
    'Hot & Cold Water', 'Room Heater', 'Drinking Water', 'Towels & Toiletries',
  ];

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [rooms, selectedType, minPrice, maxPrice, availability, selectedAmenities]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [allRooms, types] = await Promise.all([roomApi.getAllRooms(), roomApi.getAllRoomTypes()]);
      setRooms(allRooms || []);
      setRoomTypes(types || []);
    } catch (err) {
      console.error(err);
      setError('Failed to load rooms');
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let result = [...rooms];
    if (selectedType) result = result.filter((r) => r.roomType === selectedType);
    if (availability === 'available') result = result.filter((r) => r.available === true);

    const min = parseFloat(minPrice);
    const max = parseFloat(maxPrice);
    if (!isNaN(min)) result = result.filter((r) => r.price >= min);
    if (!isNaN(max)) result = result.filter((r) => r.price <= max);

    if (selectedAmenities.length > 0) {
      result = result.filter((r) => {
        const am = r.amenities || [];
        return selectedAmenities.every((s) => am.includes(s));
      });
    }
    setFiltered(result);
  };

  const resetFilters = () => {
    setSelectedType('');
    setMinPrice('');
    setMaxPrice('');
    setAvailability('all');
    setSelectedAmenities([]);
  };

  return (
    <div className="home-container">
      {/* Hero Section */}
      <section className="hero-section" style={{ backgroundImage: `url('/images/hero.png')` }}>
        <div className="hero-overlay"></div>
        <div className="hero-content animate-fade-in">
          <h1 className="display-3 mb-4 text-white">Experience Luxury <span className="text-gradient">Beyond Limits</span></h1>
          <p className="lead mb-5 opacity-90">
            Discover a world of comfort and elegance. Hand-picked rooms designed for your ultimate relaxation and peace of mind.
          </p>
          <div className="d-flex justify-content-center gap-3">
            <a href="#rooms-section" className="btn btn-primary btn-lg">Explore Rooms</a>
            {!isAuthenticated() && (
              <Link to="/register" className="btn btn-outline btn-lg" style={{ borderColor: 'white', color: 'white' }}>Join Us Now</Link>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <div className="container py-5 mt-n5 position-relative z-index-2">
        <div className="row g-4">
          {[
            { icon: '🏨', title: 'Curated Rooms', desc: 'Every room is inspected for quality and comfort.' },
            { icon: '💎', title: 'Premium Service', desc: '24/7 concierge and room service at your fingertips.' },
            { icon: '🛡️', title: 'Secure Booking', desc: 'Safe and instant confirmations with Razorpay.' }
          ].map((feature, i) => (
            <div className="col-md-4" key={i}>
              <div className="glass-card p-4 text-center h-100">
                <div className="display-5 mb-3">{feature.icon}</div>
                <h4>{feature.title}</h4>
                <p className="text-muted mb-0">{feature.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="container py-5" id="rooms-section">
        <div className="row mb-5 align-items-end">
          <div className="col-lg-6">
            <h2 className="display-5 mb-3">Find Your <span className="text-primary">Perfect Stay</span></h2>
            <p className="text-muted">Filtered by your preferences and price range.</p>
          </div>
          <div className="col-lg-6 text-lg-end">
            <button className="btn btn-outline-secondary" onClick={resetFilters}>Clear All Filters</button>
          </div>
        </div>

        {/* Filters Card */}
        <div className="card border-0 shadow-sm p-4 mb-5 bg-white">
          <div className="row g-4">
            <div className="col-md-3">
              <label className="form-label fw-semibold">Room Type</label>
              <select className="form-select" value={selectedType} onChange={(e) => setSelectedType(e.target.value)}>
                <option value="">All Luxury Types</option>
                {roomTypes.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
            <div className="col-md-5">
              <label className="form-label fw-semibold">Price Range (₹)</label>
              <div className="d-flex gap-2">
                <input type="number" className="form-control" value={minPrice} onChange={(e) => setMinPrice(e.target.value)} placeholder="Min" />
                <input type="number" className="form-control" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} placeholder="Max" />
              </div>
            </div>
            <div className="col-md-4">
              <label className="form-label fw-semibold">Availability</label>
              <div className="btn-group w-100">
                <button className={`btn ${availability === 'all' ? 'btn-primary' : 'btn-outline-secondary'}`} onClick={() => setAvailability('all')}>All</button>
                <button className={`btn ${availability === 'available' ? 'btn-primary' : 'btn-outline-secondary'}`} onClick={() => setAvailability('available')}>Available Only</button>
              </div>
            </div>
            <div className="col-12 mt-4">
              <label className="form-label fw-semibold mb-3">Amenities</label>
              <div className="d-flex flex-wrap gap-3">
                {AMENITIES.map((amen) => (
                  <div className="form-check custom-check" key={amen}>
                    <input className="form-check-input" type="checkbox" id={`amen-${amen}`}
                      checked={selectedAmenities.includes(amen)}
                      onChange={(e) => {
                        if (e.target.checked) setSelectedAmenities((p) => [...p, amen]);
                        else setSelectedAmenities((p) => p.filter((a) => a !== amen));
                      }} />
                    <label className="form-check-label" htmlFor={`amen-${amen}`}>{amen}</label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Results */}
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-grow text-primary" role="status"></div>
          </div>
        ) : error ? (
          <div className="alert alert-danger rounded-4">{error}</div>
        ) : (
          <div className="row g-4">
            {filtered.length === 0 ? (
              <div className="col-12 text-center py-5">
                <img src="/images/room-demo.png" alt="No results" className="img-fluid mb-4 opacity-50" style={{ maxWidth: '300px' }} />
                <h3>No Rooms Found</h3>
                <p className="text-muted">Try adjusting your search filters.</p>
              </div>
            ) : (
              filtered.map((room) => (
                <div key={room.id} className="col-md-6 col-lg-4">
                  <div className="card border-0 h-100 shadow-sm overflow-hidden">
                    <div className="position-relative">
                      <img
                        src={room.imageBase64 ? `data:image/jpeg;base64,${room.imageBase64}` : '/images/room-demo.png'}
                        className="room-image"
                        alt={room.roomType}
                      />
                      <div className="position-absolute top-0 end-0 p-3">
                        <span className={`badge ${room.available ? 'badge-success' : 'badge-danger'}`}>
                          {room.available ? 'Available' : 'Sold Out'}
                        </span>
                      </div>
                    </div>
                    <div className="card-body p-4">
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <div>
                          <h5 className="card-title mb-1">{room.roomType}</h5>
                          <small className="text-muted">Room #{room.roomNumber}</small>
                        </div>
                        <div className="text-end">
                          <h4 className="text-primary mb-0">₹{room.price}</h4>
                          <small className="text-muted">per night</small>
                        </div>
                      </div>
                      <p className="card-text text-muted small line-clamp-2 mb-4">
                        {room.description || 'Experience ultimate comfort in our masterfully designed rooms featuring premium amenities.'}
                      </p>
                      <div className="d-flex flex-wrap gap-2 mb-4">
                        {(room.amenities || []).slice(0, 3).map((a) => (
                          <span key={a} className="badge bg-light text-dark">{a}</span>
                        ))}
                        {room.amenities?.length > 3 && <span className="small text-muted">+{room.amenities.length - 3} more</span>}
                      </div>
                      <Link to={`/rooms/${room.id}`} className="btn btn-primary w-100 justify-content-center">
                        View Details
                      </Link>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Footer / CTA Section */}
      <section className="bg-dark text-white py-5 mt-5">
        <div className="container text-center">
          <h2 className="mb-4 text-white">Ready for an Unforgettable Stay?</h2>
          <p className="mb-5 text-white opacity-75">Join thousands of happy guests who found their perfect getaway with us.</p>
          <Link to="/rooms" className="btn btn-primary btn-lg px-5">Book Now</Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
