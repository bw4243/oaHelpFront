package com.oahelp.dto;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

import com.oahelp.entity.VirtualAccount;

/**
 * 虚拟账号DTO
 */
public class VirtualAccountDTO {
    
    private String id;
    private String username;
    private String displayName;
    private String department;
    private String createTime;
    private String lastLoginTime;
    private int daysSinceLastLogin;
    private int loginCount;
    private String source;
    private String sourceDetail;
    private String riskLevel;
    private String status;
    private String usageFrequency;
    private String email;
    private String creator;
    
    private static final DateTimeFormatter FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm");
    
    public VirtualAccountDTO() {
    }
    
    public static VirtualAccountDTO fromEntity(VirtualAccount entity) {
        VirtualAccountDTO dto = new VirtualAccountDTO();
        dto.setId(entity.getId().toString());
        dto.setUsername(entity.getUsername());
        dto.setDisplayName(entity.getDisplayName());
        dto.setDepartment(entity.getDepartment());
        dto.setCreateTime(entity.getCreateTime().format(FORMATTER));
        
        if (entity.getLastLoginTime() != null) {
            dto.setLastLoginTime(entity.getLastLoginTime().format(FORMATTER));
        } else {
            dto.setLastLoginTime("从未登录");
        }
        
        dto.setDaysSinceLastLogin(entity.getDaysSinceLastLogin());
        dto.setLoginCount(entity.getLoginCount());
        dto.setSource(entity.getSource());
        dto.setSourceDetail(entity.getSourceDetail());
        dto.setRiskLevel(entity.getRiskLevel());
        dto.setStatus(entity.getStatus());
        dto.setUsageFrequency(entity.getUsageFrequency());
        dto.setEmail(entity.getEmail());
        dto.setCreator(entity.getCreator());
        
        return dto;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
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

    public String getCreateTime() {
        return createTime;
    }

    public void setCreateTime(String createTime) {
        this.createTime = createTime;
    }

    public String getLastLoginTime() {
        return lastLoginTime;
    }

    public void setLastLoginTime(String lastLoginTime) {
        this.lastLoginTime = lastLoginTime;
    }

    public int getDaysSinceLastLogin() {
        return daysSinceLastLogin;
    }

    public void setDaysSinceLastLogin(int daysSinceLastLogin) {
        this.daysSinceLastLogin = daysSinceLastLogin;
    }

    public int getLoginCount() {
        return loginCount;
    }

    public void setLoginCount(int loginCount) {
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
}