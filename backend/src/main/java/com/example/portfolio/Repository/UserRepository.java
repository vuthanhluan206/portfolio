package com.example.portfolio.Repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.portfolio.Model.User;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String usernamr);
}
