package com.oahelp.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.oahelp.entity.LeftUser;
import com.oahelp.entity.OperationHistory;
import com.oahelp.entity.TransferTarget;
import com.oahelp.repository.LeftUserRepository;
import com.oahelp.repository.OperationHistoryRepository;
import com.oahelp.repository.PendingWorkflowRepository;
import com.oahelp.repository.TransferTargetRepository;

/**
 * 工作流清理服务类
 */
@Service
public class WorkflowCleanupService {
    
    @Autowired
    private LeftUserRepository leftUserRepository;
    
    @Autowired
    private PendingWorkflowRepository pendingWorkflowRepository;
    
    @Autowired
    private TransferTargetRepository transferTargetRepository;
    
    @Autowired
    private OperationHistoryRepository operationHistoryRepository;
    
    /**
     * 获取所有转交目标
     */
    public List<TransferTarget> getAllTransferTargets() {
        return transferTargetRepository.findAll();
    }
    
    /**
     * 获取最近的操作历史
     */
    public List<OperationHistory> getRecentOperationHistory() {
        return operationHistoryRepository.findTop10ByOrderByTimeDesc();
    }
    
    /**
     * 批量转交待办流程
     */
    @Transactional
    public OperationHistory batchTransferWorkflows(List<Long> sourceUserIds, Long targetUserId, String transferReason, String operator) {
        // 获取源用户和目标用户信息
        List<LeftUser> sourceUsers = leftUserRepository.findAllById(sourceUserIds);
        TransferTarget targetUser = transferTargetRepository.findById(targetUserId).orElse(null);
        
        if (targetUser == null) {
            throw new IllegalArgumentException("转交目标不存在");
        }
        
        // 执行批量转交
        int affectedRows = pendingWorkflowRepository.batchTransferWorkflows(sourceUserIds, targetUserId);
        
        // 更新源用户的待办数量
        for (LeftUser user : sourceUsers) {
            user.setTotalPending(0);
            leftUserRepository.save(user);
        }
        
        // 创建操作历史记录
        StringBuilder userNames = new StringBuilder();
        for (int i = 0; i < sourceUsers.size(); i++) {
            if (i > 0) {
                userNames.append(", ");
            }
            userNames.append(sourceUsers.get(i).getName());
        }
        
        String details = "将" + userNames.toString() + "的待办转交给" + targetUser.getName();
        if (transferReason != null && !transferReason.isEmpty()) {
            details += "，原因：" + transferReason;
        }
        
        OperationHistory history = new OperationHistory(
                "批量转交",
                operator,
                LocalDateTime.now(),
                details,
                "已完成"
        );
        
        return operationHistoryRepository.save(history);
    }
    
    /**
     * 批量作废待办流程
     */
    @Transactional
    public OperationHistory batchVoidWorkflows(List<Long> userIds, String operator) {
        // 获取用户信息
        List<LeftUser> users = leftUserRepository.findAllById(userIds);
        
        // 执行批量作废
        int affectedRows = pendingWorkflowRepository.batchDeleteWorkflows(userIds);
        
        // 更新用户的待办数量
        for (LeftUser user : users) {
            user.setTotalPending(0);
            leftUserRepository.save(user);
        }
        
        // 创建操作历史记录
        StringBuilder userNames = new StringBuilder();
        for (int i = 0; i < users.size(); i++) {
            if (i > 0) {
                userNames.append(", ");
            }
            userNames.append(users.get(i).getName());
        }
        
        String details = "作废" + userNames.toString() + "的待办流程";
        
        OperationHistory history = new OperationHistory(
                "批量作废",
                operator,
                LocalDateTime.now(),
                details,
                "已完成"
        );
        
        return operationHistoryRepository.save(history);
    }
}