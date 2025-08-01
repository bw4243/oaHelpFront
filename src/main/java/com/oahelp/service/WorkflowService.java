package com.oahelp.service;

import com.oahelp.entity.User;
import com.oahelp.entity.Workflow;
import com.oahelp.entity.WorkflowNode;
import com.oahelp.payload.WorkflowRequest;
import com.oahelp.payload.WorkflowResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface WorkflowService {
    
    // 创建新工作流
    Workflow createWorkflow(WorkflowRequest workflowRequest, User submitter);
    
    // 获取工作流详情
    Optional<Workflow> getWorkflowById(Long id);
    
    // 根据工作流编码获取工作流
    Optional<Workflow> getWorkflowByCode(String workflowCode);
    
    // 获取用户提交的工作流
    List<Workflow> getWorkflowsBySubmitter(User submitter);
    
    // 获取待用户审批的工作流
    List<Workflow> getWorkflowsByApprover(User approver);
    
    // 获取特定状态的工作流
    List<Workflow> getWorkflowsByStatus(Workflow.WorkflowStatus status);
    
    // 分页查询工作流
    Page<Workflow> getAllWorkflows(Pageable pageable);
    
    // 搜索工作流
    Page<Workflow> searchWorkflows(String keyword, Pageable pageable);
    
    // 撤回工作流
    Workflow recallWorkflow(String workflowCode, User operator, String reason);
    
    // 终止工作流
    Workflow terminateWorkflow(String workflowCode, User operator, String reason);
    
    // 审批工作流节点
    Workflow approveNode(String workflowCode, String nodeId, User approver, String comment);
    
    // 拒绝工作流节点
    Workflow rejectNode(String workflowCode, String nodeId, User approver, String comment);
    
    // 跳转工作流节点
    Workflow jumpToNode(String workflowCode, String fromNodeId, String toNodeId, 
                        User operator, String reason, String comment, User newApprover);
    
    // 获取工作流统计数据
    long countWorkflowsByStatus(Workflow.WorkflowStatus status);
    
    // 获取超时的工作流节点
    List<WorkflowNode> getOverdueNodes();
    
    // 将工作流数据转换为前端响应格式
    WorkflowResponse convertToWorkflowResponse(Workflow workflow);
    
    // 获取指定时间范围内的工作流
    List<Workflow> getWorkflowsByTimeRange(LocalDateTime startTime, LocalDateTime endTime);
}