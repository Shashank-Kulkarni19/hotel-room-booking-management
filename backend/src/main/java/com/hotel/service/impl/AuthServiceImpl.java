package com.hotel.service.impl;

import com.hotel.dto.JwtResponse;
import com.hotel.dto.LoginRequest;
import com.hotel.dto.RegisterRequest;
import com.hotel.entity.ForgotPasswordToken;
import com.hotel.entity.User;
import com.hotel.exception.BadRequestException;
import com.hotel.repository.ForgotPasswordTokenRepository;
import com.hotel.repository.UserRepository;
import com.hotel.service.AuthService;
import com.hotel.service.EmailService;
import com.hotel.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

/**
 * Implementation of authentication service
 */
@Service
public class AuthServiceImpl implements AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ForgotPasswordTokenRepository forgotPasswordTokenRepository;

    @Autowired
    private EmailService emailService;

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

    @Override
    public void forgotPassword(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new BadRequestException("User not found with email: " + email));

        // Generate 6 digit OTP
        Integer otp = (int) (Math.random() * 900000) + 100000;

        // Check if token already exists for user
        ForgotPasswordToken token = forgotPasswordTokenRepository.findByUser(user)
                .orElse(new ForgotPasswordToken());

        token.setOtp(otp);
        token.setExpiryTime(LocalDateTime.now().plusMinutes(10));
        token.setUser(user);

        forgotPasswordTokenRepository.save(token);
        emailService.sendForgotPasswordEmail(email, otp);
    }

    @Override
    public void verifyOtp(String email, Integer otp) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new BadRequestException("User not found with email: " + email));

        ForgotPasswordToken token = forgotPasswordTokenRepository.findByOtpAndUser(otp, user)
                .orElseThrow(() -> new BadRequestException("Invalid OTP"));

        if (token.getExpiryTime().isBefore(LocalDateTime.now())) {
            forgotPasswordTokenRepository.delete(token);
            throw new BadRequestException("OTP expired");
        }
    }

    @Override
    public void resetPassword(String email, String password) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new BadRequestException("User not found with email: " + email));

        user.setPassword(passwordEncoder.encode(password));
        userRepository.save(user);

        // Delete the token after successful password reset
        forgotPasswordTokenRepository.findByUser(user).ifPresent(forgotPasswordTokenRepository::delete);
    }
}
