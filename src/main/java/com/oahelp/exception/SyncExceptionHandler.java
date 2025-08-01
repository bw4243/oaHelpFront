package com.oahelp.exception;

import com.oahelp.payload.ApiResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

/**
 * 同步服务异常处理器
 */
@Slf4j
@ControllerAdvice
public class SyncExceptionHandler {

    /**
     * 处理资源未找到异常
     */
    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ApiResponse> handleResourceNotFoundException(ResourceNotFoundException ex) {
        log.error("资源未找到: {}", ex.getMessage());
        return new ResponseEntity<>(
                new ApiResponse(false, ex.getMessage()),
                HttpStatus.NOT_FOUND
        );
    }

    /**
     * 处理同步操作异常
     */
    @ExceptionHandler(SyncOperationException.class)
    public ResponseEntity<ApiResponse> handleSyncOperationException(SyncOperationException ex) {
        log.error("同步操作异常: {}", ex.getMessage());
        return new ResponseEntity<>(
                new ApiResponse(false, ex.getMessage()),
                HttpStatus.INTERNAL_SERVER_ERROR
        );
    }

    /**
     * 处理访问拒绝异常
     */
    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<ApiResponse> handleAccessDeniedException(AccessDeniedException ex) {
        log.error("访问拒绝: {}", ex.getMessage());
        return new ResponseEntity<>(
                new ApiResponse(false, "您没有权限执行此操作"),
                HttpStatus.FORBIDDEN
        );
    }

    /**
     * 处理通用异常
     */
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponse> handleGenericException(Exception ex) {
        log.error("系统异常: {}", ex.getMessage(), ex);
        return new ResponseEntity<>(
                new ApiResponse(false, "处理请求时发生错误，请稍后再试"),
                HttpStatus.INTERNAL_SERVER_ERROR
        );
    }
}