package com.bs23.ems.security;

import com.bs23.ems.model.Employee;
import com.bs23.ems.model.User;
import com.bs23.ems.repository.EmployeeRepository;
import com.bs23.ems.repository.UserRepository;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;
    private final EmployeeRepository employeeRepository;

    public CustomUserDetailsService(UserRepository userRepository, EmployeeRepository employeeRepository) {
        this.userRepository = userRepository;
        this.employeeRepository = employeeRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        // Check if the username contains '@' to determine if it's an email (employee login)
        boolean isEmail = username.contains("@");
        
        if (isEmail) {
            // Employee login - search by email in Employee table only
            Employee employee = employeeRepository.findByEmail(username)
                    .orElseThrow(() -> new UsernameNotFoundException("Employee not found with email: " + username));
            
            // Validate employee has proper role
            if (employee.getRole() == null || employee.getRole().trim().isEmpty()) {
                employee.setRole("EMPLOYEE"); // Set default role if not present
            }
            
            return new CustomUserDetails(employee);
        } else {
            // Admin login - search by username in User table only
            User user = userRepository.findByUsername(username)
                    .orElseThrow(() -> new UsernameNotFoundException("User not found with username: " + username));
            
            // Validate user has proper role
            if (user.getRole() == null || user.getRole().trim().isEmpty()) {
                throw new UsernameNotFoundException("User role not properly configured for: " + username);
            }
            
            return new CustomUserDetails(user);
        }
    }
}

