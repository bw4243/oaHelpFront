package com.oahelp.dto;

import java.util.List;

/**
 * 批量转交请求DTO
 */
public class BatchTransferRequestDTO {
    
    private List<Long> sourceUserIds;
    private Long targetUserId;
    private String transferReason;
    private String operator;
    
    public BatchTransferRequestDTO() {
    }

    public List<Long> getSourceUserIds() {
        return sourceUserIds;
    }

    public void setSourceUserIds(List<Long> sourceUserIds) {
        this.sourceUserIds = sourceUserIds;
    }

    public Long getTargetUserId() {
        return targetUserId;
    }

    public void setTargetUserId(Long targetUserId) {
        this.targetUserId = targetUserId;
    }

    public String getTransferReason() {
        return transferReason;
    }

    public void setTransferReason(String transferReason) {
        this.transferReason = transferReason;
    }

    public String getOperator() {
        return operator;
    }

    public void setOperator(String operator) {
        this.operator = operator;
    }
}