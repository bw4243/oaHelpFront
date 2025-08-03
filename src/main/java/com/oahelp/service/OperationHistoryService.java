package com.oahelp.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.oahelp.entity.OperationHistory;
import com.oahelp.repository.OperationHistoryRepository;

/**
 * 操作历史记录服务
 */
@Service
public class OperationHistoryService {
    
    @Autowired
    private OperationHistoryRepository operationHistoryRepository;
    
    /**
     * 记录虚拟账号禁用操作
     * @param accountIds 账号ID列表
     * @param reason 禁用原因
     * @param operator 操作人
     */
    public void recordDisableAccounts(List<String> accountIds, String reason, String operator) {
        String detail = String.format("批量禁用%d个账号，原因：%s", accountIds.size(), reason);
        OperationHistory history = new OperationHistory("禁用虚拟账号", "虚拟账号", detail, operator);
        operationHistoryRepository.save(history);
    }
    
    /**
     * 记录单个虚拟账号禁用操作
     * @param accountId 账号ID
     * @param username 用户名
     * @param reason 禁用原因
     * @param operator 操作人
     */
    public void recordDisableAccount(String accountId, String username, String reason, String operator) {
        String detail = String.format("禁用账号 %s (ID: %s)，原因：%s", username, accountId, reason);
        OperationHistory history = new OperationHistory("禁用虚拟账号", "虚拟账号", detail, operator);
        operationHistoryRepository.save(history);
    }
    
    /**
     * 记录虚拟账号检测操作
     * @param detectionDays 检测天数
     * @param detectionScope 检测范围
     * @param riskLevel 风险等级
     * @param detectedCount 检测到的账号数量
     * @param operator 操作人
     */
    public void recordDetection(int detectionDays, String detectionScope, String riskLevel, int detectedCount, String operator) {
        String detail = String.format("执行虚拟账号检测，参数：%d天，范围：%s，风险等级：%s，检测到%d个账号", 
                detectionDays, detectionScope, riskLevel, detectedCount);
        OperationHistory history = new OperationHistory("虚拟账号检测", "虚拟账号", detail, operator);
        operationHistoryRepository.save(history);
    }
    
    /**
     * 获取最近的操作历史记录
     * @param days 天数
     * @return 历史记录列表
     */
    public List<OperationHistory> getRecentHistory(int days) {
        LocalDateTime startTime = LocalDateTime.now().minusDays(days);
        return operationHistoryRepository.findByOperationTimeBetween(startTime, LocalDateTime.now());
    }
}