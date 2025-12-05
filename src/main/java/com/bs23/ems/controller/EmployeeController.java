package com.bs23.ems.controller;

import com.bs23.ems.model.Employee;
import com.bs23.ems.services.EmployeeService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/employees")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001", "http://127.0.0.1:3000", "http://127.0.0.1:3001"})
public class EmployeeController {

    private final EmployeeService employeeService;

    public EmployeeController(EmployeeService employeeService) {
        this.employeeService = employeeService;
    }

    @PreAuthorize("hasAnyRole('ROLE_ADMIN','ROLE_HR')")
    @PostMapping
    public ResponseEntity<Employee> addEmployee(@Valid @RequestBody Employee employee) {
        return ResponseEntity.ok(employeeService.createEmployee(employee));
    }

    @PreAuthorize("hasAnyRole('ROLE_ADMIN','ROLE_HR')")
    @GetMapping
    public ResponseEntity<List<Employee>> getAllEmployees() {
        return ResponseEntity.ok(employeeService.getAllEmployees());
    }

    @PreAuthorize("hasAnyRole('ROLE_ADMIN','ROLE_HR')")
    @GetMapping("/{id}")
    public ResponseEntity<Employee> getEmployeeById(@PathVariable Long id) {
        return employeeService.getEmployeeById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PreAuthorize("hasAnyRole('ROLE_ADMIN','ROLE_HR')")
    @PutMapping("/{id}")
    public ResponseEntity<Employee> updateEmployee(@Valid @PathVariable Long id,
                                                   @RequestBody Employee employee) {
        return ResponseEntity.ok(employeeService.updateEmployee(id, employee));
    }

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEmployee(@PathVariable Long id) {
        employeeService.deleteEmployee(id);
        return ResponseEntity.noContent().build();
    }

    @PreAuthorize("hasAnyRole('ROLE_ADMIN','ROLE_HR')")
    @GetMapping("/department/{deptId}")
    public ResponseEntity<List<Employee>> getEmployeesByDepartment(@PathVariable Long deptId) {
        return ResponseEntity.ok(employeeService.getEmployeesByDepartment(deptId));
    }

    @PreAuthorize("hasAnyRole('ROLE_ADMIN','ROLE_HR','ROLE_USER','ROLE_EMPLOYEE')")
    @GetMapping("/me")
    public ResponseEntity<Employee> getCurrentEmployee(Authentication authentication) {
        String username = authentication.getName();
        try {
            Employee employee = employeeService.getCurrentEmployeeWithDepartment(username);
            return ResponseEntity.ok(employee);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PreAuthorize("hasAnyRole('ROLE_ADMIN','ROLE_HR')")
    @GetMapping("/username/{username}")
    public ResponseEntity<Employee> getEmployeeByUsername(@PathVariable String username) {
        return employeeService.findByUsername(username)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
