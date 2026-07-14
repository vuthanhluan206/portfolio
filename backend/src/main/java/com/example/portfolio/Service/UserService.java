package com.example.portfolio.Service;

import org.springframework.stereotype.Service;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.example.portfolio.Model.User;
import com.example.portfolio.Repository.UserRepository;
import com.example.portfolio.dto.UserResponseDTO;

import lombok.RequiredArgsConstructor;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    // ── Mật khẩu phải có: ≥8 ký tự, chữ cái, chữ số, ký tự đặc biệt ──
    private static final Pattern PW_LETTER  = Pattern.compile("[a-zA-Z]");
    private static final Pattern PW_DIGIT   = Pattern.compile("[0-9]");
    private static final Pattern PW_SPECIAL = Pattern.compile("[^a-zA-Z0-9]");

    private void validatePassword(String password) {
        if (password == null || password.length() < 8)
            throw new IllegalArgumentException("Mật khẩu phải có ít nhất 8 ký tự");
        if (!PW_LETTER.matcher(password).find())
            throw new IllegalArgumentException("Mật khẩu phải chứa ít nhất 1 chữ cái");
        if (!PW_DIGIT.matcher(password).find())
            throw new IllegalArgumentException("Mật khẩu phải chứa ít nhất 1 chữ số");
        if (!PW_SPECIAL.matcher(password).find())
            throw new IllegalArgumentException("Mật khẩu phải chứa ít nhất 1 ký tự đặc biệt (vd: !@#$%)");
    }

    // ── Parse avatarHistory string → List<String> ──
    private List<String> parseHistory(String raw) {
        if (raw == null || raw.isBlank()) return new ArrayList<>();
        return Arrays.stream(raw.split("\\|"))
                .map(String::trim)
                .filter(s -> !s.isEmpty())
                .collect(Collectors.toCollection(ArrayList::new));
    }

    // ── Serialize List<String> → avatarHistory string ──
    private String serializeHistory(List<String> list) {
        if (list == null || list.isEmpty()) return "";
        return list.stream().filter(s -> s != null && !s.isBlank()).collect(Collectors.joining("|"));
    }

    // convert User to UserResponseDTO
    public UserResponseDTO ConvertToDTO(User user) {
        return UserResponseDTO.builder()
                .bio(user.getBio())
                .facebook(user.getFacebook())
                .github(user.getGithub())
                .tiktok(user.getTiktok())
                .instagram(user.getInstagram())
                .fullname(user.getFullname())
                .avatar(user.getAvatar())
                .avatarHistory(parseHistory(user.getAvatarHistory()))
                .build();
    }

    public UserResponseDTO getUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseGet(() -> userRepository.findAll().stream().findFirst()
                        .orElseThrow(() -> new RuntimeException("User not found")));
        return ConvertToDTO(user);
    }

    // update user by id
    public UserResponseDTO updateUser(Long id, User user) {
        User updatedUser = userRepository.findById(id)
                .orElseGet(() -> userRepository.findAll().stream().findFirst()
                        .orElseThrow(() -> new RuntimeException("User not found")));
        if (user.getUsername() != null && !user.getUsername().trim().isEmpty()) {
            updatedUser.setUsername(user.getUsername());
        }
        if (user.getPassword() != null && !user.getPassword().trim().isEmpty() && !user.getPassword().equals("***")) {
            validatePassword(user.getPassword());
            updatedUser.setPassword(passwordEncoder.encode(user.getPassword()));
        }
        if (user.getBio() != null && !user.getBio().trim().isEmpty()) {
            updatedUser.setBio(user.getBio());
        }
        if (user.getFacebook() != null && !user.getFacebook().trim().isEmpty()) {
            updatedUser.setFacebook(user.getFacebook());
        }
        if (user.getGithub() != null && !user.getGithub().trim().isEmpty()) {
            updatedUser.setGithub(user.getGithub());
        }
        if (user.getTiktok() != null && !user.getTiktok().trim().isEmpty()) {
            updatedUser.setTiktok(user.getTiktok());
        }
        if (user.getInstagram() != null && !user.getInstagram().trim().isEmpty()) {
            updatedUser.setInstagram(user.getInstagram());
        }
        if (user.getFullname() != null && !user.getFullname().trim().isEmpty()) {
            updatedUser.setFullname(user.getFullname());
        }
        userRepository.save(updatedUser);
        return ConvertToDTO(updatedUser);
    }

    // ── Upload avatar mới: lưu URL vào history, đặt làm avatar hiện tại ──
    public User updateAvatar(Long userId, String avatarUrl) {
        User user = userRepository.findById(userId)
                .orElseGet(() -> userRepository.findAll().stream().findFirst()
                        .orElseThrow(() -> new RuntimeException("Không tìm thấy user")));

        user.setAvatar(avatarUrl);

        // Nếu URL hợp lệ → thêm vào history (nếu chưa có)
        if (avatarUrl != null && !avatarUrl.isBlank()) {
            List<String> history = parseHistory(user.getAvatarHistory());
            if (!history.contains(avatarUrl)) {
                history.add(0, avatarUrl); // Thêm vào đầu danh sách (mới nhất trước)
            }
            user.setAvatarHistory(serializeHistory(history));
        }

        return userRepository.save(user);
    }

    // ── Chọn avatar từ history (không upload, không tốn R2) ──
    public UserResponseDTO selectAvatarFromHistory(Long userId, String avatarUrl) {
        User user = userRepository.findById(userId)
                .orElseGet(() -> userRepository.findAll().stream().findFirst()
                        .orElseThrow(() -> new RuntimeException("Không tìm thấy user")));

        // Chỉ set avatar field, KHÔNG thay đổi history
        user.setAvatar(avatarUrl);
        return ConvertToDTO(userRepository.save(user));
    }

    // ── Xóa 1 URL khỏi history ──
    public UserResponseDTO removeFromHistory(Long userId, String avatarUrl) {
        User user = userRepository.findById(userId)
                .orElseGet(() -> userRepository.findAll().stream().findFirst()
                        .orElseThrow(() -> new RuntimeException("Không tìm thấy user")));

        List<String> history = parseHistory(user.getAvatarHistory());
        history.remove(avatarUrl);
        user.setAvatarHistory(serializeHistory(history));

        // Nếu đang dùng avatar bị xóa → reset về avatar đầu tiên còn lại (hoặc "")
        if (avatarUrl.equals(user.getAvatar())) {
            user.setAvatar(history.isEmpty() ? "" : history.get(0));
        }

        return ConvertToDTO(userRepository.save(user));
    }
}
