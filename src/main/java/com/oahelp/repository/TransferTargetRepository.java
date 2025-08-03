package com.oahelp.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.oahelp.entity.TransferTarget;

/**
 * 转交目标数据访问接口
 */
@Repository
public interface TransferTargetRepository extends JpaRepository<TransferTarget, Long> {
    
    /**
     * 根据部门查询转交目标
     */
    List<TransferTarget> findByDepartment(String department);
    
    /**
     * 根据姓名模糊查询转交目标
     */
    List<TransferTarget> findByNameContaining(String name);
}