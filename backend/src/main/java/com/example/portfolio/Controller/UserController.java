package com.example.portfolio.Controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
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

import java.util.Map;

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

    // ── Upload avatar mới lên Cloudflare R2, lưu vào history ──
    @PostMapping("/avatar")
    public ResponseEntity<?> uploadAvatar(
            @RequestParam Long id,
            @RequestParam("file") MultipartFile file) {

        String avatarUrl = imageService.uploadImage(file);
        this.userService.updateAvatar(id, avatarUrl);

        return ResponseEntity.ok(avatarUrl);
    }

    // ── Chọn avatar từ history (không upload, 0 tốn R2) ──
    @PostMapping("/avatar/select")
    public ResponseEntity<?> selectAvatar(
            @RequestParam Long id,
            @RequestBody Map<String, String> body) {

        String avatarUrl = body.get("url");
        if (avatarUrl == null || avatarUrl.isBlank()) {
            return ResponseEntity.badRequest().body("url is required");
        }
        UserResponseDTO dto = this.userService.selectAvatarFromHistory(id, avatarUrl);
        return ResponseEntity.ok(dto);
    }

    // ── Xóa 1 URL khỏi history ──
    @DeleteMapping("/avatar/history")
    public ResponseEntity<?> removeFromHistory(
            @RequestParam Long id,
            @RequestBody Map<String, String> body) {

        String avatarUrl = body.get("url");
        if (avatarUrl == null || avatarUrl.isBlank()) {
            return ResponseEntity.badRequest().body("url is required");
        }
        UserResponseDTO dto = this.userService.removeFromHistory(id, avatarUrl);
        return ResponseEntity.ok(dto);
    }

    // ── Xóa avatar hiện tại (reset về rỗng, history vẫn giữ) ──
    @PostMapping("/avatar/delete")
    public ResponseEntity<?> deleteAvatar(@RequestParam Long id) {
        this.userService.updateAvatar(id, "");
        return ResponseEntity.ok("Avatar deleted successfully");
    }

}
