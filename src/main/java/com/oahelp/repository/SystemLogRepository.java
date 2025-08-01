package com.oahelp.repository;

import com.oahelp.entity.SystemLog;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

/**
 * 系统日志数据访问接口
 */
@Repository
public interface SystemLogRepository extends JpaRepository<SystemLog, Long>, JpaSpecificationExecutor<SystemLog> {

    /**
     * 根据日志类型查询
     */
    Page<SystemLog> findByType(String type, Pageable pageable);

    /**
     * 根据日志级别查询
     */
    Page<SystemLog> findByLevel(String level, Pageable pageable);

    /**
     * 根据时间范围查询
     */
    Page<SystemLog> findByTimeBetween(LocalDateTime startTime, LocalDateTime endTime, Pageable pageable);

    /**
     * 根据日志类型和时间范围查询
     */
    Page<SystemLog> findByTypeAndTimeBetween(String type, LocalDateTime startTime, LocalDateTime endTime, Pageable pageable);

    /**
     * 根据关键词搜索（消息、来源、用户、详情）
     */
    @Query("SELECT l FROM SystemLog l WHERE " +
            "LOWER(l.message) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
            "LOWER(l.source) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
            "LOWER(l.user) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
            "LOWER(l.details) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    Page<SystemLog> searchByKeyword(@Param("keyword") String keyword, Pageable pageable);

    /**
     * 统计各类型日志数量
     */
    @Query("SELECT l.type, COUNT(l) FROM SystemLog l GROUP BY l.type")
    List<Object[]> countByType();

    /**
     * 统计各级别日志数量
     */
    @Query("SELECT l.level, COUNT(l) FROM SystemLog l GROUP BY l.level")
    List<Object[]> countByLevel();
}