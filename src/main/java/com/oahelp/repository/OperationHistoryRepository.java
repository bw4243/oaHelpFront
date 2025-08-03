package com.oahelp.repository;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.oahelp.entity.OperationHistory;

/**
 * 操作历史记录仓库
 */
@Repository
public interface OperationHistoryRepository extends JpaRepository<OperationHistory, Long> {
    
    /**
     * 根据操作类型查询历史记录
     */
    List<OperationHistory> findByOperationType(String operationType);
    
    /**
     * 根据操作目标查询历史记录
     */
    List<OperationHistory> findByOperationTarget(String operationTarget);
    
    /**
     * 根据操作人查询历史记录
     */
    List<OperationHistory> findByOperator(String operator);
    
    /**
     * 查询指定时间范围内的历史记录
     */
    List<OperationHistory> findByOperationTimeBetween(LocalDateTime startTime, LocalDateTime endTime);
}