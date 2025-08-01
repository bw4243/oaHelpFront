package com.oahelp.service;

import com.oahelp.entity.SyncFailure;
import com.oahelp.entity.SyncSystem;

/**
 * 钉钉服务接口
 */
public interface DingTalkService {
    
    /**
     * 发送同步失败告警到钉钉
     * 
     * @param system 同步系统
     * @param failure 失败记录
     * @param consecutiveFailures 连续失败次数
     * @param webhookUrl 钉钉机器人Webhook地址
     */
    void sendSyncFailureAlert(SyncSystem system, SyncFailure failure, int consecutiveFailures, String webhookUrl);
}