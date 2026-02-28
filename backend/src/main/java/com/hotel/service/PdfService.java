package com.hotel.service;

import com.hotel.entity.Booking;
import java.io.ByteArrayInputStream;
import java.io.IOException;

/**
 * Service for generating PDF documents
 */
public interface PdfService {
    /**
     * Generate a payment receipt PDF for a booking
     * @param booking The booking details
     * @return A ByteArrayInputStream containing the PDF data
     * @throws IOException 
     */
    ByteArrayInputStream generatePaymentReceipt(Booking booking) throws IOException;
}
