package com.oahelp.payload;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * 系统日志响应DTO
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SystemLogResponse {
    private Long id;
    private String type;
    private String level;
    private String time;
    private String source;
    private String message;
    private String details;
    private String user;
    private String ip;
}