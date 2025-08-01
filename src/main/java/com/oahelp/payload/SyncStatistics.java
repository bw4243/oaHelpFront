package com.oahelp.payload;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 同步统计数据DTO
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SyncStatistics {
    
    private int totalSystems;
    private int runningSystems;
    private int failedSystems;
    private int totalSuccess;
    private int totalFailures;
    private String avgDuration;
}