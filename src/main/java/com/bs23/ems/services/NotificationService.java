package com.bs23.ems.services;

import com.bs23.ems.model.Notification;
import com.bs23.ems.repository.NotificationRepository;
import org.springframework.mail.MailException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.time.LocalDateTime;
import java.util.regex.Pattern;

@Service
public class NotificationService {

    private final JavaMailSender mailSender;
    private final NotificationRepository notificationRepository;

    // simple RFC-like email regex (sufficient for most cases)
    private static final Pattern EMAIL_PATTERN = Pattern.compile("^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+$");

    public NotificationService(JavaMailSender mailSender, NotificationRepository notificationRepository) {
        this.mailSender = mailSender;
        this.notificationRepository = notificationRepository;
    }

    private boolean isValidEmail(String email) {
        return StringUtils.hasText(email) && EMAIL_PATTERN.matcher(email).matches();
    }

    /**
     * Send email asynchronously and log the attempt.
     * Throws IllegalArgumentException if address format is invalid.
     */
    @Async("notificationExecutor")
    public void sendEmail(String to, String subject, String body) {
        if (to == null) {
            throw new IllegalArgumentException("Email address cannot be null");
        }
        if (subject == null) {
            throw new IllegalArgumentException("Subject cannot be null");
        }
        if (body == null) {
            throw new IllegalArgumentException("Email body cannot be null");
        }
        if (!isValidEmail(to)) {
            throw new IllegalArgumentException("Invalid email address: " + to);
        }

        Notification log = new Notification();
        log.setRecipientEmail(to);
        log.setSubject(subject);
        log.setMessage(body);
        log.setCreatedAt(LocalDateTime.now());
        log.setSent(false);

        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(to);
            message.setSubject(subject);
            message.setText(body);
            mailSender.send(message);

            log.setSent(true);
            log.setError(null);
        } catch (MailException ex) {
            log.setSent(false);
            log.setError(ex.getMessage());
            // optionally rethrow or just log — we keep it swallowed so caller doesn't block
        } finally {
            try {
                notificationRepository.save(log);
            } catch (Exception e) {
                // If DB save fails, at least log to stdout (don't fail the whole flow)
                System.err.println("Failed to save notification log: " + e.getMessage());
            }
        }
    }

    public java.util.List<Notification> getAllNotifications() {
        return notificationRepository.findAll();
    }

    public Notification getNotificationById(Long id) {
        if (id == null) {
            throw new IllegalArgumentException("Notification ID cannot be null");
        }
        return notificationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Notification not found"));
    }

    public void deleteNotification(Long id) {
        if (id == null) {
            throw new IllegalArgumentException("Notification ID cannot be null");
        }
        notificationRepository.deleteById(id);
    }
}
