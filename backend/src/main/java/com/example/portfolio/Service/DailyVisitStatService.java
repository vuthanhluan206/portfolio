package com.example.portfolio.Service;

import java.time.LocalDate;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.portfolio.Model.DailyVisitStat;
import com.example.portfolio.Repository.DailyVisitStatRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class DailyVisitStatService {
    private final DailyVisitStatRepository dailyVisitStatRepository;

    @Transactional
    public void incrementDailyVisitToday(LocalDate date) {
        // Atomic upsert: inserts a new row with count=1 on the first visit of the day,
        // or increments the existing counter — no duplicate-key race condition.
        this.dailyVisitStatRepository.upsertVisit(date);
    }

    public List<DailyVisitStat> getDailyVisitStat(LocalDate from, LocalDate to) {
        return this.dailyVisitStatRepository.findByDateBetweenOrderByDateAsc(from, to);
    }
}
