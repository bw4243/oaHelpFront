package com.oahelp.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "workflow_nodes")
@Data
@NoArgsConstructor
public class WorkflowNode {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "node_id", nullable = false)
    private String nodeId;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "type", nullable = false)
    @Enumerated(EnumType.STRING)
    private NodeType type;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "approver_id")
    private User approver;

    @Column(name = "status", nullable = false)
    @Enumerated(EnumType.STRING)
    private NodeStatus status;

    @Column(name = "received_time")
    private LocalDateTime receivedTime;

    @Column(name = "completed_time")
    private LocalDateTime completedTime;

    @Column(name = "deadline")
    private LocalDateTime deadline;

    @Column(name = "comment", length = 1000)
    private String comment;

    @Column(name = "position_x")
    private Integer positionX;

    @Column(name = "position_y")
    private Integer positionY;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "workflow_id", nullable = false)
    private Workflow workflow;

    public enum NodeType {
        start,
        approval,
        end
    }

    public enum NodeStatus {
        waiting,
        pending,
        completed,
        rejected,
        skipped
    }
}