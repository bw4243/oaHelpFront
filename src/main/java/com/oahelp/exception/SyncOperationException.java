package com.oahelp.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

/**
 * 同步操作异常
 */
@ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
public class SyncOperationException extends RuntimeException {
    
    public SyncOperationException(String message) {
        super(message);
    }
    
    public SyncOperationException(String message, Throwable cause) {
        super(message, cause);
    }
}