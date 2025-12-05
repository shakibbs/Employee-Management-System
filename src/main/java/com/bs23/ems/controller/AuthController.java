package com.bs23.ems.controller;

import com.bs23.ems.dto.LoginRequest;
import com.bs23.ems.security.CustomUserDetails;
import com.bs23.ems.security.JwtUtil;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.Map;

@RestController
@CrossOrigin(origins = {"http://localhost:3000",  "http://127.0.0.1:3000"},
             allowedHeaders = "*",
             methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE, RequestMethod.OPTIONS})
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthenticationManager authManager;
    private final JwtUtil jwtUtil;

    public AuthController(AuthenticationManager authManager, JwtUtil jwtUtil) {
        this.authManager = authManager;
        this.jwtUtil = jwtUtil;
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, String>> login(@Valid @RequestBody LoginRequest loginRequest) {
        System.out.println("Login attempt for username: " + loginRequest.getUsername());
        try {
            Authentication auth = authManager.authenticate(
                    new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword())
            );

            CustomUserDetails userDetails = (CustomUserDetails) auth.getPrincipal();
            String authority = userDetails.getAuthorities().iterator().next().getAuthority();
            // Remove ROLE_ prefix if present to store clean role name
            String role = authority.startsWith("ROLE_") ? authority.substring(5) : authority;
            String token = jwtUtil.generateToken(userDetails.getUsername(), role);

            System.out.println("Login successful for user: " + loginRequest.getUsername() + " with role: " + role);
            // Return JSON with token
            return ResponseEntity.ok(Collections.singletonMap("token", token));
        } catch (Exception e) {
            System.out.println("Login failed for user: " + loginRequest.getUsername() + " - " + e.getMessage());
            throw e;
        }
    }
}