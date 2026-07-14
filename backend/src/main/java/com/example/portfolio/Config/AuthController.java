package com.example.portfolio.Config;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.portfolio.Service.AuthService;
import com.example.portfolio.dto.AuthResponse;
import com.example.portfolio.dto.LoginRequest;
import com.example.portfolio.dto.RefreshTokenRequest;

import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {
    private final AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest loginRequest) {
        AuthResponse authResponse = authService.Login(loginRequest.getUsername(), loginRequest.getPassword());
        return ResponseEntity.ok(authResponse);

    }

    @PostMapping("/refresh")
    public ResponseEntity<AuthResponse> refreshToken(@RequestBody RefreshTokenRequest request) {
        AuthResponse authResponse = this.authService.refreshAccessToken(request.getRefreshToken());
        return ResponseEntity.ok(authResponse);
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(@RequestBody RefreshTokenRequest request) {
        this.authService.logout(request.getRefreshToken());
        return ResponseEntity.ok("Logout succussful");
    }

}
