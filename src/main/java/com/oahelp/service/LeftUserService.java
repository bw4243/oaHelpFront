package com.oahelp.service;

import java.time.LocalDate;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.oahelp.entity.LeftUser;
import com.oahelp.repository.LeftUserRepository;

/**
 * 离职用户服务类
 */
@Service
public class LeftUserService {
    
    @Autowired
    private LeftUserRepository leftUserRepository;
    
    /**
     * 获取所有离职用户
     */
    public List<LeftUser> getAllLeftUsers() {
        return leftUserRepository.findAll();
    }
    
    /**
     * 根据ID获取离职用户
     */
    public LeftUser getLeftUserById(Long id) {
        return leftUserRepository.findById(id).orElse(null);
    }
    
    /**
     * 保存离职用户
     */
    @Transactional
    public LeftUser saveLeftUser(LeftUser leftUser) {
        return leftUserRepository.save(leftUser);
    }
    
    /**
     * 删除离职用户
     */
    @Transactional
    public void deleteLeftUser(Long id) {
        leftUserRepository.deleteById(id);
    }
    
    /**
     * 根据部门查询离职用户
     */
    public List<LeftUser> getLeftUsersByDepartment(String department) {
        return leftUserRepository.findByDepartment(department);
    }
    
    /**
     * 根据离职日期查询离职用户
     */
    public List<LeftUser> getLeftUsersByLeaveDate(LocalDate leaveDate) {
        return leftUserRepository.findByLeaveDate(leaveDate);
    }
    
    /**
     * 根据关键词搜索离职用户
     */
    public List<LeftUser> searchLeftUsersByKeyword(String keyword) {
        return leftUserRepository.searchByKeyword(keyword);
    }
    
    /**
     * 根据流程类型查询离职用户
     */
    public List<LeftUser> getLeftUsersByWorkflowType(String workflowType) {
        return leftUserRepository.findByWorkflowType(workflowType);
    }
    
    /**
     * 根据复合条件查询离职用户
     */
    public List<LeftUser> getLeftUsersByFilters(String department, String leaveDateStr, String workflowType, String keyword) {
        LocalDate leaveDate = null;
        if (leaveDateStr != null && !leaveDateStr.isEmpty()) {
            leaveDate = LocalDate.parse(leaveDateStr);
        }
        
        return leftUserRepository.findByFilters(
                department != null ? department : "all",
                leaveDate,
                workflowType != null ? workflowType : "all",
                keyword != null ? keyword : "");
    }
}