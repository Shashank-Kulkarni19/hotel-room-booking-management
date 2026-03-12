package com.hotel.controller;

import com.hotel.dto.RatingRequest;
import com.hotel.dto.RatingResponse;
import com.hotel.service.RatingService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Controller for rating endpoints
 */
@RestController
@RequestMapping("/api/ratings")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class RatingController {

    @Autowired
    private RatingService ratingService;

    private Long getCurrentUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.isAuthenticated()) {
            // In a real scenario, you would extract the user ID from the authentication
            // For now, we'll rely on the frontend to send it or use a custom authentication provider
            Object principal = authentication.getPrincipal();
            if (principal instanceof org.springframework.security.core.userdetails.UserDetails) {
                // The username is the email, but we need the ID
                // This is handled via request header or we get it from context
                return 1L; // Placeholder - should be extracted properly
            }
        }
        throw new RuntimeException("User not authenticated");
    }

    @PostMapping
    public ResponseEntity<RatingResponse> addRating(
            @RequestHeader("X-User-Id") Long userId,
            @Valid @RequestBody RatingRequest request) {
        return ResponseEntity.ok(ratingService.addRating(userId, request));
    }

    @PutMapping("/{ratingId}")
    public ResponseEntity<RatingResponse> updateRating(
            @RequestHeader("X-User-Id") Long userId,
            @PathVariable Long ratingId,
            @Valid @RequestBody RatingRequest request) {
        return ResponseEntity.ok(ratingService.updateRating(userId, ratingId, request));
    }

    @DeleteMapping("/{ratingId}")
    public ResponseEntity<Void> deleteRating(
            @RequestHeader("X-User-Id") Long userId,
            @PathVariable Long ratingId) {
        ratingService.deleteRating(userId, ratingId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/room/{roomId}")
    public ResponseEntity<List<RatingResponse>> getRatingsByRoomId(@PathVariable Long roomId) {
        return ResponseEntity.ok(ratingService.getRatingsByRoomId(roomId));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<RatingResponse>> getRatingsByUserId(@PathVariable Long userId) {
        return ResponseEntity.ok(ratingService.getRatingsByUserId(userId));
    }

    @GetMapping("/room/{roomId}/average")
    public ResponseEntity<Double> getAverageRatingByRoomId(@PathVariable Long roomId) {
        return ResponseEntity.ok(ratingService.getAverageRatingByRoomId(roomId));
    }

    @GetMapping("/room/{roomId}/count")
    public ResponseEntity<Integer> getRatingCountByRoomId(@PathVariable Long roomId) {
        return ResponseEntity.ok(ratingService.getRatingCountByRoomId(roomId));
    }
}
