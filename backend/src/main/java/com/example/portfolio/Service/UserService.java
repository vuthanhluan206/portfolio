package com.example.portfolio.Service;

import org.springframework.stereotype.Service;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.example.portfolio.Model.User;
import com.example.portfolio.Repository.UserRepository;
import com.example.portfolio.dto.UserResponseDTO;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    // convert User to UserResponseDTO
    public UserResponseDTO ConvertToDTO(User user) {
        return UserResponseDTO.builder().bio(user.getBio())
                .facebook(user.getFacebook())
                .github(user.getGithub())
                .tiktok(user.getTiktok())
                .instagram(user.getInstagram())
                .fullname(user.getFullname())
                .avatar(user.getAvatar())
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

    public User updateAvatar(Long userId, String avatarUrl) {
        User user = userRepository.findById(userId)
                .orElseGet(() -> userRepository.findAll().stream().findFirst()
                        .orElseThrow(() -> new RuntimeException("Không tìm thấy user")));
        user.setAvatar(avatarUrl);
        return userRepository.save(user);
    }

}

