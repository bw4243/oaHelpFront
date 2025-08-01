package com.oahelp.config;

import com.oahelp.entity.SystemLog;
import com.oahelp.repository.SystemLogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;

import java.time.LocalDateTime;
import java.util.Arrays;

/**
 * 系统日志数据初始化类
 */
@Configuration
@RequiredArgsConstructor
public class LogDataInitializer {

    private final SystemLogRepository systemLogRepository;

    /**
     * 初始化示例日志数据
     */
    @Bean
    @Profile("dev")
    public CommandLineRunner initLogData() {
        return args -> {
            // 检查是否已有日志数据
            if (systemLogRepository.count() > 0) {
                return;
            }

            // 创建示例日志数据
            SystemLog log1 = SystemLog.builder()
                    .type("系统异常")
                    .level("ERROR")
                    .time(LocalDateTime.now().minusMinutes(30))
                    .source("WorkflowEngine")
                    .message("流程引擎执行异常：无法连接到数据库")
                    .details("java.sql.SQLException: Connection timeout after 30000ms\n  at com.workflow.engine.DatabaseManager.getConnection(DatabaseManager.java:45)\n  at com.workflow.engine.ProcessExecutor.execute(ProcessExecutor.java:123)")
                    .user("系统")
                    .ip("192.168.1.100")
                    .build();

            SystemLog log2 = SystemLog.builder()
                    .type("慢SQL")
                    .level("WARN")
                    .time(LocalDateTime.now().minusMinutes(35))
                    .source("DatabaseMonitor")
                    .message("慢查询检测：查询执行时间超过5秒")
                    .details("SQL: SELECT * FROM workflow_instance w LEFT JOIN workflow_node n ON w.id = n.workflow_id WHERE w.status = 'RUNNING' AND w.create_time > '2024-01-01'\nExecution Time: 8.5s\nRows Examined: 125,000")
                    .user("系统")
                    .ip("192.168.1.101")
                    .build();

            SystemLog log3 = SystemLog.builder()
                    .type("登录记录")
                    .level("INFO")
                    .time(LocalDateTime.now().minusMinutes(40))
                    .source("AuthenticationService")
                    .message("用户登录成功")
                    .details("用户名: zhangsan\n登录方式: 用户名密码\n浏览器: Chrome 120.0.0.0\n操作系统: Windows 10")
                    .user("张三")
                    .ip("192.168.1.50")
                    .build();

            SystemLog log4 = SystemLog.builder()
                    .type("系统异常")
                    .level("ERROR")
                    .time(LocalDateTime.now().minusMinutes(45))
                    .source("EmailService")
                    .message("邮件发送失败")
                    .details("javax.mail.MessagingException: Could not connect to SMTP host: smtp.company.com, port: 587\n  at com.sun.mail.smtp.SMTPTransport.openServer(SMTPTransport.java:2118)\n  at com.notification.EmailSender.send(EmailSender.java:67)")
                    .user("系统")
                    .ip("192.168.1.100")
                    .build();

            SystemLog log5 = SystemLog.builder()
                    .type("登录记录")
                    .level("WARN")
                    .time(LocalDateTime.now().minusMinutes(50))
                    .source("AuthenticationService")
                    .message("用户登录失败：密码错误")
                    .details("用户名: admin\n失败原因: 密码错误\n尝试次数: 3\n浏览器: Firefox 121.0\n操作系统: macOS 14.0")
                    .user("admin")
                    .ip("192.168.1.25")
                    .build();

            SystemLog log6 = SystemLog.builder()
                    .type("慢SQL")
                    .level("WARN")
                    .time(LocalDateTime.now().minusMinutes(55))
                    .source("DatabaseMonitor")
                    .message("慢查询检测：复杂关联查询性能问题")
                    .details("SQL: SELECT u.*, d.name as dept_name, COUNT(w.id) as workflow_count FROM users u LEFT JOIN departments d ON u.dept_id = d.id LEFT JOIN workflow_instance w ON u.id = w.submitter_id GROUP BY u.id ORDER BY workflow_count DESC\nExecution Time: 12.3s\nRows Examined: 50,000")
                    .user("系统")
                    .ip("192.168.1.101")
                    .build();

            SystemLog log7 = SystemLog.builder()
                    .type("系统异常")
                    .level("ERROR")
                    .time(LocalDateTime.now().minusHours(1))
                    .source("FileUploadService")
                    .message("文件上传服务异常：磁盘空间不足")
                    .details("java.io.IOException: No space left on device\n  at java.io.FileOutputStream.writeBytes(Native Method)\n  at com.file.FileUploadHandler.saveFile(FileUploadHandler.java:89)\nDisk Usage: 98.5% (195GB/200GB)")
                    .user("李四")
                    .ip("192.168.1.75")
                    .build();

            SystemLog log8 = SystemLog.builder()
                    .type("登录记录")
                    .level("INFO")
                    .time(LocalDateTime.now().minusHours(1).minusMinutes(5))
                    .source("AuthenticationService")
                    .message("用户退出登录")
                    .details("用户名: wangwu\n登录时长: 2小时15分钟\n浏览器: Edge 120.0.0.0\n操作系统: Windows 11")
                    .user("王五")
                    .ip("192.168.1.88")
                    .build();

            // 保存示例日志数据
            systemLogRepository.saveAll(Arrays.asList(log1, log2, log3, log4, log5, log6, log7, log8));
        };
    }
}