package com.oahelp.repository;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.oahelp.entity.VirtualAccount;

@Repository
public interface VirtualAccountRepository extends JpaRepository<VirtualAccount, Long> {
    
    List<VirtualAccount> findBySource(String source);
    
    List<VirtualAccount> findByDepartment(String department);
    
    List<VirtualAccount> findByRiskLevel(String riskLevel);
    
    @Query("SELECT v FROM VirtualAccount v WHERE v.lastLoginTime IS NULL OR v.lastLoginTime < :date")
    List<VirtualAccount> findByLastLoginTimeBefore(@Param("date") LocalDateTime date);
    
    @Query("SELECT v FROM VirtualAccount v WHERE v.lastLoginTime IS NULL")
    List<VirtualAccount> findByNeverLogin();
    
    @Query("SELECT v FROM VirtualAccount v WHERE " +
           "(:source = 'all' OR v.source = :source) AND " +
           "(:department = 'all' OR v.department = :department) AND " +
           "(:riskLevel = 'all' OR v.riskLevel = :riskLevel) AND " +
           "(:keyword = '' OR LOWER(v.username) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(v.displayName) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(v.department) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(v.email) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(v.creator) LIKE LOWER(CONCAT('%', :keyword, '%')))")
    List<VirtualAccount> findByFilters(
            @Param("source") String source,
            @Param("department") String department,
            @Param("riskLevel") String riskLevel,
            @Param("keyword") String keyword);
}