package com.bs23.ems.controller;

import com.bs23.ems.dto.AttendanceReport;
import com.bs23.ems.model.Attendance;
import com.bs23.ems.services.AttendanceService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/attendance")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001", "http://127.0.0.1:3000", "http://127.0.0.1:3001"})
public class AttendanceController {

    private final AttendanceService attendanceService;

    public AttendanceController(AttendanceService attendanceService) {
        this.attendanceService = attendanceService;
    }

    @PreAuthorize("hasAnyRole('ROLE_ADMIN','ROLE_HR')")
    @PostMapping("/checkin/{employeeId}")
    public ResponseEntity<Attendance> checkIn(@PathVariable Long employeeId) {
        return ResponseEntity.ok(attendanceService.checkIn(employeeId));
    }

    @PreAuthorize("hasAnyRole('ROLE_ADMIN','ROLE_HR')")
    @PutMapping("/checkout/{attendanceId}")
    public ResponseEntity<Attendance> checkOut(@PathVariable Long attendanceId) {
        return ResponseEntity.ok(attendanceService.checkOut(attendanceId));
    }

    @PreAuthorize("hasAnyRole('ROLE_ADMIN','ROLE_HR')")
    @GetMapping("/{employeeId}")
    public ResponseEntity<List<Attendance>> getAttendance(@PathVariable Long employeeId) {
        return ResponseEntity.ok(attendanceService.getEmployeeAttendance(employeeId));
    }
    
    @PreAuthorize("hasAnyRole('ROLE_ADMIN','ROLE_HR')")
    @GetMapping("/employee-id/{employeeId}")
    public List<Attendance> getEmployeeAttendance(@PathVariable Long employeeId) {
        return attendanceService.getEmployeeAttendance(employeeId);
    }

    @PreAuthorize("hasAnyRole('ROLE_ADMIN','ROLE_HR')")
    @GetMapping("/report/{employeeId}")
    public AttendanceReport getAttendanceReport(@PathVariable Long employeeId) {
        return attendanceService.generateReport(employeeId);
    }

    @PreAuthorize("hasAnyRole('ROLE_ADMIN','ROLE_HR')")
    @GetMapping
    public ResponseEntity<List<Attendance>> getAllAttendance() {
        return ResponseEntity.ok(attendanceService.getAllAttendance());
    }

    @PreAuthorize("isAuthenticated()")
    @GetMapping("/my-attendance")
    public ResponseEntity<List<Attendance>> getMyAttendance(Authentication authentication) {
        String username = authentication.getName();
        try {
            return ResponseEntity.ok(attendanceService.getAttendanceByEmployee(username));
        } catch (RuntimeException e) {
            if (e.getMessage().contains("Employee not found")) {
                // Return empty list for non-employee users (like admin)
                return ResponseEntity.ok(List.of());
            }
            throw e;
        }
    }

    @PreAuthorize("hasAnyRole('ROLE_ADMIN','ROLE_HR','ROLE_USER','ROLE_EMPLOYEE')")
    @GetMapping("/employee/{username}")
    public ResponseEntity<List<Attendance>> getAttendanceByEmployee(@PathVariable String username) {
        return ResponseEntity.ok(attendanceService.getAttendanceByEmployee(username));
    }
    
    @PostMapping("/mark")
    @PreAuthorize("hasAnyRole('ROLE_ADMIN','ROLE_HR','ROLE_EMPLOYEE')")
    public ResponseEntity<Attendance> markAttendance(@RequestBody Map<String, String> request, Authentication authentication) {
        String type = request.get("type");
        String username = authentication.getName();
        return ResponseEntity.ok(attendanceService.markAttendanceForCurrentUser(type, username));
    }
}
