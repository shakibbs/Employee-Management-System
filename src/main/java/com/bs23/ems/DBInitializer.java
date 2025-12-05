package com.bs23.ems;

import com.bs23.ems.model.Employee;
import com.bs23.ems.model.User;
import com.bs23.ems.services.EmployeeService;
import com.bs23.ems.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Component
public class DBInitializer implements CommandLineRunner {

    @Autowired
    private UserService userService;
    
    @Autowired
    private EmployeeService employeeService;

    @Override
    @Transactional
    public void run(String... args) {
        // Check and create default admin user
        try {
            if (userService.findByUsername("admin").isEmpty()) {
                // Create new admin user with properly encoded password
                User admin = new User();
                admin.setUsername("admin");
                admin.setPassword("admin123"); // Will be encoded by UserService
                admin.setRole("ADMIN");
                admin.setName("System Admin");
                admin.setEmail("admin@ems.com");
                admin.setPhone("01234567890");
                User createdAdmin = userService.createUser(admin);
                System.out.println("Default admin user created successfully with username: admin and password: admin123");
                System.out.println("Created admin user ID: " + createdAdmin.getId() + " with role: " + createdAdmin.getRole());
            } else {
                System.out.println("Admin user already exists.");
                // Let's check the existing admin user's role
                userService.findByUsername("admin").ifPresent(existingAdmin -> {
                    System.out.println("Existing admin user ID: " + existingAdmin.getId() + " with role: " + existingAdmin.getRole());
                });
            }
            
            // Ensure all existing employees have EMPLOYEE role
            ensureEmployeeRoles();
            
        } catch (Exception e) {
            System.err.println("Error initializing database: " + e.getMessage());
            e.printStackTrace();
        }
    }
    
    private void ensureEmployeeRoles() {
        try {
            List<Employee> employees = employeeService.getAllEmployees();
            int updatedCount = 0;
            
            for (Employee employee : employees) {
                if (employee.getRole() == null || employee.getRole().trim().isEmpty()) {
                    employee.setRole("EMPLOYEE");
                    employeeService.updateEmployee(employee.getId(), employee);
                    updatedCount++;
                }
            }
            
            if (updatedCount > 0) {
                System.out.println("Updated " + updatedCount + " employees with EMPLOYEE role");
            } else {
                System.out.println("All employees already have proper roles assigned");
            }
        } catch (Exception e) {
            System.err.println("Error updating employee roles: " + e.getMessage());
        }
    }
}
