package com.bs23.ems.repository;

import com.bs23.ems.model.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {
    
    // Custom delete method to remove all notifications for an employee by email
    void deleteByRecipientEmail(String recipientEmail);
}
