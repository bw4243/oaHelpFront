package com.oahelp.dto;

/**
 * 虚拟账号统计数据DTO
 */
public class VirtualAccountStatsDTO {
    
    private int total;
    private int highRisk;
    private int mediumRisk;
    private int lowRisk;
    private int neverLogin;
    private int longInactive;
    private int apiGenerated;
    
    public VirtualAccountStatsDTO() {
    }

    public int getTotal() {
        return total;
    }

    public void setTotal(int total) {
        this.total = total;
    }

    public int getHighRisk() {
        return highRisk;
    }

    public void setHighRisk(int highRisk) {
        this.highRisk = highRisk;
    }

    public int getMediumRisk() {
        return mediumRisk;
    }

    public void setMediumRisk(int mediumRisk) {
        this.mediumRisk = mediumRisk;
    }

    public int getLowRisk() {
        return lowRisk;
    }

    public void setLowRisk(int lowRisk) {
        this.lowRisk = lowRisk;
    }

    public int getNeverLogin() {
        return neverLogin;
    }

    public void setNeverLogin(int neverLogin) {
        this.neverLogin = neverLogin;
    }

    public int getLongInactive() {
        return longInactive;
    }

    public void setLongInactive(int longInactive) {
        this.longInactive = longInactive;
    }

    public int getApiGenerated() {
        return apiGenerated;
    }

    public void setApiGenerated(int apiGenerated) {
        this.apiGenerated = apiGenerated;
    }
}