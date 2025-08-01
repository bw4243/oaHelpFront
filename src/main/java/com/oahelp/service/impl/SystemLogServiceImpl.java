package com.oahelp.service.impl;

import com.oahelp.entity.SystemLog;
import com.oahelp.exception.ResourceNotFoundException;
import com.oahelp.payload.LogQueryRequest;
import com.oahelp.payload.PagedResponse;
import com.oahelp.payload.SystemLogResponse;
import com.oahelp.repository.SystemLogRepository;
import com.oahelp.service.SystemLogService;
import lombok.RequiredArgsConstructor;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import javax.persistence.criteria.Predicate;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.PrintWriter;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * 系统日志服务实现类
 */
@Service
@RequiredArgsConstructor
public class SystemLogServiceImpl implements SystemLogService {

    private final SystemLogRepository systemLogRepository;
    private static final DateTimeFormatter DATE_TIME_FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

    @Override
    public PagedResponse<SystemLogResponse> getLogs(LogQueryRequest queryRequest) {
        // 默认分页参数
        int page = queryRequest.getPage() != null ? queryRequest.getPage() : 0;
        int size = queryRequest.getSize() != null ? queryRequest.getSize() : 20;

        // 创建分页和排序
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "time"));

        // 创建动态查询条件
        Specification<SystemLog> spec = buildSpecification(queryRequest);

        // 执行查询
        Page<SystemLog> logs = systemLogRepository.findAll(spec, pageable);

        // 转换为响应对象
        List<SystemLogResponse> content = logs.getContent().stream()
                .map(this::convertToSystemLogResponse)
                .collect(Collectors.toList());

        return new PagedResponse<>(
                content,
                logs.getNumber(),
                logs.getSize(),
                logs.getTotalElements(),
                logs.getTotalPages(),
                logs.isLast()
        );
    }

    @Override
    public Map<String, Long> getLogStatistics(LogQueryRequest queryRequest) {
        // 创建动态查询条件
        Specification<SystemLog> spec = buildSpecification(queryRequest);
        
        // 查询所有符合条件的日志
        List<SystemLog> logs = systemLogRepository.findAll(spec);
        
        Map<String, Long> statistics = new HashMap<>();
        
        // 计算总日志数
        statistics.put("totalLogs", (long) logs.size());
        
        // 按类型统计
        Map<String, Long> typeStats = logs.stream()
                .collect(Collectors.groupingBy(SystemLog::getType, Collectors.counting()));
        
        // 将类型统计添加到结果中
        statistics.put("系统异常", typeStats.getOrDefault("系统异常", 0L));
        statistics.put("慢SQL", typeStats.getOrDefault("慢SQL", 0L));
        statistics.put("登录记录", typeStats.getOrDefault("登录记录", 0L));
        
        return statistics;
    }

    @Override
    public ByteArrayOutputStream exportLogsAsTxt(LogQueryRequest queryRequest) {
        // 创建动态查询条件
        Specification<SystemLog> spec = buildSpecification(queryRequest);
        
        // 查询所有符合条件的日志
        List<SystemLog> logs = systemLogRepository.findAll(spec, Sort.by(Sort.Direction.DESC, "time"));
        
        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        try (PrintWriter writer = new PrintWriter(outputStream)) {
            writer.println("系统日志导出报告");
            writer.println("导出时间: " + LocalDateTime.now().format(DATE_TIME_FORMATTER));
            writer.println("日志类型: " + (queryRequest.getLogType() != null && !queryRequest.getLogType().equals("all") ? queryRequest.getLogType() : "全部"));
            writer.println("时间范围: " + (queryRequest.getStartDate() != null ? queryRequest.getStartDate() : "不限") + 
                    " 至 " + (queryRequest.getEndDate() != null ? queryRequest.getEndDate() : "不限"));
            writer.println("关键词: " + (queryRequest.getKeyword() != null ? queryRequest.getKeyword() : "无"));
            writer.println("总记录数: " + logs.size());
            writer.println("----------------------------------------");
            writer.println();
            
            for (SystemLog log : logs) {
                writer.println("ID: " + log.getId());
                writer.println("时间: " + log.getTime().format(DATE_TIME_FORMATTER));
                writer.println("类型: " + log.getType());
                writer.println("级别: " + log.getLevel());
                writer.println("来源: " + log.getSource());
                writer.println("用户: " + log.getUser());
                writer.println("IP地址: " + log.getIp());
                writer.println("消息: " + log.getMessage());
                writer.println("详情: ");
                writer.println(log.getDetails());
                writer.println("----------------------------------------");
                writer.println();
            }
        }
        
        return outputStream;
    }

    @Override
    public ByteArrayOutputStream exportLogsAsExcel(LogQueryRequest queryRequest) {
        // 创建动态查询条件
        Specification<SystemLog> spec = buildSpecification(queryRequest);
        
        // 查询所有符合条件的日志
        List<SystemLog> logs = systemLogRepository.findAll(spec, Sort.by(Sort.Direction.DESC, "time"));
        
        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        
        try (Workbook workbook = new XSSFWorkbook()) {
            // 创建样式
            CellStyle headerStyle = workbook.createCellStyle();
            Font headerFont = workbook.createFont();
            headerFont.setBold(true);
            headerStyle.setFont(headerFont);
            
            // 创建工作表
            Sheet sheet = workbook.createSheet("系统日志");
            
            // 创建标题行
            Row headerRow = sheet.createRow(0);
            String[] columns = {"ID", "时间", "类型", "级别", "来源", "消息", "用户", "IP地址", "详情"};
            
            for (int i = 0; i < columns.length; i++) {
                Cell cell = headerRow.createCell(i);
                cell.setCellValue(columns[i]);
                cell.setCellStyle(headerStyle);
                sheet.setColumnWidth(i, 5000);
            }
            
            // 填充数据
            int rowNum = 1;
            for (SystemLog log : logs) {
                Row row = sheet.createRow(rowNum++);
                
                row.createCell(0).setCellValue(log.getId());
                row.createCell(1).setCellValue(log.getTime().format(DATE_TIME_FORMATTER));
                row.createCell(2).setCellValue(log.getType());
                row.createCell(3).setCellValue(log.getLevel());
                row.createCell(4).setCellValue(log.getSource());
                row.createCell(5).setCellValue(log.getMessage());
                row.createCell(6).setCellValue(log.getUser());
                row.createCell(7).setCellValue(log.getIp());
                row.createCell(8).setCellValue(log.getDetails());
            }
            
            // 写入输出流
            workbook.write(outputStream);
            
        } catch (IOException e) {
            throw new RuntimeException("导出Excel失败", e);
        }
        
        return outputStream;
    }

    @Override
    public SystemLogResponse getLogById(Long id) {
        SystemLog log = systemLogRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("日志", "id", id));
        
        return convertToSystemLogResponse(log);
    }
    
    /**
     * 构建动态查询条件
     */
    private Specification<SystemLog> buildSpecification(LogQueryRequest queryRequest) {
        return (root, query, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();
            
            // 日志类型过滤
            if (queryRequest.getLogType() != null && !queryRequest.getLogType().equals("all")) {
                predicates.add(criteriaBuilder.equal(root.get("type"), queryRequest.getLogType()));
            }
            
            // 时间范围过滤
            if (queryRequest.getStartDate() != null) {
                LocalDateTime startDateTime = LocalDateTime.of(queryRequest.getStartDate(), LocalTime.MIN);
                predicates.add(criteriaBuilder.greaterThanOrEqualTo(root.get("time"), startDateTime));
            }
            
            if (queryRequest.getEndDate() != null) {
                LocalDateTime endDateTime = LocalDateTime.of(queryRequest.getEndDate(), LocalTime.MAX);
                predicates.add(criteriaBuilder.lessThanOrEqualTo(root.get("time"), endDateTime));
            }
            
            // 关键词搜索
            if (queryRequest.getKeyword() != null && !queryRequest.getKeyword().isEmpty()) {
                String keyword = "%" + queryRequest.getKeyword().toLowerCase() + "%";
                Predicate messagePredicate = criteriaBuilder.like(criteriaBuilder.lower(root.get("message")), keyword);
                Predicate sourcePredicate = criteriaBuilder.like(criteriaBuilder.lower(root.get("source")), keyword);
                Predicate userPredicate = criteriaBuilder.like(criteriaBuilder.lower(root.get("user")), keyword);
                Predicate detailsPredicate = criteriaBuilder.like(criteriaBuilder.lower(root.get("details")), keyword);
                
                predicates.add(criteriaBuilder.or(messagePredicate, sourcePredicate, userPredicate, detailsPredicate));
            }
            
            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        };
    }
    
    /**
     * 将实体转换为响应对象
     */
    private SystemLogResponse convertToSystemLogResponse(SystemLog log) {
        return SystemLogResponse.builder()
                .id(log.getId())
                .type(log.getType())
                .level(log.getLevel())
                .time(log.getTime().format(DATE_TIME_FORMATTER))
                .source(log.getSource())
                .message(log.getMessage())
                .details(log.getDetails())
                .user(log.getUser())
                .ip(log.getIp())
                .build();
    }
}