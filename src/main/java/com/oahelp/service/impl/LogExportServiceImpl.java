package com.oahelp.service.impl;

import com.oahelp.entity.SystemLog;
import com.oahelp.payload.LogQueryRequest;
import com.oahelp.repository.SystemLogRepository;
import com.oahelp.service.LogExportService;
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
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

/**
 * 日志导出服务实现类
 */
@Service
@RequiredArgsConstructor
public class LogExportServiceImpl implements LogExportService {

    private final SystemLogRepository systemLogRepository;
    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd");
    private static final DateTimeFormatter TIME_FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

    @Override
    public void exportToExcel(LogQueryRequest queryRequest, HttpServletResponse response) throws IOException {
        // 设置响应头
        response.setContentType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        response.setHeader("Content-Disposition", "attachment; filename=system_logs_" + 
                LocalDate.now().format(DATE_FORMATTER) + ".xlsx");

        // 创建工作簿和工作表
        try (Workbook workbook = new XSSFWorkbook()) {
            Sheet sheet = workbook.createSheet("系统日志");

            // 创建标题行样式
            CellStyle headerStyle = workbook.createCellStyle();
            Font headerFont = workbook.createFont();
            headerFont.setBold(true);
            headerStyle.setFont(headerFont);
            headerStyle.setAlignment(HorizontalAlignment.CENTER);

            // 创建标题行
            Row headerRow = sheet.createRow(0);
            String[] columns = {"ID", "类型", "级别", "时间", "来源", "消息", "详情", "用户", "IP地址"};
            
            for (int i = 0; i < columns.length; i++) {
                Cell cell = headerRow.createCell(i);
                cell.setCellValue(columns[i]);
                cell.setCellStyle(headerStyle);
            }

            // 查询日志数据
            List<SystemLog> logs = queryLogs(queryRequest);
            
            // 填充数据行
            int rowNum = 1;
            for (SystemLog log : logs) {
                Row row = sheet.createRow(rowNum++);
                
                row.createCell(0).setCellValue(log.getId());
                row.createCell(1).setCellValue(log.getType());
                row.createCell(2).setCellValue(log.getLevel());
                row.createCell(3).setCellValue(log.getTime().format(TIME_FORMATTER));
                row.createCell(4).setCellValue(log.getSource());
                row.createCell(5).setCellValue(log.getMessage());
                row.createCell(6).setCellValue(log.getDetails());
                row.createCell(7).setCellValue(log.getUser());
                row.createCell(8).setCellValue(log.getIp());
            }
            
            // 自动调整列宽
            for (int i = 0; i < columns.length; i++) {
                sheet.autoSizeColumn(i);
            }
            
            // 写入响应
            workbook.write(response.getOutputStream());
        }
    }

    @Override
    public void exportToCsv(LogQueryRequest queryRequest, HttpServletResponse response) throws IOException {
        // 设置响应头
        response.setContentType("text/csv");
        response.setHeader("Content-Disposition", "attachment; filename=system_logs_" + 
                LocalDate.now().format(DATE_FORMATTER) + ".csv");
        
        // 查询日志数据
        List<SystemLog> logs = queryLogs(queryRequest);
        
        // 写入CSV
        try (PrintWriter writer = response.getWriter()) {
            // 写入CSV头
            writer.println("ID,类型,级别,时间,来源,消息,详情,用户,IP地址");
            
            // 写入数据行
            for (SystemLog log : logs) {
                writer.println(
                    escapeForCsv(log.getId()) + "," +
                    escapeForCsv(log.getType()) + "," +
                    escapeForCsv(log.getLevel()) + "," +
                    escapeForCsv(log.getTime().format(TIME_FORMATTER)) + "," +
                    escapeForCsv(log.getSource()) + "," +
                    escapeForCsv(log.getMessage()) + "," +
                    escapeForCsv(log.getDetails()) + "," +
                    escapeForCsv(log.getUser()) + "," +
                    escapeForCsv(log.getIp())
                );
            }
        }
    }
    
    /**
     * 根据查询条件获取日志列表
     */
    private List<SystemLog> queryLogs(LogQueryRequest queryRequest) {
        // 创建查询规范
        Specification<SystemLog> spec = (root, query, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();
            
            // 添加类型过滤
            if (queryRequest.getType() != null && !queryRequest.getType().isEmpty()) {
                predicates.add(criteriaBuilder.equal(root.get("type"), queryRequest.getType()));
            }
            
            // 添加级别过滤
            if (queryRequest.getLevel() != null && !queryRequest.getLevel().isEmpty()) {
                predicates.add(criteriaBuilder.equal(root.get("level"), queryRequest.getLevel()));
            }
            
            // 添加用户过滤
            if (queryRequest.getUser() != null && !queryRequest.getUser().isEmpty()) {
                predicates.add(criteriaBuilder.like(root.get("user"), "%" + queryRequest.getUser() + "%"));
            }
            
            // 添加时间范围过滤
            if (queryRequest.getStartDate() != null) {
                LocalDateTime startDateTime = LocalDateTime.of(queryRequest.getStartDate(), LocalTime.MIN);
                predicates.add(criteriaBuilder.greaterThanOrEqualTo(root.get("time"), startDateTime));
            }
            
            if (queryRequest.getEndDate() != null) {
                LocalDateTime endDateTime = LocalDateTime.of(queryRequest.getEndDate(), LocalTime.MAX);
                predicates.add(criteriaBuilder.lessThanOrEqualTo(root.get("time"), endDateTime));
            }
            
            // 添加关键词搜索
            if (queryRequest.getKeyword() != null && !queryRequest.getKeyword().isEmpty()) {
                String keyword = "%" + queryRequest.getKeyword() + "%";
                predicates.add(criteriaBuilder.or(
                    criteriaBuilder.like(root.get("message"), keyword),
                    criteriaBuilder.like(root.get("details"), keyword),
                    criteriaBuilder.like(root.get("source"), keyword)
                ));
            }
            
            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        };
        
        // 创建分页和排序
        Sort sort = Sort.by(Sort.Direction.DESC, "time");
        
        // 导出时不分页，获取所有符合条件的记录
        Page<SystemLog> page = systemLogRepository.findAll(spec, PageRequest.of(0, Integer.MAX_VALUE, sort));
        return page.getContent();
    }
    
    /**
     * 转义CSV字段
     */
    private String escapeForCsv(Object value) {
        if (value == null) {
            return "";
        }
        
        String str = value.toString();
        if (str.contains(",") || str.contains("\"") || str.contains("\n")) {
            // 如果字段包含逗号、引号或换行符，则用引号包围并将引号转义
            return "\"" + str.replace("\"", "\"\"") + "\"";
        }
        return str;
    }
}