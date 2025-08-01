package com.oahelp.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;

/**
 * 告警配置实体类
 */
@Data
@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "alert_configs")
public class AlertConfig {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private int failureThreshold;

    @Column(nullable = false)
    private boolean emailEnabled;

    @Column(nullable = false)
    private boolean dingTalkEnabled;

    @Column(columnDefinition = "TEXT")
    private String emailRecipients;

    private String dingTalkWebhook;
}