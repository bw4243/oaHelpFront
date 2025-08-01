package com.oahelp.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.time.LocalDateTime;

/**
 * 系统日志实体类
 */
@Data
@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "system_logs")
public class SystemLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String type; // 系统异常, 慢SQL, 登录记录等

    @Column(nullable = false)
    private String level; // ERROR, WARN, INFO等

    @Column(nullable = false)
    private LocalDateTime time;

    @Column(nullable = false)
    private String source; // 日志来源，如WorkflowEngine, DatabaseMonitor等

    @Column(nullable = false)
    private String message;

    @Column(columnDefinition = "TEXT")
    private String details;

    private String user;

    private String ip;
}