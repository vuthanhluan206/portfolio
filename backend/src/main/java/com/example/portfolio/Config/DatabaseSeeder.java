package com.example.portfolio.Config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.beans.factory.annotation.Value;

import com.example.portfolio.Model.User;
import com.example.portfolio.Repository.UserRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Component
@RequiredArgsConstructor
public class DatabaseSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${admin.default.password:}")
    private String defaultAdminPassword;

    @Override
    public void run(String... args) throws Exception {
        // Nếu database chưa có user nào, khởi tạo user mặc định cho admin
        if (userRepository.count() == 0) {
            // Buộc phải có env var ADMIN_DEFAULT_PASSWORD — không có thì đưa ra cảnh báo rõ ràng
            String rawPassword = (defaultAdminPassword != null && !defaultAdminPassword.isBlank())
                    ? defaultAdminPassword
                    : "Admin@" + java.util.UUID.randomUUID().toString().substring(0, 8);

            if (defaultAdminPassword == null || defaultAdminPassword.isBlank()) {
                log.warn("[SECURITY] env var 'ADMIN_DEFAULT_PASSWORD' chưa được đặt! " +
                         "Mật khẩu ngẫu nhiên đã được tạo: {}", rawPassword);
            }

            User defaultUser = User.builder()
                    .username("admin@gmail.com")
                    .password(passwordEncoder.encode(rawPassword))
                    .fullname("Vũ Thành Luân")
                    .bio("A third-year Information Technology student on a journey toward Fullstack Development. Solid backend foundation with Java & Spring Boot, actively expanding into Frontend with React.")
                    .facebook("https://facebook.com/luan.vuthanh.716")
                    .github("https://github.com/vuthanhluan206")
                    .tiktok("https://tiktok.com/@vuthanhluan206")
                    .instagram("https://instagram.com/vuthanhluan206")
                    .avatar("") // Cho phép bỏ trống avatar mặc định
                    .build();
            userRepository.save(defaultUser);
        }
    }
}
