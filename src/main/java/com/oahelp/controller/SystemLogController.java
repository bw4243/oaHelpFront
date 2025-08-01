package com.oahelp.controller;

import com.oahelp.payload.ApiResponse;
import com.oahelp.payload.LogQueryRequest;
import com.oahelp.payload.PagedResponse;
import com.oahelp.payload.SystemLogResponse;
import com.oahelp.service.SystemLogService;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.io.ByteArrayOutputStream;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Map;

/**
 * 系统日志控制器
 */
@RestController
@RequestMapping("/api/system/logs")
@RequiredArgsConstructor
public class SystemLogController {

    private final SystemLogService systemLogService;
    private static final DateTimeFormatter DATE_TIME_FORMATTER = DateTimeFormatter.ofPattern("yyyyMMdd_HHmmss");

    /**
     * 分页查询系统日志
     */
    @GetMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('IT_ADMIN')")
    public ResponseEntity<PagedResponse<SystemLogResponse>> getLogs(
            @RequestParam(value = "logType", required = false, defaultValue = "all") String logType,
            @RequestParam(value = "keyword", required = false) String keyword,
            @RequestParam(value = "startDate", required = false) String startDate,
            @RequestParam(value = "endDate", required = false) String endDate,
            @RequestParam(value = "page", required = false, defaultValue = "0") Integer page,
            @RequestParam(value = "size", required = false, defaultValue = "20") Integer size) {

        LogQueryRequest queryRequest = LogQueryRequest.builder()
                .logType(logType)
                .keyword(keyword)
                .startDate(startDate != null ? LocalDate.parse(startDate) : null)
                .endDate(endDate != null ? LocalDate.parse(endDate) : null)
                .page(page)
                .size(size)
                .build();

        return ResponseEntity.ok(systemLogService.getLogs(queryRequest));
    }

    /**
     * 获取日志统计信息
     */
    @GetMapping("/statistics")
    @PreAuthorize("hasRole('ADMIN') or hasRole('IT_ADMIN')")
    public ResponseEntity<Map<String, Long>> getLogStatistics(
            @RequestParam(value = "logType", required = false, defaultValue = "all") String logType,
            @RequestParam(value = "keyword", required = false) String keyword,
            @RequestParam(value = "startDate", required = false) String startDate,
            @RequestParam(value = "endDate", required = false) String endDate) {

        LogQueryRequest queryRequest = LogQueryRequest.builder()
                .logType(logType)
                .keyword(keyword)
                .startDate(startDate != null ? LocalDate.parse(startDate) : null)
                .endDate(endDate != null ? LocalDate.parse(endDate) : null)
                .build();

        return ResponseEntity.ok(systemLogService.getLogStatistics(queryRequest));
    }

    /**
     * 获取日志详情
     */
    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('IT_ADMIN')")
    public ResponseEntity<SystemLogResponse> getLogById(@PathVariable Long id) {
        return ResponseEntity.ok(systemLogService.getLogById(id));
    }

    /**
     * 导出日志为TXT格式
     */
    @GetMapping("/export/txt")
    @PreAuthorize("hasRole('ADMIN') or hasRole('IT_ADMIN')")
    public ResponseEntity<Resource> exportLogsAsTxt(
            @RequestParam(value = "logType", required = false, defaultValue = "all") String logType,
            @RequestParam(value = "keyword", required = false) String keyword,
            @RequestParam(value = "startDate", required = false) String startDate,
            @RequestParam(value = "endDate", required = false) String endDate) {

        LogQueryRequest queryRequest = LogQueryRequest.builder()
                .logType(logType)
                .keyword(keyword)
                .startDate(startDate != null ? LocalDate.parse(startDate) : null)
                .endDate(endDate != null ? LocalDate.parse(endDate) : null)
                .build();

        ByteArrayOutputStream outputStream = systemLogService.exportLogsAsTxt(queryRequest);
        ByteArrayResource resource = new ByteArrayResource(outputStream.toByteArray());

        String timestamp = LocalDateTime.now().format(DATE_TIME_FORMATTER);
        String filename = "system_logs_" + timestamp + ".txt";

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + filename + "\"")
                .contentType(MediaType.TEXT_PLAIN)
                .contentLength(resource.contentLength())
                .body(resource);
    }

    /**
     * 导出日志为Excel格式
     */
    @GetMapping("/export/excel")
    @PreAuthorize("hasRole('ADMIN') or hasRole('IT_ADMIN')")
    public ResponseEntity<Resource> exportLogsAsExcel(
            @RequestParam(value = "logType", required = false, defaultValue = "all") String logType,
            @RequestParam(value = "keyword", required = false) String keyword,
            @RequestParam(value = "startDate", required = false) String startDate,
            @RequestParam(value = "endDate", required = false) String endDate) {

        LogQueryRequest queryRequest = LogQueryRequest.builder()
                .logType(logType)
                .keyword(keyword)
                .startDate(startDate != null ? LocalDate.parse(startDate) : null)
                .endDate(endDate != null ? LocalDate.parse(endDate) : null)
                .build();

        ByteArrayOutputStream outputStream = systemLogService.exportLogsAsExcel(queryRequest);
        ByteArrayResource resource = new ByteArrayResource(outputStream.toByteArray());

        String timestamp = LocalDateTime.now().format(DATE_TIME_FORMATTER);
        String filename = "system_logs_" + timestamp + ".xlsx";

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + filename + "\"")
                .contentType(MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"))
                .contentLength(resource.contentLength())
                .body(resource);
    }
}