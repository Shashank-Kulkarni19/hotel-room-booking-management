package com.hotel.service.impl;

import com.hotel.dto.JwtResponse;
import com.hotel.dto.LoginRequest;
import com.hotel.dto.RegisterRequest;
import com.hotel.entity.User;
import com.hotel.exception.BadRequestException;
import com.hotel.repository.UserRepository;
import com.hotel.service.AuthService;
import com.hotel.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

/**
 * Implementation of authentication service
 */
@Service
public class AuthServiceImpl implements AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Override
    public JwtResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email already exists");
        }

        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole("ROLE_USER");
        user.setEnabled(true);

        user = userRepository.save(user);

        String token = jwtUtil.generateToken(user.getEmail(), user.getRole());

        return new JwtResponse(token, "Bearer", user.getId(), user.getName(), user.getEmail(), user.getRole());
    }

    @Override
    public JwtResponse login(LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new BadRequestException("User not found"));

        if (!user.getEnabled()) {
            throw new BadRequestException("Account is disabled");
        }

        String token = jwtUtil.generateToken(user.getEmail(), user.getRole());

        return new JwtResponse(token, "Bearer", user.getId(), user.getName(), user.getEmail(), user.getRole());
    }
}

