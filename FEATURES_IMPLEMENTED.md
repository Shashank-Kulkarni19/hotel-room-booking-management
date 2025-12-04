# Hotel Booking System - Features Added

## Summary
Successfully implemented two major features:
1. **User Rating System** - Users can rate and review rooms
2. **Room Search & Filter** - Users can filter rooms by type on the front page

---

## 1. USER RATING SYSTEM

### Backend Changes

#### Database
- **File**: `database/schema.sql`
- Added `ratings` table with:
  - User and Room foreign keys (unique constraint)
  - Rating (1-5 stars)
  - Review text
  - Created/Updated timestamps

#### New Entities
- **File**: `backend/src/main/java/com/hotel/entity/Rating.java`
  - Entity mapping for ratings table
  - Relationships with User and Room entities
  - Automatic timestamp management

#### DTOs
- **File**: `backend/src/main/java/com/hotel/dto/RatingRequest.java`
  - Validates rating (1-5)
  - Validates review length (10-500 characters)
  
- **File**: `backend/src/main/java/com/hotel/dto/RatingResponse.java`
  - Returns rating data with user info and timestamps

#### Repositories
- **File**: `backend/src/main/java/com/hotel/repository/RatingRepository.java`
- Methods:
  - `findByRoomId()` - Get all ratings for a room
  - `findByUserIdAndRoomId()` - Ensure one rating per user per room
  - `getAverageRatingByRoomId()` - Calculate average rating
  - `countRatingsByRoomId()` - Get total rating count

#### Services
- **File**: `backend/src/main/java/com/hotel/service/RatingService.java`
  - Interface defining rating operations

- **File**: `backend/src/main/java/com/hotel/service/impl/RatingServiceImpl.java`
- Methods:
  - `addRating()` - Add new rating with duplicate check
  - `updateRating()` - Update existing rating
  - `deleteRating()` - Delete rating with authorization
  - `getRatingsByRoomId()` - Fetch all ratings for room
  - `getAverageRatingByRoomId()` - Get average rating
  - `getRatingCountByRoomId()` - Get rating count

#### Controllers
- **File**: `backend/src/main/java/com/hotel/controller/RatingController.java`
- Endpoints:
  - `POST /api/ratings` - Add rating
  - `PUT /api/ratings/{id}` - Update rating
  - `DELETE /api/ratings/{id}` - Delete rating
  - `GET /api/ratings/room/{roomId}` - Get room ratings
  - `GET /api/ratings/user/{userId}` - Get user ratings
  - `GET /api/ratings/room/{roomId}/average` - Get average rating
  - `GET /api/ratings/room/{roomId}/count` - Get rating count

#### Room Entity Updates
- Added `ratings` OneToMany relationship in `Room.java`

### Frontend Changes

#### APIs
- **File**: `frontend/src/api/ratingApi.js`
  - Methods to communicate with backend rating endpoints
  - Handles user ID via `X-User-Id` header

#### Components
- **File**: `frontend/src/components/RatingComponent.jsx`
  - Displays room ratings and average rating
  - Shows star rating (1-5)
  - Form to submit new ratings
  - List of existing ratings
  - Delete button for user's own ratings
  - Authentication check

#### Pages Updated
- **File**: `frontend/src/pages/RoomDetails.jsx`
  - Integrated `RatingComponent`
  - Displays all ratings on room detail page

---

## 2. ROOM SEARCH & FILTER BY TYPE

### Backend Changes

#### Repository Updates
- **File**: `backend/src/main/java/com/hotel/repository/RoomRepository.java`
- New methods:
  - `findByRoomType()` - Get rooms by type
  - `findByRoomTypeAndAvailableTrue()` - Get available rooms by type
  - `findAllRoomTypes()` - Get list of all room types

#### Service Updates
- **File**: `backend/src/main/java/com/hotel/service/RoomService.java`
- New methods:
  - `getRoomsByType()` - Fetch rooms filtered by type
  - `getAvailableRoomsByType()` - Fetch available rooms by type
  - `getAllRoomTypes()` - Get all distinct room types

- **File**: `backend/src/main/java/com/hotel/service/impl/RoomServiceImpl.java`
  - Implemented above methods

#### Controller Updates
- **File**: `backend/src/main/java/com/hotel/controller/RoomController.java`
- New endpoints:
  - `GET /api/rooms/type/{roomType}` - Get rooms by type
  - `GET /api/rooms/type/{roomType}/available` - Get available rooms by type
  - `GET /api/rooms/types/all` - Get all room types

### Frontend Changes

#### APIs
- **File**: `frontend/src/api/roomApi.js`
- New methods:
  - `getRoomsByType()` - Fetch rooms by type
  - `getAvailableRoomsByType()` - Fetch available rooms by type
  - `getAllRoomTypes()` - Fetch room type list

#### Pages Updated
- **File**: `frontend/src/pages/Rooms.jsx`
  - Added room type dropdown filter
  - Combined with existing availability filter
  - Display room count
  - Enhanced UI with card-based filter section

---

## Admin Credentials
- **Email**: admin@hotel.com
- **Password**: admin123
- **Note**: This is the default admin account created during database initialization

---

## Database Setup
To add the ratings table, run:
```sql
USE hotel_booking_db;

CREATE TABLE IF NOT EXISTS ratings (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    room_id BIGINT NOT NULL,
    rating INT NOT NULL,
    review TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (room_id) REFERENCES rooms(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_room_rating (user_id, room_id),
    INDEX idx_room_id (room_id),
    INDEX idx_user_id (user_id),
    INDEX idx_rating (rating)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

---

## Building & Running

### Backend
```bash
cd backend
mvn clean install
mvn spring-boot:run
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

---

## Features Workflow

### Rating System
1. User logs in
2. Navigates to Room Details page
3. Scrolls to "Guest Reviews" section
4. Clicks "Write a Review"
5. Selects rating (1-5 stars) and writes review
6. Submits review
7. Review appears in the list with user name and date
8. User can delete their own reviews
9. Average rating and review count displayed at top

### Search & Filter
1. User visits Rooms page (`/rooms`)
2. Sees filter card with:
   - Room Type dropdown (All Types / Single / Double / Suite, etc.)
   - Availability toggle (All Rooms / Available Only)
   - Room count display
3. Selects room type → displays only that type
4. Combines with availability filter
5. Results update in real-time

---

## Notes
- Only authenticated users can rate rooms
- Each user can only rate each room once (duplicate check)
- Users can only delete their own ratings
- Ratings and reviews are visible to all users
- Room type filtering works with availability filtering
- All endpoints are secured with authentication where needed
