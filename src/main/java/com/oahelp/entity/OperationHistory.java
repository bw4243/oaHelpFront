package com.oahelp.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

/**
 * 操作历史记录实体类
 */
@Entity
@Table(name = "operation_history")
public class OperationHistory {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String operationType;
    
    @Column(nullable = false)
    private String operationTarget;
    
    @Column(nullable = false)
    private String operationDetail;
    
    @Column(nullable = false)
    private String operator;
    
    @Column(nullable = false)
    private LocalDateTime operationTime;

    // 构造函数
    public OperationHistory() {
    }
    
    public OperationHistory(String operationType, String operationTarget, String operationDetail, String operator) {
        this.operationType = operationType;
        this.operationTarget = operationTarget;
        this.operationDetail = operationDetail;
        this.operator = operator;
        this.operationTime = LocalDateTime.now();
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getOperationType() {
        return operationType;
    }

    public void setOperationType(String operationType) {
        this.operationType = operationType;
    }

    public String getOperationTarget() {
        return operationTarget;
    }

    public void setOperationTarget(String operationTarget) {
        this.operationTarget = operationTarget;
    }

    public String getOperationDetail() {
        return operationDetail;
    }

    public void setOperationDetail(String operationDetail) {
        this.operationDetail = operationDetail;
    }

    public String getOperator() {
        return operator;
    }

    public void setOperator(String operator) {
        this.operator = operator;
    }

    public LocalDateTime getOperationTime() {
        return operationTime;
    }

    public void setOperationTime(LocalDateTime operationTime) {
        this.operationTime = operationTime;
    }
}