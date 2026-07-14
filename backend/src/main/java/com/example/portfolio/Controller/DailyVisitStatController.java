package com.example.portfolio.Controller;

import java.time.LocalDate;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.portfolio.Service.DailyVisitStatService;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.GetMapping;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/daily-visit-stat")
public class DailyVisitStatController {
    private final DailyVisitStatService dailyVisitStatService;

    @PostMapping("/increment")
    public ResponseEntity<?> incrementDailyVisitToday(@RequestParam LocalDate date) {
        this.dailyVisitStatService.incrementDailyVisitToday(date);
        return ResponseEntity.ok("Daily visit incremented");
    }

    @GetMapping
    public ResponseEntity<?> getDailyVisitStat( @RequestParam LocalDate from, @RequestParam LocalDate to) {
        return ResponseEntity.ok(this.dailyVisitStatService.getDailyVisitStat(from, to));
    }
}
