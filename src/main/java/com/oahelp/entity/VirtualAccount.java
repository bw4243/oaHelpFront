package com.oahelp.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

/**
 * 虚拟账号实体类
 */
@Entity
@Table(name = "virtual_accounts")
public class VirtualAccount {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false, unique = true)
    private String username;
    
    @Column(nullable = false)
    private String displayName;
    
    @Column(nullable = false)
    private String department;
    
    @Column(nullable = false)
    private LocalDateTime createTime;
    
    @Column
    private LocalDateTime lastLoginTime;
    
    @Column(nullable = false)
    private Integer loginCount;
    
    @Column(nullable = false)
    private String source;
    
    @Column
    private String sourceDetail;
    
    @Column(nullable = false)
    private String riskLevel;
    
    @Column(nullable = false)
    private String status;
    
    @Column
    private String usageFrequency;
    
    @Column
    private String email;
    
    @Column(nullable = false)
    private String creator;

    // 构造函数
    public VirtualAccount() {
    }
    
    public VirtualAccount(String username, String displayName, String department, 
                         LocalDateTime createTime, String source, String sourceDetail, 
                         String riskLevel, String status, String email, String creator) {
        this.username = username;
        this.displayName = displayName;
        this.department = department;
        this.createTime = createTime;
        this.loginCount = 0;
        this.source = source;
        this.sourceDetail = sourceDetail;
        this.riskLevel = riskLevel;
        this.status = status;
        this.usageFrequency = "无";
        this.email = email;
        this.creator = creator;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getDisplayName() {
        return displayName;
    }

    public void setDisplayName(String displayName) {
        this.displayName = displayName;
    }

    public String getDepartment() {
        return department;
    }

    public void setDepartment(String department) {
        this.department = department;
    }

    public LocalDateTime getCreateTime() {
        return createTime;
    }

    public void setCreateTime(LocalDateTime createTime) {
        this.createTime = createTime;
    }

    public LocalDateTime getLastLoginTime() {
        return lastLoginTime;
    }

    public void setLastLoginTime(LocalDateTime lastLoginTime) {
        this.lastLoginTime = lastLoginTime;
    }

    public Integer getLoginCount() {
        return loginCount;
    }

    public void setLoginCount(Integer loginCount) {
        this.loginCount = loginCount;
    }

    public String getSource() {
        return source;
    }

    public void setSource(String source) {
        this.source = source;
    }

    public String getSourceDetail() {
        return sourceDetail;
    }

    public void setSourceDetail(String sourceDetail) {
        this.sourceDetail = sourceDetail;
    }

    public String getRiskLevel() {
        return riskLevel;
    }

    public void setRiskLevel(String riskLevel) {
        this.riskLevel = riskLevel;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getUsageFrequency() {
        return usageFrequency;
    }

    public void setUsageFrequency(String usageFrequency) {
        this.usageFrequency = usageFrequency;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getCreator() {
        return creator;
    }

    public void setCreator(String creator) {
        this.creator = creator;
    }
    
    /**
     * 计算距离上次登录的天数
     * @return 天数，如果从未登录则返回999
     */
    public int getDaysSinceLastLogin() {
        if (lastLoginTime == null) {
            return 999;
        }
        return (int) java.time.Duration.between(lastLoginTime, LocalDateTime.now()).toDays();
    }
    
    /**
     * 更新使用频率
     */
    public void updateUsageFrequency() {
        if (loginCount == 0) {
            this.usageFrequency = "无";
        } else if (loginCount <= 2) {
            this.usageFrequency = "极低";
        } else if (loginCount <= 10) {
            this.usageFrequency = "低";
        } else if (loginCount <= 30) {
            this.usageFrequency = "中";
        } else {
            this.usageFrequency = "高";
        }
    }
}