package com.example.portfolio.Service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.example.portfolio.Model.Project;
import com.example.portfolio.Repository.ProjectRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ProjectService {

    private final ProjectRepository projectRepository;

    public List<Project> getAllProjects() {
        return projectRepository.findAllByOrderByIdDesc();
    }

    public Project createProject(Project project) {
        return projectRepository.save(project);
    }

    public Project updateProject(Long id, Project updated) {
        Project existing = projectRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Project không tồn tại với id: " + id));
        existing.setName(updated.getName());
        existing.setDescription(updated.getDescription());
        existing.setDuration(updated.getDuration());
        existing.setSkills(updated.getSkills());
        existing.setCategory(updated.getCategory());
        existing.setGithub(updated.getGithub());
        existing.setLiveDemo(updated.getLiveDemo());
        return projectRepository.save(existing);
    }

    public void deleteProject(Long id) {
        projectRepository.deleteById(id);
    }
}
