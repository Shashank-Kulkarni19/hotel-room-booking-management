package com.hotel.service.impl;
import java.io.*;
import com.hotel.entity.Booking;
import com.hotel.service.PdfService;
import com.lowagie.text.*;
import com.lowagie.text.pdf.PdfPCell;
import com.lowagie.text.pdf.PdfPTable;
import com.lowagie.text.pdf.PdfWriter;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.awt.Color;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Service
public class PdfServiceImpl implements PdfService {

    private static final Logger logger = LoggerFactory.getLogger(PdfServiceImpl.class);

    @Override
    public ByteArrayInputStream generatePaymentReceipt(Booking booking) throws java.io.IOException {
        logger.info("Generating PDF receipt for booking ID: {}", booking.getId());
        Document document = new Document(PageSize.A4);
        ByteArrayOutputStream out = new ByteArrayOutputStream();

        try {
            PdfWriter.getInstance(document, out);
            document.open();

            // Add Header
            Font headerFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 24, Color.DARK_GRAY);
            Paragraph header = new Paragraph("PAYMENT RECEIPT", headerFont);
            header.setAlignment(Element.ALIGN_CENTER);
            header.setSpacingAfter(20);
            document.add(header);

            // Add Hotel Info
            Font subHeaderFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 14);
            Paragraph hotelInfo = new Paragraph("Hotel Booking Management System\n123 Luxury Lane, City\nPhone: +1 234 567 890\nEmail: contact@hotel.com", FontFactory.getFont(FontFactory.HELVETICA, 12));
            hotelInfo.setSpacingAfter(20);
            document.add(hotelInfo);

            // Add Receipt Details Table
            PdfPTable table = new PdfPTable(2);
            table.setWidthPercentage(100);
            table.setSpacingBefore(10);

            addCell(table, "Receipt No:", subHeaderFont);
            addCell(table, "REC-" + booking.getId() + "-" + System.currentTimeMillis() % 10000, FontFactory.getFont(FontFactory.HELVETICA, 12));

            addCell(table, "Date:", subHeaderFont);
            addCell(table, LocalDateTime.now().format(DateTimeFormatter.ofPattern("dd-MM-yyyy HH:mm")), FontFactory.getFont(FontFactory.HELVETICA, 12));

            addCell(table, "Customer Name:", subHeaderFont);
            addCell(table, booking.getUser().getName(), FontFactory.getFont(FontFactory.HELVETICA, 12));

            addCell(table, "Email:", subHeaderFont);
            addCell(table, booking.getUser().getEmail(), FontFactory.getFont(FontFactory.HELVETICA, 12));

            document.add(table);

            // Add Booking Details Table
            Paragraph bookingTitle = new Paragraph("\nBooking Details", subHeaderFont);
            bookingTitle.setSpacingAfter(10);
            document.add(bookingTitle);

            PdfPTable bookingTable = new PdfPTable(2);
            bookingTable.setWidthPercentage(100);

            addCell(bookingTable, "Room Type:", subHeaderFont);
            addCell(bookingTable, booking.getRoom().getRoomType(), FontFactory.getFont(FontFactory.HELVETICA, 12));

            addCell(bookingTable, "Room Number:", subHeaderFont);
            addCell(bookingTable, booking.getRoom().getRoomNumber(), FontFactory.getFont(FontFactory.HELVETICA, 12));

            addCell(bookingTable, "Check-In Date:", subHeaderFont);
            addCell(bookingTable, booking.getCheckInDate().format(DateTimeFormatter.ofPattern("dd-MM-yyyy")), FontFactory.getFont(FontFactory.HELVETICA, 12));

            addCell(bookingTable, "Check-Out Date:", subHeaderFont);
            addCell(bookingTable, booking.getCheckOutDate().format(DateTimeFormatter.ofPattern("dd-MM-yyyy")), FontFactory.getFont(FontFactory.HELVETICA, 12));

            addCell(bookingTable, "Total Amount Paid:", subHeaderFont);
            addCell(bookingTable, "INR " + booking.getTotalAmount(), FontFactory.getFont(FontFactory.HELVETICA_BOLD, 12, Color.BLUE));

            addCell(bookingTable, "Payment Status:", subHeaderFont);
            addCell(bookingTable, "SUCCESSFUL", FontFactory.getFont(FontFactory.HELVETICA_BOLD, 12, Color.GREEN));

            document.add(bookingTable);

            // Footer
            Paragraph footer = new Paragraph("\n\nThank you for choosing us! We hope you have a pleasant stay.", FontFactory.getFont(FontFactory.HELVETICA_OBLIQUE, 10));
            footer.setAlignment(Element.ALIGN_CENTER);
            document.add(footer);

            document.close();

        } catch (DocumentException ex) {
            logger.error("Error occurred while generating PDF: {}", ex.getMessage());
        }

        return new ByteArrayInputStream(out.toByteArray());
    }

    private void addCell(PdfPTable table, String text, Font font) {
        PdfPCell cell = new PdfPCell(new Phrase(text, font));
        cell.setPadding(8);
        cell.setVerticalAlignment(Element.ALIGN_MIDDLE);
        table.addCell(cell);
    }
}
