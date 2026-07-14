package com.example.portfolio.Model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Project {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    // Thời gian thực hiện, ví dụ "03/2026" hoặc "3 months"
    private String duration;

    // Danh sách skill, lưu dưới dạng chuỗi phân cách bằng dấu phẩy, vd: "Java,Spring Boot,MySQL"
    @Column(columnDefinition = "TEXT")
    private String skills;

    // Category: backend / frontend / fullstack
    private String category;

    // GitHub link — để null nếu không có
    private String github;

    // Live Demo link — để null nếu không có
    private String liveDemo;
}
