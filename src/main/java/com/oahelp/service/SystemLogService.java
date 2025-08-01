package com.oahelp.service;

import com.oahelp.payload.LogQueryRequest;
import com.oahelp.payload.PagedResponse;
import com.oahelp.payload.SystemLogResponse;

import java.io.ByteArrayOutputStream;
import java.util.Map;

/**
 * 系统日志服务接口
 */
public interface SystemLogService {

    /**
     * 分页查询系统日志
     * @param queryRequest 查询条件
     * @return 分页日志数据
     */
    PagedResponse<SystemLogResponse> getLogs(LogQueryRequest queryRequest);
    
    /**
     * 获取日志统计信息
     * @param queryRequest 查询条件
     * @return 统计信息
     */
    Map<String, Long> getLogStatistics(LogQueryRequest queryRequest);
    
    /**
     * 导出日志为TXT格式
     * @param queryRequest 查询条件
     * @return 导出的文件内容
     */
    ByteArrayOutputStream exportLogsAsTxt(LogQueryRequest queryRequest);
    
    /**
     * 导出日志为Excel格式
     * @param queryRequest 查询条件
     * @return 导出的文件内容
     */
    ByteArrayOutputStream exportLogsAsExcel(LogQueryRequest queryRequest);
    
    /**
     * 获取日志详情
     * @param id 日志ID
     * @return 日志详情
     */
    SystemLogResponse getLogById(Long id);
}