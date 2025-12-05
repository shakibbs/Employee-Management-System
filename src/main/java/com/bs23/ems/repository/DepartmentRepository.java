package com.bs23.ems.repository;

import com.bs23.ems.model.Department;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface DepartmentRepository extends JpaRepository<Department, Long> {
    
    boolean existsByName(String name);
    
    boolean existsByNameAndIdNot(String name, Long id);
    
    @Query("SELECT COUNT(e) FROM Employee e WHERE e.department.id = :deptId")
    long countEmployeesByDepartmentId(Long deptId);
}
