package com.oahelp.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.oahelp.dto.ApiResponseDTO;
import com.oahelp.dto.BatchDisableRequestDTO;
import com.oahelp.dto.VirtualAccountDTO;
import com.oahelp.dto.VirtualAccountSearchFiltersDTO;
import com.oahelp.dto.VirtualAccountStatsDTO;
import com.oahelp.entity.OperationHistory;
import com.oahelp.service.OperationHistoryService;
import com.oahelp.service.VirtualAccountService;

/**
 * 虚拟账号控制器
 */
@RestController
@RequestMapping("/api/virtual-accounts")
public class VirtualAccountController {
    
    @Autowired
    private VirtualAccountService virtualAccountService;
    
    @Autowired
    private OperationHistoryService operationHistoryService;
    
    /**
     * 根据过滤条件搜索虚拟账号
     * @param filters 过滤条件
     * @return 虚拟账号列表和统计数据
     */
    @PostMapping("/search")
    public ApiResponseDTO<Object> searchAccounts(@RequestBody VirtualAccountSearchFiltersDTO filters) {
        List<VirtualAccountDTO> accounts = virtualAccountService.findByFilters(filters);
        VirtualAccountStatsDTO stats = virtualAccountService.getStats(accounts);
        
        return ApiResponseDTO.success("查询成功", new Object() {
            public final List<VirtualAccountDTO> accounts = accounts;
            public final VirtualAccountStatsDTO stats = stats;
        });
    }
    
    /**
     * 执行虚拟账号检测
     * @param detectionDays 检测天数阈值
     * @param detectionScope 检测范围
     * @param riskLevel 风险等级
     * @param operator 操作人
     * @return 检测结果
     */
    @GetMapping("/detect")
    public ApiResponseDTO<Object> detectAccounts(
            @RequestParam("days") int detectionDays,
            @RequestParam(value = "scope", defaultValue = "all") String detectionScope,
            @RequestParam(value = "risk", defaultValue = "all") String riskLevel,
            @RequestParam(value = "operator", defaultValue = "系统管理员") String operator) {
        
        List<VirtualAccountDTO> accounts = virtualAccountService.detectVirtualAccounts(
                detectionDays, detectionScope, riskLevel, operator);
        VirtualAccountStatsDTO stats = virtualAccountService.getStats(accounts);
        
        return ApiResponseDTO.success("检测完成", new Object() {
            public final List<VirtualAccountDTO> accounts = accounts;
            public final VirtualAccountStatsDTO stats = stats;
        });
    }
    
    /**
     * 批量禁用账号
     * @param request 批量禁用请求
     * @param operator 操作人
     * @return 禁用结果
     */
    @PostMapping("/batch-disable")
    public ApiResponseDTO<Object> batchDisableAccounts(
            @RequestBody BatchDisableRequestDTO request,
            @RequestParam(value = "operator", defaultValue = "系统管理员") String operator) {
        
        int count = virtualAccountService.batchDisableAccounts(request, operator);
        
        return ApiResponseDTO.success("成功禁用 " + count + " 个账号", new Object() {
            public final int disabledCount = count;
        });
    }
    
    /**
     * 禁用单个账号
     * @param id 账号ID
     * @param reason 禁用理由
     * @param operator 操作人
     * @return 禁用结果
     */
    @PostMapping("/{id}/disable")
    public ApiResponseDTO<Object> disableAccount(
            @PathVariable("id") Long id,
            @RequestParam("reason") String reason,
            @RequestParam(value = "operator", defaultValue = "系统管理员") String operator) {
        
        boolean success = virtualAccountService.disableAccount(id, reason, operator);
        
        if (success) {
            return ApiResponseDTO.success("账号禁用成功", null);
        } else {
            return ApiResponseDTO.error("账号不存在或禁用失败");
        }
    }
    
    /**
     * 获取所有部门列表
     * @return 部门列表
     */
    @GetMapping("/departments")
    public ApiResponseDTO<List<String>> getAllDepartments() {
        List<String> departments = virtualAccountService.getAllDepartments();
        return ApiResponseDTO.success(departments);
    /**
     * 获取最近的操作历史记录
     * @param days 天数
     * @return 历史记录列表
     */
    @GetMapping("/operation-history")
    public ApiResponseDTO<List<OperationHistory>> getOperationHistory(
            @RequestParam(value = "days", defaultValue = "30") int days) {
        
        List<OperationHistory> history = operationHistoryService.getRecentHistory(days);
        return ApiResponseDTO.success(history);
    }
}
}