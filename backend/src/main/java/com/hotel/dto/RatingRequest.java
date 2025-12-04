package com.hotel.dto;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO for rating request
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class RatingRequest {
    
    @NotNull(message = "Room ID is required")
    private Long roomId;
    
    @NotNull(message = "Rating is required")
    @Min(value = 1, message = "Rating must be at least 1")
    @Max(value = 5, message = "Rating must not exceed 5")
    private Integer rating;
    
    @NotBlank(message = "Review cannot be empty")
    @Size(min = 10, max = 500, message = "Review must be between 10 and 500 characters")
    private String review;

    public Long getRoomId() {
        return roomId;
    }

    public void setRoomId(Long roomId) {
        this.roomId = roomId;
    }

    public Integer getRating() {
        return rating;
    }

    public void setRating(Integer rating) {
        this.rating = rating;
    }

    public String getReview() {
        return review;
    }

    public void setReview(String review) {
        this.review = review;
    }
}
