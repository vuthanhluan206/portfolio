package com.example.portfolio.Controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.example.portfolio.Cloudflare.ImageService;
import com.example.portfolio.Model.User;
import com.example.portfolio.Service.UserService;
import com.example.portfolio.dto.UserResponseDTO;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;
    private final ImageService imageService;

    @GetMapping
    public ResponseEntity<?> getUser(@RequestParam long id) {
        UserResponseDTO user = this.userService.getUserById(id);
        return ResponseEntity.ok(user);
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<?> updateUser(@PathVariable Long id, @RequestBody User user) {
        UserResponseDTO updatedUser = this.userService.updateUser(id, user);
        return ResponseEntity.ok(updatedUser);
    }

    @PostMapping("/avatar")
    public ResponseEntity<?> uploadAvatar(
            @RequestParam Long id,
            @RequestParam("file") MultipartFile file) {

        // Endpoint đã được bảo vệ bởi JWT (anyRequest().authenticated())
        // Chỉ admin đang đăng nhập mới gọi được tới đây
        String avatarUrl = imageService.uploadImage(file);
        this.userService.updateAvatar(id, avatarUrl);

        return ResponseEntity.ok(avatarUrl);
    }

    @PostMapping("/avatar/delete")
    public ResponseEntity<?> deleteAvatar(@RequestParam Long id) {
        this.userService.updateAvatar(id, "");
        return ResponseEntity.ok("Avatar deleted successfully");
    }

}
