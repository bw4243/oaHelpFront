package com.oahelp.dto;

import java.util.List;

/**
 * 批量禁用账号请求DTO
 */
public class BatchDisableRequestDTO {
    
    private List<String> accountIds;
    private String disableReason;
    
    public BatchDisableRequestDTO() {
    }

    public List<String> getAccountIds() {
        return accountIds;
    }

    public void setAccountIds(List<String> accountIds) {
        this.accountIds = accountIds;
    }

    public String getDisableReason() {
        return disableReason;
    }

    public void setDisableReason(String disableReason) {
        this.disableReason = disableReason;
    }
}