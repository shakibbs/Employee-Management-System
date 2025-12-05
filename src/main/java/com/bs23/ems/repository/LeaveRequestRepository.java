package com.bs23.ems.repository;

import com.bs23.ems.model.LeaveRequest;
import com.bs23.ems.model.Employee;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

public interface LeaveRequestRepository extends JpaRepository<LeaveRequest, Long> {
    List<LeaveRequest> findByEmployee(Employee employee);
    List<LeaveRequest> findByStatus(LeaveRequest.LeaveStatus status);
    
    // Custom delete method to remove all leave requests for an employee
    void deleteByEmployee(Employee employee);
    
    // Find overlapping leave requests for an employee
    @Query("SELECT lr FROM LeaveRequest lr WHERE lr.employee = :employee " +
           "AND lr.status IN ('PENDING', 'APPROVED') " +
           "AND ((lr.startDate <= :endDate AND lr.endDate >= :startDate))")
    List<LeaveRequest> findOverlappingLeaves(@Param("employee") Employee employee,
                                           @Param("startDate") LocalDate startDate,
                                           @Param("endDate") LocalDate endDate);
}
