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

    /**
     * Send OTP for password reset
     * @param to The recipient email
     * @param otp The OTP to send
     */
    void sendForgotPasswordEmail(String to, Integer otp);

    /**
     * Send refund confirmation email to the user
     * @param booking The booking details
     * @param amount The refunded amount
     * @param refundId The refund transaction ID
     */
    void sendRefundEmail(Booking booking, double amount, String refundId);
}
