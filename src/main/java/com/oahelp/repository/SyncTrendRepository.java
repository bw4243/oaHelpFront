package com.oahelp.repository;

import com.oahelp.entity.SyncTrend;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

/**
 * 同步趋势数据仓库接口
 */
@Repository
public interface SyncTrendRepository extends JpaRepository<SyncTrend, Long> {
    
    /**
     * 查询指定时间范围内的趋势数据
     */
    List<SyncTrend> findByTimeBetweenOrderByTimeAsc(LocalDateTime startTime, LocalDateTime endTime);
    
    /**
     * 按小时分组查询今日趋势数据
     */
    @Query("SELECT t.hourKey, SUM(t.success), SUM(t.failure) FROM SyncTrend t " +
           "WHERE t.time >= :startTime AND t.time <= :endTime " +
           "GROUP BY t.hourKey ORDER BY t.hourKey")
    List<Object[]> findTodayTrendByHour(LocalDateTime startTime, LocalDateTime endTime);
}