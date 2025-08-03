package com.oahelp.repository;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.oahelp.entity.LeftUser;

/**
 * 离职用户数据访问接口
 */
@Repository
public interface LeftUserRepository extends JpaRepository<LeftUser, Long> {
    
    /**
     * 根据部门查询离职用户
     */
    List<LeftUser> findByDepartment(String department);
    
    /**
     * 根据离职日期查询离职用户
     */
    List<LeftUser> findByLeaveDate(LocalDate leaveDate);
    
    /**
     * 根据关键词搜索离职用户（姓名、部门、职位）
     */
    @Query("SELECT u FROM LeftUser u WHERE u.name LIKE %:keyword% OR u.department LIKE %:keyword% OR u.position LIKE %:keyword%")
    List<LeftUser> searchByKeyword(@Param("keyword") String keyword);
    
    /**
     * 根据流程类型查询离职用户
     */
    @Query("SELECT DISTINCT u FROM LeftUser u JOIN u.pendingWorkflows w WHERE w.type LIKE %:workflowType%")
    List<LeftUser> findByWorkflowType(@Param("workflowType") String workflowType);
    
    /**
     * 复合条件查询
     */
    @Query("SELECT DISTINCT u FROM LeftUser u LEFT JOIN u.pendingWorkflows w WHERE " +
           "(:department = 'all' OR u.department = :department) AND " +
           "(:leaveDate IS NULL OR u.leaveDate = :leaveDate) AND " +
           "(:workflowType = 'all' OR w.type LIKE %:workflowType%) AND " +
           "(:keyword = '' OR u.name LIKE %:keyword% OR u.department LIKE %:keyword% OR u.position LIKE %:keyword% OR w.title LIKE %:keyword%)")
    List<LeftUser> findByFilters(
            @Param("department") String department,
            @Param("leaveDate") LocalDate leaveDate,
            @Param("workflowType") String workflowType,
            @Param("keyword") String keyword);
}