package com.hotel.repository;

import com.hotel.entity.ForgotPasswordToken;
import com.hotel.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ForgotPasswordTokenRepository extends JpaRepository<ForgotPasswordToken, Long> {

    @Query("SELECT fpt FROM ForgotPasswordToken fpt WHERE fpt.otp = ?1 AND fpt.user = ?2")
    Optional<ForgotPasswordToken> findByOtpAndUser(Integer otp, User user);
    
    Optional<ForgotPasswordToken> findByUser(User user);
}
