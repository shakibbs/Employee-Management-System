package com.bs23.ems.services;

import com.bs23.ems.dto.AttendanceReport;
import com.bs23.ems.model.Attendance;
import com.bs23.ems.model.Employee;
import com.bs23.ems.repository.AttendanceRepository;
import com.bs23.ems.repository.EmployeeRepository;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class AttendanceService {

    private final AttendanceRepository attendanceRepository;
    private final EmployeeRepository employeeRepository;

    public AttendanceService(AttendanceRepository attendanceRepository, EmployeeRepository employeeRepository) {
        this.attendanceRepository = attendanceRepository;
        this.employeeRepository = employeeRepository;
    }

    public Attendance checkIn(Long employeeId) {
        if (employeeId == null) {
            throw new IllegalArgumentException("Employee ID cannot be null");
        }
        Employee employee = employeeRepository.findById(employeeId)
                .orElseThrow(() -> new RuntimeException("Employee not found"));
        Attendance attendance = new Attendance();
        attendance.setEmployee(employee);
        attendance.setCheckIn(LocalDateTime.now());
        return attendanceRepository.save(attendance);
    }

    public Attendance checkOut(Long attendanceId) {
        if (attendanceId == null) {
            throw new IllegalArgumentException("Attendance ID cannot be null");
        }
        Attendance attendance = attendanceRepository.findById(attendanceId)
                .orElseThrow(() -> new RuntimeException("Attendance not found"));
        attendance.setCheckOut(LocalDateTime.now());
        return attendanceRepository.save(attendance);
    }

    public List<Attendance> getEmployeeAttendance(Long employeeId) {
        if (employeeId == null) {
            throw new IllegalArgumentException("Employee ID cannot be null");
        }
        Employee employee = employeeRepository.findById(employeeId)
                .orElseThrow(() -> new RuntimeException("Employee not found"));
        return attendanceRepository.findByEmployee(employee);
    }
    public AttendanceReport generateReport(Long employeeId) {
        if (employeeId == null) {
            throw new IllegalArgumentException("Employee ID cannot be null");
        }
        Employee employee = employeeRepository.findById(employeeId)
                .orElseThrow(() -> new RuntimeException("Employee not found"));

        List<Attendance> records = attendanceRepository.findByEmployee(employee);
        int totalDays = records.size();
        int presentDays = (int) records.stream()
                .filter(r -> r.getCheckIn() != null && r.getCheckOut() != null)
                .count();
        int absentDays = totalDays - presentDays;

        double totalHoursWorked = records.stream()
                .filter(r -> r.getCheckIn() != null && r.getCheckOut() != null)
                .mapToDouble(r -> Duration.between(r.getCheckIn(), r.getCheckOut()).toHours())
                .sum();

        return new AttendanceReport(
                employee.getId(),
                employee.getFirstName() + " " + employee.getLastName(),
                totalDays,
                presentDays,
                absentDays,
                totalHoursWorked
        );
    }

    public List<Attendance> getAllAttendance() {
        return attendanceRepository.findAll();
    }

    public List<Attendance> getAttendanceByEmployee(String username) {
        if (username == null) {
            throw new IllegalArgumentException("Username cannot be null");
        }
        // First try to find by email (more efficient)
        Employee employee = employeeRepository.findByEmail(username)
                .orElse(null);
        
        // If not found by email, try name-based lookup
        if (employee == null && username.contains(".")) {
            String[] parts = username.split("\\.");
            if (parts.length == 2) {
                employee = employeeRepository.findByFirstNameIgnoreCaseAndLastNameIgnoreCase(parts[0], parts[1])
                        .orElse(null);
            }
        }
        
        if (employee == null) {
            throw new RuntimeException("Employee not found with username: " + username);
        }
        return attendanceRepository.findByEmployee(employee);
    }
    
    public Attendance markAttendanceForCurrentUser(String type, String username) {
        if (type == null) {
            throw new IllegalArgumentException("Type cannot be null");
        }
        if (username == null) {
            throw new IllegalArgumentException("Username cannot be null");
        }
        
        // First try to find by email (more efficient)
        Employee employee = employeeRepository.findByEmail(username)
                .orElse(null);
        
        // If not found by email, try name-based lookup
        if (employee == null && username.contains(".")) {
            String[] parts = username.split("\\.");
            if (parts.length == 2) {
                employee = employeeRepository.findByFirstNameIgnoreCaseAndLastNameIgnoreCase(parts[0], parts[1])
                        .orElse(null);
            }
        }
        
        if (employee == null) {
            throw new RuntimeException("Employee not found with username: " + username);
        }
        
        if ("CHECK_IN".equals(type)) {
            // Create new attendance record for check-in
            Attendance attendance = new Attendance();
            attendance.setEmployee(employee);
            attendance.setCheckIn(LocalDateTime.now());
            return attendanceRepository.save(attendance);
        } else if ("CHECK_OUT".equals(type)) {
            // Find today's attendance record and update it with check-out time
            LocalDateTime startOfDay = LocalDateTime.now().withHour(0).withMinute(0).withSecond(0).withNano(0);
            LocalDateTime endOfDay = LocalDateTime.now().withHour(23).withMinute(59).withSecond(59).withNano(999999999);
            
            List<Attendance> todayAttendances = attendanceRepository.findByEmployee(employee).stream()
                    .filter(a -> a.getCheckIn() != null &&
                            a.getCheckIn().isAfter(startOfDay) &&
                            a.getCheckIn().isBefore(endOfDay))
                    .toList();
            
            if (todayAttendances.isEmpty()) {
                throw new RuntimeException("No check-in record found for today. Cannot check out without checking in first.");
            }
            
            // Get the latest attendance record for today
            Attendance attendance = todayAttendances.get(todayAttendances.size() - 1);
            
            if (attendance.getCheckOut() != null) {
                throw new RuntimeException("Already checked out today.");
            }
            
            attendance.setCheckOut(LocalDateTime.now());
            return attendanceRepository.save(attendance);
        } else {
            throw new IllegalArgumentException("Invalid attendance type: " + type);
        }
    }
}
