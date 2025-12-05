package com.bs23.ems.security;

import com.bs23.ems.model.Employee;
import com.bs23.ems.model.User;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;

public class CustomUserDetails implements UserDetails {

    private final User user;
    private final Employee employee;

    public CustomUserDetails(User user) {
        this.user = user;
        this.employee = null;
    }

    public CustomUserDetails(Employee employee) {
        this.employee = employee;
        this.user = null;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        String role = user != null ? user.getRole() : employee.getRole();
        
        // If role is null or empty, assign default role
        if (role == null || role.trim().isEmpty()) {
            role = "EMPLOYEE"; // Default role for employees without specified role
        }
        
        return List.of(new SimpleGrantedAuthority("ROLE_" + role));
    }

    @Override
    public String getPassword() {
        return user != null ? user.getPassword() : employee.getPassword();
    }

    @Override
    public String getUsername() {
        return user != null ? user.getUsername() : employee.getEmail();
    }

    @Override
    public boolean isAccountNonExpired() { return true; }

    @Override
    public boolean isAccountNonLocked() { return true; }

    @Override
    public boolean isCredentialsNonExpired() { return true; }

    @Override
    public boolean isEnabled() { return true; }
}
