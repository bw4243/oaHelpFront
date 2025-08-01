package com.oahelp.service.impl;

import com.oahelp.entity.ApproverDelegate;
import com.oahelp.entity.User;
import com.oahelp.payload.ApproverDelegateRequest;
import com.oahelp.payload.ApproverDelegateResponse;
import com.oahelp.repository.ApproverDelegateRepository;
import com.oahelp.repository.UserRepository;
import com.oahelp.service.ApproverDelegateService;
import com.oahelp.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;

@Service
public class ApproverDelegateServiceImpl implements ApproverDelegateService {

    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

    @Autowired
    private ApproverDelegateRepository delegateRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserService userService;

    @Override
    @Transactional
    public ApproverDelegate createDelegate(ApproverDelegateRequest request, User creator) {
        // 验证委托人和代理人
        User fromUser = userRepository.findById(request.getFromUserId())
                .orElseThrow(() -> new NoSuchElementException("未找到委托人: " + request.getFromUserId()));
        
        User toUser = userRepository.findById(request.getToUserId())
                .orElseThrow(() -> new NoSuchElementException("未找到代理人: " + request.getToUserId()));
        
        // 验证时间范围
        if (request.getStartTime().isAfter(request.getEndTime())) {
            throw new IllegalArgumentException("开始时间不能晚于结束时间");
        }
        
        if (request.getEndTime().isBefore(LocalDateTime.now())) {
            throw new IllegalArgumentException("结束时间不能早于当前时间");
        }
        
        // 创建审批代理
        ApproverDelegate delegate = new ApproverDelegate();
        delegate.setFromUser(fromUser);
        delegate.setToUser(toUser);
        delegate.setStartTime(request.getStartTime());
        delegate.setEndTime(request.getEndTime());
        delegate.setReason(request.getReason());
        delegate.setStatus(ApproverDelegate.DelegateStatus.生效中);
        delegate.setCreatedTime(LocalDateTime.now());
        delegate.setCreatedBy(creator);
        
        return delegateRepository.save(delegate);
    }

    @Override
    @Transactional
    public ApproverDelegate cancelDelegate(Long id, User operator) {
        ApproverDelegate delegate = delegateRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("未找到审批代理: " + id));
        
        // 只有创建人或委托人可以取消
        if (!delegate.getCreatedBy().getId().equals(operator.getId()) && 
            !delegate.getFromUser().getId().equals(operator.getId())) {
            throw new IllegalStateException("只有创建人或委托人可以取消审批代理");
        }
        
        // 只能取消生效中的代理
        if (delegate.getStatus() != ApproverDelegate.DelegateStatus.生效中) {
            throw new IllegalStateException("只能取消生效中的审批代理");
        }
        
        delegate.setStatus(ApproverDelegate.DelegateStatus.已取消);
        return delegateRepository.save(delegate);
    }

    @Override
    public Optional<ApproverDelegate> getDelegateById(Long id) {
        return delegateRepository.findById(id);
    }

    @Override
    public List<ApproverDelegate> getDelegatesByFromUser(User fromUser) {
        return delegateRepository.findByFromUser(fromUser);
    }

    @Override
    public List<ApproverDelegate> getDelegatesByToUser(User toUser) {
        return delegateRepository.findByToUser(toUser);
    }

    @Override
    public List<ApproverDelegate> getDelegatesByStatus(ApproverDelegate.DelegateStatus status) {
        return delegateRepository.findByStatus(status);
    }

    @Override
    public Page<ApproverDelegate> getAllDelegates(Pageable pageable) {
        return delegateRepository.findAll(pageable);
    }

    @Override
    public List<ApproverDelegate> getActiveDelegatesByFromUser(User fromUser) {
        return delegateRepository.findActiveByFromUser(
                fromUser, ApproverDelegate.DelegateStatus.生效中, LocalDateTime.now());
    }

    @Override
    public List<ApproverDelegate> getActiveDelegatesByToUser(User toUser) {
        return delegateRepository.findActiveByToUser(
                toUser, ApproverDelegate.DelegateStatus.生效中, LocalDateTime.now());
    }

    @Override
    @Transactional
    public void updateExpiredDelegates() {
        List<ApproverDelegate> expiredDelegates = delegateRepository.findExpiredDelegates(
                LocalDateTime.now(), ApproverDelegate.DelegateStatus.生效中);
        
        for (ApproverDelegate delegate : expiredDelegates) {
            delegate.setStatus(ApproverDelegate.DelegateStatus.已过期);
            delegateRepository.save(delegate);
        }
    }

    @Override
    public boolean hasActiveDelegate(User user) {
        List<ApproverDelegate> activeDelegates = getActiveDelegatesByFromUser(user);
        return !activeDelegates.isEmpty();
    }

    @Override
    public Optional<User> getDelegateUser(User fromUser) {
        List<ApproverDelegate> activeDelegates = getActiveDelegatesByFromUser(fromUser);
        if (!activeDelegates.isEmpty()) {
            return Optional.of(activeDelegates.get(0).getToUser());
        }
        return Optional.empty();
    }

    @Override
    public ApproverDelegateResponse convertToResponse(ApproverDelegate delegate) {
        ApproverDelegateResponse response = new ApproverDelegateResponse();
        response.setId(delegate.getId());
        response.setFromUser(userService.getUserSummary(delegate.getFromUser()));
        response.setToUser(userService.getUserSummary(delegate.getToUser()));
        response.setStartTime(delegate.getStartTime().format(DATE_FORMATTER));
        response.setEndTime(delegate.getEndTime().format(DATE_FORMATTER));
        response.setReason(delegate.getReason());
        response.setStatus(delegate.getStatus().name());
        response.setCreatedTime(delegate.getCreatedTime().format(DATE_FORMATTER));
        response.setCreatedBy(userService.getUserSummary(delegate.getCreatedBy()));
        return response;
    }
}