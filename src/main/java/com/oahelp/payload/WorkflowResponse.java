package com.oahelp.payload;

import com.oahelp.entity.WorkflowNode;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
public class WorkflowResponse {
    private String id;
    private String workflowCode;
    private String title;
    private String type;
    private UserSummary submitter;
    private String submitTime;
    private String currentNodeId;
    private String status;
    private List<WorkflowNodeResponse> nodes = new ArrayList<>();
    private List<WorkflowConnectionResponse> connections = new ArrayList<>();
    private List<WorkflowHistoryResponse> history = new ArrayList<>();

    @Data
    public static class WorkflowNodeResponse {
        private String id;
        private String name;
        private String type;
        private UserSummary approver;
        private String status;
        private String receivedTime;
        private String completedTime;
        private String deadline;
        private String comment;
        private Position position;

        @Data
        public static class Position {
            private Integer x;
            private Integer y;

            public Position(Integer x, Integer y) {
                this.x = x;
                this.y = y;
            }
        }
    }

    @Data
    public static class WorkflowConnectionResponse {
        private String from;
        private String to;

        public WorkflowConnectionResponse(String from, String to) {
            this.from = from;
            this.to = to;
        }
    }

    @Data
    public static class WorkflowHistoryResponse {
        private String id;
        private String nodeId;
        private String nodeName;
        private UserSummary approver;
        private String action;
        private String time;
        private String comment;
        private String status;
    }
}