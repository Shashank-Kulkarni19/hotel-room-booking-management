package com.hotel.repository;

import com.hotel.entity.Room;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

/**
 * Repository interface for Room entity
 */
@Repository
public interface RoomRepository extends JpaRepository<Room, Long> {
    
    List<Room> findByAvailableTrue();
    
    Optional<Room> findByRoomNumber(String roomNumber);
    
    /**
     * Find rooms available for a specific date range
     * Excludes rooms that have overlapping bookings
     */
        @Query("SELECT DISTINCT r FROM Room r WHERE r.available = true AND " +
            "(SELECT COUNT(b) FROM Booking b WHERE b.room.id = r.id AND b.status = 'BOOKED' " +
            "AND ((b.checkInDate <= :checkOutDate AND b.checkOutDate >= :checkInDate))) < r.totalRooms")
        List<Room> findAvailableRoomsForDateRange(@Param("checkInDate") LocalDate checkInDate, 
                                 @Param("checkOutDate") LocalDate checkOutDate);
    
    List<Room> findByRoomType(String roomType);
    
    List<Room> findByRoomTypeAndAvailableTrue(String roomType);
    
    @Query("SELECT DISTINCT r.roomType FROM Room r ORDER BY r.roomType")
    List<String> findAllRoomTypes();
}

