package com.oahelp.payload;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class ApproverDelegateRequest {
    
    @NotNull(message = "委托人ID不能为空")
    private Long fromUserId;
    
    @NotNull(message = "代理人ID不能为空")
    private Long toUserId;
    
    @NotNull(message = "开始时间不能为空")
    private LocalDateTime startTime;
    
    @NotNull(message = "结束时间不能为空")
    private LocalDateTime endTime;
    
    private String reason;
}