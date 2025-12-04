package com.hotel.repository;

import com.hotel.entity.Rating;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repository interface for Rating entity
 */
@Repository
public interface RatingRepository extends JpaRepository<Rating, Long> {
    
    List<Rating> findByRoomId(Long roomId);
    
    Optional<Rating> findByUserIdAndRoomId(Long userId, Long roomId);
    
    List<Rating> findByUserId(Long userId);
    
    @Query("SELECT AVG(r.rating) FROM Rating r WHERE r.room.id = ?1")
    Double getAverageRatingByRoomId(Long roomId);
    
    @Query("SELECT COUNT(r) FROM Rating r WHERE r.room.id = ?1")
    Integer countRatingsByRoomId(Long roomId);
}
