package com.hotel.service;

import com.hotel.dto.JwtResponse;
import com.hotel.dto.LoginRequest;
import com.hotel.dto.RegisterRequest;

public interface AuthService {
    JwtResponse register(RegisterRequest request);
    JwtResponse login(LoginRequest request);
    void forgotPassword(String email);
    void verifyOtp(String email, Integer otp);
    void resetPassword(String email, String password);
}

