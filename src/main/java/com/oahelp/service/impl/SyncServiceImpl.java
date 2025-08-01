package com.oahelp.service.impl;

import com.oahelp.entity.AlertConfig;
import com.oahelp.entity.SyncFailure;
import com.oahelp.entity.SyncSystem;
import com.oahelp.exception.ResourceNotFoundException;
import com.oahelp.exception.SyncOperationException;
import com.oahelp.payload.SyncStatistics;
import com.oahelp.payload.SyncTrendData;
import com.oahelp.repository.AlertConfigRepository;
import com.oahelp.repository.SyncFailureRepository;
import com.oahelp.repository.SyncSystemRepository;
import com.oahelp.repository.SyncTrendRepository;
import com.oahelp.service.DingTalkService;
import com.oahelp.service.EmailService;
import com.oahelp.service.SyncService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.PageRequest;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

/**
 * 数据同步服务实现类
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class SyncServiceImpl implements SyncService {

    private final SyncSystemRepository syncSystemRepository;
    private final SyncFailureRepository syncFailureRepository;
    private final SyncTrendRepository syncTrendRepository;
    private final AlertConfigRepository alertConfigRepository;
    private final EmailService emailService;
    private final DingTalkService dingTalkService;
    
    private static final DateTimeFormatter TIME_FORMATTER = DateTimeFormatter.ofPattern("HH:mm");

    @Override
    public List<SyncSystem> getAllSyncSystems() {
        return syncSystemRepository.findAll();
    }

    @Override
    public SyncSystem getSyncSystemById(String id) {
        return syncSystemRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("同步系统", "id", id));
    }

    @Override
    @Transactional
    public SyncSystem updateSyncSystemStatus(String id, boolean enabled) {
        SyncSystem system = getSyncSystemById(id);
        system.setEnabled(enabled);
        
        // 如果禁用系统，则更新状态为已停止
        if (!enabled && !"stopped".equals(system.getStatus())) {
            system.setStatus("stopped");
            system.setNextSyncTime(null);
        } 
        // 如果启用系统且当前为停止状态，则更新为成功状态并设置下次同步时间
        else if (enabled && "stopped".equals(system.getStatus())) {
            system.setStatus("success");
            system.setNextSyncTime(calculateNextSyncTime(system.getSyncInterval()));
        }
        
        return syncSystemRepository.save(system);
    }

    @Override
    @Async
    @Transactional
    public void triggerSync(String id) {
        SyncSystem system = getSyncSystemById(id);
        
        // 如果系统未启用，则不执行同步
        if (!system.isEnabled()) {
            log.warn("系统未启用，无法执行同步: {}", system.getName());
            return;
        }
        
        try {
            // 更新状态为同步中
            system.setStatus("running");
            syncSystemRepository.save(system);
            
            // 执行实际同步逻辑（根据不同系统类型调用不同的同步方法）
            boolean success = executeSync(system);
            
            // 更新同步结果
            LocalDateTime now = LocalDateTime.now();
            system.setLastSyncTime(now);
            system.setNextSyncTime(calculateNextSyncTime(system.getSyncInterval()));
            
            if (success) {
                system.setStatus("success");
                system.setSuccessCount(system.getSuccessCount() + 1);
                
                // 记录同步趋势数据
                recordSyncTrend(now, true);
            } else {
                system.setStatus("failed");
                system.setFailureCount(system.getFailureCount() + 1);
                system.setLastFailureTime(now);
                system.setLastFailureReason("同步失败");
                
                // 记录同步趋势数据
                recordSyncTrend(now, false);
                
                // 记录失败详情
                recordSyncFailure(system, "同步失败", "执行同步过程中发生错误", "0.0秒");
                
                // 检查是否需要发送告警
                checkAndSendAlert(system);
            }
            
            syncSystemRepository.save(system);
            
        } catch (Exception e) {
            log.error("执行同步时发生异常: " + system.getName(), e);
            
            // 更新失败状态
            system.setStatus("failed");
            system.setFailureCount(system.getFailureCount() + 1);
            system.setLastFailureTime(LocalDateTime.now());
            system.setLastFailureReason(e.getMessage());
            try {
                syncSystemRepository.save(system);
            } catch (Exception ex) {
                throw new SyncOperationException("更新同步系统状态失败", ex);
            }
            
            // 记录失败详情
            recordSyncFailure(system, "同步异常", e.getMessage(), "0.0秒");
            
            // 记录同步趋势数据
            recordSyncTrend(LocalDateTime.now(), false);
            
            // 检查是否需要发送告警
            checkAndSendAlert(system);
        }
    }

    @Override
    public List<SyncFailure> getRecentFailures(int limit) {
        return syncFailureRepository.findByTimeAfterOrderByTimeDesc(
                LocalDateTime.now().minusDays(7), 
                PageRequest.of(0, limit)
        );
    }

    @Override
    public List<SyncTrendData> getTodayTrend() {
        LocalDate today = LocalDate.now();
        LocalDateTime startOfDay = today.atStartOfDay();
        LocalDateTime endOfDay = today.atTime(LocalTime.MAX);
        
        List<Object[]> trendData = syncTrendRepository.findTodayTrendByHour(startOfDay, endOfDay);
        List<SyncTrendData> result = new ArrayList<>();
        
        for (Object[] data : trendData) {
            result.add(SyncTrendData.builder()
                    .time((String) data[0])
                    .success(((Number) data[1]).intValue())
                    .failure(((Number) data[2]).intValue())
                    .build());
        }
        
        return result;
    }

    @Override
    public SyncStatistics getSyncStatistics() {
        List<SyncSystem> systems = syncSystemRepository.findAll();
        
        int totalSystems = systems.size();
        int runningSystems = 0;
        int failedSystems = 0;
        int totalSuccess = 0;
        int totalFailures = 0;
        
        for (SyncSystem system : systems) {
            if ("running".equals(system.getStatus())) {
                runningSystems++;
            } else if ("failed".equals(system.getStatus())) {
                failedSystems++;
            }
            
            totalSuccess += system.getSuccessCount();
            totalFailures += system.getFailureCount();
        }
        
        // 计算平均耗时
        Double avgTime = syncSystemRepository.calculateAverageTime();
        String avgDuration = avgTime != null ? String.format("%.1f秒", avgTime) : "0.0秒";
        
        return SyncStatistics.builder()
                .totalSystems(totalSystems)
                .runningSystems(runningSystems)
                .failedSystems(failedSystems)
                .totalSuccess(totalSuccess)
                .totalFailures(totalFailures)
                .avgDuration(avgDuration)
                .build();
    }

    @Override
    public AlertConfig getAlertConfig() {
        AlertConfig config = alertConfigRepository.findFirstByOrderById();
        
        // 如果不存在配置，则创建默认配置
        if (config == null) {
            config = AlertConfig.builder()
                    .failureThreshold(3)
                    .emailEnabled(true)
                    .dingTalkEnabled(false)
                    .emailRecipients("admin@company.com")
                    .dingTalkWebhook("")
                    .build();
            
            alertConfigRepository.save(config);
        }
        
        return config;
    }

    @Override
    @Transactional
    public AlertConfig updateAlertConfig(AlertConfig alertConfig) {
        // 获取现有配置或创建新配置
        AlertConfig existingConfig = alertConfigRepository.findFirstByOrderById();
        
        if (existingConfig == null) {
            return alertConfigRepository.save(alertConfig);
        } else {
            existingConfig.setFailureThreshold(alertConfig.getFailureThreshold());
            existingConfig.setEmailEnabled(alertConfig.isEmailEnabled());
            existingConfig.setDingTalkEnabled(alertConfig.isDingTalkEnabled());
            existingConfig.setEmailRecipients(alertConfig.getEmailRecipients());
            existingConfig.setDingTalkWebhook(alertConfig.getDingTalkWebhook());
            
            return alertConfigRepository.save(existingConfig);
        }
    }
    
    /**
     * 执行实际的同步逻辑
     * 根据不同系统类型调用不同的同步实现
     */
    private boolean executeSync(SyncSystem system) {
        // 这里根据系统ID或类型调用不同的同步实现
        switch (system.getId()) {
            case "ad":
                return syncActiveDirectory(system);
            case "erp":
                return syncERP(system);
            case "hr":
                return syncHR(system);
            case "crm":
                return syncCRM(system);
            default:
                log.warn("未知的同步系统类型: {}", system.getId());
                return false;
        }
    }
    
    /**
     * AD域同步实现
     */
    private boolean syncActiveDirectory(SyncSystem system) {
        log.info("执行AD域同步: {}", system.getName());
        // 实际的AD域同步逻辑
        // 这里是模拟实现，实际项目中需要根据具体需求实现
        return Math.random() > 0.1; // 90%成功率
    }
    
    /**
     * ERP系统同步实现
     */
    private boolean syncERP(SyncSystem system) {
        log.info("执行ERP系统同步: {}", system.getName());
        // 实际的ERP系统同步逻辑
        return Math.random() > 0.05; // 95%成功率
    }
    
    /**
     * HR系统同步实现
     */
    private boolean syncHR(SyncSystem system) {
        log.info("执行HR系统同步: {}", system.getName());
        // 实际的HR系统同步逻辑
        return Math.random() > 0.2; // 80%成功率
    }
    
    /**
     * CRM系统同步实现
     */
    private boolean syncCRM(SyncSystem system) {
        log.info("执行CRM系统同步: {}", system.getName());
        // 实际的CRM系统同步逻辑
        return Math.random() > 0.1; // 90%成功率
    }
    
    /**
     * 计算下次同步时间
     */
    private LocalDateTime calculateNextSyncTime(String syncInterval) {
        LocalDateTime now = LocalDateTime.now();
        
        // 根据同步间隔计算下次同步时间
        if (syncInterval.contains("小时")) {
            int hours = Integer.parseInt(syncInterval.split("小时")[0]);
            return now.plusHours(hours);
        } else if (syncInterval.contains("分钟")) {
            int minutes = Integer.parseInt(syncInterval.split("分钟")[0]);
            return now.plusMinutes(minutes);
        } else if (syncInterval.contains("每日")) {
            // 设置为明天的同一时间
            return now.plusDays(1);
        } else if (syncInterval.contains("每周")) {
            // 设置为下周的同一时间
            return now.plusWeeks(1);
        } else if (syncInterval.contains("每月")) {
            // 设置为下月的同一时间
            return now.plusMonths(1);
        } else {
            // 默认1小时
            return now.plusHours(1);
        }
    }
    
    /**
     * 记录同步失败详情
     */
    private void recordSyncFailure(SyncSystem system, String reason, String details, String duration) {
        SyncFailure failure = SyncFailure.builder()
                .systemId(system.getId())
                .systemName(system.getName())
                .time(LocalDateTime.now())
                .reason(reason)
                .details(details)
                .duration(duration)
                .build();
        
        syncFailureRepository.save(failure);
    }
    
    /**
     * 记录同步趋势数据
     */
    private void recordSyncTrend(LocalDateTime time, boolean success) {
        String hourKey = time.format(TIME_FORMATTER);
        
        SyncTrend trend = SyncTrend.builder()
                .time(time)
                .success(success ? 1 : 0)
                .failure(success ? 0 : 1)
                .hourKey(hourKey)
                .build();
        
        syncTrendRepository.save(trend);
    }
    
    /**
     * 检查是否需要发送告警
     */
    private void checkAndSendAlert(SyncSystem system) {
        AlertConfig alertConfig = getAlertConfig();
        
        // 检查连续失败次数是否达到阈值
        int failureThreshold = alertConfig.getFailureThreshold();
        int consecutiveFailures = syncFailureRepository.countBySystemIdAndTimeAfterOrderByTimeDesc(
                system.getId(), 
                LocalDateTime.now().minusDays(1)
        );
        
        if (consecutiveFailures >= failureThreshold) {
            // 获取最近的失败记录
            List<SyncFailure> failures = syncFailureRepository.findBySystemIdAndTimeAfterOrderByTimeDesc(
                    system.getId(),
                    LocalDateTime.now().minusDays(1),
                    PageRequest.of(0, 1)
            );
            
            if (!failures.isEmpty()) {
                SyncFailure latestFailure = failures.get(0);
                
                // 发送告警通知
                if (alertConfig.isEmailEnabled() && alertConfig.getEmailRecipients() != null) {
                    String[] recipients = alertConfig.getEmailRecipients().split(",");
                    emailService.sendSyncFailureAlert(system, latestFailure, consecutiveFailures, recipients);
                }
                
                if (alertConfig.isDingTalkEnabled() && alertConfig.getDingTalkWebhook() != null 
                        && !alertConfig.getDingTalkWebhook().isEmpty()) {
                    dingTalkService.sendSyncFailureAlert(system, latestFailure, consecutiveFailures, 
                            alertConfig.getDingTalkWebhook());
                }
            }
        }
    }
}