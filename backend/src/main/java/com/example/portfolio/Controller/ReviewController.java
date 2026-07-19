package com.example.portfolio.Controller;

import org.springframework.http.HttpStatus;
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

import com.example.portfolio.Model.Review;
import com.example.portfolio.Service.ReviewService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/review")
public class ReviewController {

    private final ReviewService reviewService;

    @PostMapping("/create")
    public ResponseEntity<?> createReview(@RequestBody Review review) {
        Review review2 = this.reviewService.createReview(review);
        return ResponseEntity.ok(review2);
    }

    @GetMapping
    public ResponseEntity<?> getAllReview() {
        return ResponseEntity.ok(this.reviewService.getAllReviews());
    }

    @PutMapping("/update")
    public ResponseEntity<?> updateReview(@RequestBody Review review) {
        Review updatedReview = this.reviewService.updateReview(review);
        return ResponseEntity.ok(updatedReview);
    }

    // Public — user tự sửa review của mình bằng email xác nhận
    @PutMapping("/update-by-email")
    public ResponseEntity<?> updateByEmail(
            @RequestParam Long id,
            @RequestParam String email,
            @RequestParam String name,
            @RequestParam String role,
            @RequestParam Long star,
            @RequestParam String content) {
        try {
            Review updated = this.reviewService.updateByEmail(id, email, name, role, star, content);
            return ResponseEntity.ok(updated);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(e.getMessage());
        }
    }

    // Admin xóa review — yêu cầu JWT
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteReview(@PathVariable Long id) {
        this.reviewService.deleteReview(id);
        return ResponseEntity.ok("Review deleted successfully");
    }

    // Public — user tự xóa review của mình bằng email
    @DeleteMapping("/delete-by-email")
    public ResponseEntity<?> deleteByEmail(
            @RequestParam Long id,
            @RequestParam String email) {
        try {
            this.reviewService.deleteByEmail(id, email);
            return ResponseEntity.ok("Xóa review thành công");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(e.getMessage());
        }
    }
}

