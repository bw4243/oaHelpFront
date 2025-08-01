package com.oahelp.service;

import com.oahelp.entity.SyncFailure;
import com.oahelp.entity.SyncSystem;

/**
 * 邮件服务接口
 */
public interface EmailService {
    
    /**
     * 发送同步失败告警邮件
     * 
     * @param system 同步系统
     * @param failure 失败记录
     * @param consecutiveFailures 连续失败次数
     * @param recipients 收件人列表
     */
    void sendSyncFailureAlert(SyncSystem system, SyncFailure failure, int consecutiveFailures, String[] recipients);
}