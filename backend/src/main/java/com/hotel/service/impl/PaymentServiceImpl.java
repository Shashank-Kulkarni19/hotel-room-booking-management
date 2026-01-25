package com.hotel.service.impl;

import com.hotel.dto.CreateOrderRequest;
import com.hotel.dto.OrderResponse;
import com.hotel.dto.PaymentResponse;
import com.hotel.dto.VerifyPaymentRequest;
import com.hotel.entity.Booking;
import com.hotel.entity.Payment;
import com.hotel.exception.BadRequestException;
import com.hotel.exception.ResourceNotFoundException;
import com.hotel.repository.BookingRepository;
import com.hotel.repository.PaymentRepository;
import com.hotel.service.EmailService;
import com.hotel.service.PaymentService;
import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import com.razorpay.RazorpayException;
import com.razorpay.Utils;
import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Implementation of PaymentService for Razorpay payment operations
 */
@Service
public class PaymentServiceImpl implements PaymentService {

    private static final Logger logger = LoggerFactory.getLogger(PaymentServiceImpl.class);

    @Value("${razorpay.key.id}")
    private String razorpayKeyId;

    @Value("${razorpay.key.secret}")
    private String razorpayKeySecret;

    private final BookingRepository bookingRepository;
    private final PaymentRepository paymentRepository;
    private final EmailService emailService;

    public PaymentServiceImpl(BookingRepository bookingRepository, PaymentRepository paymentRepository, EmailService emailService) {
        this.bookingRepository = bookingRepository;
        this.paymentRepository = paymentRepository;
        this.emailService = emailService;
    }

    /**
     * Create a Razorpay order for the given booking
     */
    @Override
    @Transactional
    public OrderResponse createOrder(CreateOrderRequest request) throws Exception {
        logger.info("Creating Razorpay order for booking ID: {}", request.getBookingId());

        // Fetch booking
        Booking booking = bookingRepository.findById(request.getBookingId())
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with ID: " + request.getBookingId()));

        // Validate booking status - Allow both PENDING and BOOKED for flexibility during transition
        if (!"PENDING".equals(booking.getStatus()) && !"BOOKED".equals(booking.getStatus())) {
            throw new BadRequestException("Booking is not in a valid status for payment (Status: " + booking.getStatus() + ")");
        }

        try {
            // Initialize Razorpay client
            RazorpayClient razorpayClient = new RazorpayClient(razorpayKeyId, razorpayKeySecret);

            // Create order request
            JSONObject orderRequest = new JSONObject();
            orderRequest.put("amount", (int) (request.getAmount() * 100)); // Amount in paise
            orderRequest.put("currency", "INR");
            orderRequest.put("receipt", "booking_" + request.getBookingId());

            // Create order
            Order razorpayOrder = razorpayClient.orders.create(orderRequest);
            String razorpayOrderId = razorpayOrder.get("id");

            logger.info("Razorpay order created: {}", razorpayOrderId);

            // Update booking with Razorpay order ID
            booking.setRazorpayOrderId(razorpayOrderId);
            bookingRepository.save(booking);

            // Create payment record
            Payment payment = new Payment();
            payment.setBooking(booking);
            payment.setOrderId(razorpayOrderId);
            payment.setAmount(request.getAmount());
            payment.setStatus("PENDING");
            paymentRepository.save(payment);

            // Return order response
            OrderResponse response = new OrderResponse();
            response.setOrderId(razorpayOrderId);
            response.setAmount(request.getAmount());
            response.setCurrency("INR");
            response.setRazorpayKeyId(razorpayKeyId);
            response.setBookingId(request.getBookingId());

            return response;

        } catch (RazorpayException e) {
            logger.error("Error creating Razorpay order: {}", e.getMessage());
            throw new Exception("Failed to create Razorpay order: " + e.getMessage());
        }
    }

