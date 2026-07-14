package com.example.portfolio.Model;

import java.util.List;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Email(message = "Email should be valid")
    @NotBlank(message = "Username cannot be blank")
    private String username;

    @NotBlank(message = "Password cannot be blank")
    private String password;

    @NotBlank(message = "Bio cannot be blank")
    @jakarta.persistence.Column(columnDefinition = "TEXT")
    private String bio;

    private String facebook;

    private String github;

    private String tiktok;

    private String instagram;

    @NotBlank(message = "Fullname cannot be blank")
    private String fullname;

    private String avatar;

    // Lưu danh sách URL avatar đã upload, phân cách bởi "|"
    @jakarta.persistence.Column(columnDefinition = "TEXT")
    private String avatarHistory;

    @OneToMany(mappedBy = "user")
    private List<RefreshToken> refreshTokens;

}
