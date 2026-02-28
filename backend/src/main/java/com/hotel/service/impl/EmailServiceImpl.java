package com.hotel.service.impl;

import com.hotel.entity.Booking;
import com.hotel.service.EmailService;
import com.hotel.service.PdfService;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import jakarta.mail.util.ByteArrayDataSource;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

/**
 * Implementation of EmailService
 */
@Service
public class EmailServiceImpl implements EmailService {

    private static final Logger logger = LoggerFactory.getLogger(EmailServiceImpl.class);

    private final JavaMailSender mailSender;
    private final PdfService pdfService;

    @Value("${spring.mail.username}")
    private String fromEmail;

    public EmailServiceImpl(JavaMailSender mailSender, PdfService pdfService) {
        this.mailSender = mailSender;
        this.pdfService = pdfService;
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

            // Generate and attach PDF Receipt
            java.io.ByteArrayInputStream bis = pdfService.generatePaymentReceipt(booking);
            ByteArrayDataSource dataSource = new ByteArrayDataSource(bis, "application/pdf");
            helper.addAttachment("Payment_Receipt_" + booking.getId() + ".pdf", dataSource);

            mailSender.send(message);
            logger.info("Booking confirmation email with PDF receipt sent successfully to {}", booking.getUser().getEmail());

        } catch (MessagingException | IOException e) {
            logger.error("Failed to send booking confirmation email: {}", e.getMessage());
        }
    }

    @Override
    public void sendForgotPasswordEmail(String to, Integer otp) {
        logger.info("Sending forgot password email to: {}", to);

        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(fromEmail);
            helper.setTo(to);
            helper.setSubject("Password Reset OTP - Hotel Booking System");

            String content = "<div style='font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;'>" +
                    "<h2 style='color: #2c3e50; text-align: center;'>Password Reset Request</h2>" +
                    "<p>Hello,</p>" +
                    "<p>We received a request to reset your password. Please use the following OTP to proceed:</p>" +
                    "<div style='background-color: #f9f9f9; padding: 20px; text-align: center; border-radius: 5px; margin: 20px 0;'>" +
                    "<h1 style='margin: 0; color: #2980b9; letter-spacing: 5px;'>" + otp + "</h1>" +
                    "</div>" +
                    "<p>This OTP is valid for 10 minutes. If you did not request a password reset, please ignore this email.</p>" +
                    "<p>Best Regards,<br>Hotel Management Team</p>" +
                    "</div>";

            helper.setText(content, true);

            mailSender.send(message);
            logger.info("Forgot password email sent successfully to {}", to);

        } catch (MessagingException e) {
            logger.error("Failed to send forgot password email: {}", e.getMessage());
        }
    }

    @Override
    public void sendRefundEmail(Booking booking, double amount, String refundId) {
        logger.info("Sending refund confirmation email for booking ID: {}, Refund ID: {}", booking.getId(), refundId);

        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(fromEmail);
            helper.setTo(booking.getUser().getEmail());
            helper.setSubject("Refund Confirmation - Hotel Booking System");

            String content = buildRefundEmailContent(booking, amount, refundId);
            helper.setText(content, true);

            mailSender.send(message);
            logger.info("Refund confirmation email sent successfully to {}", booking.getUser().getEmail());

        } catch (MessagingException e) {
            logger.error("Failed to send refund confirmation email: {}", e.getMessage());
        }
    }

    private String buildRefundEmailContent(Booking booking, double amount, String refundId) {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd-MM-yyyy HH:mm:ss");
        String refundDate = LocalDateTime.now().format(formatter);

        return "<div style='font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;'>" +
                "<div style='text-align: center; margin-bottom: 20px;'>" +
                "<h2 style='color: #e67e22;'>Refund Processed</h2>" +
                "</div>" +
                "<p>Dear <strong>" + booking.getUser().getName() + "</strong>,</p>" +
                "<p>Your refund for booking <strong>#" + booking.getId() + "</strong> has been processed successfully.</p>" +
                "<div style='background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin-top: 20px; border-left: 5px solid #e67e22;'>" +
                "<h3 style='margin-top: 0; color: #2c3e50;'>Refund Details</h3>" +
                "<p><strong>Refund Amount:</strong> ₹" + amount + "</p>" +
                "<p><strong>Refund ID:</strong> " + refundId + "</p>" +
                "<p><strong>Date of Refund:</strong> " + refundDate + "</p>" +
                "</div>" +
                "<div style='background-color: #ffffff; padding: 15px; border-radius: 5px; margin-top: 20px; border: 1px dashed #ccc;'>" +
                "<h3 style='margin-top: 0; color: #7f8c8d;'>Original Booking Information</h3>" +
                "<p><strong>Room Type:</strong> " + booking.getRoom().getRoomType() + "</p>" +
                "<p><strong>Check-In:</strong> " + booking.getCheckInDate().format(DateTimeFormatter.ofPattern("dd-MM-yyyy")) + "</p>" +
                "<p><strong>Check-Out:</strong> " + booking.getCheckOutDate().format(DateTimeFormatter.ofPattern("dd-MM-yyyy")) + "</p>" +
                "</div>" +
                "<p style='margin-top: 20px;'>The amount should be credited to your original payment method within 5-7 business days.</p>" +
                "<p>If you have any questions, please contact our support team.</p>" +
                "<p>Best Regards,<br>Hotel Management Team</p>" +
                "</div>";
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
