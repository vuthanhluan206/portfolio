package com.example.portfolio.Repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.portfolio.Model.Review;

public interface ReviewRepository extends JpaRepository<Review, Long> {
    boolean existsByEmail(String email);
}
