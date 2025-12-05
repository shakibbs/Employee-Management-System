package com.bs23.ems.controller;

import com.bs23.ems.model.LeaveRequest;
import com.bs23.ems.services.LeaveService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/leaves")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001", "http://127.0.0.1:3000", "http://127.0.0.1:3001"})
public class LeaveController {

    private final LeaveService leaveService;

    public LeaveController(LeaveService leaveService) {
        this.leaveService = leaveService;
    }

    @PostMapping("/request")
    @PreAuthorize("hasAnyRole('ROLE_ADMIN','ROLE_HR','ROLE_USER','ROLE_EMPLOYEE')")
    public ResponseEntity<LeaveRequest> requestLeave(@RequestBody LeaveRequest leaveRequest,
                                                   Authentication authentication) {
        String username = authentication.getName();
        return ResponseEntity.ok(leaveService.requestLeaveByUsername(username, leaveRequest));
    }

    @PutMapping("/approve/{leaveId}")
    @PreAuthorize("hasAnyRole('ROLE_ADMIN','ROLE_HR')")
    public ResponseEntity<LeaveRequest> approveLeave(@PathVariable Long leaveId, Authentication authentication) {
        System.out.println("=== APPROVE LEAVE DEBUG ===");
        System.out.println("Leave ID: " + leaveId);
        System.out.println("Authenticated user: " + authentication.getName());
        System.out.println("User authorities: " + authentication.getAuthorities());
        return ResponseEntity.ok(leaveService.approveLeave(leaveId));
    }

    @PutMapping("/reject/{leaveId}")
    @PreAuthorize("hasAnyRole('ROLE_ADMIN','ROLE_HR')")
    public ResponseEntity<LeaveRequest> rejectLeave(@PathVariable Long leaveId, Authentication authentication) {
        System.out.println("=== REJECT LEAVE DEBUG ===");
        System.out.println("Leave ID: " + leaveId);
        System.out.println("Authenticated user: " + authentication.getName());
        System.out.println("User authorities: " + authentication.getAuthorities());
        return ResponseEntity.ok(leaveService.rejectLeave(leaveId));
    }

    @GetMapping("/employee/{employeeId}")
    public ResponseEntity<List<LeaveRequest>> getEmployeeLeaves(@PathVariable Long employeeId) {
        return ResponseEntity.ok(leaveService.getEmployeeLeaves(employeeId));
    }

    @GetMapping("/pending")
    @PreAuthorize("hasAnyRole('ROLE_ADMIN','ROLE_HR')")
    public ResponseEntity<List<LeaveRequest>> getPendingLeaves() {
        return ResponseEntity.ok(leaveService.getPendingLeaves());
    }

    @GetMapping("/my-requests")
    @PreAuthorize("hasAnyRole('ROLE_ADMIN','ROLE_HR','ROLE_USER','ROLE_EMPLOYEE')")
    public ResponseEntity<List<LeaveRequest>> getMyLeaveRequests(Authentication authentication) {
        String username = authentication.getName();
        return ResponseEntity.ok(leaveService.getLeaveRequestsByUsername(username));
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ROLE_ADMIN','ROLE_HR')")
    public ResponseEntity<List<LeaveRequest>> getAllLeaveRequests() {
        return ResponseEntity.ok(leaveService.getAllLeaveRequests());
    }
}
