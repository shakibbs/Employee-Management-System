package com.bs23.ems.controller;

import com.bs23.ems.model.Notification;
import com.bs23.ems.services.NotificationService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/notifications")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001", "http://127.0.0.1:3000", "http://127.0.0.1:3001"})
public class NotificationController {

    private final NotificationService notificationService;

    public NotificationController(NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    @PreAuthorize("hasAnyRole('ROLE_ADMIN','ROLE_HR')")
    @GetMapping
    public ResponseEntity<List<Notification>> getAllNotifications() {
        return ResponseEntity.ok(notificationService.getAllNotifications());
    }

    @PreAuthorize("hasAnyRole('ROLE_ADMIN','ROLE_HR','ROLE_USER','ROLE_EMPLOYEE')")
    @GetMapping("/my-notifications")
    public ResponseEntity<List<Notification>> getMyNotifications(Authentication authentication) {
        String username = authentication.getName();
        // For now, return all notifications since we don't have employee-specific notifications
        return ResponseEntity.ok(notificationService.getAllNotifications());
    }

    @PreAuthorize("hasAnyRole('ROLE_ADMIN','ROLE_HR')")
    @GetMapping("/{id}")
    public ResponseEntity<Notification> getNotification(@PathVariable Long id) {
        return ResponseEntity.ok(notificationService.getNotificationById(id));
    }

    @PreAuthorize("hasAnyRole('ROLE_ADMIN','ROLE_HR')")
    @PostMapping
    public ResponseEntity<String> sendNotification(@RequestBody Map<String, String> request) {
        String to = request.get("to");
        String subject = request.get("subject");
        String body = request.get("body");
        
        notificationService.sendEmail(to, subject, body);
        return ResponseEntity.ok("Notification sent successfully");
    }

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteNotification(@PathVariable Long id) {
        notificationService.deleteNotification(id);
        return ResponseEntity.noContent().build();
    }
}