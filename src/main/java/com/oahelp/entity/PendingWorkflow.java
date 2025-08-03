package com.oahelp.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

/**
 * 待处理工作流实体类
 */
@Entity
@Table(name = "pending_workflows")
public class PendingWorkflow {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "left_user_id")
    private LeftUser leftUser;
    
    @Column(nullable = false)
    private String workflowType;
    
    @Column(nullable = false)
    private String workflowId;
    
    @Column(nullable = false)
    private String workflowTitle;
    
    @Column(nullable = false)
    private LocalDateTime createTime;
    
    @Column
    private String status;

    // 构造函数
    public PendingWorkflow() {
    }
    
    public PendingWorkflow(LeftUser leftUser, String workflowType, String workflowId, String workflowTitle) {
        this.leftUser = leftUser;
        this.workflowType = workflowType;
        this.workflowId = workflowId;
        this.workflowTitle = workflowTitle;
        this.createTime = LocalDateTime.now();
        this.status = "待处理";
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public LeftUser getLeftUser() {
        return leftUser;
    }

    public void setLeftUser(LeftUser leftUser) {
        this.leftUser = leftUser;
    }

    public String getWorkflowType() {
        return workflowType;
    }

    public void setWorkflowType(String workflowType) {
        this.workflowType = workflowType;
    }

    public String getWorkflowId() {
        return workflowId;
    }

    public void setWorkflowId(String workflowId) {
        this.workflowId = workflowId;
    }

    public String getWorkflowTitle() {
        return workflowTitle;
    }

    public void setWorkflowTitle(String workflowTitle) {
        this.workflowTitle = workflowTitle;
    }

    public LocalDateTime getCreateTime() {
        return createTime;
    }

    public void setCreateTime(LocalDateTime createTime) {
        this.createTime = createTime;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}