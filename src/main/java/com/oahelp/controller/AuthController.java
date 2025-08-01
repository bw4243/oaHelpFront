package com.oahelp.controller;

import com.oahelp.entity.Role;
import com.oahelp.entity.SystemLog;
import com.oahelp.entity.User;
import com.oahelp.payload.ApiResponse;
import com.oahelp.payload.JwtAuthenticationResponse;
import com.oahelp.payload.LoginRequest;
import com.oahelp.payload.SignUpRequest;
import com.oahelp.repository.RoleRepository;
import com.oahelp.repository.UserRepository;
import com.oahelp.security.JwtTokenProvider;
import com.oahelp.service.SystemLogService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.util.Collections;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtTokenProvider tokenProvider;
    
    @Autowired
    private SystemLogService systemLogService;

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest, 
                                             HttpServletRequest request) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            loginRequest.getUsernameOrEmail(),
                            loginRequest.getPassword()
                    )
            );

            SecurityContextHolder.getContext().setAuthentication(authentication);

            String jwt = tokenProvider.generateToken(authentication);
            
            // 记录登录日志
            User user = userRepository.findByUsernameOrEmail(
                    loginRequest.getUsernameOrEmail(), 
                    loginRequest.getUsernameOrEmail())
                    .orElse(null);
            
            if (user != null) {
                systemLogService.createSuccessLog(
                        SystemLog.OperationType.登录,
                        "用户 " + user.getUsername() + " 登录成功",
                        user,
                        request.getRemoteAddr()
                );
            }
            
            return ResponseEntity.ok(new JwtAuthenticationResponse(jwt));
        } catch (Exception e) {
            // 记录登录失败日志
            systemLogService.createFailureLog(
                    SystemLog.OperationType.登录,
                    "用户 " + loginRequest.getUsernameOrEmail() + " 登录失败",
                    null,
                    request.getRemoteAddr(),
                    e.getMessage()
            );
            
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new ApiResponse(false, "用户名或密码错误"));
        }
    }

    @PostMapping("/signup")
    public ResponseEntity<?> registerUser(@Valid @RequestBody SignUpRequest signUpRequest,
                                         HttpServletRequest request) {
        if (userRepository.existsByUsername(signUpRequest.getUsername())) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse(false, "用户名已被使用"));
        }

        if (userRepository.existsByEmail(signUpRequest.getEmail())) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse(false, "邮箱已被使用"));
        }

        // 创建用户账号
        User user = new User();
        user.setName(signUpRequest.getName());
        user.setUsername(signUpRequest.getUsername());
        user.setEmail(signUpRequest.getEmail());
        user.setPassword(passwordEncoder.encode(signUpRequest.getPassword()));
        user.setDepartment(signUpRequest.getDepartment());
        user.setPosition(signUpRequest.getPosition());
        user.setIsActive(true);

        Role userRole = roleRepository.findByName(Role.RoleName.ROLE_USER)
                .orElseThrow(() -> new RuntimeException("未找到用户角色"));

        user.setRoles(Collections.singleton(userRole));

        User result = userRepository.save(user);
        
        // 记录注册日志
        systemLogService.createSuccessLog(
                SystemLog.OperationType.系统配置修改,
                "新用户注册: " + user.getUsername(),
                user,
                request.getRemoteAddr()
        );

        URI location = ServletUriComponentsBuilder
                .fromCurrentContextPath().path("/api/users/{username}")
                .buildAndExpand(result.getUsername()).toUri();

        return ResponseEntity.created(location)
                .body(new ApiResponse(true, "用户注册成功"));
    }
}