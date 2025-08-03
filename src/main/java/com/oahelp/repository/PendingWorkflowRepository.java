package com.oahelp.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.oahelp.entity.PendingWorkflow;

/**
 * 待办流程数据访问接口
 */
@Repository
public interface PendingWorkflowRepository extends JpaRepository<PendingWorkflow, Long> {
    
    /**
     * 根据离职用户ID查询待办流程
     */
    List<PendingWorkflow> findByLeftUserId(Long leftUserId);
    
    /**
     * 根据流程类型查询待办流程
     */
    List<PendingWorkflow> findByType(String type);
    
    /**
     * 根据优先级查询待办流程
     */
    List<PendingWorkflow> findByPriority(String priority);
    
    /**
     * 批量更新待办流程所属用户
     */
    @Modifying
    @Query("UPDATE PendingWorkflow w SET w.leftUser.id = :targetUserId WHERE w.leftUser.id IN :sourceUserIds")
    int batchTransferWorkflows(@Param("sourceUserIds") List<Long> sourceUserIds, @Param("targetUserId") Long targetUserId);
    
    /**
     * 批量删除待办流程
     */
    @Modifying
    @Query("DELETE FROM PendingWorkflow w WHERE w.leftUser.id IN :userIds")
    int batchDeleteWorkflows(@Param("userIds") List<Long> userIds);
}