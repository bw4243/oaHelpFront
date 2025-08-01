package com.oahelp.controller;

import com.oahelp.entity.SystemLog;
import com.oahelp.entity.User;
import com.oahelp.payload.ApiResponse;
import com.oahelp.payload.UserSummary;
import com.oahelp.security.CurrentUser;
import com.oahelp.security.UserPrincipal;
import com.oahelp.service.SystemLogService;
import com.oahelp.service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;
    
    @Autowired
    private SystemLogService systemLogService;

    @GetMapping("/me")
    @PreAuthorize("hasRole('USER')")
    public UserSummary getCurrentUser(@CurrentUser UserPrincipal currentUser) {
        User user = userService.getUserById(currentUser.getId())
                .orElseThrow(() -> new RuntimeException("未找到当前用户"));
        return userService.getUserSummary(user);
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public List<UserSummary> getAllUsers() {
        return userService.getAllUsers().stream()
                .map(user -> userService.getUserSummary(user))
                .collect(Collectors.toList());
    }

    @GetMapping("/page")
    @PreAuthorize("hasRole('ADMIN')")
    public Page<UserSummary> getAllUsers(Pageable pageable) {
        return userService.getAllUsers(pageable)
                .map(user -> userService.getUserSummary(user));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<UserSummary> getUserById(@PathVariable Long id) {
        return userService.getUserById(id)
                .map(user -> ResponseEntity.ok(userService.getUserSummary(user)))
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/department/{department}")
    @PreAuthorize("hasRole('USER')")
    public List<UserSummary> getUsersByDepartment(@PathVariable String department) {
        return userService.getUsersByDepartment(department).stream()
                .map(user -> userService.getUserSummary(user))
                .collect(Collectors.toList());
    }

    @GetMapping("/active")
    @PreAuthorize("hasRole('ADMIN')")
    public List<UserSummary> getActiveUsers() {
        return userService.getActiveUsers().stream()
                .map(user -> userService.getUserSummary(user))
                .collect(Collectors.toList());
    }

    @GetMapping("/inactive")
    @PreAuthorize("hasRole('ADMIN')")
    public List<UserSummary> getInactiveUsers() {
        return userService.getInactiveUsers().stream()
                .map(user -> userService.getUserSummary(user))
                .collect(Collectors.toList());
    }

    @PutMapping("/{id}/deactivate")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deactivateUser(@PathVariable Long id, 
                                          @CurrentUser UserPrincipal currentUser,
                                          HttpServletRequest request) {
        try {
            userService.deactivateUser(id);
            
            User operator = userService.getUserById(currentUser.getId())
                    .orElseThrow(() -> new RuntimeException("未找到当前用户"));
            
            User targetUser = userService.getUserById(id)
                    .orElseThrow(() -> new RuntimeException("未找到目标用户"));
            
            systemLogService.createSuccessLog(
                    SystemLog.OperationType.系统配置修改,
                    "停用用户: " + targetUser.getUsername(),
                    operator,
                    request.getRemoteAddr()
            );
            
            return ResponseEntity.ok(new ApiResponse(true, "用户已停用"));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse(false, "停用用户失败: " + e.getMessage()));
        }
    }

    @PutMapping("/{id}/activate")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> activateUser(@PathVariable Long id, 
                                        @CurrentUser UserPrincipal currentUser,
                                        HttpServletRequest request) {
        try {
            userService.activateUser(id);
            
            User operator = userService.getUserById(currentUser.getId())
                    .orElseThrow(() -> new RuntimeException("未找到当前用户"));
            
            User targetUser = userService.getUserById(id)
                    .orElseThrow(() -> new RuntimeException("未找到目标用户"));
            
            systemLogService.createSuccessLog(
                    SystemLog.OperationType.系统配置修改,
                    "启用用户: " + targetUser.getUsername(),
                    operator,
                    request.getRemoteAddr()
            );
            
            return ResponseEntity.ok(new ApiResponse(true, "用户已启用"));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse(false, "启用用户失败: " + e.getMessage()));
        }
    }
}