package com.oahelp.repository;

import com.oahelp.entity.User;
import com.oahelp.entity.Workflow;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface WorkflowRepository extends JpaRepository<Workflow, Long> {
    Optional<Workflow> findByWorkflowCode(String workflowCode);
    
    List<Workflow> findBySubmitter(User submitter);
    
    List<Workflow> findByStatus(Workflow.WorkflowStatus status);
    
    List<Workflow> findByType(String type);
    
    @Query("SELECT w FROM Workflow w WHERE w.status = :status AND w.submitTime BETWEEN :startTime AND :endTime")
    List<Workflow> findByStatusAndTimeRange(
            @Param("status") Workflow.WorkflowStatus status,
            @Param("startTime") LocalDateTime startTime,
            @Param("endTime") LocalDateTime endTime);
    
    @Query("SELECT w FROM Workflow w JOIN w.nodes n WHERE n.approver = :approver AND n.status = :nodeStatus")
    List<Workflow> findByApproverAndNodeStatus(
            @Param("approver") User approver,
            @Param("nodeStatus") WorkflowNode.NodeStatus nodeStatus);
    
    @Query("SELECT w FROM Workflow w WHERE w.title LIKE %:keyword% OR w.workflowCode LIKE %:keyword%")
    Page<Workflow> searchByKeyword(@Param("keyword") String keyword, Pageable pageable);
    
    @Query("SELECT COUNT(w) FROM Workflow w WHERE w.status = :status")
    Long countByStatus(@Param("status") Workflow.WorkflowStatus status);
}