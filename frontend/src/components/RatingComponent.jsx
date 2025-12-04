import React, { useState, useEffect } from 'react';
import { ratingApi } from '../api/ratingApi';
import { useAuth } from '../context/AuthContext';

const RatingComponent = ({ roomId, onRatingAdded }) => {
  const { user } = useAuth();
  const [ratings, setRatings] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [ratingCount, setRatingCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    rating: 5,
    review: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    loadRatings();
  }, [roomId]);

  const loadRatings = async () => {
    try {
      setLoading(true);
      const [ratings, average, count] = await Promise.all([
        ratingApi.getRatingsByRoomId(roomId),
        ratingApi.getAverageRatingByRoomId(roomId),
        ratingApi.getRatingCountByRoomId(roomId),
      ]);
      setRatings(ratings);
      setAverageRating(average);
      setRatingCount(count);
      setError('');
    } catch (err) {
      console.error('Failed to load ratings', err);
      setError('Failed to load ratings');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      setError('You must be logged in to rate this room');
      return;
    }

    try {
      setSubmitting(true);
      setError('');
      setSuccess('');

      await ratingApi.addRating(user.id, {
        roomId,
        rating: parseInt(formData.rating),
        review: formData.review,
      });

      setSuccess('Rating added successfully!');
      setFormData({ rating: 5, review: '' });
      setShowForm(false);
      
      await loadRatings();
      
      if (onRatingAdded) {
        onRatingAdded();
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to add rating';
      setError(errorMsg);
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteRating = async (ratingId) => {
    if (!user) return;

    if (!window.confirm('Are you sure you want to delete this rating?')) {
      return;
    }

    try {
      await ratingApi.deleteRating(user.id, ratingId);
      setSuccess('Rating deleted successfully!');
      await loadRatings();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete rating');
      console.error(err);
    }
  };

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span key={i} className={i <= rating ? 'text-warning' : 'text-secondary'}>
          ★
        </span>
      );
    }
    return stars;
  };

  if (loading) {
    return (
      <div className="text-center my-4">
        <div className="spinner-border spinner-border-sm" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="ratings-section mt-4">
      <h4>Guest Reviews</h4>

      <div className="card mb-4 bg-light">
        <div className="card-body">
          <div className="row align-items-center">
            <div className="col-md-6">
              <div className="d-flex align-items-center">
                <div className="me-3">
                  <h2 className="mb-0">{averageRating.toFixed(1)}</h2>
                </div>
                <div>
                  <div className="mb-2">
                    {renderStars(Math.round(averageRating))}
                  </div>
                  <small className="text-muted">{ratingCount} review{ratingCount !== 1 ? 's' : ''}</small>
                </div>
              </div>
            </div>
            <div className="col-md-6 text-md-end">
              {user && !showForm && (
                <button
                  className="btn btn-primary"
                  onClick={() => setShowForm(true)}
                >
                  Write a Review
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {showForm && user && (
        <div className="card mb-4 border-primary">
          <div className="card-body">
            <h5 className="card-title">Share Your Experience</h5>
            
            {error && (
              <div className="alert alert-danger" role="alert">
                {error}
              </div>
            )}
            
            {success && (
              <div className="alert alert-success" role="alert">
                {success}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">Rating</label>
                <div className="d-flex align-items-center gap-2">
                  <select
                    className="form-select"
                    style={{ maxWidth: '100px' }}
                    value={formData.rating}
                    onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
                    required
                  >
                    {[5, 4, 3, 2, 1].map((star) => (
                      <option key={star} value={star}>
                        {star} Star{star !== 1 ? 's' : ''}
                      </option>
                    ))}
                  </select>
                  <span className="ms-2">{renderStars(parseInt(formData.rating))}</span>
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label">Review</label>
                <textarea
                  className="form-control"
                  rows="4"
                  value={formData.review}
                  onChange={(e) => setFormData({ ...formData, review: e.target.value })}
                  placeholder="Share your thoughts about this room..."
                  minLength="10"
                  maxLength="500"
                  required
                />
                <small className="text-muted d-block mt-1">
                  {formData.review.length}/500 characters
                </small>
              </div>

              <div className="d-flex gap-2">
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={submitting}
                >
                  {submitting ? 'Submitting...' : 'Submit Review'}
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowForm(false)}
                  disabled={submitting}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {!user && showForm && (
        <div className="alert alert-info" role="alert">
          Please <a href="/login">log in</a> to write a review.
        </div>
      )}

      <div className="ratings-list">
        {ratings.length === 0 ? (
          <p className="text-muted">No reviews yet. Be the first to review this room!</p>
        ) : (
          ratings.map((rating) => (
            <div key={rating.id} className="card mb-3">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-start mb-2">
                  <div>
                    <h6 className="card-subtitle mb-1">{rating.userName}</h6>
                    <div className="mb-2">{renderStars(rating.rating)}</div>
                  </div>
                  {user && user.id === rating.userId && (
                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => handleDeleteRating(rating.id)}
                    >
                      Delete
                    </button>
                  )}
                </div>
                <p className="card-text">{rating.review}</p>
                <small className="text-muted">
                  {new Date(rating.createdAt).toLocaleDateString()}
                </small>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default RatingComponent;
