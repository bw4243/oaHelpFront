package com.oahelp.entity;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

/**
 * 离职用户实体类
 */
@Entity
@Table(name = "left_users")
public class LeftUser {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String name;
    
    @Column(nullable = false)
    private String department;
    
    @Column(nullable = false)
    private String position;
    
    @Column(nullable = false)
    private LocalDate leaveDate;
    
    @Column(nullable = false)
    private String email;
    
    @OneToMany(mappedBy = "leftUser", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<PendingWorkflow> pendingWorkflows = new ArrayList<>();
    
    @Column(nullable = false)
    private Integer totalPending;

    // 构造函数
    public LeftUser() {
    }
    
    public LeftUser(String name, String department, String position, LocalDate leaveDate, String email) {
        this.name = name;
        this.department = department;
        this.position = position;
        this.leaveDate = leaveDate;
        this.email = email;
        this.totalPending = 0;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDepartment() {
        return department;
    }

    public void setDepartment(String department) {
        this.department = department;
    }

    public String getPosition() {
        return position;
    }

    public void setPosition(String position) {
        this.position = position;
    }

    public LocalDate getLeaveDate() {
        return leaveDate;
    }

    public void setLeaveDate(LocalDate leaveDate) {
        this.leaveDate = leaveDate;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public List<PendingWorkflow> getPendingWorkflows() {
        return pendingWorkflows;
    }

    public void setPendingWorkflows(List<PendingWorkflow> pendingWorkflows) {
        this.pendingWorkflows = pendingWorkflows;
        this.totalPending = pendingWorkflows.size();
    }

    public Integer getTotalPending() {
        return totalPending;
    }

    public void setTotalPending(Integer totalPending) {
        this.totalPending = totalPending;
    }
    
    public void addPendingWorkflow(PendingWorkflow workflow) {
        pendingWorkflows.add(workflow);
        workflow.setLeftUser(this);
        this.totalPending = pendingWorkflows.size();
    }
    
    public void removePendingWorkflow(PendingWorkflow workflow) {
        pendingWorkflows.remove(workflow);
        workflow.setLeftUser(null);
        this.totalPending = pendingWorkflows.size();
    }
}