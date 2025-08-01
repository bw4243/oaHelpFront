package com.oahelp.service.impl;

import com.oahelp.entity.*;
import com.oahelp.payload.UserSummary;
import com.oahelp.payload.WorkflowRequest;
import com.oahelp.payload.WorkflowResponse;
import com.oahelp.repository.*;
import com.oahelp.service.UserService;
import com.oahelp.service.WorkflowService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class WorkflowServiceImpl implements WorkflowService {

    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

    @Autowired
    private WorkflowRepository workflowRepository;

    @Autowired
    private WorkflowNodeRepository nodeRepository;

    @Autowired
    private WorkflowConnectionRepository connectionRepository;

    @Autowired
    private WorkflowHistoryRepository historyRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserService userService;

    @Override
    @Transactional
    public Workflow createWorkflow(WorkflowRequest workflowRequest, User submitter) {
        // 生成工作流编码
        String workflowCode = generateWorkflowCode(workflowRequest.getType());
        
        // 创建工作流
        Workflow workflow = new Workflow();
        workflow.setWorkflowCode(workflowCode);
        workflow.setTitle(workflowRequest.getTitle());
        workflow.setType(workflowRequest.getType());
        workflow.setSubmitter(submitter);
        workflow.setSubmitTime(LocalDateTime.now());
        workflow.setStatus(Workflow.WorkflowStatus.审批中);
        
        // 保存工作流以获取ID
        workflow = workflowRepository.save(workflow);
        
        // 创建节点
        Map<String, WorkflowNode> nodeMap = new HashMap<>();
        for (WorkflowRequest.WorkflowNodeRequest nodeRequest : workflowRequest.getNodes()) {
            WorkflowNode node = new WorkflowNode();
            node.setNodeId(nodeRequest.getNodeId());
            node.setName(nodeRequest.getName());
            node.setType(WorkflowNode.NodeType.valueOf(nodeRequest.getType()));
            node.setWorkflow(workflow);
            node.setPositionX(nodeRequest.getPositionX());
            node.setPositionY(nodeRequest.getPositionY());
            
            // 设置节点状态
            if (node.getType() == WorkflowNode.NodeType.start) {
                node.setStatus(WorkflowNode.NodeStatus.completed);
                node.setCompletedTime(LocalDateTime.now());
                node.setApprover(submitter);
            } else if (node.getType() == WorkflowNode.NodeType.approval) {
                // 第一个审批节点设置为pending，其他为waiting
                if (nodeMap.isEmpty() || nodeMap.values().stream()
                        .noneMatch(n -> n.getType() == WorkflowNode.NodeType.approval && 
                                n.getStatus() == WorkflowNode.NodeStatus.pending)) {
                    node.setStatus(WorkflowNode.NodeStatus.pending);
                    node.setReceivedTime(LocalDateTime.now());
                    // 设置截止时间为3天后
                    node.setDeadline(LocalDateTime.now().plusDays(3));
                    workflow.setCurrentNodeId(node.getNodeId());
                } else {
                    node.setStatus(WorkflowNode.NodeStatus.waiting);
                }
                
                // 设置审批人
                if (nodeRequest.getApproverId() != null) {
                    userRepository.findById(nodeRequest.getApproverId())
                            .ifPresent(node::setApprover);
                }
            } else {
                node.setStatus(WorkflowNode.NodeStatus.waiting);
            }
            
            nodeRepository.save(node);
            nodeMap.put(node.getNodeId(), node);
        }
        
        // 创建连接
        for (WorkflowRequest.WorkflowConnectionRequest connRequest : workflowRequest.getConnections()) {
            WorkflowConnection connection = new WorkflowConnection();
            connection.setFromNodeId(connRequest.getFromNodeId());
            connection.setToNodeId(connRequest.getToNodeId());
            connection.setWorkflow(workflow);
            connectionRepository.save(connection);
        }
        
        // 创建提交历史记录
        WorkflowNode startNode = nodeMap.values().stream()
                .filter(n -> n.getType() == WorkflowNode.NodeType.start)
                .findFirst()
                .orElse(null);
        
        if (startNode != null) {
            WorkflowHistory history = new WorkflowHistory();
            history.setNodeId(startNode.getNodeId());
            history.setNodeName(startNode.getName());
            history.setApprover(submitter);
            history.setAction(WorkflowHistory.ActionType.提交);
            history.setActionTime(LocalDateTime.now());
            history.setComment(workflowRequest.getContent());
            history.setStatus(WorkflowNode.NodeStatus.completed);
            history.setWorkflow(workflow);
            historyRepository.save(history);
        }
        
        return workflow;
    }

    @Override
    public Optional<Workflow> getWorkflowById(Long id) {
        return workflowRepository.findById(id);
    }

    @Override
    public Optional<Workflow> getWorkflowByCode(String workflowCode) {
        return workflowRepository.findByWorkflowCode(workflowCode);
    }

    @Override
    public List<Workflow> getWorkflowsBySubmitter(User submitter) {
        return workflowRepository.findBySubmitter(submitter);
    }

    @Override
    public List<Workflow> getWorkflowsByApprover(User approver) {
        return workflowRepository.findByApproverAndNodeStatus(approver, WorkflowNode.NodeStatus.pending);
    }

    @Override
    public List<Workflow> getWorkflowsByStatus(Workflow.WorkflowStatus status) {
        return workflowRepository.findByStatus(status);
    }

    @Override
    public Page<Workflow> getAllWorkflows(Pageable pageable) {
        return workflowRepository.findAll(pageable);
    }

    @Override
    public Page<Workflow> searchWorkflows(String keyword, Pageable pageable) {
        return workflowRepository.searchByKeyword(keyword, pageable);
    }

    @Override
    @Transactional
    public Workflow recallWorkflow(String workflowCode, User operator, String reason) {
        Optional<Workflow> workflowOpt = workflowRepository.findByWorkflowCode(workflowCode);
        if (workflowOpt.isPresent()) {
            Workflow workflow = workflowOpt.get();
            
            // 只有提交人可以撤回，且只能撤回审批中的流程
            if (!workflow.getSubmitter().getId().equals(operator.getId())) {
                throw new IllegalStateException("只有流程提交人可以撤回流程");
            }
            
            if (workflow.getStatus() != Workflow.WorkflowStatus.审批中) {
                throw new IllegalStateException("只能撤回审批中的流程");
            }
            
            // 更新流程状态
            workflow.setStatus(Workflow.WorkflowStatus.已撤回);
            
            // 创建撤回历史记录
            WorkflowHistory history = new WorkflowHistory();
            history.setNodeId(workflow.getCurrentNodeId());
            
            Optional<WorkflowNode> currentNodeOpt = nodeRepository.findByWorkflowAndNodeId(workflow, workflow.getCurrentNodeId());
            if (currentNodeOpt.isPresent()) {
                history.setNodeName(currentNodeOpt.get().getName());
            } else {
                history.setNodeName("未知节点");
            }
            
            history.setApprover(operator);
            history.setAction(WorkflowHistory.ActionType.撤回);
            history.setActionTime(LocalDateTime.now());
            history.setComment(reason);
            history.setStatus(WorkflowNode.NodeStatus.completed);
            history.setWorkflow(workflow);
            historyRepository.save(history);
            
            return workflowRepository.save(workflow);
        }
        
        throw new NoSuchElementException("未找到工作流: " + workflowCode);
    }

    @Override
    @Transactional
    public Workflow terminateWorkflow(String workflowCode, User operator, String reason) {
        Optional<Workflow> workflowOpt = workflowRepository.findByWorkflowCode(workflowCode);
        if (workflowOpt.isPresent()) {
            Workflow workflow = workflowOpt.get();
            
            // 只能终止审批中的流程
            if (workflow.getStatus() != Workflow.WorkflowStatus.审批中) {
                throw new IllegalStateException("只能终止审批中的流程");
            }
            
            // 更新流程状态
            workflow.setStatus(Workflow.WorkflowStatus.已终止);
            
            // 创建终止历史记录
            WorkflowHistory history = new WorkflowHistory();
            history.setNodeId(workflow.getCurrentNodeId());
            
            Optional<WorkflowNode> currentNodeOpt = nodeRepository.findByWorkflowAndNodeId(workflow, workflow.getCurrentNodeId());
            if (currentNodeOpt.isPresent()) {
                history.setNodeName(currentNodeOpt.get().getName());
            } else {
                history.setNodeName("未知节点");
            }
            
            history.setApprover(operator);
            history.setAction(WorkflowHistory.ActionType.终止);
            history.setActionTime(LocalDateTime.now());
            history.setComment(reason);
            history.setStatus(WorkflowNode.NodeStatus.completed);
            history.setWorkflow(workflow);
            historyRepository.save(history);
            
            return workflowRepository.save(workflow);
        }
        
        throw new NoSuchElementException("未找到工作流: " + workflowCode);
    }

    @Override
    @Transactional
    public Workflow approveNode(String workflowCode, String nodeId, User approver, String comment) {
        Optional<Workflow> workflowOpt = workflowRepository.findByWorkflowCode(workflowCode);
        if (workflowOpt.isPresent()) {
            Workflow workflow = workflowOpt.get();
            
            // 检查流程状态
            if (workflow.getStatus() != Workflow.WorkflowStatus.审批中) {
                throw new IllegalStateException("只能审批处于审批中状态的流程");
            }
            
            // 检查节点是否存在
            Optional<WorkflowNode> nodeOpt = nodeRepository.findByWorkflowAndNodeId(workflow, nodeId);
            if (nodeOpt.isEmpty()) {
                throw new NoSuchElementException("未找到节点: " + nodeId);
            }
            
            WorkflowNode node = nodeOpt.get();
            
            // 检查节点状态
            if (node.getStatus() != WorkflowNode.NodeStatus.pending) {
                throw new IllegalStateException("只能审批处于待审批状态的节点");
            }
            
            // 检查审批人
            if (node.getApprover() != null && !node.getApprover().getId().equals(approver.getId())) {
                // 检查是否有代理关系
                // 这里简化处理，实际应该检查审批代理表
                throw new IllegalStateException("您不是该节点的审批人");
            }
            
            // 更新节点状态
            node.setStatus(WorkflowNode.NodeStatus.completed);
            node.setCompletedTime(LocalDateTime.now());
            node.setComment(comment);
            nodeRepository.save(node);
            
            // 创建审批历史记录
            WorkflowHistory history = new WorkflowHistory();
            history.setNodeId(nodeId);
            history.setNodeName(node.getName());
            history.setApprover(approver);
            history.setAction(WorkflowHistory.ActionType.审批);
            history.setActionTime(LocalDateTime.now());
            history.setComment(comment);
            history.setStatus(WorkflowNode.NodeStatus.completed);
            history.setWorkflow(workflow);
            historyRepository.save(history);
            
            // 查找下一个节点
            List<WorkflowConnection> connections = connectionRepository.findByFromNodeId(nodeId);
            if (!connections.isEmpty()) {
                String nextNodeId = connections.get(0).getToNodeId();
                Optional<WorkflowNode> nextNodeOpt = nodeRepository.findByWorkflowAndNodeId(workflow, nextNodeId);
                
                if (nextNodeOpt.isPresent()) {
                    WorkflowNode nextNode = nextNodeOpt.get();
                    
                    if (nextNode.getType() == WorkflowNode.NodeType.end) {
                        // 如果下一个节点是结束节点，则完成流程
                        nextNode.setStatus(WorkflowNode.NodeStatus.completed);
                        nextNode.setCompletedTime(LocalDateTime.now());
                        nodeRepository.save(nextNode);
                        
                        workflow.setStatus(Workflow.WorkflowStatus.已完成);
                        workflow.setCurrentNodeId(nextNodeId);
                        
                        // 创建结束历史记录
                        WorkflowHistory endHistory = new WorkflowHistory();
                        endHistory.setNodeId(nextNodeId);
                        endHistory.setNodeName(nextNode.getName());
                        endHistory.setApprover(approver);
                        endHistory.setAction(WorkflowHistory.ActionType.审批);
                        endHistory.setActionTime(LocalDateTime.now());
                        endHistory.setComment("流程完成");
                        endHistory.setStatus(WorkflowNode.NodeStatus.completed);
                        endHistory.setWorkflow(workflow);
                        historyRepository.save(endHistory);
                    } else {
                        // 更新下一个节点状态为待审批
                        nextNode.setStatus(WorkflowNode.NodeStatus.pending);
                        nextNode.setReceivedTime(LocalDateTime.now());
                        nextNode.setDeadline(LocalDateTime.now().plusDays(3));
                        nodeRepository.save(nextNode);
                        
                        workflow.setCurrentNodeId(nextNodeId);
                    }
                }
            }
            
            return workflowRepository.save(workflow);
        }
        
        throw new NoSuchElementException("未找到工作流: " + workflowCode);
    }

    @Override
    @Transactional
    public Workflow rejectNode(String workflowCode, String nodeId, User approver, String comment) {
        Optional<Workflow> workflowOpt = workflowRepository.findByWorkflowCode(workflowCode);
        if (workflowOpt.isPresent()) {
            Workflow workflow = workflowOpt.get();
            
            // 检查流程状态
            if (workflow.getStatus() != Workflow.WorkflowStatus.审批中) {
                throw new IllegalStateException("只能审批处于审批中状态的流程");
            }
            
            // 检查节点是否存在
            Optional<WorkflowNode> nodeOpt = nodeRepository.findByWorkflowAndNodeId(workflow, nodeId);
            if (nodeOpt.isEmpty()) {
                throw new NoSuchElementException("未找到节点: " + nodeId);
            }
            
            WorkflowNode node = nodeOpt.get();
            
            // 检查节点状态
            if (node.getStatus() != WorkflowNode.NodeStatus.pending) {
                throw new IllegalStateException("只能审批处于待审批状态的节点");
            }
            
            // 检查审批人
            if (node.getApprover() != null && !node.getApprover().getId().equals(approver.getId())) {
                // 检查是否有代理关系
                // 这里简化处理，实际应该检查审批代理表
                throw new IllegalStateException("您不是该节点的审批人");
            }
            
            // 更新节点状态
            node.setStatus(WorkflowNode.NodeStatus.rejected);
            node.setCompletedTime(LocalDateTime.now());
            node.setComment(comment);
            nodeRepository.save(node);
            
            // 创建拒绝历史记录
            WorkflowHistory history = new WorkflowHistory();
            history.setNodeId(nodeId);
            history.setNodeName(node.getName());
            history.setApprover(approver);
            history.setAction(WorkflowHistory.ActionType.拒绝);
            history.setActionTime(LocalDateTime.now());
            history.setComment(comment);
            history.setStatus(WorkflowNode.NodeStatus.rejected);
            history.setWorkflow(workflow);
            historyRepository.save(history);
            
            // 更新流程状态为已拒绝
            workflow.setStatus(Workflow.WorkflowStatus.已拒绝);
            
            return workflowRepository.save(workflow);
        }
        
        throw new NoSuchElementException("未找到工作流: " + workflowCode);
    }

    @Override
    @Transactional
    public Workflow jumpToNode(String workflowCode, String fromNodeId, String toNodeId, 
                              User operator, String reason, String comment, User newApprover) {
        Optional<Workflow> workflowOpt = workflowRepository.findByWorkflowCode(workflowCode);
        if (workflowOpt.isPresent()) {
            Workflow workflow = workflowOpt.get();
            
            // 检查流程状态
            if (workflow.getStatus() != Workflow.WorkflowStatus.审批中) {
                throw new IllegalStateException("只能跳转处于审批中状态的流程");
            }
            
            // 检查当前节点是否存在
            Optional<WorkflowNode> fromNodeOpt = nodeRepository.findByWorkflowAndNodeId(workflow, fromNodeId);
            if (fromNodeOpt.isEmpty()) {
                throw new NoSuchElementException("未找到源节点: " + fromNodeId);
            }
            
            // 检查目标节点是否存在
            Optional<WorkflowNode> toNodeOpt = nodeRepository.findByWorkflowAndNodeId(workflow, toNodeId);
            if (toNodeOpt.isEmpty()) {
                throw new NoSuchElementException("未找到目标节点: " + toNodeId);
            }
            
            WorkflowNode fromNode = fromNodeOpt.get();
            WorkflowNode toNode = toNodeOpt.get();
            
            // 更新源节点状态
            fromNode.setStatus(WorkflowNode.NodeStatus.skipped);
            fromNode.setCompletedTime(LocalDateTime.now());
            fromNode.setComment("已跳转至" + toNode.getName());
            nodeRepository.save(fromNode);
            
            // 更新目标节点状态
            toNode.setStatus(WorkflowNode.NodeStatus.pending);
            toNode.setReceivedTime(LocalDateTime.now());
            toNode.setDeadline(LocalDateTime.now().plusDays(3));
            
            // 如果指定了新审批人，则更新
            if (newApprover != null) {
                toNode.setApprover(newApprover);
            }
            
            nodeRepository.save(toNode);
            
            // 创建跳转历史记录
            WorkflowHistory history = new WorkflowHistory();
            history.setNodeId(fromNodeId);
            history.setNodeName(fromNode.getName() + " → " + toNode.getName());
            history.setApprover(operator);
            history.setAction(WorkflowHistory.ActionType.跳转);
            history.setActionTime(LocalDateTime.now());
            history.setComment(reason + (comment != null ? "\n" + comment : ""));
            history.setStatus(WorkflowNode.NodeStatus.completed);
            history.setWorkflow(workflow);
            historyRepository.save(history);
            
            // 更新流程当前节点
            workflow.setCurrentNodeId(toNodeId);
            
            return workflowRepository.save(workflow);
        }
        
        throw new NoSuchElementException("未找到工作流: " + workflowCode);
    }

    @Override
    public long countWorkflowsByStatus(Workflow.WorkflowStatus status) {
        return workflowRepository.countByStatus(status);
    }

    @Override
    public List<WorkflowNode> getOverdueNodes() {
        return nodeRepository.findOverdueNodes(WorkflowNode.NodeStatus.pending, LocalDateTime.now());
    }

    @Override
    public WorkflowResponse convertToWorkflowResponse(Workflow workflow) {
        WorkflowResponse response = new WorkflowResponse();
        response.setId(workflow.getId().toString());
        response.setWorkflowCode(workflow.getWorkflowCode());
        response.setTitle(workflow.getTitle());
        response.setType(workflow.getType());
        response.setSubmitter(userService.getUserSummary(workflow.getSubmitter()));
        response.setSubmitTime(workflow.getSubmitTime().format(DATE_FORMATTER));
        response.setCurrentNodeId(workflow.getCurrentNodeId());
        response.setStatus(workflow.getStatus().name());
        
        // 转换节点
        List<WorkflowNode> nodes = nodeRepository.findByWorkflow(workflow);
        for (WorkflowNode node : nodes) {
            WorkflowResponse.WorkflowNodeResponse nodeResponse = new WorkflowResponse.WorkflowNodeResponse();
            nodeResponse.setId(node.getNodeId());
            nodeResponse.setName(node.getName());
            nodeResponse.setType(node.getType().name());
            if (node.getApprover() != null) {
                nodeResponse.setApprover(userService.getUserSummary(node.getApprover()));
            }
            nodeResponse.setStatus(node.getStatus().name());
            if (node.getReceivedTime() != null) {
                nodeResponse.setReceivedTime(node.getReceivedTime().format(DATE_FORMATTER));
            }
            if (node.getCompletedTime() != null) {
                nodeResponse.setCompletedTime(node.getCompletedTime().format(DATE_FORMATTER));
            }
            if (node.getDeadline() != null) {
                nodeResponse.setDeadline(node.getDeadline().format(DATE_FORMATTER));
            }
            nodeResponse.setComment(node.getComment());
            nodeResponse.setPosition(new WorkflowResponse.WorkflowNodeResponse.Position(
                    node.getPositionX(), node.getPositionY()));
            
            response.getNodes().add(nodeResponse);
        }
        
        // 转换连接
        List<WorkflowConnection> connections = connectionRepository.findByWorkflow(workflow);
        for (WorkflowConnection connection : connections) {
            WorkflowResponse.WorkflowConnectionResponse connResponse = 
                    new WorkflowResponse.WorkflowConnectionResponse(
                            connection.getFromNodeId(), connection.getToNodeId());
            response.getConnections().add(connResponse);
        }
        
        // 转换历史记录
        List<WorkflowHistory> histories = historyRepository.findByWorkflowOrderByActionTimeDesc(workflow);
        for (WorkflowHistory history : histories) {
            WorkflowResponse.WorkflowHistoryResponse historyResponse = new WorkflowResponse.WorkflowHistoryResponse();
            historyResponse.setId(history.getId().toString());
            historyResponse.setNodeId(history.getNodeId());
            historyResponse.setNodeName(history.getNodeName());
            if (history.getApprover() != null) {
                historyResponse.setApprover(userService.getUserSummary(history.getApprover()));
            }
            historyResponse.setAction(history.getAction().name());
            historyResponse.setTime(history.getActionTime().format(DATE_FORMATTER));
            historyResponse.setComment(history.getComment());
            historyResponse.setStatus(history.getStatus().name());
            
            response.getHistory().add(historyResponse);
        }
        
        return response;
    }

    @Override
    public List<Workflow> getWorkflowsByTimeRange(LocalDateTime startTime, LocalDateTime endTime) {
        return workflowRepository.findByStatusAndTimeRange(Workflow.WorkflowStatus.审批中, startTime, endTime);
    }

    // 生成工作流编码
    private String generateWorkflowCode(String type) {
        String prefix;
        switch (type) {
            case "请假流程":
                prefix = "QJ";
                break;
            case "报销流程":
                prefix = "BX";
                break;
            case "采购流程":
                prefix = "CG";
                break;
            case "合同审批":
                prefix = "HT";
                break;
            default:
                prefix = "WF";
        }
        
        String dateStr = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd"));
        String randomStr = String.format("%04d", new Random().nextInt(10000));
        
        return prefix + dateStr + randomStr;
    }
}