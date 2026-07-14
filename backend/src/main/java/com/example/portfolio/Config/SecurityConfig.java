package com.example.portfolio.Config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpMethod;

import java.util.List;

import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.provisioning.InMemoryUserDetailsManager;
import org.springframework.beans.factory.annotation.Value;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthFilter jwtAuthFilter;

    @Value("${app.cors.allowed-origins}")
    private List<String> allowedOrigins;

    @Bean
    public UserDetailsService userDetailsService() {
        return new InMemoryUserDetailsManager();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    // CORS cho phép React dev server (localhost:5173) gọi API
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(allowedOrigins);
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(List.of("*"));
        config.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/api/**", config);
        return source;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .csrf(csrf -> csrf.disable())
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(
                        auth -> auth
                                .requestMatchers("/api/auth/**").permitAll()
                                // Public: user tự xóa review của mình bằng email xác nhận
                                .requestMatchers("/api/review/delete-by-email").permitAll()
                                // Public: user tự sửa review của mình bằng email xác nhận
                                .requestMatchers(HttpMethod.PUT, "/api/review/update-by-email").permitAll()
                                // Public: gửi review mới
                                .requestMatchers(HttpMethod.POST, "/api/review/create").permitAll()
                                // Public: GET all reviews (để hiển thị trên trang chính)
                                .requestMatchers(HttpMethod.GET, "/api/review").permitAll()
                                // Public: GET user info (để hiển thị tên, bio, avatar lên trang chủ)
                                .requestMatchers(HttpMethod.GET, "/api/user").permitAll()
                                // Public: ghi nhận lượt truy cập của khách vãng lai
                                .requestMatchers(HttpMethod.POST, "/api/daily-visit-stat/increment").permitAll()
                                // Public: GET all projects (hiển thị trên trang chủ)
                                .requestMatchers(HttpMethod.GET, "/api/project").permitAll()
                                // Còn lại yêu cầu đăng nhập
                                .anyRequest().authenticated())
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);
        return http.build();
    }

}

