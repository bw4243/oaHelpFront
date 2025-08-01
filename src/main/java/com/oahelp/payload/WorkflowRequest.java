package com.oahelp.payload;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.List;

@Data
public class WorkflowRequest {
    
    @NotBlank(message = "标题不能为空")
    private String title;
    
    @NotBlank(message = "流程类型不能为空")
    private String type;
    
    @NotBlank(message = "流程内容不能为空")
    private String content;
    
    @NotEmpty(message = "流程节点不能为空")
    private List<WorkflowNodeRequest> nodes;
    
    @NotEmpty(message = "流程连接不能为空")
    private List<WorkflowConnectionRequest> connections;
    
    @Data
    public static class WorkflowNodeRequest {
        @NotBlank(message = "节点ID不能为空")
        private String nodeId;
        
        @NotBlank(message = "节点名称不能为空")
        private String name;
        
        @NotBlank(message = "节点类型不能为空")
        private String type;
        
        private Long approverId;
        
        private Integer positionX;
        
        private Integer positionY;
    }
    
    @Data
    public static class WorkflowConnectionRequest {
        @NotBlank(message = "起始节点ID不能为空")
        private String fromNodeId;
        
        @NotBlank(message = "目标节点ID不能为空")
        private String toNodeId;
    }
}