package com.example.portfolio.Repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.portfolio.Model.Review;
import java.util.List;

public interface ReviewRepository extends JpaRepository<Review, Long> {
    boolean existsByEmail(String email);

    // Lấy tất cả review, mới nhất lên đầu
    List<Review> findAllByOrderByCreatedAtDesc();
}
