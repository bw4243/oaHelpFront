package com.oahelp.payload;

import com.oahelp.entity.ApproverDelegate;
import lombok.Data;

@Data
public class ApproverDelegateResponse {
    private Long id;
    private UserSummary fromUser;
    private UserSummary toUser;
    private String startTime;
    private String endTime;
    private String reason;
    private String status;
    private String createdTime;
    private UserSummary createdBy;
}