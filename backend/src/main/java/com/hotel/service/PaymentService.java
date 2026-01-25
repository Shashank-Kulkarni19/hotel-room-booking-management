package com.hotel.service;

import com.hotel.dto.CreateOrderRequest;
import com.hotel.dto.OrderResponse;
import com.hotel.dto.PaymentResponse;
import com.hotel.dto.VerifyPaymentRequest;

/**
 * Service interface for payment operations
 */
public interface PaymentService {
    
    /**
     * Create a Razorpay order for a booking
     */
    OrderResponse createOrder(CreateOrderRequest request) throws Exception;
    
    /**
     * Verify Razorpay payment signature and update booking status
     */
    PaymentResponse verifyPayment(VerifyPaymentRequest request) throws Exception;

    /**
     * Refund a payment for a booking
     */
    PaymentResponse refundPayment(Long bookingId) throws Exception;
}
