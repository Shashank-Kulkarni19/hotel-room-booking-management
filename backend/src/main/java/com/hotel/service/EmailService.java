package com.hotel.service;

import com.hotel.entity.Booking;

/**
 * Service for sending emails
 */
public interface EmailService {
    /**
     * Send booking confirmation email to the user
     * @param booking The booking details
     */
    void sendBookingConfirmationEmail(Booking booking);
}
