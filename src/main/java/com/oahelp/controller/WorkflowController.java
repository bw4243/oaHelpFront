package com.oahelp.controller;

import com.oahelp.entity.SystemLog;
import com.oahelp.entity.User;
import com.oahelp.entity.Workflow;
import com.oahelp.entity.WorkflowNode;
import com.oahelp.payload.ApiResponse;
import com.oahelp.payload.WorkflowRequest;
import com.oahelp.payload.WorkflowResponse;
import com.oahelp.security.CurrentUser;
import com.oahelp.security.UserPrincipal;
import com.oahelp.service.SystemLogService;
import com.oahelp.service.UserService;
import com.oahelp.service.WorkflowService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/workflows")
public class WorkflowController {

    @Autowired
    private WorkflowService workflowService;

    @Autowired
    private UserService userService;
    
    @Autowired
    private SystemLogService systemLogService;

    @PostMapping
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> createWorkflow(@Valid @RequestBody WorkflowRequest workflowRequest,
                                          @CurrentUser UserPrincipal currentUser,
                                          HttpServletRequest request) {
        try {
            User submitter = userService.getUserById(currentUser.getId())
                    .orElseThrow(() -> new RuntimeException("未找到当前用户"));
            
            Workflow workflow = workflowService.createWorkflow(workflowRequest, submitter);
            
            systemLogService.createSuccessLog(
                    SystemLog.OperationType.流程提交,
                    "提交流程: " + workflow.getTitle() + " (编号: " + workflow.getWorkflowCode() + ")",
                    submitter,
                    request.getRemoteAddr()
            );
            
            return ResponseEntity.ok(workflowService.convertToWorkflowResponse(workflow));
        } catch (Exception e) {
            User submitter = userService.getUserById(currentUser.getId())
                    .orElseThrow(() -> new RuntimeException("未找到当前用户"));
            
            systemLogService.createFailureLog(
                    SystemLog.OperationType.流程提交,
                    "提交流程失败: " + workflowRequest.getTitle(),
                    submitter,
                    request.getRemoteAddr(),
                    e.getMessage()
            );
            
            return ResponseEntity.badRequest()
                    .body(new ApiResponse(false, "创建流程失败: " + e.getMessage()));
        }
    }

