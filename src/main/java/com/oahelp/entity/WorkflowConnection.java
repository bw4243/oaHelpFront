package com.oahelp.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "workflow_connections")
@Data
@NoArgsConstructor
public class WorkflowConnection {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "from_node_id", nullable = false)
    private String fromNodeId;

    @Column(name = "to_node_id", nullable = false)
    private String toNodeId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "workflow_id", nullable = false)
    private Workflow workflow;

    public WorkflowConnection(String fromNodeId, String toNodeId, Workflow workflow) {
        this.fromNodeId = fromNodeId;
        this.toNodeId = toNodeId;
        this.workflow = workflow;
    }
}