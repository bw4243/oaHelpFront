package com.oahelp.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "workflow_history")
@Data
@NoArgsConstructor
public class WorkflowHistory {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "node_id")
    private String nodeId;

    @Column(name = "node_name", nullable = false)
    private String nodeName;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "approver_id")
    private User approver;

    @Column(name = "action", nullable = false)
    @Enumerated(EnumType.STRING)
    private ActionType action;

    @Column(name = "action_time", nullable = false)
    private LocalDateTime actionTime;

    @Column(name = "comment", length = 1000)
    private String comment;

    @Column(name = "status", nullable = false)
    @Enumerated(EnumType.STRING)
    private WorkflowNode.NodeStatus status;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "workflow_id", nullable = false)
    private Workflow workflow;

    public enum ActionType {
        提交,
        审批,
        拒绝,
        撤回,
        跳转,
        终止
    }
}