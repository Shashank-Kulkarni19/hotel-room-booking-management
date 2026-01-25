package com.hotel.dto;

import lombok.Data;

@Data
public class RazorpayOrderResponse {
    private String orderId;
    private Double amount;
    private String currency;
    private String status;
    private String key; // Send key to frontend to avoid hardcoding
}
