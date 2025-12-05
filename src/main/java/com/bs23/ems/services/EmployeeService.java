package com.bs23.ems.services;

import com.bs23.ems.model.Department;
import com.bs23.ems.model.Employee;
import com.bs23.ems.repository.AttendanceRepository;
import com.bs23.ems.repository.DepartmentRepository;
import com.bs23.ems.repository.EmployeeRepository;
import com.bs23.ems.repository.LeaveRequestRepository;
import com.bs23.ems.repository.NotificationRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class EmployeeService {

    private static final Logger logger = LoggerFactory.getLogger(EmployeeService.class);
    
    private final EmployeeRepository employeeRepository;
    private final DepartmentRepository departmentRepository;
    private final AttendanceRepository attendanceRepository;
    private final LeaveRequestRepository leaveRequestRepository;
    private final NotificationRepository notificationRepository;
    private final PasswordEncoder passwordEncoder;

    public EmployeeService(EmployeeRepository employeeRepository,
                           DepartmentRepository departmentRepository,
                           AttendanceRepository attendanceRepository,
                           LeaveRequestRepository leaveRequestRepository,
                           NotificationRepository notificationRepository,
                           PasswordEncoder passwordEncoder) {
        this.employeeRepository = employeeRepository;
        this.departmentRepository = departmentRepository;
        this.attendanceRepository = attendanceRepository;
        this.leaveRequestRepository = leaveRequestRepository;
        this.notificationRepository = notificationRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public Employee createEmployee(Employee employee) {
        if (employee == null) {
            throw new IllegalArgumentException("Employee cannot be null");
        }
        // Validate and assign department
        if (employee.getDepartment() != null) {
            Long deptId = employee.getDepartment().getId();
            if (deptId != null) {
                Department dept = departmentRepository.findById(deptId)
                        .orElseThrow(() -> new RuntimeException("Department not found"));
                employee.setDepartment(dept);
            }
        }
        
        // Encode password if provided
        if (employee.getPassword() != null && !employee.getPassword().isEmpty()) {
            employee.setPassword(passwordEncoder.encode(employee.getPassword()));
        }
        
        // Set default role if not provided
        if (employee.getRole() == null || employee.getRole().isEmpty()) {
            employee.setRole("EMPLOYEE");
        }
        
        return employeeRepository.save(employee);
    }

    public List<Employee> getAllEmployees() {
        // Use the optimized query that loads departments in one go (fixes N+1 problem)
        return employeeRepository.findAllWithDepartments();
    }

    public Optional<Employee> getEmployeeById(Long id) {
        if (id == null) {
            throw new IllegalArgumentException("Employee ID cannot be null");
        }
        return employeeRepository.findById(id);
    }

    public Employee updateEmployee(Long id, Employee updatedEmployee) {
        if (id == null) {
            throw new IllegalArgumentException("Employee ID cannot be null");
        }
        if (updatedEmployee == null) {
            throw new IllegalArgumentException("Updated employee cannot be null");
        }
        return employeeRepository.findById(id).map(employee -> {
            employee.setFirstName(updatedEmployee.getFirstName());
            employee.setLastName(updatedEmployee.getLastName());
            employee.setEmail(updatedEmployee.getEmail());
            employee.setPosition(updatedEmployee.getPosition());
            employee.setSalary(updatedEmployee.getSalary());
            
            // Update role if provided
            if (updatedEmployee.getRole() != null) {
                employee.setRole(updatedEmployee.getRole());
            }

            // Update password if provided
            if (updatedEmployee.getPassword() != null && !updatedEmployee.getPassword().isEmpty()) {
                employee.setPassword(passwordEncoder.encode(updatedEmployee.getPassword()));
            }

            // Validate and update department
            if (updatedEmployee.getDepartment() != null) {
                Long deptId = updatedEmployee.getDepartment().getId();
                if (deptId != null) {
                    Department dept = departmentRepository.findById(deptId)
                            .orElseThrow(() -> new RuntimeException("Department not found"));
                    employee.setDepartment(dept);
                } else {
                    employee.setDepartment(null);
                }
            } else {
                employee.setDepartment(null);
            }

            return employeeRepository.save(employee);
        }).orElseThrow(() -> new RuntimeException("Employee not found with id: " + id));
    }

    @Transactional
    public void deleteEmployee(Long id) {
        if (id == null) {
            throw new IllegalArgumentException("Employee ID cannot be null");
        }
        
        // Find the employee first
        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Employee not found with id: " + id));
        
        // Delete all attendance records for this employee
        attendanceRepository.deleteByEmployee(employee);
        
        // Delete all leave requests for this employee
        leaveRequestRepository.deleteByEmployee(employee);
        
        // Delete all notifications for this employee (by email)
        notificationRepository.deleteByRecipientEmail(employee.getEmail());
        
        // Finally delete the employee
        employeeRepository.delete(employee);
    }

    // Additional helper: get employees by department
    public List<Employee> getEmployeesByDepartment(Long departmentId) {
        if (departmentId == null) {
            throw new IllegalArgumentException("Department ID cannot be null");
        }
        return employeeRepository.findByDepartmentId(departmentId);
    }

    public Optional<Employee> findByUsername(String username) {
        if (username == null) {
            throw new IllegalArgumentException("Username cannot be null");
        }
        // First try to find by email
        Optional<Employee> employee = employeeRepository.findByEmail(username);
        if (employee.isPresent()) {
            return employee;
        }
        
        // If not found by email, try to find by first name and last name combination
        if (username.contains(".")) {
            String[] parts = username.split("\\.");
            if (parts.length == 2) {
                String firstName = parts[0];
                String lastName = parts[1];
                return employeeRepository.findByFirstNameIgnoreCaseAndLastNameIgnoreCase(firstName, lastName);
            }
        }
        
        return Optional.empty();
    }
    
    // Get current employee with department properly loaded
    public Employee getCurrentEmployeeWithDepartment(String username) {
        if (username == null) {
            throw new IllegalArgumentException("Username cannot be null");
        }
        
        // Try to find by email first using the optimized query
        Optional<Employee> employeeOpt = employeeRepository.findByUsernameWithDepartment(username, null, null);
        if (employeeOpt.isPresent()) {
            return employeeOpt.get();
        }
        
        // If not found by email, try to find by firstName.lastName combination
        if (username.contains(".")) {
            String[] parts = username.split("\\.");
            if (parts.length == 2) {
                String firstName = parts[0];
                String lastName = parts[1];
                employeeOpt = employeeRepository.findByUsernameWithDepartment(null, firstName, lastName);
                if (employeeOpt.isPresent()) {
                    return employeeOpt.get();
                }
            }
        }
        
        throw new RuntimeException("Employee not found with username: " + username);
    }
}
