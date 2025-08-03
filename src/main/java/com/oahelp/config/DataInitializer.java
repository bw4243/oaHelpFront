package com.oahelp.config;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;

import com.oahelp.entity.VirtualAccount;
import com.oahelp.repository.VirtualAccountRepository;

/**
 * 数据初始化配置
 */
@Configuration
public class DataInitializer {
    
    @Autowired
    private VirtualAccountRepository virtualAccountRepository;
    
    /**
     * 初始化虚拟账号测试数据
     */
    @Bean
    @Profile("dev")
    public CommandLineRunner initVirtualAccountData() {
        return args -> {
            // 检查是否已有数据
            if (virtualAccountRepository.count() > 0) {
                return;
            }
            
            // 创建测试数据
            List<VirtualAccount> accounts = Arrays.asList(
                createAccount("test_user_001", "测试用户001", "技术部", 
                        LocalDateTime.now().minusDays(120), 
                        LocalDateTime.now().minusDays(27), 5, 
                        "接口生成", "AD域同步接口", "中", "启用", 
                        "test001@company.com", "系统接口"),
                        
                createAccount("temp_admin_002", "临时管理员002", "IT部", 
                        LocalDateTime.now().minusDays(180), 
                        LocalDateTime.now().minusDays(47), 2, 
                        "手动创建", "管理员手动创建", "高", "启用", 
                        "temp002@company.com", "张管理员"),
                        
                createAccount("service_account_003", "服务账号003", "系统服务", 
                        LocalDateTime.now().minusDays(90), 
                        null, 0, 
                        "接口生成", "自动化脚本创建", "高", "启用", 
                        "service003@company.com", "自动化系统"),
                        
                createAccount("guest_user_004", "访客用户004", "外部访客", 
                        LocalDateTime.now().minusDays(60), 
                        LocalDateTime.now().minusDays(6), 12, 
                        "手动创建", "前台手动创建", "低", "启用", 
                        "guest004@company.com", "前台接待"),
                        
                createAccount("backup_admin_005", "备份管理员005", "IT部", 
                        LocalDateTime.now().minusDays(150), 
                        LocalDateTime.now().minusDays(93), 1, 
                        "接口生成", "备份系统接口", "高", "启用", 
                        "backup005@company.com", "备份系统"),
                        
                createAccount("demo_user_006", "演示用户006", "市场部", 
                        LocalDateTime.now().minusDays(50), 
                        LocalDateTime.now().minusDays(22), 8, 
                        "手动创建", "演示需要创建", "中", "启用", 
                        "demo006@company.com", "市场经理")
            );
            
            // 保存测试数据
            virtualAccountRepository.saveAll(accounts);
            System.out.println("已初始化虚拟账号测试数据");
        };
    }
    
    /**
     * 创建虚拟账号
     */
    private VirtualAccount createAccount(String username, String displayName, String department, 
                                        LocalDateTime createTime, LocalDateTime lastLoginTime, 
                                        int loginCount, String source, String sourceDetail, 
                                        String riskLevel, String status, String email, String creator) {
        VirtualAccount account = new VirtualAccount();
        account.setUsername(username);
        account.setDisplayName(displayName);
        account.setDepartment(department);
        account.setCreateTime(createTime);
        account.setLastLoginTime(lastLoginTime);
        account.setLoginCount(loginCount);
        account.setSource(source);
        account.setSourceDetail(sourceDetail);
        account.setRiskLevel(riskLevel);
        account.setStatus(status);
        account.setEmail(email);
        account.setCreator(creator);
        account.updateUsageFrequency();
        return account;
    }
}