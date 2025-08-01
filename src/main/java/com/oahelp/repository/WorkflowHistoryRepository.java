package com.oahelp.repository;

import com.oahelp.entity.User;
import com.oahelp.entity.Workflow;
import com.oahelp.entity.WorkflowHistory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface WorkflowHistoryRepository extends JpaRepository<WorkflowHistory, Long> {
    List<WorkflowHistory> findByWorkflow(Workflow workflow);
    
    List<WorkflowHistory> findByWorkflowOrderByActionTimeDesc(Workflow workflow);
    
    List<WorkflowHistory> findByNodeId(String nodeId);
    
    List<WorkflowHistory> findByApprover(User approver);
    
    List<WorkflowHistory> findByAction(WorkflowHistory.ActionType action);
    
    @Query("SELECT h FROM WorkflowHistory h WHERE h.actionTime BETWEEN :startTime AND :endTime")
    List<WorkflowHistory> findByTimeRange(
            @Param("startTime") LocalDateTime startTime,
            @Param("endTime") LocalDateTime endTime);
    
    @Query("SELECT h FROM WorkflowHistory h WHERE h.workflow = :workflow AND h.action = :action")
    List<WorkflowHistory> findByWorkflowAndAction(
            @Param("workflow") Workflow workflow,
            @Param("action") WorkflowHistory.ActionType action);
    
    @Query("SELECT h FROM WorkflowHistory h WHERE h.comment LIKE %:keyword%")
    Page<WorkflowHistory> searchByCommentKeyword(@Param("keyword") String keyword, Pageable pageable);
}