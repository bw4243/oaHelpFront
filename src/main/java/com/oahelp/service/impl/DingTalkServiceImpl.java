package com.oahelp.service.impl;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.oahelp.entity.SyncFailure;
import com.oahelp.entity.SyncSystem;
import com.oahelp.service.DingTalkService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.thymeleaf.context.Context;
import org.thymeleaf.spring5.SpringTemplateEngine;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.Map;

/**
 * 钉钉服务实现类
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class DingTalkServiceImpl implements DingTalkService {

    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;
    private final SpringTemplateEngine templateEngine;
    
    @Value("${sync.alert.dingtalk.title:OA系统数据同步失败告警}")
    private String title;
    
    @Value("${sync.alert.dingtalk.template:templates/dingtalk/sync-alert.json}")
    private String templatePath;
    
    @Value("${app.url:http://localhost:8080}")
    private String appUrl;

    @Override
    public void sendSyncFailureAlert(SyncSystem system, SyncFailure failure, int consecutiveFailures, String webhookUrl) {
        try {
            // 准备模板变量
            Context context = new Context();
            Map<String, Object> variables = new HashMap<>();
            variables.put("systemName", system.getName());
            variables.put("systemDescription", system.getDescription());
            variables.put("syncType", system.getSyncType());
            variables.put("dataSource", system.getDataSource());
            variables.put("failureTime", formatDateTime(failure.getTime()));
            variables.put("failureReason", failure.getReason());
            variables.put("failureDetails", failure.getDetails());
            variables.put("consecutiveFailures", consecutiveFailures);
            variables.put("systemUrl", appUrl + "/system/sync");
            
            context.setVariables(variables);
            
            // 处理模板
            String templateContent = templateEngine.process(templatePath, context);
            
            // 发送钉钉消息
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            
            HttpEntity<String> request = new HttpEntity<>(templateContent, headers);
            restTemplate.postForEntity(webhookUrl, request, String.class);
            
            log.info("成功发送同步失败告警到钉钉: 系统[{}]", system.getName());
            
        } catch (Exception e) {
            log.error("发送同步失败告警到钉钉时发生错误", e);
        }
    }
    
    /**
     * 格式化日期时间
     */
    private String formatDateTime(LocalDateTime dateTime) {
        if (dateTime == null) {
            return "";
        }
        return dateTime.format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));
    }
}