    @GetMapping("/{workflowCode}")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> getWorkflowByCode(@PathVariable String workflowCode) {
        return workflowService.getWorkflowByCode(workflowCode)
                .map(workflow -> ResponseEntity.ok(workflowService.convertToWorkflowResponse(workflow)))
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/my-submissions")
    @PreAuthorize("hasRole('USER')")
    public List<WorkflowResponse> getMySubmissions(@CurrentUser UserPrincipal currentUser) {
        User submitter = userService.getUserById(currentUser.getId())
                .orElseThrow(() -> new RuntimeException("未找到当前用户"));
        
        return workflowService.getWorkflowsBySubmitter(submitter).stream()
                .map(workflow -> workflowService.convertToWorkflowResponse(workflow))
                .collect(Collectors.toList());
    }

    @GetMapping("/pending-approvals")
    @PreAuthorize("hasRole('USER')")
    public List<WorkflowResponse> getPendingApprovals(@CurrentUser UserPrincipal currentUser) {
        User approver = userService.getUserById(currentUser.getId())
                .orElseThrow(() -> new RuntimeException("未找到当前用户"));
        
        return workflowService.getWorkflowsByApprover(approver).stream()
                .map(workflow -> workflowService.convertToWorkflowResponse(workflow))
                .collect(Collectors.toList());
    }

    @GetMapping("/status/{status}")
    @PreAuthorize("hasRole('USER')")
    public List<WorkflowResponse> getWorkflowsByStatus(@PathVariable String status) {
        try {
            Workflow.WorkflowStatus workflowStatus = Workflow.WorkflowStatus.valueOf(status);
            return workflowService.getWorkflowsByStatus(workflowStatus).stream()
                    .map(workflow -> workflowService.convertToWorkflowResponse(workflow))
                    .collect(Collectors.toList());
        } catch (IllegalArgumentException e) {
            return List.of();
        }
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public Page<WorkflowResponse> getAllWorkflows(Pageable pageable) {
        return workflowService.getAllWorkflows(pageable)
                .map(workflow -> workflowService.convertToWorkflowResponse(workflow));
    }

    @GetMapping("/search")
    @PreAuthorize("hasRole('USER')")
    public Page<WorkflowResponse> searchWorkflows(@RequestParam String keyword, Pageable pageable) {
        return workflowService.searchWorkflows(keyword, pageable)
                .map(workflow -> workflowService.convertToWorkflowResponse(workflow));
    }

    @PostMapping("/{workflowCode}/recall")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> recallWorkflow(@PathVariable String workflowCode,
                                          @RequestParam String reason,
                                          @CurrentUser UserPrincipal currentUser,
                                          HttpServletRequest request) {
        try {
            User operator = userService.getUserById(currentUser.getId())
                    .orElseThrow(() -> new RuntimeException("未找到当前用户"));
            
            Workflow workflow = workflowService.recallWorkflow(workflowCode, operator, reason);
            
            systemLogService.createSuccessLog(
                    SystemLog.OperationType.流程撤回,
                    "撤回流程: " + workflow.getTitle() + " (编号: " + workflow.getWorkflowCode() + ")",
                    operator,
                    request.getRemoteAddr()
            );
            
            return ResponseEntity.ok(workflowService.convertToWorkflowResponse(workflow));
        } catch (Exception e) {
            User operator = userService.getUserById(currentUser.getId())
                    .orElseThrow(() -> new RuntimeException("未找到当前用户"));
            
            systemLogService.createFailureLog(
                    SystemLog.OperationType.流程撤回,
                    "撤回流程失败: " + workflowCode,
                    operator,
                    request.getRemoteAddr(),
                    e.getMessage()
            );
            
            return ResponseEntity.badRequest()
                    .body(new ApiResponse(false, "撤回流程失败: " + e.getMessage()));
        }
    }

    @PostMapping("/{workflowCode}/terminate")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> terminateWorkflow(@PathVariable String workflowCode,
                                             @RequestParam String reason,
                                             @CurrentUser UserPrincipal currentUser,
                                             HttpServletRequest request) {
        try {
            User operator = userService.getUserById(currentUser.getId())
                    .orElseThrow(() -> new RuntimeException("未找到当前用户"));
            
            Workflow workflow = workflowService.terminateWorkflow(workflowCode, operator, reason);
            
            systemLogService.createSuccessLog(
                    SystemLog.OperationType.流程终止,
                    "终止流程: " + workflow.getTitle() + " (编号: " + workflow.getWorkflowCode() + ")",
                    operator,
                    request.getRemoteAddr()
            );
            
            return ResponseEntity.ok(workflowService.convertToWorkflowResponse(workflow));
        } catch (Exception e) {
            User operator = userService.getUserById(currentUser.getId())
                    .orElseThrow(() -> new RuntimeException("未找到当前用户"));
            
            systemLogService.createFailureLog(
                    SystemLog.OperationType.流程终止,
                    "终止流程失败: " + workflowCode,
                    operator,
                    request.getRemoteAddr(),
                    e.getMessage()
            );
            
            return ResponseEntity.badRequest()
                    .body(new ApiResponse(false, "终止流程失败: " + e.getMessage()));
        }
    }

    @PostMapping("/{workflowCode}/nodes/{nodeId}/approve")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> approveNode(@PathVariable String workflowCode,
                                       @PathVariable String nodeId,
                                       @RequestParam String comment,
                                       @CurrentUser UserPrincipal currentUser,
                                       HttpServletRequest request) {
        try {
            User approver = userService.getUserById(currentUser.getId())
                    .orElseThrow(() -> new RuntimeException("未找到当前用户"));
            
            Workflow workflow = workflowService.approveNode(workflowCode, nodeId, approver, comment);
            
            systemLogService.createSuccessLog(
                    SystemLog.OperationType.流程审批,
                    "审批通过流程: " + workflow.getTitle() + " (编号: " + workflow.getWorkflowCode() + ")",
                    approver,
                    request.getRemoteAddr()
            );
            
            return ResponseEntity.ok(workflowService.convertToWorkflowResponse(workflow));
        } catch (Exception e) {
            User approver = userService.getUserById(currentUser.getId())
                    .orElseThrow(() -> new RuntimeException("未找到当前用户"));
            
            systemLogService.createFailureLog(
                    SystemLog.OperationType.流程审批,
                    "审批流程失败: " + workflowCode,
                    approver,
                    request.getRemoteAddr(),
                    e.getMessage()
            );
            
            return ResponseEntity.badRequest()
                    .body(new ApiResponse(false, "审批节点失败: " + e.getMessage()));
        }
    }

    @PostMapping("/{workflowCode}/nodes/{nodeId}/reject")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> rejectNode(@PathVariable String workflowCode,
                                      @PathVariable String nodeId,
                                      @RequestParam String comment,
                                      @CurrentUser UserPrincipal currentUser,
                                      HttpServletRequest request) {
        try {
            User approver = userService.getUserById(currentUser.getId())
                    .orElseThrow(() -> new RuntimeException("未找到当前用户"));
            
            Workflow workflow = workflowService.rejectNode(workflowCode, nodeId, approver, comment);
            
            systemLogService.createSuccessLog(
                    SystemLog.OperationType.流程审批,
                    "拒绝流程: " + workflow.getTitle() + " (编号: " + workflow.getWorkflowCode() + ")",
                    approver,
                    request.getRemoteAddr()
            );
            
            return ResponseEntity.ok(workflowService.convertToWorkflowResponse(workflow));
        } catch (Exception e) {
            User approver = userService.getUserById(currentUser.getId())
                    .orElseThrow(() -> new RuntimeException("未找到当前用户"));
            
            systemLogService.createFailureLog(
                    SystemLog.OperationType.流程审批,
                    "拒绝流程失败: " + workflowCode,
                    approver,
                    request.getRemoteAddr(),
                    e.getMessage()
            );
            
            return ResponseEntity.badRequest()
                    .body(new ApiResponse(false, "拒绝节点失败: " + e.getMessage()));
        }
    }

    @PostMapping("/{workflowCode}/jump")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> jumpToNode(@PathVariable String workflowCode,
                                      @RequestParam String fromNodeId,
                                      @RequestParam String toNodeId,
                                      @RequestParam String reason,
                                      @RequestParam(required = false) String comment,
                                      @RequestParam(required = false) Long newApproverId,
                                      @CurrentUser UserPrincipal currentUser,
                                      HttpServletRequest request) {
        try {
            User operator = userService.getUserById(currentUser.getId())
                    .orElseThrow(() -> new RuntimeException("未找到当前用户"));
            
            User newApprover = null;
            if (newApproverId != null) {
                newApprover = userService.getUserById(newApproverId)
                        .orElseThrow(() -> new RuntimeException("未找到新审批人"));
            }
            
            Workflow workflow = workflowService.jumpToNode(workflowCode, fromNodeId, toNodeId, 
                    operator, reason, comment, newApprover);
            
            systemLogService.createSuccessLog(
                    SystemLog.OperationType.流程跳转,
                    "流程跳转: " + workflow.getTitle() + " (编号: " + workflow.getWorkflowCode() + ")",
                    operator,
                    request.getRemoteAddr()
            );
            
            return ResponseEntity.ok(workflowService.convertToWorkflowResponse(workflow));
        } catch (Exception e) {
            User operator = userService.getUserById(currentUser.getId())
                    .orElseThrow(() -> new RuntimeException("未找到当前用户"));
            
            systemLogService.createFailureLog(
                    SystemLog.OperationType.流程跳转,
                    "流程跳转失败: " + workflowCode,
                    operator,
                    request.getRemoteAddr(),
                    e.getMessage()
            );
            
            return ResponseEntity.badRequest()
                    .body(new ApiResponse(false, "流程跳转失败: " + e.getMessage()));
        }
    }

    @GetMapping("/statistics/count")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> getWorkflowsCount() {
        try {
            return ResponseEntity.ok(
                    List.of(
                            workflowService.countWorkflowsByStatus(Workflow.WorkflowStatus.审批中),
                            workflowService.countWorkflowsByStatus(Workflow.WorkflowStatus.已完成),
                            workflowService.countWorkflowsByStatus(Workflow.WorkflowStatus.已拒绝),
                            workflowService.countWorkflowsByStatus(Workflow.WorkflowStatus.已撤回),
                            workflowService.countWorkflowsByStatus(Workflow.WorkflowStatus.已终止)
                    )
            );
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse(false, "获取流程统计数据失败: " + e.getMessage()));
        }
    }

    @GetMapping("/overdue-nodes")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getOverdueNodes() {
        try {
            List<WorkflowNode> overdueNodes = workflowService.getOverdueNodes();
            return ResponseEntity.ok(overdueNodes.size());
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse(false, "获取超时节点失败: " + e.getMessage()));
        }
    }

    @GetMapping("/time-range")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> getWorkflowsByTimeRange(
            @RequestParam String startTime,
            @RequestParam String endTime) {
        try {
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
            LocalDateTime start = LocalDateTime.parse(startTime, formatter);
            LocalDateTime end = LocalDateTime.parse(endTime, formatter);
            
            List<WorkflowResponse> workflows = workflowService.getWorkflowsByTimeRange(start, end).stream()
                    .map(workflow -> workflowService.convertToWorkflowResponse(workflow))
                    .collect(Collectors.toList());
            
            return ResponseEntity.ok(workflows);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse(false, "获取时间范围内的流程失败: " + e.getMessage()));
        }
    }
}