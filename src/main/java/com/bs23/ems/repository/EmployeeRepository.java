package com.bs23.ems.repository;

import com.bs23.ems.model.Employee;
import com.bs23.ems.model.Department;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EmployeeRepository extends JpaRepository<Employee, Long> {
    // Find all employees in a given department
    List<Employee> findByDepartment(Department department);

    // Optional: find by department ID directly
    List<Employee> findByDepartmentId(Long departmentId);
    
    // Find by email or username (firstName.lastName combination)
    Optional<Employee> findByEmail(String email);
    Optional<Employee> findByFirstNameIgnoreCaseAndLastNameIgnoreCase(String firstName, String lastName);
    
    // Find all employees with their departments loaded in one query (fixes N+1 problem)
    @Query("SELECT e FROM Employee e LEFT JOIN FETCH e.department")
    List<Employee> findAllWithDepartments();
    
    // Find employee by username (email or firstName.lastName) with department loaded in one query
    @Query("SELECT e FROM Employee e LEFT JOIN FETCH e.department WHERE e.email = :username OR (e.firstName = :firstName AND e.lastName = :lastName)")
    Optional<Employee> findByUsernameWithDepartment(@Param("username") String username, @Param("firstName") String firstName, @Param("lastName") String lastName);
}
