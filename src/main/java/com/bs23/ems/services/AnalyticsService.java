package com.bs23.ems.services;

import com.bs23.ems.dto.AttendanceTrendDTO;
import com.bs23.ems.dto.DepartmentEmployeeCountDTO;
import com.bs23.ems.dto.PayRollSummaryDTO;
import com.bs23.ems.model.Attendance;
import com.bs23.ems.model.Employee;
import com.bs23.ems.repository.AttendanceRepository;
import com.bs23.ems.repository.DepartmentRepository;
import com.bs23.ems.repository.EmployeeRepository;
import org.springframework.stereotype.Service;

import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class AnalyticsService {

    private final EmployeeRepository employeeRepository;
    private final AttendanceRepository attendanceRepository;
    private final DepartmentRepository departmentRepository;

    public AnalyticsService(EmployeeRepository employeeRepository,
                            AttendanceRepository attendanceRepository,
                            DepartmentRepository departmentRepository) {
        this.employeeRepository = employeeRepository;
        this.attendanceRepository = attendanceRepository;
        this.departmentRepository = departmentRepository;
    }

    // ===== Employee demographics: count per department =====
    public List<DepartmentEmployeeCountDTO> getEmployeeDemographics() {
        List<Employee> employees = employeeRepository.findAll();

        Map<String, Long> countMap = employees.stream()
                .collect(Collectors.groupingBy(
                        e -> e.getDepartment() != null ? e.getDepartment().getName() : "Unassigned",
                        Collectors.counting()
                ));

        return countMap.entrySet().stream()
                .map(entry -> new DepartmentEmployeeCountDTO(entry.getKey(), entry.getValue()))
                .collect(Collectors.toList());
    }

    // ===== Attendance trends =====
    public List<AttendanceTrendDTO> getAttendanceTrends() {
        List<Attendance> attendances = attendanceRepository.findAll();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");

        Map<String, Long> trendMap = attendances.stream()
                .filter(a -> a.getCheckIn() != null)
                .collect(Collectors.groupingBy(
                        a -> a.getCheckIn().format(formatter),
                        Collectors.counting()
                ));

        return trendMap.entrySet().stream()
                .map(entry -> new AttendanceTrendDTO(entry.getKey(), entry.getValue()))
                .sorted(Comparator.comparing(AttendanceTrendDTO::getDate))
                .collect(Collectors.toList());
    }

    // ===== Payroll summaries =====
    public List<PayRollSummaryDTO> getPayrollSummary() {
        List<Employee> employees = employeeRepository.findAll();

        Map<String, List<Employee>> deptMap = employees.stream()
                .collect(Collectors.groupingBy(
                        e -> e.getDepartment() != null ? e.getDepartment().getName() : "Unassigned"
                ));

        List<PayRollSummaryDTO> summaries = new ArrayList<>();
        for (Map.Entry<String, List<Employee>> entry : deptMap.entrySet()) {
            double total = entry.getValue().stream()
                    .map(Employee::getSalary)
                    .filter(Objects::nonNull)
                    .mapToDouble(Double::doubleValue)
                    .sum();
            double avg = entry.getValue().stream()
                    .map(Employee::getSalary)
                    .filter(Objects::nonNull)
                    .mapToDouble(Double::doubleValue)
                    .average()
                    .orElse(0.0);

            summaries.add(new PayRollSummaryDTO(entry.getKey(), total, avg));
        }
        return summaries;
    }

    // ===== Dashboard data aggregation =====
    public Map<String, Object> getDashboardData() {
        Map<String, Object> dashboardData = new HashMap<>();
        
        // Employee counts
        List<Employee> employees = employeeRepository.findAll();
        dashboardData.put("employeeCount", employees.size());
        
        // Get recent 5 employees
        List<Employee> recentEmployees = employees.stream()
                .sorted(Comparator.comparing(Employee::getId).reversed())
                .limit(5)
                .collect(Collectors.toList());
        dashboardData.put("recentEmployees", recentEmployees);
        
        // Department count - count all departments in database
        dashboardData.put("departmentCount", departmentRepository.findAll().size());
        
        // Attendance statistics
        List<Attendance> attendances = attendanceRepository.findAll();
        Map<String, Long> attendanceStats = new HashMap<>();
        attendanceStats.put("present", attendances.stream()
                .filter(a -> a.getCheckIn() != null && a.getCheckOut() != null)
                .count());
        attendanceStats.put("absent", attendances.stream()
                .filter(a -> a.getCheckIn() == null)
                .count());
        attendanceStats.put("leave", attendances.stream()
                .filter(a -> a.getCheckIn() != null && a.getCheckOut() == null)
                .count());
        dashboardData.put("attendanceStats", attendanceStats);
        
        // Recent attendance
        List<Attendance> recentAttendance = attendances.stream()
                .sorted(Comparator.comparing(Attendance::getId).reversed())
                .limit(5)
                .collect(Collectors.toList());
        dashboardData.put("recentAttendance", recentAttendance);
        
        return dashboardData;
    }
}
