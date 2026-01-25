package com.hotel.repository;

import com.hotel.entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {
    Optional<Payment> findByOrderId(String orderId);
    Optional<Payment> findByPaymentId(String paymentId);
    
    // Use findTop to get the latest payment attempt in case multiple orders were created
    Optional<Payment> findTopByBookingIdOrderByIdDesc(Long bookingId);
}
