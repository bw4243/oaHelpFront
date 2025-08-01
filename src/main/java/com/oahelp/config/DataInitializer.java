package com.oahelp.config;

import com.oahelp.entity.AlertConfig;
import com.oahelp.entity.SyncSystem;
import com.oahelp.entity.SyncTrend;
import com.oahelp.repository.AlertConfigRepository;
import com.oahelp.repository.SyncSystemRepository;
import com.oahelp.repository.SyncTrendRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.Arrays;
import java.util.Random;

/**
 * 数据初始化配置
 * 仅在开发环境中启用
 */
@Slf4j
@Configuration
@RequiredArgsConstructor
@Profile({"dev", "test"})
public class DataInitializer {

    private final SyncSystemRepository syncSystemRepository;
    private final SyncTrendRepository syncTrendRepository;
    private final AlertConfigRepository alertConfigRepository;
    private final Random random = new Random();

    @Bean
    public CommandLineRunner initSyncData() {
        return args -> {
            log.info("初始化同步系统数据...");
            
            // 初始化同步系统
            if (syncSystemRepository.count() == 0) {
                initSyncSystems();
            }
            
            // 初始化趋势数据
            if (syncTrendRepository.count() == 0) {
                initTrendData();
            }
            
            // 初始化告警配置
            if (alertConfigRepository.count() == 0) {
                initAlertConfig();
            }
            
            log.info("同步系统数据初始化完成");
        };
    }
    
    /**
     * 初始化同步系统
     */
    private void initSyncSystems() {
        // AD域同步
        SyncSystem adSync = SyncSystem.builder()
                .id("ad")
                .name("AD域同步")
                .description("Active Directory用户和组织架构同步")
                .status("running")
                .lastSyncTime(LocalDateTime.now().minusMinutes(30))
                .nextSyncTime(LocalDateTime.now().plusMinutes(30))
                .syncInterval("1小时")
                .successCount(1247)
                .failureCount(3)
                .avgDuration("2.3秒")
                .lastFailureReason("连接超时")
                .lastFailureTime(LocalDateTime.now().minusHours(2).minusMinutes(15))
                .enabled(true)
                .syncType("增量同步")
                .dataSource("ldap://ad.company.com:389")
                .build();
        
        // ERP系统同步
        SyncSystem erpSync = SyncSystem.builder()
                .id("erp")
                .name("ERP系统同步")
                .description("ERP系统员工信息和部门数据同步")
                .status("success")
                .lastSyncTime(LocalDateTime.now().minusHours(1))
                .nextSyncTime(LocalDateTime.now().plusHours(23))
                .syncInterval("每日")
                .successCount(892)
                .failureCount(1)
                .avgDuration("15.6秒")
                .lastFailureReason("数据格式错误")
                .lastFailureTime(LocalDateTime.now().minusDays(1).minusHours(16))
                .enabled(true)
                .syncType("全量同步")
                .dataSource("http://erp.company.com/api/sync")
                .build();
        
        // HR系统同步
        SyncSystem hrSync = SyncSystem.builder()
                .id("hr")
                .name("HR系统同步")
                .description("人力资源系统员工档案同步")
                .status("failed")
                .lastSyncTime(LocalDateTime.now().minusMinutes(15))
                .nextSyncTime(LocalDateTime.now().plusMinutes(45))
                .syncInterval("1小时")
                .successCount(654)
                .failureCount(8)
                .avgDuration("8.9秒")
                .lastFailureReason("API认证失败")
                .lastFailureTime(LocalDateTime.now().minusMinutes(15))
                .enabled(true)
                .syncType("增量同步")
                .dataSource("https://hr.company.com/api/v2/sync")
                .build();
        
        // CRM系统同步
        SyncSystem crmSync = SyncSystem.builder()
                .id("crm")
                .name("CRM系统同步")
                .description("客户关系管理系统数据同步")
                .status("stopped")
                .lastSyncTime(LocalDateTime.now().minusHours(4).minusMinutes(30))
                .nextSyncTime(null)
                .syncInterval("4小时")
                .successCount(423)
                .failureCount(2)
                .avgDuration("5.2秒")
                .lastFailureReason("无")
                .lastFailureTime(LocalDateTime.now().minusDays(1).minusHours(9).minusMinutes(30))
                .enabled(false)
                .syncType("增量同步")
                .dataSource("http://crm.company.com/sync")
                .build();
        
        syncSystemRepository.saveAll(Arrays.asList(adSync, erpSync, hrSync, crmSync));
    }
    
    /**
     * 初始化趋势数据
     */
    private void initTrendData() {
        LocalDate today = LocalDate.now();
        
        // 生成今天每小时的趋势数据
        for (int hour = 8; hour <= 17; hour++) {
            String hourKey = String.format("%02d:00", hour);
            LocalDateTime time = today.atTime(hour, 0);
            
            // 生成随机的成功和失败次数
            int success = 30 + random.nextInt(40); // 30-70
            int failure = random.nextInt(4);       // 0-3
            
            SyncTrend trend = SyncTrend.builder()
                    .time(time)
                    .hourKey(hourKey)
                    .success(success)
                    .failure(failure)
                    .build();
            
            syncTrendRepository.save(trend);
        }
    }
    
    /**
     * 初始化告警配置
     */
    private void initAlertConfig() {
        AlertConfig config = AlertConfig.builder()
                .failureThreshold(3)
                .emailEnabled(true)
                .dingTalkEnabled(false)
                .emailRecipients("admin@company.com,it@company.com")
                .dingTalkWebhook("")
                .build();
        
        alertConfigRepository.save(config);
    }
}