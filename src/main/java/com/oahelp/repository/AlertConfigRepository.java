package com.oahelp.repository;

import com.oahelp.entity.AlertConfig;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * 告警配置仓库接口
 */
@Repository
public interface AlertConfigRepository extends JpaRepository<AlertConfig, Long> {
    
    /**
     * 获取默认配置（通常只有一条记录）
     */
    AlertConfig findFirstByOrderById();
}