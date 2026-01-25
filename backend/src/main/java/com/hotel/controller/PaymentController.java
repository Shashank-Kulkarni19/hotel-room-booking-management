package com.hotel.controller;

import com.hotel.dto.CreateOrderRequest;
import com.hotel.dto.OrderResponse;
import com.hotel.dto.PaymentResponse;
import com.hotel.dto.VerifyPaymentRequest;
import com.hotel.service.PaymentService;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * REST Controller for payment operations
 */
@RestController
@RequestMapping("/api/payments")
@CrossOrigin(origins = "*")
public class PaymentController {

    private static final Logger logger = LoggerFactory.getLogger(PaymentController.class);

    private final PaymentService paymentService;

    public PaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    /**
     * Create a Razorpay order
     * POST /api/payments/create-order
     */
    @PostMapping("/create-order")
    public ResponseEntity<?> createOrder(@Valid @RequestBody CreateOrderRequest request) {
        try {
            logger.info("Received request to create order for booking ID: {}", request.getBookingId());
            OrderResponse response = paymentService.createOrder(request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("Error creating order: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error creating order: " + e.getMessage());
        }
    }

    /**
     * Verify Razorpay payment
     * POST /api/payments/verify
     */
    @PostMapping("/verify")
    public ResponseEntity<?> verifyPayment(@Valid @RequestBody VerifyPaymentRequest request) {
        try {
            logger.info("Received request to verify payment for order ID: {}", request.getRazorpayOrderId());
            PaymentResponse response = paymentService.verifyPayment(request);
            
            if (response.isSuccess()) {
                return ResponseEntity.ok(response);
            } else {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
            }
        } catch (Exception e) {
            logger.error("Error verifying payment: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error verifying payment: " + e.getMessage());
        }
    }

    /**
     * Refund a payment
     * POST /api/payments/refund/{bookingId}
     */
    @PostMapping("/refund/{bookingId}")
    public ResponseEntity<?> refundPayment(@PathVariable Long bookingId) {
        try {
            logger.info("Received request to refund payment for booking ID: {}", bookingId);
            PaymentResponse response = paymentService.refundPayment(bookingId);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("Error refunding payment: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error refunding payment: " + e.getMessage());
        }
    }
}
