# OA帮助系统 - 离职人员待办清理模块

## 项目介绍

本项目是OA帮助系统的离职人员待办清理模块，用于检测并处理离职人员的未完成流程。主要功能包括：

1. 查询离职人员及其待办流程
2. 批量转交待办流程给其他人员
3. 批量作废待办流程
4. 记录操作历史

## 技术栈

- 后端：Spring Boot、Spring Data JPA、MySQL
- 前端：React、Next.js、Tailwind CSS

## 项目结构

```
src/main/java/com/oahelp/
├── config/                 # 配置类
│   ├── WebConfig.java      # Web配置
│   └── DataInitializer.java # 数据初始化
├── controller/             # 控制器
│   └── WorkflowCleanupController.java # 工作流清理控制器
├── dto/                    # 数据传输对象
│   ├── ApiResponseDTO.java # API响应DTO
│   ├── BatchTransferRequestDTO.java # 批量转交请求DTO
│   ├── BatchVoidRequestDTO.java # 批量作废请求DTO
│   └── SearchFiltersDTO.java # 搜索过滤条件DTO
├── entity/                 # 实体类
│   ├── LeftUser.java       # 离职用户实体
│   ├── OperationHistory.java # 操作历史实体
│   ├── PendingWorkflow.java # 待办流程实体
│   └── TransferTarget.java # 转交目标实体
├── exception/              # 异常处理
│   ├── BusinessException.java # 业务异常
│   └── GlobalExceptionHandler.java # 全局异常处理器
├── repository/             # 数据访问层
│   ├── LeftUserRepository.java # 离职用户仓库
│   ├── OperationHistoryRepository.java # 操作历史仓库
│   ├── PendingWorkflowRepository.java # 待办流程仓库
│   └── TransferTargetRepository.java # 转交目标仓库
├── service/                # 服务层
│   ├── LeftUserService.java # 离职用户服务
│   └── WorkflowCleanupService.java # 工作流清理服务
└── OaHelpApplication.java  # 应用程序入口
```

## API接口

### 1. 获取离职用户列表

- **URL**: `/api/workflow/cleanup/left-users`
- **方法**: GET
- **参数**:
  - `department`: 部门（可选）
  - `leaveDate`: 离职日期（可选）
  - `workflowType`: 流程类型（可选）
  - `keyword`: 关键词（可选）
- **响应**:
  ```json
  {
    "success": true,
    "message": "操作成功",
    "data": [
      {
        "id": 1,
        "name": "张小明",
        "department": "技术部",
        "position": "高级工程师",
        "leaveDate": "2024-01-10",
        "email": "zhang@company.com",
        "pendingWorkflows": [...],
        "totalPending": 2
      },
      ...
    ]
  }
  ```

### 2. 获取转交目标列表

- **URL**: `/api/workflow/cleanup/transfer-targets`
- **方法**: GET
- **响应**:
  ```json
  {
    "success": true,
    "message": "操作成功",
    "data": [
      {
        "id": 1,
        "name": "刘经理",
        "department": "技术部",
        "position": "部门经理"
      },
      ...
    ]
  }
  ```

### 3. 获取操作历史

- **URL**: `/api/workflow/cleanup/operation-history`
- **方法**: GET
- **响应**:
  ```json
  {
    "success": true,
    "message": "操作成功",
    "data": [
      {
        "id": 1,
        "type": "批量转交",
        "operator": "管理员",
        "time": "2024-01-15 14:30:00",
        "details": "将张小明的2个待办转交给刘经理",
        "status": "已完成"
      },
      ...
    ]
  }
  ```

### 4. 批量转交待办流程

- **URL**: `/api/workflow/cleanup/batch-transfer`
- **方法**: POST
- **请求体**:
  ```json
  {
    "sourceUserIds": [1, 2],
    "targetUserId": 1,
    "transferReason": "离职交接",
    "operator": "管理员"
  }
  ```
- **响应**:
  ```json
  {
    "success": true,
    "message": "批量转交成功",
    "data": {
      "id": 3,
      "type": "批量转交",
      "operator": "管理员",
      "time": "2024-01-16 10:30:00",
      "details": "将张小明, 李小红的待办转交给刘经理，原因：离职交接",
      "status": "已完成"
    }
  }
  ```

### 5. 批量作废待办流程

- **URL**: `/api/workflow/cleanup/batch-void`
- **方法**: POST
- **请求体**:
  ```json
  {
    "userIds": [3, 4],
    "operator": "管理员"
  }
  ```
- **响应**:
  ```json
  {
    "success": true,
    "message": "批量作废成功",
    "data": {
      "id": 4,
      "type": "批量作废",
      "operator": "管理员",
      "time": "2024-01-16 11:30:00",
      "details": "作废王大华, 陈小强的待办流程",
      "status": "已完成"
    }
  }
  ```

## 启动项目

1. 确保已安装MySQL数据库，并创建名为`oahelp`的数据库
2. 修改`application.yml`中的数据库连接信息
3. 运行`OaHelpApplication.java`启动应用程序
4. 访问`http://localhost:8080/oahelp/`