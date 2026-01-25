package com.hotel.scheduler;

import com.hotel.entity.Booking;
import com.hotel.repository.BookingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.List;

/**
 * Scheduler that marks bookings as COMPLETED when their checkout date has passed
 */
@Component
public class BookingScheduler {

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private com.hotel.service.RoomService roomService;

    // Run once a day at 00:30 to process recently completed checkouts
    @Scheduled(cron = "0 * * * * ?")
    public void completePastBookings() {
        LocalDate today = LocalDate.now();
        List<Booking> toComplete = bookingRepository.findBookingsToComplete(today);
        if (toComplete == null || toComplete.isEmpty()) return;

        for (Booking b : toComplete) {
            b.setStatus("COMPLETED");
            try {
                roomService.increaseAvailableRooms(b.getRoom().getId());
            } catch (Exception ignored) {
                // ignore failures restoring counter
            }
        }

        bookingRepository.saveAll(toComplete);
    }

    /**
     * Automatically cancel PENDING bookings older than 10 minutes
     * Runs every minute
     */
    @Scheduled(fixedRate = 60000)
    public void cancelExpiredBookings() {
        java.time.LocalDateTime tenMinutesAgo = java.time.LocalDateTime.now().minusMinutes(10);
        List<Booking> expiredBookings = bookingRepository.findExpiredPendingBookings(tenMinutesAgo);
        
        if (expiredBookings != null && !expiredBookings.isEmpty()) {
            System.out.println("Cancelling " + expiredBookings.size() + " expired pending bookings");
            for (Booking booking : expiredBookings) {
                booking.setStatus("CANCELLED");
                // Restore room availability if it was decreased
                try {
                    roomService.increaseAvailableRooms(booking.getRoom().getId());
                } catch (Exception ignored) {}
            }
            bookingRepository.saveAll(expiredBookings);
        }
    }
}
