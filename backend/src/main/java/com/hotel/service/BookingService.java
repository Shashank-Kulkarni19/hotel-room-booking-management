package com.hotel.service;

import com.hotel.dto.BookingRequest;
import com.hotel.dto.BookingResponse;

import java.util.List;

public interface BookingService {
    BookingResponse createBooking(Long userId, BookingRequest request);
    BookingResponse cancelBooking(Long bookingId, Long userId);
    List<BookingResponse> getUserBookings(Long userId);
    List<BookingResponse> getAllBookings();
    BookingResponse getBookingById(Long id);
}

