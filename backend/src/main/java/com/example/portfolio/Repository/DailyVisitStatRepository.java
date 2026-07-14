package com.example.portfolio.Repository;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.example.portfolio.Model.DailyVisitStat;

public interface DailyVisitStatRepository extends JpaRepository<DailyVisitStat, LocalDate> {

    List<DailyVisitStat> findByDateBetweenOrderByDateAsc(LocalDate from, LocalDate to);

    /**
     * Atomically insert or increment the visit counter for a given date.
     * Uses MySQL ON DUPLICATE KEY UPDATE to avoid duplicate-key errors
     * when concurrent requests hit the same day.
     */
    @Modifying
    @Query(
        value = "INSERT INTO daily_visit_stat (date, total_visits) VALUES (:date, 1) "
              + "ON DUPLICATE KEY UPDATE total_visits = total_visits + 1",
        nativeQuery = true
    )
    void upsertVisit(@Param("date") LocalDate date);
}
