package com.hotel.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO for room response
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class RoomResponse {
    
    private Long id;
    private String roomType;
    private String roomNumber;
    private String description;
    private Double price;
    private Integer totalRooms;
    private Integer availableRooms;
    private Boolean available;
    private String imageBase64; // Base64 encoded image for frontend
	private java.util.List<String> amenities;
	public Long getId() {
		return id;
	}
	public void setId(Long id) {
		this.id = id;
	}
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
	public Integer getAvailableRooms() {
		return availableRooms;
	}
	public void setAvailableRooms(Integer availableRooms) {
		this.availableRooms = availableRooms;
	}
	public Boolean getAvailable() {
		return available;
	}
	public void setAvailable(Boolean available) {
		this.available = available;
	}
	public String getImageBase64() {
		return imageBase64;
	}
	public void setImageBase64(String imageBase64) {
		this.imageBase64 = imageBase64;
	}

    public java.util.List<String> getAmenities() {
        return amenities;
    }

    public void setAmenities(java.util.List<String> amenities) {
        this.amenities = amenities;
    }
}

