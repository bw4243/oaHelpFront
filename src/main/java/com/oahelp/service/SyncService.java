package com.oahelp.service;

import com.oahelp.entity.AlertConfig;
import com.oahelp.entity.SyncFailure;
import com.oahelp.entity.SyncSystem;
import com.oahelp.payload.SyncStatistics;
import com.oahelp.payload.SyncTrendData;

import java.util.List;
import java.util.Map;

/**
 * 数据同步服务接口
 */
public interface SyncService {
    
    /**
     * 获取所有同步系统
     */
    List<SyncSystem> getAllSyncSystems();
    
    /**
     * 获取同步系统详情
     */
    SyncSystem getSyncSystemById(String id);
    
    /**
     * 更新同步系统状态
     */
    SyncSystem updateSyncSystemStatus(String id, boolean enabled);
    
    /**
     * 手动触发同步
     */
    void triggerSync(String id);
    
    /**
     * 获取最近失败记录
     */
    List<SyncFailure> getRecentFailures(int limit);
    
    /**
     * 获取今日同步趋势数据
     */
    List<SyncTrendData> getTodayTrend();
    
    /**
     * 获取同步统计数据
     */
    SyncStatistics getSyncStatistics();
    
    /**
     * 获取告警配置
     */
    AlertConfig getAlertConfig();
    
    /**
     * 更新告警配置
     */
    AlertConfig updateAlertConfig(AlertConfig alertConfig);
}