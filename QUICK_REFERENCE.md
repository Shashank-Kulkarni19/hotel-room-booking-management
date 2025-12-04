# Quick Reference - Credentials & Endpoints

## Admin Credentials
- **Email**: admin@hotel.com
- **Password**: admin123

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Rooms
- `GET /api/rooms` - Get all rooms
- `GET /api/rooms/available` - Get available rooms
- `GET /api/rooms/{id}` - Get room details
- `GET /api/rooms/available/date-range?checkInDate=2024-12-01&checkOutDate=2024-12-05` - Get available rooms for date range
- `GET /api/rooms/types/all` - Get all room types (new)
- `GET /api/rooms/type/{roomType}` - Get rooms by type (new)
- `GET /api/rooms/type/{roomType}/available` - Get available rooms by type (new)

### Ratings (NEW)
- `POST /api/ratings` - Add rating (requires X-User-Id header)
- `PUT /api/ratings/{ratingId}` - Update rating (requires X-User-Id header)
- `DELETE /api/ratings/{ratingId}` - Delete rating (requires X-User-Id header)
- `GET /api/ratings/room/{roomId}` - Get all ratings for a room
- `GET /api/ratings/user/{userId}` - Get all ratings by a user
- `GET /api/ratings/room/{roomId}/average` - Get average rating for room
- `GET /api/ratings/room/{roomId}/count` - Get total rating count for room

### Bookings
- `POST /api/bookings` - Create booking
- `GET /api/user/bookings` - Get user's bookings
- `PUT /api/bookings/{id}` - Update booking
- `DELETE /api/bookings/{id}` - Cancel booking

## Frontend Pages

### Public Pages
- `/` - Home page
- `/rooms` - Browse all rooms with NEW type filter
- `/rooms/{id}` - Room details with NEW ratings section
- `/login` - User login
- `/register` - User registration

### Protected Pages (User)
- `/myBookings` - User's bookings

### Protected Pages (Admin)
- `/admin` - Admin dashboard
- `/admin/manage-rooms` - Manage rooms
- `/admin/manage-bookings` - Manage bookings
- `/admin/manage-users` - Manage users

## Database Tables
- `users` - User accounts
- `rooms` - Room inventory
- `bookings` - Room bookings
- `ratings` - Room ratings and reviews (NEW)

## Sample Room Types
- Single - $50/night
- Double - $80/night
- Suite - $150/night
