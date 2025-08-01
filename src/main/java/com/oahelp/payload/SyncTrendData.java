package com.oahelp.payload;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 同步趋势数据DTO
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SyncTrendData {
    
    private String time;
    private int success;
    private int failure;
}