package com.hotel.controller;

import com.hotel.dto.RoomRequest;
import com.hotel.dto.RoomResponse;
import com.hotel.service.RoomService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.util.List;

/**
 * Controller for room endpoints
 */
@RestController
@RequestMapping("/api/rooms")
public class RoomController {

    @Autowired
    private RoomService roomService;

    @GetMapping
    public ResponseEntity<List<RoomResponse>> getAllRooms() {
        return ResponseEntity.ok(roomService.getAllRooms());
    }

    @GetMapping("/available")
    public ResponseEntity<List<RoomResponse>> getAvailableRooms() {
        return ResponseEntity.ok(roomService.getAvailableRooms());
    }

    @GetMapping("/available/date-range")
    public ResponseEntity<List<RoomResponse>> getAvailableRoomsForDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate checkInDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate checkOutDate) {
        return ResponseEntity.ok(roomService.getAvailableRoomsForDateRange(checkInDate, checkOutDate));
    }

    @GetMapping("/{id}")
    public ResponseEntity<RoomResponse> getRoomById(@PathVariable Long id) {
        return ResponseEntity.ok(roomService.getRoomById(id));
    }

    @GetMapping("/type/{roomType}")
    public ResponseEntity<List<RoomResponse>> getRoomsByType(@PathVariable String roomType) {
        return ResponseEntity.ok(roomService.getRoomsByType(roomType));
    }

    @GetMapping("/type/{roomType}/available")
    public ResponseEntity<List<RoomResponse>> getAvailableRoomsByType(@PathVariable String roomType) {
        return ResponseEntity.ok(roomService.getAvailableRoomsByType(roomType));
    }

    @GetMapping("/types/all")
    public ResponseEntity<List<String>> getAllRoomTypes() {
        return ResponseEntity.ok(roomService.getAllRoomTypes());
    }
}