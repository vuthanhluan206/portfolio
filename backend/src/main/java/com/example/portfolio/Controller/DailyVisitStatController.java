package com.example.portfolio.Controller;

import java.time.LocalDate;
import java.util.concurrent.ConcurrentHashMap;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import jakarta.servlet.http.HttpServletRequest;

import com.example.portfolio.Service.DailyVisitStatService;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.GetMapping;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/daily-visit-stat")
public class DailyVisitStatController {
    private final DailyVisitStatService dailyVisitStatService;
    
    // Lưu IP và thời điểm increment gần nhất để tránh spam (1 tiếng 1 lần mỗi IP)
    private final ConcurrentHashMap<String, Long> visitIpCache = new ConcurrentHashMap<>();
    private static final long COOLDOWN_MS = 3600000L; // 1 hour

    @PostMapping("/increment")
    public ResponseEntity<?> incrementDailyVisitToday(@RequestParam LocalDate date, HttpServletRequest request) {
        String clientIp = getClientIp(request);
        long now = System.currentTimeMillis();
        
        Long lastVisit = visitIpCache.get(clientIp);
        if (lastVisit != null && (now - lastVisit) < COOLDOWN_MS) {
            return ResponseEntity.ok("Rate limited: Daily visit count already incremented recently for this IP");
        }
        
        // Dọn dẹp cache thỉnh thoảng để tránh phình to bộ nhớ
        if (visitIpCache.size() > 5000) {
            visitIpCache.entrySet().removeIf(entry -> (now - entry.getValue()) > COOLDOWN_MS);
        }
        
        visitIpCache.put(clientIp, now);
        this.dailyVisitStatService.incrementDailyVisitToday(date);
        return ResponseEntity.ok("Daily visit incremented");
    }

    @GetMapping
    public ResponseEntity<?> getDailyVisitStat(@RequestParam LocalDate from, @RequestParam LocalDate to) {
        return ResponseEntity.ok(this.dailyVisitStatService.getDailyVisitStat(from, to));
    }

    private String getClientIp(HttpServletRequest request) {
        String xff = request.getHeader("X-Forwarded-For");
        if (xff != null && !xff.isBlank()) {
            return xff.split(",")[0].trim();
        }
        String xri = request.getHeader("X-Real-IP");
        if (xri != null && !xri.isBlank()) {
            return xri;
        }
        return request.getRemoteAddr();
    }
}

