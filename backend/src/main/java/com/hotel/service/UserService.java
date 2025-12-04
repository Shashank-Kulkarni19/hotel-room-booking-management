package com.hotel.service;

import com.hotel.dto.UserResponse;

import java.util.List;

public interface UserService {
    UserResponse getCurrentUser(String email);
    UserResponse updateUserStatus(Long userId, Boolean enabled);
    List<UserResponse> getAllUsers();
}

