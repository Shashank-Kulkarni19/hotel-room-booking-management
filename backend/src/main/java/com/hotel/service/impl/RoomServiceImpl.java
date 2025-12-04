package com.hotel.service.impl;

import java.io.IOException;
import java.time.LocalDate;
import java.util.Base64;
import java.util.List;
import java.util.stream.Collectors;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.hotel.dto.RoomRequest;
import com.hotel.dto.RoomResponse;
import com.hotel.entity.Room;
import com.hotel.exception.BadRequestException;
import com.hotel.exception.ResourceNotFoundException;
import com.hotel.repository.RoomRepository;
import com.hotel.service.RoomService;

/**
 * Implementation of room service with inventory management
 */
@Service
@Transactional
public class RoomServiceImpl implements RoomService {

    @Autowired
    private RoomRepository roomRepository;

    @Autowired
    private ModelMapper modelMapper;

    @Override
    public RoomResponse createRoom(RoomRequest request, MultipartFile image) {
        if (roomRepository.findByRoomNumber(request.getRoomNumber()).isPresent()) {
            throw new BadRequestException("Room number already exists");
        }

        Room room = modelMapper.map(request, Room.class);
        room.setAvailableRooms(request.getTotalRooms());
        room.setAvailable(true);

        if (image != null && !image.isEmpty()) {
            try {
                room.setImage(image.getBytes());
            } catch (IOException e) {
                throw new BadRequestException("Failed to process image");
            }
        }

        room = roomRepository.save(room);
        return convertToResponse(room);
    }

    @Override
    public RoomResponse updateRoom(Long id, RoomRequest request, MultipartFile image) {
        Room room = roomRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Room not found"));

        // Check if room number is being changed and if it's already taken
        if (!room.getRoomNumber().equals(request.getRoomNumber())) {
            if (roomRepository.findByRoomNumber(request.getRoomNumber()).isPresent()) {
                throw new BadRequestException("Room number already exists");
            }
        }

        room.setRoomType(request.getRoomType());
        room.setRoomNumber(request.getRoomNumber());
        room.setDescription(request.getDescription());
        room.setPrice(request.getPrice());

        // Update amenities if provided (null means "no change")
        if (request.getAmenities() != null) {
            room.setAmenities(request.getAmenities());
        }

        // Update total rooms and adjust available rooms
        int oldTotal = room.getTotalRooms();
        int newTotal = request.getTotalRooms();
        int difference = newTotal - oldTotal;
        room.setTotalRooms(newTotal);
        room.setAvailableRooms(Math.max(0, room.getAvailableRooms() + difference));

        // Update availability status
        if (room.getAvailableRooms() == 0) {
            room.setAvailable(false);
        } else {
            room.setAvailable(true);
        }

        if (image != null && !image.isEmpty()) {
            try {
                room.setImage(image.getBytes());
            } catch (IOException e) {
                throw new BadRequestException("Failed to process image");
            }
        }

        room = roomRepository.save(room);
        return convertToResponse(room);
    }

    @Override
    public void deleteRoom(Long id) {
        Room room = roomRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Room not found"));
        roomRepository.delete(room);
    }

    @Override
    public RoomResponse getRoomById(Long id) {
        Room room = roomRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Room not found"));
        return convertToResponse(room);
    }

    @Override
    public List<RoomResponse> getAllRooms() {
        return roomRepository.findAll().stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<RoomResponse> getAvailableRooms() {
        return roomRepository.findByAvailableTrue().stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<RoomResponse> getAvailableRoomsForDateRange(LocalDate checkInDate, LocalDate checkOutDate) {
        if (checkInDate.isAfter(checkOutDate) || checkInDate.isEqual(checkOutDate)) {
            throw new BadRequestException("Check-out date must be after check-in date");
        }

        return roomRepository.findAvailableRoomsForDateRange(checkInDate, checkOutDate).stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<RoomResponse> getRoomsByType(String roomType) {
        return roomRepository.findByRoomType(roomType).stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<RoomResponse> getAvailableRoomsByType(String roomType) {
        return roomRepository.findByRoomTypeAndAvailableTrue(roomType).stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<String> getAllRoomTypes() {
        return roomRepository.findAllRoomTypes();
    }

    /**
     * Convert Room entity to RoomResponse DTO
     */
    private RoomResponse convertToResponse(Room room) {
        RoomResponse response = modelMapper.map(room, RoomResponse.class);
        
        // Convert image to Base64 if present
        if (room.getImage() != null && room.getImage().length > 0) {
            response.setImageBase64(Base64.getEncoder().encodeToString(room.getImage()));
        }
        
        return response;
    }

    /**
     * Decrease available rooms (called when booking is created)
     */
    public void decreaseAvailableRooms(Long roomId) {
        Room room = roomRepository.findById(roomId)
                .orElseThrow(() -> new ResourceNotFoundException("Room not found"));
        
        if (room.getAvailableRooms() <= 0) {
            throw new BadRequestException("Room is not available");
        }
        
        room.setAvailableRooms(room.getAvailableRooms() - 1);
        
        if (room.getAvailableRooms() == 0) {
            room.setAvailable(false);
        }
        
        roomRepository.save(room);
    }

    /**
     * Increase available rooms (called when booking is cancelled)
     */
    public void increaseAvailableRooms(Long roomId) {
        Room room = roomRepository.findById(roomId)
                .orElseThrow(() -> new ResourceNotFoundException("Room not found"));
        
        room.setAvailableRooms(Math.min(room.getAvailableRooms() + 1, room.getTotalRooms()));
        
        if (room.getAvailableRooms() > 0) {
            room.setAvailable(true);
        }
        
        roomRepository.save(room);
    }
}

