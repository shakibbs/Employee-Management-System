package com.bs23.ems.controller;

import com.bs23.ems.dto.AttendanceTrendDTO;
import com.bs23.ems.dto.DepartmentEmployeeCountDTO;
import com.bs23.ems.dto.PayRollSummaryDTO;
import com.bs23.ems.services.AnalyticsService;
import java.util.Map;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/analytics")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001", "http://127.0.0.1:3000", "http://127.0.0.1:3001"})
public class AnalyticsController {

    private final AnalyticsService analyticsService;

    public AnalyticsController(AnalyticsService analyticsService) {
        this.analyticsService = analyticsService;
    }

    @PreAuthorize("hasAnyRole('ROLE_ADMIN','ROLE_HR')")
    @GetMapping("/departments")
    public ResponseEntity<List<DepartmentEmployeeCountDTO>> getEmployeeDemographics() {
        return ResponseEntity.ok(analyticsService.getEmployeeDemographics());
    }

    @PreAuthorize("hasAnyRole('ROLE_ADMIN','ROLE_HR')")
    @GetMapping("/attendance")
    public ResponseEntity<List<AttendanceTrendDTO>> getAttendanceTrends() {
        return ResponseEntity.ok(analyticsService.getAttendanceTrends());
    }

    @PreAuthorize("hasAnyRole('ROLE_ADMIN','ROLE_HR')")
    @GetMapping("/payroll")
    public ResponseEntity<List<PayRollSummaryDTO>> getPayrollSummary() {
        return ResponseEntity.ok(analyticsService.getPayrollSummary());
    }

    @PreAuthorize("hasAnyRole('ROLE_ADMIN','ROLE_HR')")
    @GetMapping("/dashboard")
    public ResponseEntity<Map<String, Object>> getDashboardData() {
        return ResponseEntity.ok(analyticsService.getDashboardData());
    }
}
