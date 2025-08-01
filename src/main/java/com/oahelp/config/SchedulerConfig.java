package com.oahelp.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.annotation.EnableScheduling;

/**
 * 定时任务配置类
 */
@Configuration
@EnableScheduling
@EnableAsync
public class SchedulerConfig {
    // 启用定时任务和异步执行功能
}