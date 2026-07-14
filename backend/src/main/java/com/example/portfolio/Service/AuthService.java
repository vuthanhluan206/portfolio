package com.example.portfolio.Service;

import java.time.LocalDateTime;
import java.util.UUID;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.portfolio.Config.JwtTokenProvider;
import com.example.portfolio.Model.RefreshToken;
import com.example.portfolio.Model.User;
import com.example.portfolio.Repository.RefreshTokenRepository;
import com.example.portfolio.Repository.UserRepository;
import com.example.portfolio.dto.AuthResponse;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Service
public class AuthService {
    private final UserRepository userRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;

    private static final long REFRESH_TOKEN_VALID_DAYS = 7;

    public AuthResponse Login(String username, String password) {
        // kiểm tra user có tồn tại không
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("sai tên đăng nhập hoặc mật khẩu"));
        // kiểm tra mật khẩu
        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new RuntimeException("sai tên đăng nhập hoặc mật khẩu");
        }
        // tạo access token thông qua user name
        String accessToken = jwtTokenProvider.generateAccessToken(user.getUsername());
        // tạo refresh token
        String refreshTokemValue = UUID.randomUUID().toString();

        RefreshToken refreshToken = RefreshToken.builder().token(refreshTokemValue).user(user)
                .expiryDate(LocalDateTime.now().plusDays(REFRESH_TOKEN_VALID_DAYS)).build();
        refreshTokenRepository.save(refreshToken);
        // trả về refreshtone và acess token
        return new AuthResponse(accessToken, refreshTokemValue);
    }

    // cấp access token mới
    public AuthResponse refreshAccessToken(String refresshTokenValue) {
        // kiểm tra refreshToken
        RefreshToken oldRefreshToken = refreshTokenRepository.findByToken(refresshTokenValue)
                .orElseThrow(() -> new RuntimeException("Refresh token không hợp lệ"));
        // Kiểm tra refreshtoken đã hết hạn chưa
        if (oldRefreshToken.getExpiryDate().isBefore(LocalDateTime.now())) {
            this.refreshTokenRepository.delete(oldRefreshToken);
            throw new RuntimeException("Token đã hết hạn vui lòng đăng nhập lại");
        }

        User user = oldRefreshToken.getUser();
        // xóa token cũ trước khi cấp token mới (tránh tích lũy token trong DB)
        refreshTokenRepository.delete(oldRefreshToken);
        // tạo access token mới
        String newAccessToken = this.jwtTokenProvider.generateAccessToken(user.getUsername());
        // tạo refresh token mới
        String newRefreshToken = UUID.randomUUID().toString();
        RefreshToken refreshToken = RefreshToken.builder()
                .token(newRefreshToken).user(user).expiryDate(LocalDateTime.now().plusDays(REFRESH_TOKEN_VALID_DAYS))
                .build();
        refreshTokenRepository.save(refreshToken);
        return new AuthResponse(newAccessToken, newRefreshToken);
    }

    // đăng xuất và xóa token
    public void logout(String refreshTokenValue) {
        refreshTokenRepository.deleteByToken(refreshTokenValue);
    }
}
