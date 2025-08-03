package com.oahelp.dto;

import java.util.List;

/**
 * 批量作废请求DTO
 */
public class BatchVoidRequestDTO {
    
    private List<Long> userIds;
    private String operator;
    
    public BatchVoidRequestDTO() {
    }

    public List<Long> getUserIds() {
        return userIds;
    }

    public void setUserIds(List<Long> userIds) {
        this.userIds = userIds;
    }

    public String getOperator() {
        return operator;
    }

    public void setOperator(String operator) {
        this.operator = operator;
    }
}