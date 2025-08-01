package com.oahelp.scheduler;

import com.oahelp.entity.SyncSystem;
import com.oahelp.service.SyncService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;

/**
 * 数据同步定时任务
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class SyncScheduler {

    private final SyncService syncService;
    
    /**
     * 每分钟检查一次需要执行的同步任务
     */
    @Scheduled(fixedRate = 60000)
    public void checkAndExecuteSyncTasks() {
        log.debug("检查需要执行的同步任务...");
        
        List<SyncSystem> systems = syncService.getAllSyncSystems();
        LocalDateTime now = LocalDateTime.now();
        
        for (SyncSystem system : systems) {
            // 只处理已启用且不在运行中的系统
            if (system.isEnabled() && !"running".equals(system.getStatus())) {
                // 检查是否到达下次同步时间
                if (system.getNextSyncTime() != null && now.isAfter(system.getNextSyncTime())) {
                    log.info("触发定时同步任务: {}", system.getName());
                    syncService.triggerSync(system.getId());
                }
            }
        }
    }
    
    /**
     * 每天凌晨1点执行数据清理任务
     */
    @Scheduled(cron = "0 0 1 * * ?")
    public void cleanupOldData() {
        log.info("执行数据清理任务...");
        
        // 这里可以实现清理过期数据的逻辑
        // 例如删除30天前的同步趋势数据、90天前的失败记录等
    }
}