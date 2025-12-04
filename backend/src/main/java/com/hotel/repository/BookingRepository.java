package com.hotel.repository;

import com.hotel.entity.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

/**
 * Repository interface for Booking entity
 */
@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {
    
    @Query("SELECT b FROM Booking b WHERE b.user.id = :userId")
    List<Booking> findByUserId(@Param("userId") Long userId);
    
    @Query("SELECT b FROM Booking b WHERE b.room.id = :roomId")
    List<Booking> findByRoomId(@Param("roomId") Long roomId);
    
    /**
     * Check if there are overlapping bookings for a room in a date range
     */
    @Query("SELECT COUNT(b) > 0 FROM Booking b WHERE b.room.id = :roomId " +
           "AND b.status = 'BOOKED' " +
           "AND ((b.checkInDate <= :checkOutDate AND b.checkOutDate >= :checkInDate))")
    Boolean hasOverlappingBooking(@Param("roomId") Long roomId, 
                                  @Param("checkInDate") LocalDate checkInDate, 
                                  @Param("checkOutDate") LocalDate checkOutDate);
    
    /**
     * Count active bookings for a room
     */
    @Query("SELECT COUNT(b) FROM Booking b WHERE b.room.id = :roomId AND b.status = 'BOOKED'")
    Long countActiveBookingsByRoomId(@Param("roomId") Long roomId);

        /**
         * Count overlapping active bookings for a room in a date range
         */
        @Query("SELECT COUNT(b) FROM Booking b WHERE b.room.id = :roomId " +
            "AND b.status = 'BOOKED' " +
            "AND ((b.checkInDate <= :checkOutDate AND b.checkOutDate >= :checkInDate))")
        Long countOverlappingBookings(@Param("roomId") Long roomId,
                          @Param("checkInDate") LocalDate checkInDate,
                          @Param("checkOutDate") LocalDate checkOutDate);

        /**
         * Find bookings that should be marked completed (checkout date before or equal to today)
         */
        @Query("SELECT b FROM Booking b WHERE b.status = 'BOOKED' AND b.checkOutDate < :today")
        List<Booking> findBookingsToComplete(@Param("today") LocalDate today);
}

