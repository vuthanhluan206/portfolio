package com.example.portfolio.Config;

import java.util.Date;

import javax.crypto.SecretKey;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

@Component
public class JwtTokenProvider {
    @Value("${jwt.secret}")
    private String secret;

    @Value("${jwt.access-token-expiration}")
    private long accessTokenExpiration;

    // create secret Key
    private SecretKey getSigningKey() {
        return Keys.hmacShaKeyFor(secret.getBytes());
    }

    // create access token
    public String generateAccessToken(String username) {
        Date now = new Date();
        Date expireDate = new Date(now.getTime() + accessTokenExpiration);

        return Jwts.builder()
                .subject(username) // lưu user vào claim
                .issuedAt(now) // lưu thời gian tạo token
                .expiration(expireDate) // lưu thời gian hết hạn token
                .signWith(getSigningKey()) // chữ ký bằng secret key
                .compact();// convert sang chuỗi jwt hoàn chỉnh
    }

    // giải mã token
    public String getUsernameFromToken(String token) {
        Claims claims = Jwts.parser()
                .verifyWith(getSigningKey()) // kiểm tra chữ ký
                .build()
                .parseSignedClaims(token) // parse chuỗi JWT thành claims
                .getPayload(); // lấy payload

        return claims.getSubject(); // lấy giá chị sub là username
    }

    // xác thực token
    public boolean ValidateToken(String token) {

        try {
            Jwts.parser()
                    .verifyWith(getSigningKey()) // xác thực chữ ký
                    .build()
                    .parseSignedClaims(token); // phân tích token
            return true;
        } catch (Exception e) {
            return false;
        }

    }

}
