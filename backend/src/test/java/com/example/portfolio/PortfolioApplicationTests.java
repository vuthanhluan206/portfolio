package com.example.portfolio;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import com.example.portfolio.Repository.ReviewRepository;

@SpringBootTest
class PortfolioApplicationTests {

    @Autowired
    private ReviewRepository reviewRepository;

    @Test
    void contextLoads() {
    }

    @Test
    void testFindAllReviews() {
        try {
            System.out.println("=== FETCHING REVIEWS START ===");
            reviewRepository.findAllByOrderByCreatedAtDesc().forEach(r -> {
                System.out.println("Review: " + r.getId() + " - " + r.getName() + " - " + r.getCreatedAt());
            });
            System.out.println("=== FETCHING REVIEWS SUCCESS ===");
        } catch (Exception e) {
            System.err.println("=== FETCHING REVIEWS FAILED ===");
            e.printStackTrace();
            throw e;
        }
    }
}
