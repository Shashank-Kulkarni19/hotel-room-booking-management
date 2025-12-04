package com.hotel.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.hotel.dto.BookingResponse;
import com.hotel.dto.RoomRequest;
import com.hotel.dto.RoomResponse;
import com.hotel.dto.UserResponse;
import com.hotel.service.BookingService;
import com.hotel.service.RoomService;
import com.hotel.service.UserService;

/**
 * Controller for admin endpoints
 */
@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "http://localhost:5173")
public class AdminController {

    @Autowired
    private RoomService roomService;

    @Autowired
    private BookingService bookingService;

    @Autowired
    private UserService userService;

    // Room Management
    @PostMapping("/rooms")
    public ResponseEntity<RoomResponse> createRoom(
            @RequestParam String roomType,
            @RequestParam String roomNumber,
            @RequestParam(required = false) String description,
            @RequestParam Double price,
            @RequestParam Integer totalRooms,
            @RequestParam(required = false) MultipartFile image,
            @RequestParam(required = false) java.util.List<String> amenities) {
        RoomRequest request = new RoomRequest();
        request.setRoomType(roomType);
        request.setRoomNumber(roomNumber);
        request.setDescription(description);
        request.setPrice(price);
        request.setTotalRooms(totalRooms);
        request.setAmenities(amenities);
        return ResponseEntity.ok(roomService.createRoom(request, image));
    }

    @PutMapping("/rooms/{id}")
    public ResponseEntity<RoomResponse> updateRoom(
            @PathVariable Long id,
            @RequestParam String roomType,
            @RequestParam String roomNumber,
            @RequestParam(required = false) String description,
            @RequestParam Double price,
            @RequestParam Integer totalRooms,
            @RequestParam(required = false) MultipartFile image,
            @RequestParam(required = false) java.util.List<String> amenities) {
        RoomRequest request = new RoomRequest();
        request.setRoomType(roomType);
        request.setRoomNumber(roomNumber);
        request.setDescription(description);
        request.setPrice(price);
        request.setTotalRooms(totalRooms);
        request.setAmenities(amenities);
        return ResponseEntity.ok(roomService.updateRoom(id, request, image));
    }

    @DeleteMapping("/rooms/{id}")
    public ResponseEntity<Void> deleteRoom(@PathVariable Long id) {
        roomService.deleteRoom(id);
        return ResponseEntity.noContent().build();
    }

    // Booking Management
    @GetMapping("/bookings")
    public ResponseEntity<List<BookingResponse>> getAllBookings() {
        return ResponseEntity.ok(bookingService.getAllBookings());
    }

    @GetMapping("/bookings/{id}")
    public ResponseEntity<BookingResponse> getBookingById(@PathVariable Long id) {
        return ResponseEntity.ok(bookingService.getBookingById(id));
    }

    // User Management
    @GetMapping("/users")
    public ResponseEntity<List<UserResponse>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    @PutMapping("/users/{id}/status")
    public ResponseEntity<UserResponse> updateUserStatus(
            @PathVariable Long id,
            @RequestParam Boolean enabled) {
        return ResponseEntity.ok(userService.updateUserStatus(id, enabled));
    }
}

