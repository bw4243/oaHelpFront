package com.oahelp.service;

import com.oahelp.entity.User;
import com.oahelp.payload.UserSummary;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Optional;

public interface UserService {
    User createUser(User user);
    
    User updateUser(User user);
    
    void deleteUser(Long id);
    
    Optional<User> getUserById(Long id);
    
    Optional<User> getUserByUsername(String username);
    
    Optional<User> getUserByEmail(String email);
    
    List<User> getAllUsers();
    
    Page<User> getAllUsers(Pageable pageable);
    
    List<User> getUsersByDepartment(String department);
    
    List<User> getActiveUsers();
    
    List<User> getInactiveUsers();
    
    boolean existsByUsername(String username);
    
    boolean existsByEmail(String email);
    
    UserSummary getUserSummary(User user);
    
    void deactivateUser(Long id);
    
    void activateUser(Long id);
}