package com.oahelp.repository;

import com.oahelp.entity.User;
import com.oahelp.entity.Workflow;
import com.oahelp.entity.WorkflowNode;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface WorkflowNodeRepository extends JpaRepository<WorkflowNode, Long> {
    List<WorkflowNode> findByWorkflow(Workflow workflow);
    
    Optional<WorkflowNode> findByWorkflowAndNodeId(Workflow workflow, String nodeId);
    
    List<WorkflowNode> findByApproverAndStatus(User approver, WorkflowNode.NodeStatus status);
    
    @Query("SELECT n FROM WorkflowNode n WHERE n.status = :status AND n.deadline < :now")
    List<WorkflowNode> findOverdueNodes(
            @Param("status") WorkflowNode.NodeStatus status,
            @Param("now") LocalDateTime now);
    
    @Query("SELECT n FROM WorkflowNode n WHERE n.workflow = :workflow AND n.type = :type")
    List<WorkflowNode> findByWorkflowAndType(
            @Param("workflow") Workflow workflow,
            @Param("type") WorkflowNode.NodeType type);
    
    @Query("SELECT COUNT(n) FROM WorkflowNode n WHERE n.approver = :approver AND n.status = :status")
    Long countByApproverAndStatus(
            @Param("approver") User approver,
            @Param("status") WorkflowNode.NodeStatus status);
}