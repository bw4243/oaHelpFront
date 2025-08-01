package com.oahelp.repository;

import com.oahelp.entity.ApproverDelegate;
import com.oahelp.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ApproverDelegateRepository extends JpaRepository<ApproverDelegate, Long> {
    List<ApproverDelegate> findByFromUser(User fromUser);
    
    List<ApproverDelegate> findByToUser(User toUser);
    
    List<ApproverDelegate> findByStatus(ApproverDelegate.DelegateStatus status);
    
    @Query("SELECT d FROM ApproverDelegate d WHERE d.fromUser = :user AND d.status = :status AND :now BETWEEN d.startTime AND d.endTime")
    List<ApproverDelegate> findActiveByFromUser(
            @Param("user") User user,
            @Param("status") ApproverDelegate.DelegateStatus status,
            @Param("now") LocalDateTime now);
    
    @Query("SELECT d FROM ApproverDelegate d WHERE d.toUser = :user AND d.status = :status AND :now BETWEEN d.startTime AND d.endTime")
    List<ApproverDelegate> findActiveByToUser(
            @Param("user") User user,
            @Param("status") ApproverDelegate.DelegateStatus status,
            @Param("now") LocalDateTime now);
    
    @Query("SELECT d FROM ApproverDelegate d WHERE d.endTime < :now AND d.status = :status")
    List<ApproverDelegate> findExpiredDelegates(
            @Param("now") LocalDateTime now,
            @Param("status") ApproverDelegate.DelegateStatus status);
}