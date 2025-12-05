package com.bs23.ems.repository;

import com.bs23.ems.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByUsername(String username);
    User findByEmail(String email);
    User findByPhone(String phone);
    Optional<User> findUserById(Long id);

}
