package com.oahelp.service;

import com.oahelp.payload.LogQueryRequest;

import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

/**
 * 日志导出服务接口
 */
public interface LogExportService {

    /**
     * 导出日志为Excel
     *
     * @param queryRequest 查询条件
     * @param response HTTP响应
     * @throws IOException 如果导出过程中发生IO异常
     */
    void exportToExcel(LogQueryRequest queryRequest, HttpServletResponse response) throws IOException;

    /**
     * 导出日志为CSV
     *
     * @param queryRequest 查询条件
     * @param response HTTP响应
     * @throws IOException 如果导出过程中发生IO异常
     */
    void exportToCsv(LogQueryRequest queryRequest, HttpServletResponse response) throws IOException;
}