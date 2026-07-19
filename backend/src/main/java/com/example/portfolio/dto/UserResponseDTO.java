package com.example.portfolio.dto;

import java.util.List;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class UserResponseDTO {

    private String bio;

    private String facebook;

    private String github;

    private String tiktok;

    private String instagram;

    private String fullname;

    private String avatar;

    private List<String> avatarHistory;
}