    /**
     * Verify Razorpay payment signature and update booking status
     */
    @Override
    @Transactional
    public PaymentResponse verifyPayment(VerifyPaymentRequest request) throws Exception {
        logger.info("Verifying payment for order ID: {}", request.getRazorpayOrderId());

        try {
            // Find payment by order ID
            Payment payment = paymentRepository.findByOrderId(request.getRazorpayOrderId())
                    .orElseThrow(() -> new ResourceNotFoundException("Payment not found for order ID: " + request.getRazorpayOrderId()));

            Booking booking = payment.getBooking();

            // Verify signature
            JSONObject options = new JSONObject();
            options.put("razorpay_order_id", request.getRazorpayOrderId());
            options.put("razorpay_payment_id", request.getRazorpayPaymentId());
            options.put("razorpay_signature", request.getRazorpaySignature());

            boolean isValidSignature = Utils.verifyPaymentSignature(options, razorpayKeySecret);

            if (isValidSignature) {
                logger.info("Payment signature verified successfully for order: {}", request.getRazorpayOrderId());

                // Update payment details
                payment.setPaymentId(request.getRazorpayPaymentId());
                payment.setSignature(request.getRazorpaySignature());
                payment.setStatus("SUCCESS");
                paymentRepository.save(payment);

                // Update booking status to CONFIRMED
                booking.setStatus("CONFIRMED");
                bookingRepository.save(booking);

                // Send confirmation email
                try {
                    emailService.sendBookingConfirmationEmail(booking);
                } catch (Exception e) {
                    logger.error("Failed to send booking confirmation email: {}", e.getMessage());
                    // Don't throw exception since payment is already successful
                }

                // Return success response
                PaymentResponse response = new PaymentResponse();
                response.setSuccess(true);
                response.setMessage("Payment verified successfully");
                response.setPaymentId(request.getRazorpayPaymentId());
                response.setOrderId(request.getRazorpayOrderId());
                response.setBookingId(booking.getId());
                response.setBookingStatus("CONFIRMED");

                return response;

            } else {
                logger.error("Payment signature verification failed for order: {}", request.getRazorpayOrderId());

                // Update payment status to FAILED
                payment.setStatus("FAILED");
                paymentRepository.save(payment);

                // Update booking status to CANCELLED
                booking.setStatus("CANCELLED");
                bookingRepository.save(booking);

                // Return failure response
                PaymentResponse response = new PaymentResponse();
                response.setSuccess(false);
                response.setMessage("Payment verification failed");
                response.setOrderId(request.getRazorpayOrderId());
                response.setBookingId(booking.getId());
                response.setBookingStatus("CANCELLED");

                return response;
            }

        } catch (RazorpayException e) {
            logger.error("Error verifying payment: {}", e.getMessage());
            throw new Exception("Failed to verify payment: " + e.getMessage());
        }
    }

    @Override
    @Transactional
    public PaymentResponse refundPayment(Long bookingId) throws Exception {
        logger.info("Initiating refund for booking ID: {}", bookingId);

        try {
            // Find payment by booking ID
            Payment payment = paymentRepository.findTopByBookingIdOrderByIdDesc(bookingId)
                    .orElseThrow(() -> new ResourceNotFoundException("Payment not found for booking ID: " + bookingId));

            if (!"SUCCESS".equals(payment.getStatus())) {
                throw new BadRequestException("Only successful payments can be refunded");
            }

            if ("REFUNDED".equals(payment.getRefundStatus())) {
                throw new BadRequestException("This payment has already been refunded");
            }

            // Initialize Razorpay client
            RazorpayClient razorpayClient = new RazorpayClient(razorpayKeyId, razorpayKeySecret);

            // Create refund request
            JSONObject refundRequest = new JSONObject();
            refundRequest.put("payment_id", payment.getPaymentId());
            refundRequest.put("amount", (int) (payment.getAmount() * 100)); // Full refund in paise

            // Create refund
            com.razorpay.Refund razorpayRefund = razorpayClient.payments.refund(refundRequest);
            String refundId = razorpayRefund.get("id");

            logger.info("Razorpay refund created: {}", refundId);

            // Update payment details
            payment.setRefundId(refundId);
            payment.setRefundStatus("REFUNDED");
            paymentRepository.save(payment);

            // Return success response
            PaymentResponse response = new PaymentResponse();
            response.setSuccess(true);
            response.setMessage("Refund processed successfully");
            response.setBookingId(bookingId);
            response.setPaymentId(payment.getPaymentId());

            return response;

        } catch (RazorpayException e) {
            logger.error("Error creating Razorpay refund: {}", e.getMessage());
            throw new Exception("Failed to process refund: " + e.getMessage());
        }
    }
}
