package com.hotel.service;

import com.hotel.dto.RoomRequest;
import com.hotel.dto.RoomResponse;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.util.List;

public interface RoomService {
    RoomResponse createRoom(RoomRequest request, MultipartFile image);
    RoomResponse updateRoom(Long id, RoomRequest request, MultipartFile image);
    void deleteRoom(Long id);
    RoomResponse getRoomById(Long id);
    List<RoomResponse> getAllRooms();
    List<RoomResponse> getAvailableRooms();
    List<RoomResponse> getAvailableRoomsForDateRange(LocalDate checkInDate, LocalDate checkOutDate);
    List<RoomResponse> getRoomsByType(String roomType);
    List<RoomResponse> getAvailableRoomsByType(String roomType);
    List<String> getAllRoomTypes();
    // Decrease/increase immediate available rooms counter
    void decreaseAvailableRooms(Long roomId);
    void increaseAvailableRooms(Long roomId);
}

