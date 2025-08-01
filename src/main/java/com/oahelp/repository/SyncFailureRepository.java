package com.oahelp.repository;

import com.oahelp.entity.SyncFailure;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

/**
 * 同步失败记录仓库接口
 */
@Repository
public interface SyncFailureRepository extends JpaRepository<SyncFailure, Long> {
    
    /**
     * 查询指定系统的失败记录
     */
    List<SyncFailure> findBySystemId(String systemId);
    
    /**
     * 查询最近的失败记录
     */
    List<SyncFailure> findByTimeAfterOrderByTimeDesc(LocalDateTime time, Pageable pageable);
    
    /**
     * 查询指定系统最近的失败记录
     */
    List<SyncFailure> findBySystemIdAndTimeAfterOrderByTimeDesc(String systemId, LocalDateTime time, Pageable pageable);
    
    /**
     * 统计指定系统连续失败次数
     */
    int countBySystemIdAndTimeAfterOrderByTimeDesc(String systemId, LocalDateTime time);
}