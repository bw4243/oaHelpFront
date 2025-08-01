package com.oahelp.payload;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

/**
 * 日志查询请求DTO
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LogQueryRequest {
    private String logType;
    private String keyword;
    private LocalDate startDate;
    private LocalDate endDate;
    private Integer page;
    private Integer size;
}