package com.oahelp.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.time.LocalDateTime;

/**
 * 数据同步系统实体类
 */
@Data
@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "sync_systems")
public class SyncSystem {

    @Id
    private String id;

    @Column(nullable = false)
    private String name;

    private String description;

    @Column(nullable = false)
    private String status; // running, success, failed, stopped

    private LocalDateTime lastSyncTime;

    private LocalDateTime nextSyncTime;

    @Column(nullable = false)
    private String syncInterval;

    private int successCount;

    private int failureCount;

    private String avgDuration;

    private String lastFailureReason;

    private LocalDateTime lastFailureTime;

    @Column(nullable = false)
    private boolean enabled;

    @Column(nullable = false)
    private String syncType; // 全量同步, 增量同步

    @Column(nullable = false)
    private String dataSource;
}