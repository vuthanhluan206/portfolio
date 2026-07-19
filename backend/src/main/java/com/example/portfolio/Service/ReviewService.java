package com.example.portfolio.Service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.example.portfolio.Model.Review;
import com.example.portfolio.Repository.ReviewRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ReviewService {
    private final ReviewRepository reviewRepository;

    // create a review
    public Review createReview(Review review) {
        if (review.getEmail() == null || review.getEmail().isEmpty()) {
            throw new IllegalArgumentException("Email cannot be null or empty");
        }
        if (reviewRepository.existsByEmail(review.getEmail())) {
            throw new IllegalArgumentException(
                    "Review already exists for this email. User may only submit one review per email address.");
        }
        return reviewRepository.save(review);
    }

    // get all list of review — mới nhất lên đầu
    public List<Review> getAllReviews() {
        return reviewRepository.findAllByOrderByCreatedAtDesc();
    }

    // update a review
    public Review updateReview(Review review) {
        Review existing = reviewRepository.findById(review.getId())
                .orElseThrow(() -> new IllegalArgumentException("Review does not exist for this id"));

        if (review.getStar() == null || review.getStar() < 0 || review.getStar() > 5) {
            throw new IllegalArgumentException("Star must be a number between 0 and 5");
        }

        existing.setEmail(review.getEmail());
        existing.setName(review.getName());
        existing.setRole(review.getRole());
        existing.setStar(review.getStar());
        existing.setContent(review.getContent());
        return reviewRepository.save(existing);
    }

    // Public — user tự sửa review của mình bằng email xác nhận
    public Review updateByEmail(Long id, String email, String name, String role, Long star, String content) {
        Review existing = reviewRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Review does not exist for this id"));
        if (!existing.getEmail().equalsIgnoreCase(email.trim())) {
            throw new IllegalArgumentException("Email không khớp với review này");
        }
        if (star == null || star < 1 || star > 5) {
            throw new IllegalArgumentException("Số sao phải từ 1 đến 5");
        }
        existing.setName(name);
        existing.setRole(role);
        existing.setStar(star);
        existing.setContent(content);
        return reviewRepository.save(existing);
    }

    // delete a review (admin — yêu cầu JWT)
    public void deleteReview(Long id) {
        if (!reviewRepository.existsById(id)) {
            throw new IllegalArgumentException("Review does not exist for this id");
        }
        reviewRepository.deleteById(id);
    }

    // delete a review by email — public, user tự xóa review của mình
    public void deleteByEmail(Long id, String email) {
        Review review = reviewRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Review does not exist for this id"));
        // kiểm tra email khớp với review
        if (!review.getEmail().equalsIgnoreCase(email.trim())) {
            throw new IllegalArgumentException("Email không khớp với review này");
        }
        reviewRepository.deleteById(id);
    }
}
