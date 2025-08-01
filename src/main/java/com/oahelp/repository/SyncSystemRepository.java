package com.oahelp.repository;

import com.oahelp.entity.SyncSystem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * 数据同步系统仓库接口
 */
@Repository
public interface SyncSystemRepository extends JpaRepository<SyncSystem, String> {
    
    /**
     * 查询所有启用的同步系统
     */
    List<SyncSystem> findByEnabledTrue();
    
    /**
     * 查询所有失败状态的同步系统
     */
    List<SyncSystem> findByStatus(String status);
    
    /**
     * 统计各状态的系统数量
     */
    @Query("SELECT s.status, COUNT(s) FROM SyncSystem s GROUP BY s.status")
    List<Object[]> countByStatus();
    
    /**
     * 计算所有系统的平均耗时（秒）
     */
    @Query("SELECT AVG(CAST(SUBSTRING(s.avgDuration, 1, LOCATE('秒', s.avgDuration) - 1) AS double)) FROM SyncSystem s")
    Double calculateAverageTime();
}