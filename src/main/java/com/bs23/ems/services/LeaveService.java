package com.bs23.ems.services;

import com.bs23.ems.model.Employee;
import com.bs23.ems.model.LeaveRequest;
import com.bs23.ems.repository.EmployeeRepository;
import com.bs23.ems.repository.LeaveRequestRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class LeaveService {

    private static final Logger logger = LoggerFactory.getLogger(LeaveService.class);

    private final LeaveRequestRepository leaveRepository;
    private final EmployeeRepository employeeRepository;
    private final EmailService emailService;   // 👈 Inject Email Service

    public LeaveService(LeaveRequestRepository leaveRepository,
                        EmployeeRepository employeeRepository,
                        EmailService emailService) {

        this.leaveRepository = leaveRepository;
        this.employeeRepository = employeeRepository;
        this.emailService = emailService;
    }

    // ========== REQUEST LEAVE ==========
    public LeaveRequest requestLeave(Long employeeId, LeaveRequest leaveRequest) {
        if (employeeId == null) {
            throw new IllegalArgumentException("Employee ID cannot be null");
        }
        if (leaveRequest == null) {
            throw new IllegalArgumentException("Leave request cannot be null");
        }

        Employee employee = employeeRepository.findById(employeeId)
                .orElseThrow(() -> new RuntimeException("Employee not found"));

        // Check for overlapping leave requests
        List<LeaveRequest> overlappingLeaves = leaveRepository.findOverlappingLeaves(
                employee, leaveRequest.getStartDate(), leaveRequest.getEndDate());
        
        if (!overlappingLeaves.isEmpty()) {
            throw new RuntimeException("Employee already has a leave request during this period");
        }

        leaveRequest.setEmployee(employee);
        leaveRequest.setStatus(LeaveRequest.LeaveStatus.PENDING);

        LeaveRequest saved = leaveRepository.save(leaveRequest);

        // 🔔 Notify Admin
        String adminEmail = "admin@example.com";  // You can replace with actual admin email

        emailService.sendEmail(
                adminEmail,
                "New Leave Request Submitted",
                "Employee " + employee.getFirstName() + " " + employee.getLastName() +
                        " has requested leave from " + saved.getStartDate() +
                        " to " + saved.getEndDate() +
                        ".\nReason: " + saved.getReason()
        );

        return saved;
    }

    // ========== APPROVE LEAVE ==========
    public LeaveRequest approveLeave(Long leaveId) {
        if (leaveId == null) {
            throw new IllegalArgumentException("Leave ID cannot be null");
        }

        // Log authentication details for debugging
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null) {
            logger.info("Leave approval attempt by user: " + auth.getName() + " with authorities: " + auth.getAuthorities());
        } else {
            logger.warn("Leave approval attempt with no authentication context");
        }

        LeaveRequest leave = leaveRepository.findById(leaveId)
                .orElseThrow(() -> new RuntimeException("Leave request not found"));

        logger.info("Approving leave request ID: " + leaveId + " for employee: " + leave.getEmployee().getFirstName() + " " + leave.getEmployee().getLastName());

        leave.setStatus(LeaveRequest.LeaveStatus.APPROVED);
        LeaveRequest saved = leaveRepository.save(leave);

        // 🔔 Notify Employee
        emailService.sendEmail(
                leave.getEmployee().getEmail(),
                "Leave Approved",
                "Your leave request from " + leave.getStartDate() + " to " + leave.getEndDate() +
                        " has been APPROVED."
        );

        logger.info("Leave request ID: " + leaveId + " approved successfully");
        return saved;
    }

    // ========== REJECT LEAVE ==========
    public LeaveRequest rejectLeave(Long leaveId) {
        if (leaveId == null) {
            throw new IllegalArgumentException("Leave ID cannot be null");
        }

        // Log authentication details for debugging
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null) {
            logger.info("Leave rejection attempt by user: " + auth.getName() + " with authorities: " + auth.getAuthorities());
        } else {
            logger.warn("Leave rejection attempt with no authentication context");
        }

        LeaveRequest leave = leaveRepository.findById(leaveId)
                .orElseThrow(() -> new RuntimeException("Leave request not found"));

        logger.info("Rejecting leave request ID: " + leaveId + " for employee: " + leave.getEmployee().getFirstName() + " " + leave.getEmployee().getLastName());

        leave.setStatus(LeaveRequest.LeaveStatus.REJECTED);
        LeaveRequest saved = leaveRepository.save(leave);

        // 🔔 Notify Employee
        emailService.sendEmail(
                leave.getEmployee().getEmail(),
                "Leave Rejected",
                "Your leave request from " + leave.getStartDate() + " to " + leave.getEndDate() +
                        " has been REJECTED.\nReason: " + leave.getReason()
        );

        logger.info("Leave request ID: " + leaveId + " rejected successfully");
        return saved;
    }

    public List<LeaveRequest> getEmployeeLeaves(Long employeeId) {
        if (employeeId == null) {
            throw new IllegalArgumentException("Employee ID cannot be null");
        }

        Employee employee = employeeRepository.findById(employeeId)
                .orElseThrow(() -> new RuntimeException("Employee not found"));

        return leaveRepository.findByEmployee(employee);
    }

    public List<LeaveRequest> getPendingLeaves() {
        return leaveRepository.findByStatus(LeaveRequest.LeaveStatus.PENDING);
    }

    public LeaveRequest requestLeaveByUsername(String username, LeaveRequest leaveRequest) {
        if (username == null) {
            throw new IllegalArgumentException("Username cannot be null");
        }
        if (leaveRequest == null) {
            throw new IllegalArgumentException("Leave request cannot be null");
        }
        
        // First try to find by email
        Employee employee = employeeRepository.findByEmail(username)
                .orElse(null);
        
        // If not found by email, try to find by username format (firstName.lastName)
        if (employee == null && username.contains(".")) {
            String[] nameParts = username.split("\\.");
            if (nameParts.length == 2) {
                String firstName = nameParts[0];
                String lastName = nameParts[1];
                employee = employeeRepository.findByFirstNameIgnoreCaseAndLastNameIgnoreCase(firstName, lastName)
                        .orElse(null);
            }
        }
        
        if (employee == null) {
            throw new RuntimeException("Employee not found with username: " + username);
        }
        
        // Check for overlapping leave requests
        List<LeaveRequest> overlappingLeaves = leaveRepository.findOverlappingLeaves(
                employee, leaveRequest.getStartDate(), leaveRequest.getEndDate());
        
        if (!overlappingLeaves.isEmpty()) {
            throw new RuntimeException("Employee already has a leave request during this period");
        }
        
        leaveRequest.setEmployee(employee);
        leaveRequest.setStatus(LeaveRequest.LeaveStatus.PENDING);
        
        LeaveRequest saved = leaveRepository.save(leaveRequest);
        
        // Notify Admin
        String adminEmail = "admin@example.com";  // You can replace with actual admin email
        
        emailService.sendEmail(
                adminEmail,
                "New Leave Request Submitted",
                "Employee " + employee.getFirstName() + " " + employee.getLastName() +
                        " has requested leave from " + saved.getStartDate() +
                        " to " + saved.getEndDate() +
                        ".\nReason: " + saved.getReason()
        );
        
        return saved;
    }

    public List<LeaveRequest> getLeaveRequestsByUsername(String username) {
        if (username == null) {
            throw new IllegalArgumentException("Username cannot be null");
        }
        
        // First try to find by email
        Employee employee = employeeRepository.findByEmail(username)
                .orElse(null);
        
        // If not found by email, try to find by username format (firstName.lastName)
        if (employee == null && username.contains(".")) {
            String[] nameParts = username.split("\\.");
            if (nameParts.length == 2) {
                String firstName = nameParts[0];
                String lastName = nameParts[1];
                employee = employeeRepository.findByFirstNameIgnoreCaseAndLastNameIgnoreCase(firstName, lastName)
                        .orElse(null);
            }
        }
        
        if (employee == null) {
            throw new RuntimeException("Employee not found with username: " + username);
        }
        
        return leaveRepository.findByEmployee(employee);
    }

    public List<LeaveRequest> getAllLeaveRequests() {
        return leaveRepository.findAll();
    }
}
