package com.hotel.service.impl;

import com.hotel.dto.BookingRequest;
import com.hotel.dto.BookingResponse;
import com.hotel.entity.Booking;
import com.hotel.entity.Room;
import com.hotel.entity.User;
import com.hotel.exception.BadRequestException;
import com.hotel.exception.ResourceNotFoundException;
import com.hotel.repository.BookingRepository;
import com.hotel.repository.RoomRepository;
import com.hotel.repository.UserRepository;
import com.hotel.service.BookingService;
import com.hotel.service.RoomService;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Implementation of booking service with inventory management
 */
@Service
@Transactional
public class BookingServiceImpl implements BookingService {

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoomRepository roomRepository;


    @Autowired
    private ModelMapper modelMapper;

    @Autowired
    private com.hotel.service.RoomService roomService;

    @Override
    public BookingResponse createBooking(Long userId, BookingRequest request) {
        // Validate dates
        if (request.getCheckInDate().isAfter(request.getCheckOutDate()) || 
            request.getCheckInDate().isEqual(request.getCheckOutDate())) {
            throw new BadRequestException("Check-out date must be after check-in date");
        }

        if (request.getCheckInDate().isBefore(LocalDate.now())) {
            throw new BadRequestException("Check-in date cannot be in the past");
        }

        // Get user and room
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Room room = roomRepository.findById(request.getRoomId())
                .orElseThrow(() -> new ResourceNotFoundException("Room not found"));

        // Determine how many bookings already exist for the requested date range
        Long overlapping = bookingRepository.countOverlappingBookings(
                request.getRoomId(),
                request.getCheckInDate(),
                request.getCheckOutDate());

        // If overlapping bookings are greater than or equal to total rooms, no availability
        if (overlapping != null && overlapping >= room.getTotalRooms()) {
            throw new BadRequestException("No available rooms for the selected dates");
        }

        // Calculate total amount
        long numberOfDays = ChronoUnit.DAYS.between(request.getCheckInDate(), request.getCheckOutDate());
        double totalAmount = numberOfDays * room.getPrice();

        // Create booking
        Booking booking = new Booking();
        booking.setUser(user);
        booking.setRoom(room);
        booking.setCheckInDate(request.getCheckInDate());
        booking.setCheckOutDate(request.getCheckOutDate());
        booking.setTotalAmount(totalAmount);
        booking.setStatus("BOOKED");

        booking = bookingRepository.save(booking);

        // Decrease immediate available rooms count
        try {
            roomService.decreaseAvailableRooms(room.getId());
        } catch (Exception ignored) {
            // Log or ignore - availability counter should not block booking creation
        }

        return convertToResponse(booking);
    }

    @Override
    public BookingResponse cancelBooking(Long bookingId, Long userId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));

        // Check if user owns the booking (admin check is done at controller level via security)
        if (!booking.getUser().getId().equals(userId)) {
            throw new BadRequestException("You can only cancel your own bookings");
        }

        if (booking.getStatus().equals("CANCELLED")) {
            throw new BadRequestException("Booking is already cancelled");
        }

        // Update booking status
        booking.setStatus("CANCELLED");
        booking = bookingRepository.save(booking);

        // Increase immediate available rooms count
        try {
            roomService.increaseAvailableRooms(booking.getRoom().getId());
        } catch (Exception ignored) {
            // Log or ignore - availability counter should not block cancellation
        }

        return convertToResponse(booking);
    }

    @Override
    public List<BookingResponse> getUserBookings(Long userId) {
        return bookingRepository.findByUserId(userId).stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<BookingResponse> getAllBookings() {
        return bookingRepository.findAll().stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public BookingResponse getBookingById(Long id) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));
        return convertToResponse(booking);
    }

    /**
     * Convert Booking entity to BookingResponse DTO
     */
    private BookingResponse convertToResponse(Booking booking) {
        BookingResponse response = new BookingResponse();
        response.setId(booking.getId());
        response.setUserId(booking.getUser().getId());
        response.setUserName(booking.getUser().getName());
        response.setRoomId(booking.getRoom().getId());
        response.setRoomType(booking.getRoom().getRoomType());
        response.setRoomNumber(booking.getRoom().getRoomNumber());
        response.setCheckInDate(booking.getCheckInDate());
        response.setCheckOutDate(booking.getCheckOutDate());
        response.setTotalAmount(booking.getTotalAmount());
        response.setStatus(booking.getStatus());
        return response;
    }
}

