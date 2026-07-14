package com.example.portfolio.Repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.portfolio.Model.Project;

import java.util.List;

public interface ProjectRepository extends JpaRepository<Project, Long> {
    List<Project> findAllByOrderByIdDesc();
}
