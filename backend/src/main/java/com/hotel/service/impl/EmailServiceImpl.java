package com.hotel.service.impl;

import com.hotel.entity.Booking;
import com.hotel.service.EmailService;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import java.time.format.DateTimeFormatter;

/**
 * Implementation of EmailService
 */
@Service
public class EmailServiceImpl implements EmailService {

    private static final Logger logger = LoggerFactory.getLogger(EmailServiceImpl.class);

    private final JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String fromEmail;

    public EmailServiceImpl(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    @Override
    public void sendBookingConfirmationEmail(Booking booking) {
        logger.info("Sending booking confirmation email for booking ID: {}", booking.getId());

        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(fromEmail);
            helper.setTo(booking.getUser().getEmail());
            helper.setSubject("Booking Confirmation - Hotel Booking System");

            String content = buildEmailContent(booking);
            helper.setText(content, true);

            mailSender.send(message);
            logger.info("Booking confirmation email sent successfully to {}", booking.getUser().getEmail());

        } catch (MessagingException e) {
            logger.error("Failed to send booking confirmation email: {}", e.getMessage());
        }
    }

    private String buildEmailContent(Booking booking) {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd-MM-yyyy");
        String checkInDate = booking.getCheckInDate().format(formatter);
        String checkOutDate = booking.getCheckOutDate().format(formatter);

        return "<div style='font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;'>" +
                "<h2 style='color: #2c3e50; text-align: center;'>Booking Confirmation</h2>" +
                "<p>Dear <strong>" + booking.getUser().getName() + "</strong>,</p>" +
                "<p>Thank you for choosing our hotel. Your booking has been confirmed successfully!</p>" +
                "<div style='background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin-top: 20px;'>" +
                "<h3 style='margin-top: 0; color: #2980b9;'>Booking Details</h3>" +
                "<p><strong>Booking ID:</strong> #" + booking.getId() + "</p>" +
                "<p><strong>Room Type:</strong> " + booking.getRoom().getRoomType() + "</p>" +
                "<p><strong>Room Number:</strong> " + booking.getRoom().getRoomNumber() + "</p>" +
                "<p><strong>Check-In Date:</strong> " + checkInDate + "</p>" +
                "<p><strong>Check-Out Date:</strong> " + checkOutDate + "</p>" +
                "<p><strong>Total Amount:</strong> ₹" + booking.getTotalAmount() + "</p>" +
                "<p><strong>Amenities:</strong> " + String.join(", ", booking.getRoom().getAmenities()) + "</p>" +
                "</div>" +
                "<p style='margin-top: 20px;'>We look forward to welcoming you soon!</p>" +
                "<p>Best Regards,<br>Hotel Management Team</p>" +
                "</div>";
    }
}
