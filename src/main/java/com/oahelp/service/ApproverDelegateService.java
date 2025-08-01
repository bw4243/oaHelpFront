package com.oahelp.service;

import com.oahelp.entity.ApproverDelegate;
import com.oahelp.entity.User;
import com.oahelp.payload.ApproverDelegateRequest;
import com.oahelp.payload.ApproverDelegateResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface ApproverDelegateService {
    
    // 创建审批代理
    ApproverDelegate createDelegate(ApproverDelegateRequest request, User creator);
    
    // 取消审批代理
    ApproverDelegate cancelDelegate(Long id, User operator);
    
    // 获取审批代理详情
    Optional<ApproverDelegate> getDelegateById(Long id);
    
    // 获取用户创建的审批代理
    List<ApproverDelegate> getDelegatesByFromUser(User fromUser);
    
    // 获取用户接收的审批代理
    List<ApproverDelegate> getDelegatesByToUser(User toUser);
    
    // 获取特定状态的审批代理
    List<ApproverDelegate> getDelegatesByStatus(ApproverDelegate.DelegateStatus status);
    
    // 分页查询审批代理
    Page<ApproverDelegate> getAllDelegates(Pageable pageable);
    
    // 获取当前生效的审批代理
    List<ApproverDelegate> getActiveDelegatesByFromUser(User fromUser);
    
    // 获取当前接收的生效审批代理
    List<ApproverDelegate> getActiveDelegatesByToUser(User toUser);
    
    // 更新过期的审批代理状态
    void updateExpiredDelegates();
    
    // 检查用户是否有审批代理
    boolean hasActiveDelegate(User user);
    
    // 获取用户的代理人
    Optional<User> getDelegateUser(User fromUser);
    
    // 将审批代理数据转换为前端响应格式
    ApproverDelegateResponse convertToResponse(ApproverDelegate delegate);
}