package com.oahelp.service.impl;

import com.oahelp.entity.SyncFailure;
import com.oahelp.entity.SyncSystem;
import com.oahelp.service.EmailService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ClassPathResource;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.thymeleaf.context.Context;
import org.thymeleaf.spring5.SpringTemplateEngine;

import javax.mail.MessagingException;
import javax.mail.internet.MimeMessage;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.time.Year;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.Map;

/**
 * 邮件服务实现类
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class EmailServiceImpl implements EmailService {

    private final JavaMailSender mailSender;
    private final SpringTemplateEngine templateEngine;
    
    @Value("${sync.alert.mail.from:noreply@company.com}")
    private String fromAddress;
    
    @Value("${sync.alert.mail.subject:[OA系统] 数据同步失败告警}")
    private String subject;
    
    @Value("${sync.alert.mail.template:templates/mail/sync-alert.html}")
    private String templatePath;
    
    @Value("${app.url:http://localhost:8080}")
    private String appUrl;

    @Override
    public void sendSyncFailureAlert(SyncSystem system, SyncFailure failure, int consecutiveFailures, String[] recipients) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, 
                    MimeMessageHelper.MULTIPART_MODE_MIXED_RELATED, 
                    StandardCharsets.UTF_8.name());
            
            // 设置邮件基本信息
            helper.setFrom(fromAddress);
            helper.setTo(recipients);
            helper.setSubject(subject);
            
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
            variables.put("currentYear", Year.now().getValue());
            
            context.setVariables(variables);
            
            // 处理模板
            String emailContent = templateEngine.process(templatePath, context);
            helper.setText(emailContent, true);
            
            // 发送邮件
            mailSender.send(message);
            
            log.info("成功发送同步失败告警邮件: 系统[{}], 接收人: {}", system.getName(), String.join(", ", recipients));
            
        } catch (MessagingException e) {
            log.error("发送同步失败告警邮件时发生错误", e);
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