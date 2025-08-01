package com.oahelp.repository;

import com.oahelp.entity.Workflow;
import com.oahelp.entity.WorkflowConnection;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface WorkflowConnectionRepository extends JpaRepository<WorkflowConnection, Long> {
    List<WorkflowConnection> findByWorkflow(Workflow workflow);
    
    List<WorkflowConnection> findByFromNodeId(String fromNodeId);
    
    List<WorkflowConnection> findByToNodeId(String toNodeId);
    
    WorkflowConnection findByWorkflowAndFromNodeIdAndToNodeId(Workflow workflow, String fromNodeId, String toNodeId);
}