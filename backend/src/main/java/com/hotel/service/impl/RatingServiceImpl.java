package com.hotel.service.impl;

import com.hotel.dto.RatingRequest;
import com.hotel.dto.RatingResponse;
import com.hotel.entity.Rating;
import com.hotel.entity.Room;
import com.hotel.entity.User;
import com.hotel.exception.BadRequestException;
import com.hotel.exception.ResourceNotFoundException;
import com.hotel.repository.RatingRepository;
import com.hotel.repository.RoomRepository;
import com.hotel.repository.UserRepository;
import com.hotel.service.RatingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Implementation of Rating Service
 */
@Service
public class RatingServiceImpl implements RatingService {

    @Autowired
    private RatingRepository ratingRepository;

    @Autowired
    private RoomRepository roomRepository;

    @Autowired
    private UserRepository userRepository;

    @Override
    public RatingResponse addRating(Long userId, RatingRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Room room = roomRepository.findById(request.getRoomId())
                .orElseThrow(() -> new ResourceNotFoundException("Room not found"));

        // Check if user already rated this room
        if (ratingRepository.findByUserIdAndRoomId(userId, request.getRoomId()).isPresent()) {
            throw new BadRequestException("You have already rated this room. Update your existing rating instead.");
        }

        Rating rating = new Rating();
        rating.setUser(user);
        rating.setRoom(room);
        rating.setRating(request.getRating());
        rating.setReview(request.getReview());

        rating = ratingRepository.save(rating);
        return convertToResponse(rating);
    }

    @Override
    public RatingResponse updateRating(Long userId, Long ratingId, RatingRequest request) {
        Rating rating = ratingRepository.findById(ratingId)
                .orElseThrow(() -> new ResourceNotFoundException("Rating not found"));

        if (!rating.getUser().getId().equals(userId)) {
            throw new BadRequestException("You can only update your own ratings");
        }

        rating.setRating(request.getRating());
        rating.setReview(request.getReview());

        rating = ratingRepository.save(rating);
        return convertToResponse(rating);
    }

    @Override
    public void deleteRating(Long userId, Long ratingId) {
        Rating rating = ratingRepository.findById(ratingId)
                .orElseThrow(() -> new ResourceNotFoundException("Rating not found"));

        if (!rating.getUser().getId().equals(userId)) {
            throw new BadRequestException("You can only delete your own ratings");
        }

        ratingRepository.delete(rating);
    }

    @Override
    public List<RatingResponse> getRatingsByRoomId(Long roomId) {
        roomRepository.findById(roomId)
                .orElseThrow(() -> new ResourceNotFoundException("Room not found"));

        List<Rating> ratings = ratingRepository.findByRoomId(roomId);
        return ratings.stream().map(this::convertToResponse).collect(Collectors.toList());
    }

    @Override
    public List<RatingResponse> getRatingsByUserId(Long userId) {
        userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        List<Rating> ratings = ratingRepository.findByUserId(userId);
        return ratings.stream().map(this::convertToResponse).collect(Collectors.toList());
    }

    @Override
    public Double getAverageRatingByRoomId(Long roomId) {
        roomRepository.findById(roomId)
                .orElseThrow(() -> new ResourceNotFoundException("Room not found"));

        Double average = ratingRepository.getAverageRatingByRoomId(roomId);
        return average != null ? average : 0.0;
    }

    @Override
    public Integer getRatingCountByRoomId(Long roomId) {
        roomRepository.findById(roomId)
                .orElseThrow(() -> new ResourceNotFoundException("Room not found"));

        Integer count = ratingRepository.countRatingsByRoomId(roomId);
        return count != null ? count : 0;
    }

    private RatingResponse convertToResponse(Rating rating) {
        RatingResponse response = new RatingResponse();
        response.setId(rating.getId());
        response.setUserId(rating.getUser().getId());
        response.setUserName(rating.getUser().getName());
        response.setRoomId(rating.getRoom().getId());
        response.setRating(rating.getRating());
        response.setReview(rating.getReview());
        response.setCreatedAt(rating.getCreatedAt());
        response.setUpdatedAt(rating.getUpdatedAt());
        return response;
    }
}
