package com.oahelp.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.oahelp.dto.ApiResponseDTO;
import com.oahelp.dto.BatchTransferRequestDTO;
import com.oahelp.dto.BatchVoidRequestDTO;
import com.oahelp.dto.SearchFiltersDTO;
import com.oahelp.entity.LeftUser;
import com.oahelp.entity.OperationHistory;
import com.oahelp.entity.TransferTarget;
import com.oahelp.service.LeftUserService;
import com.oahelp.service.WorkflowCleanupService;

/**
 * 工作流清理控制器
 */
@RestController
@RequestMapping("/api/workflow/cleanup")
public class WorkflowCleanupController {
    
    @Autowired
    private LeftUserService leftUserService;
    
    @Autowired
    private WorkflowCleanupService workflowCleanupService;
    
    /**
     * 获取离职用户列表
     */
    @GetMapping("/left-users")
    public ResponseEntity<ApiResponseDTO<List<LeftUser>>> getLeftUsers(SearchFiltersDTO filters) {
        List<LeftUser> users = leftUserService.getLeftUsersByFilters(
                filters.getDepartment(), 
                filters.getLeaveDate(), 
                filters.getWorkflowType(), 
                filters.getKeyword());
        
        return ResponseEntity.ok(ApiResponseDTO.success(users));
    }
    
    /**
     * 获取转交目标列表
     */
    @GetMapping("/transfer-targets")
    public ResponseEntity<ApiResponseDTO<List<TransferTarget>>> getTransferTargets() {
        List<TransferTarget> targets = workflowCleanupService.getAllTransferTargets();
        return ResponseEntity.ok(ApiResponseDTO.success(targets));
    }
    
    /**
     * 获取操作历史
     */
    @GetMapping("/operation-history")
    public ResponseEntity<ApiResponseDTO<List<OperationHistory>>> getOperationHistory() {
        List<OperationHistory> history = workflowCleanupService.getRecentOperationHistory();
        return ResponseEntity.ok(ApiResponseDTO.success(history));
    }
    
    /**
     * 批量转交待办流程
     */
    @PostMapping("/batch-transfer")
    public ResponseEntity<ApiResponseDTO<OperationHistory>> batchTransfer(@RequestBody BatchTransferRequestDTO request) {
        OperationHistory history = workflowCleanupService.batchTransferWorkflows(
                request.getSourceUserIds(), 
                request.getTargetUserId(), 
                request.getTransferReason(), 
                request.getOperator());
        
        return ResponseEntity.ok(ApiResponseDTO.success("批量转交成功", history));
    }
    
    /**
     * 批量作废待办流程
     */
    @PostMapping("/batch-void")
    public ResponseEntity<ApiResponseDTO<OperationHistory>> batchVoid(@RequestBody BatchVoidRequestDTO request) {
        OperationHistory history = workflowCleanupService.batchVoidWorkflows(
                request.getUserIds(), 
                request.getOperator());
        
        return ResponseEntity.ok(ApiResponseDTO.success("批量作废成功", history));
    }
}