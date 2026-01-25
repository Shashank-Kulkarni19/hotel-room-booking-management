package com.hotel.dto;

import lombok.Data;

@Data
public class OrderRequest {
    private Long bookingId;
    private Double amount;
}
