package com.hotel.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

/**
 * DTO for room creation/update request
 */
@Data
public class RoomRequest {
    
    @NotBlank(message = "Room type is required")
    private String roomType;
    
    @NotBlank(message = "Room number is required")
    private String roomNumber;
    
    private String description;
    
    @NotNull(message = "Price is required")
    @Positive(message = "Price must be positive")
    private Double price;
    
    @NotNull(message = "Total rooms is required")
    @Positive(message = "Total rooms must be positive")
    private Integer totalRooms;

	private java.util.List<String> amenities;

	public String getRoomType() {
		return roomType;
	}

	public void setRoomType(String roomType) {
		this.roomType = roomType;
	}

	public String getRoomNumber() {
		return roomNumber;
	}

	public void setRoomNumber(String roomNumber) {
		this.roomNumber = roomNumber;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public Double getPrice() {
		return price;
	}

	public void setPrice(Double price) {
		this.price = price;
	}

	public Integer getTotalRooms() {
		return totalRooms;
	}

	public void setTotalRooms(Integer totalRooms) {
		this.totalRooms = totalRooms;
	}

	public java.util.List<String> getAmenities() {
		return amenities;
	}

	public void setAmenities(java.util.List<String> amenities) {
		this.amenities = amenities;
	}
}

