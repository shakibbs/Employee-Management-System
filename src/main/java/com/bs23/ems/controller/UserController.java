package com.bs23.ems.controller;

import com.bs23.ems.dto.UserRequest;
import com.bs23.ems.model.User;
import com.bs23.ems.services.UserService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001", "http://127.0.0.1:3000", "http://127.0.0.1:3001"})
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    // Get all users (Admin only)
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @GetMapping
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(userService.getAll());
    }

    // Create user (Admin only)
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @PostMapping("/create")
    public ResponseEntity<User> createUser(@Valid @RequestBody UserRequest userRequest) {
        // Convert DTO to entity and create user (password encoding is handled in service)
        User user = new User();
        user.setUsername(userRequest.getUsername());
        user.setName(userRequest.getName());
        user.setEmail(userRequest.getEmail());
        user.setPassword(userRequest.getPassword()); // Raw password, will be encoded in service
        user.setRole(userRequest.getRole());
        user.setPhone(userRequest.getPhone());
        user.setAddress(userRequest.getAddress());

        return new ResponseEntity<>(userService.createUser(user), HttpStatus.CREATED);
    }

    // Get user by ID (Admin only)
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(@PathVariable Long id) {
        return userService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Update user (Admin only)
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @PutMapping("/{id}")
    public ResponseEntity<User> updateUser(@PathVariable Long id, @Valid @RequestBody UserRequest userRequest) {
        // Convert DTO to entity and update user
        User user = new User();
        user.setUsername(userRequest.getUsername());
        user.setName(userRequest.getName());
        user.setEmail(userRequest.getEmail());
        user.setPassword(userRequest.getPassword()); // Raw password, will be encoded in service
        user.setRole(userRequest.getRole());
        user.setPhone(userRequest.getPhone());
        user.setAddress(userRequest.getAddress());

        return ResponseEntity.ok(userService.updateUser(id, user));
    }

    // Delete user (Admin only)
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        userService.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
