package com.oahelp.aspect;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.oahelp.annotation.LogOperation;
import com.oahelp.entity.SystemLog;
import com.oahelp.repository.SystemLogRepository;
import com.oahelp.security.UserPrincipal;
import lombok.RequiredArgsConstructor;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.AfterThrowing;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Pointcut;
import org.aspectj.lang.reflect.MethodSignature;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import javax.servlet.http.HttpServletRequest;
import java.time.LocalDateTime;
import java.util.Arrays;

/**
 * 日志记录切面
 * 用于自动记录系统异常日志
 */
@Aspect
@Component
@RequiredArgsConstructor
public class LoggingAspect {

    private static final Logger logger = LoggerFactory.getLogger(LoggingAspect.class);
    private final SystemLogRepository systemLogRepository;

    private final ObjectMapper objectMapper = new ObjectMapper();

    /**
     * 定义切点 - 所有控制器方法
     */
    @Pointcut("execution(* com.oahelp.controller.*.*(..))")
    public void controllerMethods() {
    }

    /**
     * 定义切点 - 所有服务方法
     */
    @Pointcut("execution(* com.oahelp.service.*.*(..))")
    public void serviceMethods() {
    }
    
    /**
     * 定义切点 - 带有LogOperation注解的方法
     */
    @Pointcut("@annotation(com.oahelp.annotation.LogOperation)")
    public void logOperationMethods() {
    }

    /**
     * 异常通知 - 记录控制器异常
     */
    @AfterThrowing(pointcut = "controllerMethods()", throwing = "ex")
    public void logControllerException(JoinPoint joinPoint, Throwable ex) {
        logException(joinPoint, ex, "控制器");
    }

    /**
     * 异常通知 - 记录服务异常
     */
    @AfterThrowing(pointcut = "serviceMethods()", throwing = "ex")
    public void logServiceException(JoinPoint joinPoint, Throwable ex) {
        logException(joinPoint, ex, "服务");
    }
    
    /**
     * 环绕通知 - 记录操作日志
     */
    @Around("logOperationMethods()")
    public Object logOperation(ProceedingJoinPoint joinPoint) throws Throwable {
        // 获取方法签名
        MethodSignature signature = (MethodSignature) joinPoint.getSignature();
        LogOperation logOperation = signature.getMethod().getAnnotation(LogOperation.class);
        
        if (logOperation == null) {
            return joinPoint.proceed();
        }
        
        // 获取请求信息
        String ip = "未知";
        String username = "系统";
        
        try {
            ServletRequestAttributes attributes = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
            if (attributes != null) {
                HttpServletRequest request = attributes.getRequest();
                ip = getClientIp(request);
            }
            
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            if (authentication != null && authentication.getPrincipal() instanceof UserPrincipal) {
                UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
                username = userPrincipal.getUsername();
            }
        } catch (Exception e) {
            logger.warn("获取请求信息失败", e);
        }
        
        // 记录请求参数
        String params = "";
        if (logOperation.recordParams()) {
            try {
                params = objectMapper.writeValueAsString(joinPoint.getArgs());
            } catch (Exception e) {
                params = Arrays.toString(joinPoint.getArgs());
            }
        }
        
        // 执行方法
        Object result = null;
        long startTime = System.currentTimeMillis();
        try {
            result = joinPoint.proceed();
            return result;
        } finally {
            long endTime = System.currentTimeMillis();
            long duration = endTime - startTime;
            
            // 记录返回结果
            String resultStr = "";
            if (logOperation.recordResult() && result != null) {
                try {
                    resultStr = objectMapper.writeValueAsString(result);
                } catch (Exception e) {
                    resultStr = result.toString();
                }
            }
            
            // 构建详情
            StringBuilder details = new StringBuilder();
            details.append("方法: ").append(signature.getDeclaringType().getSimpleName())
                   .append(".").append(signature.getName()).append("\n");
            
            if (!params.isEmpty()) {
                details.append("参数: ").append(params).append("\n");
            }
            
            if (!resultStr.isEmpty()) {
                details.append("结果: ").append(resultStr).append("\n");
            }
            
            details.append("执行时间: ").append(duration).append("ms");
            
            // 创建并保存系统日志
            SystemLog systemLog = SystemLog.builder()
                    .type(logOperation.type())
                    .level("INFO")
                    .time(LocalDateTime.now())
                    .source(signature.getDeclaringType().getSimpleName())
                    .message(logOperation.description())
                    .details(details.toString())
                    .user(username)
                    .ip(ip)
                    .build();
            
            systemLogRepository.save(systemLog);
        }
    }

    /**
     * 记录异常日志
     */
    private void logException(JoinPoint joinPoint, Throwable ex, String source) {
        try {
            // 获取方法签名
            MethodSignature signature = (MethodSignature) joinPoint.getSignature();
            String className = signature.getDeclaringType().getSimpleName();
            String methodName = signature.getName();
            
            // 获取请求信息
            String ip = "未知";
            String username = "系统";
            
            try {
                ServletRequestAttributes attributes = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
                if (attributes != null) {
                    HttpServletRequest request = attributes.getRequest();
                    ip = getClientIp(request);
                }
                
                Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
                if (authentication != null && authentication.getPrincipal() instanceof UserPrincipal) {
                    UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
                    username = userPrincipal.getUsername();
                }
            } catch (Exception e) {
                logger.warn("获取请求信息失败", e);
            }
            
            // 构建异常详情
            StringBuilder details = new StringBuilder();
            details.append("异常类型: ").append(ex.getClass().getName()).append("\n");
            details.append("异常消息: ").append(ex.getMessage()).append("\n");
            details.append("方法: ").append(className).append(".").append(methodName).append("\n");
            details.append("参数: ").append(Arrays.toString(joinPoint.getArgs())).append("\n");
            details.append("堆栈跟踪: \n");
            
            // 添加堆栈跟踪（最多10行）
            int count = 0;
            for (StackTraceElement element : ex.getStackTrace()) {
                details.append("  at ").append(element).append("\n");
                if (++count >= 10) {
                    details.append("  ... 更多堆栈信息省略 ...\n");
                    break;
                }
            }
            
            // 创建并保存系统日志
            SystemLog systemLog = SystemLog.builder()
                    .type("系统异常")
                    .level("ERROR")
                    .time(LocalDateTime.now())
                    .source(className)
                    .message(source + "执行异常: " + ex.getMessage())
                    .details(details.toString())
                    .user(username)
                    .ip(ip)
                    .build();
            
            systemLogRepository.save(systemLog);
            
        } catch (Exception e) {
            logger.error("记录系统异常日志失败", e);
        }
    }
    
    /**
     * 获取客户端IP地址
     */
    private String getClientIp(HttpServletRequest request) {
        String ip = request.getHeader("X-Forwarded-For");
        if (ip == null || ip.isEmpty() || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getHeader("Proxy-Client-IP");
        }
        if (ip == null || ip.isEmpty() || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getHeader("WL-Proxy-Client-IP");
        }
        if (ip == null || ip.isEmpty() || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getHeader("HTTP_CLIENT_IP");
        }
        if (ip == null || ip.isEmpty() || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getHeader("HTTP_X_FORWARDED_FOR");
        }
        if (ip == null || ip.isEmpty() || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getRemoteAddr();
        }
        return ip;
    }
}