package com.bs23.ems.repository;

import com.bs23.ems.model.Attendance;
import com.bs23.ems.model.Employee;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface AttendanceRepository extends JpaRepository<Attendance, Long> {
    List<Attendance> findByEmployee(Employee employee);
    List<Attendance> findByEmployeeAndCheckInBetween(Employee employee, LocalDateTime start, LocalDateTime end);
    
    // Custom delete method to remove all attendance records for an employee
    void deleteByEmployee(Employee employee);
}
