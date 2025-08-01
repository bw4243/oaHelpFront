package com.oahelp.controller;

import com.oahelp.entity.AlertConfig;
import com.oahelp.entity.SyncFailure;
import com.oahelp.entity.SyncSystem;
import com.oahelp.payload.ApiResponse;
import com.oahelp.payload.SyncStatistics;
import com.oahelp.payload.SyncTrendData;
import com.oahelp.service.SyncService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 数据同步控制器
 */
@RestController
@RequestMapping("/api/sync")
@RequiredArgsConstructor
public class SyncController {

    private final SyncService syncService;

    /**
     * 获取所有同步系统
     */
    @GetMapping("/systems")
    public ResponseEntity<List<SyncSystem>> getAllSyncSystems() {
        return ResponseEntity.ok(syncService.getAllSyncSystems());
    }

    /**
     * 获取同步系统详情
     */
    @GetMapping("/systems/{id}")
    public ResponseEntity<SyncSystem> getSyncSystem(@PathVariable String id) {
        return ResponseEntity.ok(syncService.getSyncSystemById(id));
    }

    /**
     * 更新同步系统状态
     */
    @PutMapping("/systems/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<SyncSystem> updateSyncSystemStatus(
            @PathVariable String id,
            @RequestParam boolean enabled) {
        return ResponseEntity.ok(syncService.updateSyncSystemStatus(id, enabled));
    }

    /**
     * 手动触发同步
     */
    @PostMapping("/systems/{id}/trigger")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse> triggerSync(@PathVariable String id) {
        syncService.triggerSync(id);
        return ResponseEntity.ok(new ApiResponse(true, "同步任务已触发"));
    }

    /**
     * 获取最近失败记录
     */
    @GetMapping("/failures")
    public ResponseEntity<List<SyncFailure>> getRecentFailures(
            @RequestParam(defaultValue = "10") int limit) {
        return ResponseEntity.ok(syncService.getRecentFailures(limit));
    }

    /**
     * 获取今日同步趋势数据
     */
    @GetMapping("/trend")
    public ResponseEntity<List<SyncTrendData>> getTodayTrend() {
        return ResponseEntity.ok(syncService.getTodayTrend());
    }

    /**
     * 获取同步统计数据
     */
    @GetMapping("/statistics")
    public ResponseEntity<SyncStatistics> getSyncStatistics() {
        return ResponseEntity.ok(syncService.getSyncStatistics());
    }

    /**
     * 获取告警配置
     */
    @GetMapping("/alert-config")
    public ResponseEntity<AlertConfig> getAlertConfig() {
        return ResponseEntity.ok(syncService.getAlertConfig());
    }

    /**
     * 更新告警配置
     */
    @PutMapping("/alert-config")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<AlertConfig> updateAlertConfig(@RequestBody AlertConfig alertConfig) {
        return ResponseEntity.ok(syncService.updateAlertConfig(alertConfig));
    }
}