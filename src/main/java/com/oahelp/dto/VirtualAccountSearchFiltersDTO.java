package com.oahelp.dto;

/**
 * 虚拟账号搜索过滤条件DTO
 */
public class VirtualAccountSearchFiltersDTO {
    
    private String source = "all";
    private String department = "all";
    private String riskLevel = "all";
    private String lastLoginDays = "all";
    private String keyword = "";
    
    public VirtualAccountSearchFiltersDTO() {
    }

    public String getSource() {
        return source;
    }

    public void setSource(String source) {
        this.source = source;
    }

    public String getDepartment() {
        return department;
    }

    public void setDepartment(String department) {
        this.department = department;
    }

    public String getRiskLevel() {
        return riskLevel;
    }

    public void setRiskLevel(String riskLevel) {
        this.riskLevel = riskLevel;
    }

    public String getLastLoginDays() {
        return lastLoginDays;
    }

    public void setLastLoginDays(String lastLoginDays) {
        this.lastLoginDays = lastLoginDays;
    }

    public String getKeyword() {
        return keyword;
    }

    public void setKeyword(String keyword) {
        this.keyword = keyword;
    }
}