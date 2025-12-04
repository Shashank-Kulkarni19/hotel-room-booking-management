package com.hotel.service;

import com.hotel.dto.RatingRequest;
import com.hotel.dto.RatingResponse;

import java.util.List;

public interface RatingService {
    RatingResponse addRating(Long userId, RatingRequest request);
    RatingResponse updateRating(Long userId, Long ratingId, RatingRequest request);
    void deleteRating(Long userId, Long ratingId);
    List<RatingResponse> getRatingsByRoomId(Long roomId);
    List<RatingResponse> getRatingsByUserId(Long userId);
    Double getAverageRatingByRoomId(Long roomId);
    Integer getRatingCountByRoomId(Long roomId);
}
