package com.oahelp.service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.oahelp.dto.BatchDisableRequestDTO;
import com.oahelp.dto.VirtualAccountDTO;
import com.oahelp.dto.VirtualAccountSearchFiltersDTO;
import com.oahelp.dto.VirtualAccountStatsDTO;
import com.oahelp.entity.VirtualAccount;
import com.oahelp.exception.BusinessException;
import com.oahelp.repository.VirtualAccountRepository;
import com.oahelp.service.OperationHistoryService;

@Service
public class VirtualAccountService {
    
    @Autowired
    private VirtualAccountRepository virtualAccountRepository;
    
    @Autowired
    private OperationHistoryService operationHistoryService;
    
    /**
     * 根据过滤条件查询虚拟账号
     * @param filters 过滤条件
     * @return 虚拟账号DTO列表
     */
    public List<VirtualAccountDTO> findByFilters(VirtualAccountSearchFiltersDTO filters) {
        List<VirtualAccount> accounts = virtualAccountRepository.findByFilters(
                filters.getSource(),
                filters.getDepartment(),
                filters.getRiskLevel(),
                filters.getKeyword());
        
        // 如果需要按最后登录天数过滤
        if (!"all".equals(filters.getLastLoginDays())) {
            int days = Integer.parseInt(filters.getLastLoginDays());
            accounts = accounts.stream()
                    .filter(account -> account.getDaysSinceLastLogin() >= days)
                    .collect(Collectors.toList());
        }
        
        return accounts.stream()
                .map(VirtualAccountDTO::fromEntity)
                .collect(Collectors.toList());
    }
    
    /**
     * 获取虚拟账号统计数据
     * @param accounts 虚拟账号DTO列表
     * @return 统计数据DTO
     */
    public VirtualAccountStatsDTO getStats(List<VirtualAccountDTO> accounts) {
        VirtualAccountStatsDTO stats = new VirtualAccountStatsDTO();
        stats.setTotal(accounts.size());
        stats.setHighRisk((int) accounts.stream().filter(a -> "高".equals(a.getRiskLevel())).count());
        stats.setMediumRisk((int) accounts.stream().filter(a -> "中".equals(a.getRiskLevel())).count());
        stats.setLowRisk((int) accounts.stream().filter(a -> "低".equals(a.getRiskLevel())).count());
        stats.setNeverLogin((int) accounts.stream().filter(a -> "从未登录".equals(a.getLastLoginTime())).count());
        stats.setLongInactive((int) accounts.stream().filter(a -> a.getDaysSinceLastLogin() > 60).count());
        stats.setApiGenerated((int) accounts.stream().filter(a -> "接口生成".equals(a.getSource())).count());
        return stats;
    }
    
    /**
     * 执行虚拟账号检测
     * @param detectionDays 检测天数阈值
     * @param detectionScope 检测范围
     * @param riskLevel 风险等级
     * @param operator 操作人
     * @return 检测到的虚拟账号DTO列表
     */
    public List<VirtualAccountDTO> detectVirtualAccounts(int detectionDays, String detectionScope, String riskLevel, String operator) {
        LocalDateTime thresholdDate = LocalDateTime.now().minusDays(detectionDays);
        List<VirtualAccount> accounts = virtualAccountRepository.findByLastLoginTimeBefore(thresholdDate);
        
        // 根据检测范围过滤
        if (!"all".equals(detectionScope)) {
            accounts = accounts.stream()
                    .filter(account -> detectionScope.equals(account.getSource()))
                    .collect(Collectors.toList());
        }
        
        // 根据风险等级过滤
        if ("high".equals(riskLevel)) {
            accounts = accounts.stream()
                    .filter(account -> "高".equals(account.getRiskLevel()))
                    .collect(Collectors.toList());
        } else if ("medium".equals(riskLevel)) {
            accounts = accounts.stream()
                    .filter(account -> "高".equals(account.getRiskLevel()) || "中".equals(account.getRiskLevel()))
                    .collect(Collectors.toList());
        }
        
        // 更新风险等级
        accounts.forEach(account -> {
            int days = account.getDaysSinceLastLogin();
            if (days > 90 || account.getLoginCount() == 0) {
                account.setRiskLevel("高");
            } else if (days > 60) {
                account.setRiskLevel("中");
            } else if (days > 30) {
                account.setRiskLevel("低");
            }
            virtualAccountRepository.save(account);
        });
        
        // 记录操作历史
        operationHistoryService.recordDetection(detectionDays, detectionScope, riskLevel, accounts.size(), operator);
        
        return accounts.stream()
                .map(VirtualAccountDTO::fromEntity)
                .collect(Collectors.toList());
    }
    
    /**
     * 批量禁用账号
     * @param request 批量禁用请求
     * @param operator 操作人
     * @return 禁用的账号数量
     */
    @Transactional
    public int batchDisableAccounts(BatchDisableRequestDTO request, String operator) {
        if (request.getAccountIds() == null || request.getAccountIds().isEmpty()) {
            throw new BusinessException("账号ID列表不能为空");
        }
        
        if (request.getDisableReason() == null || request.getDisableReason().trim().isEmpty()) {
            throw new BusinessException("禁用理由不能为空");
        }
        
        List<Long> ids = request.getAccountIds().stream()
                .map(Long::parseLong)
                .collect(Collectors.toList());
        
        List<VirtualAccount> accounts = new ArrayList<>();
        for (Long id : ids) {
            Optional<VirtualAccount> accountOpt = virtualAccountRepository.findById(id);
            if (accountOpt.isPresent()) {
                VirtualAccount account = accountOpt.get();
                account.setStatus("禁用");
                accounts.add(account);
            }
        }
        
        virtualAccountRepository.saveAll(accounts);
        
        // 记录操作历史
        operationHistoryService.recordDisableAccounts(request.getAccountIds(), request.getDisableReason(), operator);
        
        return accounts.size();
    }
    
    /**
     * 禁用单个账号
     * @param id 账号ID
     * @param reason 禁用理由
     * @param operator 操作人
     * @return 是否成功
     */
    @Transactional
    public boolean disableAccount(Long id, String reason, String operator) {
        if (reason == null || reason.trim().isEmpty()) {
            throw new BusinessException("禁用理由不能为空");
        }
        
        Optional<VirtualAccount> accountOpt = virtualAccountRepository.findById(id);
        if (accountOpt.isPresent()) {
            VirtualAccount account = accountOpt.get();
            account.setStatus("禁用");
            virtualAccountRepository.save(account);
            
            // 记录操作历史
            operationHistoryService.recordDisableAccount(
                    id.toString(), account.getUsername(), reason, operator);
            
            return true;
        }
        return false;
    }
    
    /**
     * 获取所有部门列表
     * @return 部门列表
     */
    public List<String> getAllDepartments() {
        return virtualAccountRepository.findAll().stream()
                .map(VirtualAccount::getDepartment)
                .distinct()
                .collect(Collectors.toList());
    }
}