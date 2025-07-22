"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import {
  UserX,
  Search,
  Filter,
  Trash2,
  ArrowRight,
  FileText,
  AlertTriangle,
  History,
  Loader2,
  X,
  Users,
} from "lucide-react"

export default function OrganizationCleanup() {
  const [selectedUsers, setSelectedUsers] = useState<string[]>([])
  const [transferTarget, setTransferTarget] = useState("")
  const [transferReason, setTransferReason] = useState("")
  const [isTransferring, setIsTransferring] = useState(false)
  const [isVoiding, setIsVoiding] = useState(false)

  // 搜索条件状态
  const [searchFilters, setSearchFilters] = useState({
    department: "all",
    leaveDate: "",
    workflowType: "all",
    keyword: "",
  })

  // 模拟离职用户数据
  const leftUsers = [
    {
      id: "user1",
      name: "张小明",
      department: "技术部",
      position: "高级工程师",
      leaveDate: "2024-01-10",
      email: "zhang@company.com",
      pendingWorkflows: [
        { id: "wf1", title: "服务器采购申请", type: "采购流程", submitTime: "2024-01-08", priority: "高" },
        { id: "wf2", title: "技术方案审批", type: "技术审批", submitTime: "2024-01-09", priority: "中" },
      ],
      totalPending: 2,
    },
    {
      id: "user2",
      name: "李小红",
      department: "财务部",
      position: "会计主管",
      leaveDate: "2024-01-12",
      email: "li@company.com",
      pendingWorkflows: [
        { id: "wf3", title: "差旅费报销", type: "报销流程", submitTime: "2024-01-11", priority: "中" },
        { id: "wf4", title: "预算审批", type: "财务审批", submitTime: "2024-01-10", priority: "高" },
        { id: "wf5", title: "合同付款", type: "付款流程", submitTime: "2024-01-09", priority: "紧急" },
      ],
      totalPending: 3,
    },
    {
      id: "user3",
      name: "王大华",
      department: "市场部",
      position: "市场经理",
      leaveDate: "2024-01-14",
      email: "wang@company.com",
      pendingWorkflows: [
        { id: "wf6", title: "营销活动申请", type: "活动审批", submitTime: "2024-01-13", priority: "中" },
      ],
      totalPending: 1,
    },
    {
      id: "user4",
      name: "陈小强",
      department: "人事部",
      position: "HR专员",
      leaveDate: "2024-01-15",
      email: "chen@company.com",
      pendingWorkflows: [
        { id: "wf7", title: "员工入职审批", type: "人事流程", submitTime: "2024-01-14", priority: "高" },
        { id: "wf8", title: "薪资调整申请", type: "薪资流程", submitTime: "2024-01-13", priority: "中" },
        { id: "wf9", title: "培训申请", type: "培训流程", submitTime: "2024-01-12", priority: "低" },
        { id: "wf10", title: "考勤异常处理", type: "考勤流程", submitTime: "2024-01-11", priority: "中" },
      ],
      totalPending: 4,
    },
  ]

  // 可用的转交目标
  const transferTargets = [
    { id: "target1", name: "刘经理", department: "技术部", position: "部门经理" },
    { id: "target2", name: "陈会计", department: "财务部", position: "财务经理" },
    { id: "target3", name: "赵主管", department: "市场部", position: "市场主管" },
    { id: "target4", name: "孙经理", department: "人事部", position: "HR经理" },
    { id: "target5", name: "吴总监", department: "管理层", position: "运营总监" },
  ]

  // 操作历史
  const [operationHistory, setOperationHistory] = useState([
    {
      id: "op1",
      type: "批量转交",
      operator: "管理员",
      time: "2024-01-15 14:30",
      details: "将张小明的2个待办转交给刘经理",
      status: "已完成",
    },
    {
      id: "op2",
      type: "批量作废",
      operator: "管理员",
      time: "2024-01-14 16:20",
      details: "作废李小红的1个过期流程",
      status: "已完成",
    },
  ])

  // 过滤后的用户数据
  const filteredUsers = useMemo(() => {
    return leftUsers.filter((user) => {
      // 部门过滤
      if (searchFilters.department !== "all" && user.department !== searchFilters.department) {
        return false
      }

      // 离职日期过滤
      if (searchFilters.leaveDate && user.leaveDate !== searchFilters.leaveDate) {
        return false
      }

      // 流程类型过滤
      if (searchFilters.workflowType !== "all") {
        const hasWorkflowType = user.pendingWorkflows.some((wf) => wf.type.includes(searchFilters.workflowType))
        if (!hasWorkflowType) {
          return false
        }
      }

      // 关键词搜索
      if (searchFilters.keyword) {
        const keyword = searchFilters.keyword.toLowerCase()
        return (
          user.name.toLowerCase().includes(keyword) ||
          user.department.toLowerCase().includes(keyword) ||
          user.position.toLowerCase().includes(keyword) ||
          user.pendingWorkflows.some((wf) => wf.title.toLowerCase().includes(keyword))
        )
      }

      return true
    })
  }, [searchFilters])

  const handleUserSelect = (userId: string, checked: boolean) => {
    if (checked) {
      setSelectedUsers([...selectedUsers, userId])
    } else {
      setSelectedUsers(selectedUsers.filter((id) => id !== userId))
    }
  }

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedUsers(filteredUsers.map((u) => u.id))
    } else {
      setSelectedUsers([])
    }
  }

  const handleBatchTransfer = async () => {
    setIsTransferring(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // 创建操作记录
      const selectedUserNames = filteredUsers
        .filter((u) => selectedUsers.includes(u.id))
        .map((u) => u.name)
        .join(", ")

      const targetName = transferTargets.find((t) => t.id === transferTarget)?.name

      const newOperation = {
        id: `op${Date.now()}`,
        type: "批量转交",
        operator: "管理员",
        time: new Date().toLocaleString("zh-CN"),
        details: `将${selectedUserNames}的待办转交给${targetName}`,
        status: "已完成",
      }

      setOperationHistory([newOperation, ...operationHistory])

      // 重置表单
      setSelectedUsers([])
      setTransferTarget("")
      setTransferReason("")
    } finally {
      setIsTransferring(false)
    }
  }

  const handleBatchVoid = async () => {
    setIsVoiding(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500))

      const selectedUserNames = filteredUsers
        .filter((u) => selectedUsers.includes(u.id))
        .map((u) => u.name)
        .join(", ")

      const newOperation = {
        id: `op${Date.now()}`,
        type: "批量作废",
        operator: "管理员",
        time: new Date().toLocaleString("zh-CN"),
        details: `作废${selectedUserNames}的待办流程`,
        status: "已完成",
      }

      setOperationHistory([newOperation, ...operationHistory])
      setSelectedUsers([])
    } finally {
      setIsVoiding(false)
    }
  }

  const getPriorityBadge = (priority: string) => {
    const variants = {
      紧急: "bg-gradient-to-r from-red-500 to-red-600 text-white animate-pulse",
      高: "bg-gradient-to-r from-orange-500 to-orange-600 text-white",
      中: "bg-gradient-to-r from-blue-500 to-blue-600 text-white",
      低: "bg-gradient-to-r from-gray-500 to-gray-600 text-white",
    }
    return <Badge className={variants[priority as keyof typeof variants]}>{priority}</Badge>
  }

  const handleClearSearch = () => {
    setSearchFilters({
      department: "all",
      leaveDate: "",
      workflowType: "all",
      keyword: "",
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* 页面标题 */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-red-600 to-pink-600 rounded-2xl shadow-lg">
            <UserX className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
              离职人员待办清理
            </h1>
            <p className="text-lg text-gray-600 mt-2">检测并处理离职人员的未完成流程</p>
          </div>
        </div>

        {/* 搜索筛选区域 */}
        <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg">
                  <Filter className="w-5 h-5 text-white" />
                </div>
                <CardTitle className="text-xl">搜索筛选</CardTitle>
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant="outline" className="text-sm">
                  找到 {filteredUsers.length} 个离职用户
                </Badge>
                {(searchFilters.department !== "all" ||
                  searchFilters.leaveDate ||
                  searchFilters.workflowType !== "all" ||
                  searchFilters.keyword) && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleClearSearch}
                    className="text-gray-600 hover:text-gray-800 bg-transparent"
                  >
                    <X className="w-4 h-4 mr-1" />
                    清除
                  </Button>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* 关键词搜索 */}
              <div className="space-y-3">
                <Label className="text-sm font-medium text-gray-700">关键词搜索</Label>
                <div className="relative">
                  <Input
                    placeholder="搜索姓名、部门、职位、流程标题..."
                    value={searchFilters.keyword}
                    onChange={(e) => setSearchFilters((prev) => ({ ...prev, keyword: e.target.value }))}
                    className="border-2 border-gray-200 focus:border-blue-500 transition-colors pl-10"
                  />
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                </div>
              </div>

              {/* 筛选条件 */}
              <div className="grid gap-6 md:grid-cols-4">
                <div className="space-y-3">
                  <Label className="text-sm font-medium text-gray-700">部门</Label>
                  <Select
                    value={searchFilters.department}
                    onValueChange={(value) => setSearchFilters((prev) => ({ ...prev, department: value }))}
                  >
                    <SelectTrigger className="border-2 border-gray-200 focus:border-blue-500 transition-colors">
                      <SelectValue placeholder="选择部门" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">全部部门</SelectItem>
                      <SelectItem value="技术部">技术部</SelectItem>
                      <SelectItem value="财务部">财务部</SelectItem>
                      <SelectItem value="市场部">市场部</SelectItem>
                      <SelectItem value="人事部">人事部</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-3">
                  <Label className="text-sm font-medium text-gray-700">离职日期</Label>
                  <Input
                    type="date"
                    value={searchFilters.leaveDate}
                    onChange={(e) => setSearchFilters((prev) => ({ ...prev, leaveDate: e.target.value }))}
                    className="border-2 border-gray-200 focus:border-blue-500 transition-colors"
                  />
                </div>
                <div className="space-y-3">
                  <Label className="text-sm font-medium text-gray-700">流程类型</Label>
                  <Select
                    value={searchFilters.workflowType}
                    onValueChange={(value) => setSearchFilters((prev) => ({ ...prev, workflowType: value }))}
                  >
                    <SelectTrigger className="border-2 border-gray-200 focus:border-blue-500 transition-colors">
                      <SelectValue placeholder="选择流程类型" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">全部类型</SelectItem>
                      <SelectItem value="采购">采购流程</SelectItem>
                      <SelectItem value="报销">报销流程</SelectItem>
                      <SelectItem value="审批">审批流程</SelectItem>
                      <SelectItem value="人事">人事流程</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-end">
                  <Button
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                    onClick={() => console.log("执行搜索", searchFilters)}
                  >
                    <Search className="mr-2 h-4 w-4" />
                    搜索
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 批量操作区 */}
        <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
          <CardHeader className="pb-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg">
                <Users className="w-5 h-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-xl">批量操作</CardTitle>
                <CardDescription className="text-gray-600">
                  已选择 {selectedUsers.length} 个用户，共{" "}
                  {filteredUsers
                    .filter((u) => selectedUsers.includes(u.id))
                    .reduce((sum, u) => sum + u.totalPending, 0)}{" "}
                  个待办
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label>转交目标</Label>
                <Select value={transferTarget} onValueChange={setTransferTarget}>
                  <SelectTrigger>
                    <SelectValue placeholder="选择转交目标" />
                  </SelectTrigger>
                  <SelectContent>
                    {transferTargets.map((target) => (
                      <SelectItem key={target.id} value={target.id}>
                        <div className="flex flex-col">
                          <span className="font-medium">{target.name}</span>
                          <span className="text-xs text-gray-500">
                            {target.department} · {target.position}
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>转交理由</Label>
                <Textarea
                  placeholder="请输入转交理由..."
                  value={transferReason}
                  onChange={(e) => setTransferReason(e.target.value)}
                  className="border-2 border-gray-200 focus:border-purple-500 transition-colors"
                />
              </div>
              <div className="flex flex-col justify-end space-y-2">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                      disabled={selectedUsers.length === 0 || !transferTarget}
                    >
                      <ArrowRight className="mr-2 h-4 w-4" />
                      批量转交
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>确认批量转交</DialogTitle>
                      <DialogDescription>将选中用户的待办流程转交给指定人员</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="font-medium text-gray-700">转交目标</p>
                            <p className="text-gray-900">
                              {transferTargets.find((t) => t.id === transferTarget)?.name}
                            </p>
                          </div>
                          <div>
                            <p className="font-medium text-gray-700">影响用户</p>
                            <p className="text-gray-900">{selectedUsers.length} 个</p>
                          </div>
                          <div>
                            <p className="font-medium text-gray-700">待办数量</p>
                            <p className="text-gray-900">
                              {filteredUsers
                                .filter((u) => selectedUsers.includes(u.id))
                                .reduce((sum, u) => sum + u.totalPending, 0)}{" "}
                              个
                            </p>
                          </div>
                          <div>
                            <p className="font-medium text-gray-700">转交理由</p>
                            <p className="text-gray-900">{transferReason || "无"}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" disabled={isTransferring}>
                        取消
                      </Button>
                      <Button
                        onClick={handleBatchTransfer}
                        disabled={isTransferring}
                        className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                      >
                        {isTransferring ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            转交中...
                          </>
                        ) : (
                          "确认转交"
                        )}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      className="border-red-200 text-red-700 hover:bg-red-50 bg-transparent"
                      disabled={selectedUsers.length === 0}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      批量作废
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle className="flex items-center space-x-2">
                        <AlertTriangle className="w-5 h-5 text-red-500" />
                        <span>确认批量作废</span>
                      </DialogTitle>
                      <DialogDescription>此操作将作废选中用户的所有待办流程，操作不可撤销</DialogDescription>
                    </DialogHeader>
                    <div className="p-4 bg-gradient-to-r from-red-50 to-pink-50 rounded-xl border border-red-200">
                      <div className="text-sm space-y-2">
                        <div className="flex justify-between">
                          <span className="font-medium text-gray-700">影响用户:</span>
                          <span className="text-gray-900">{selectedUsers.length} 个</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-medium text-gray-700">待办数量:</span>
                          <span className="text-gray-900">
                            {filteredUsers
                              .filter((u) => selectedUsers.includes(u.id))
                              .reduce((sum, u) => sum + u.totalPending, 0)}{" "}
                            个
                          </span>
                        </div>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" disabled={isVoiding}>
                        取消
                      </Button>
                      <Button
                        onClick={handleBatchVoid}
                        disabled={isVoiding}
                        className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800"
                      >
                        {isVoiding ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            作废中...
                          </>
                        ) : (
                          "确认作废"
                        )}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 离职用户列表 */}
        <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg">
                  <FileText className="w-5 h-5 text-white" />
                </div>
                <div>
                  <CardTitle className="text-xl">离职用户待办列表</CardTitle>
                  <CardDescription className="text-gray-600">显示有未完成流程的离职用户</CardDescription>
                </div>
              </div>
              <Badge className="bg-gradient-to-r from-red-500 to-red-600 text-white px-3 py-1">
                {filteredUsers.reduce((sum, u) => sum + u.totalPending, 0)} 个待办
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-hidden rounded-xl border border-gray-200">
              <Table>
                <TableHeader className="bg-gradient-to-r from-gray-50 to-gray-100">
                  <TableRow>
                    <TableHead className="w-12">
                      <Checkbox
                        checked={selectedUsers.length === filteredUsers.length && filteredUsers.length > 0}
                        onCheckedChange={handleSelectAll}
                      />
                    </TableHead>
                    <TableHead className="font-semibold text-gray-700">姓名</TableHead>
                    <TableHead className="font-semibold text-gray-700">部门/职位</TableHead>
                    <TableHead className="font-semibold text-gray-700">离职日期</TableHead>
                    <TableHead className="font-semibold text-gray-700">待办数量</TableHead>
                    <TableHead className="font-semibold text-gray-700">待办详情</TableHead>
                    <TableHead className="font-semibold text-gray-700">操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow
                      key={user.id}
                      className="hover:bg-gradient-to-r hover:from-orange-50 hover:to-red-50 transition-all duration-200"
                    >
                      <TableCell>
                        <Checkbox
                          checked={selectedUsers.includes(user.id)}
                          onCheckedChange={(checked) => handleUserSelect(user.id, checked as boolean)}
                        />
                      </TableCell>
                      <TableCell className="font-medium">{user.name}</TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium text-gray-900">{user.department}</div>
                          <div className="text-sm text-gray-600">{user.position}</div>
                        </div>
                      </TableCell>
                      <TableCell className="text-red-600 font-medium">{user.leaveDate}</TableCell>
                      <TableCell>
                        <Badge className="bg-gradient-to-r from-red-500 to-red-600 text-white">
                          {user.totalPending} 个
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1 max-w-xs">
                          {user.pendingWorkflows.slice(0, 2).map((workflow) => (
                            <div
                              key={workflow.id}
                              className="flex items-center justify-between p-2 bg-gradient-to-r from-gray-50 to-gray-100 rounded text-xs"
                            >
                              <div className="flex-1 truncate">
                                <div className="font-medium text-gray-900">{workflow.title}</div>
                                <div className="text-gray-600">{workflow.type}</div>
                              </div>
                              {getPriorityBadge(workflow.priority)}
                            </div>
                          ))}
                          {user.pendingWorkflows.length > 2 && (
                            <div className="text-xs text-gray-500 text-center">
                              还有 {user.pendingWorkflows.length - 2} 个...
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                size="sm"
                                variant="outline"
                                className="border-blue-200 text-blue-700 hover:bg-blue-50 bg-transparent"
                              >
                                <FileText className="mr-1 h-3 w-3" />
                                详情
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl">
                              <DialogHeader>
                                <DialogTitle>{user.name} - 待办详情</DialogTitle>
                                <DialogDescription>
                                  {user.department} · {user.position} · 离职日期: {user.leaveDate}
                                </DialogDescription>
                              </DialogHeader>
                              <div className="space-y-4">
                                {user.pendingWorkflows.map((workflow) => (
                                  <div
                                    key={workflow.id}
                                    className="p-4 border border-gray-200 rounded-xl bg-gradient-to-r from-gray-50 to-white"
                                  >
                                    <div className="flex items-center justify-between mb-2">
                                      <h4 className="font-medium text-gray-900">{workflow.title}</h4>
                                      {getPriorityBadge(workflow.priority)}
                                    </div>
                                    <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                                      <div>流程类型: {workflow.type}</div>
                                      <div>提交时间: {workflow.submitTime}</div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                              <DialogFooter>
                                <Button variant="outline">关闭</Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* 操作历史 */}
        <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
          <CardHeader className="pb-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-lg">
                <History className="w-5 h-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-xl">操作历史</CardTitle>
                <CardDescription className="text-gray-600">最近的批量处理操作记录</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {operationHistory.map((record) => (
                <div
                  key={record.id}
                  className="flex items-center justify-between p-4 border-2 border-gray-100 rounded-xl hover:border-gray-200 transition-all duration-200 bg-gradient-to-r from-gray-50 to-white"
                >
                  <div className="flex items-center space-x-4">
                    <div
                      className={`p-2 rounded-lg ${
                        record.type === "批量转交"
                          ? "bg-gradient-to-r from-green-500 to-green-600"
                          : "bg-gradient-to-r from-red-500 to-red-600"
                      }`}
                    >
                      {record.type === "批量转交" ? (
                        <ArrowRight className="h-4 w-4 text-white" />
                      ) : (
                        <Trash2 className="h-4 w-4 text-white" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{record.type}</p>
                      <p className="text-sm text-gray-600">{record.details}</p>
                      <p className="text-xs text-gray-500">
                        {record.operator} · {record.time}
                      </p>
                    </div>
                  </div>
                  <Badge
                    className={
                      record.status === "已完成"
                        ? "bg-gradient-to-r from-green-500 to-green-600 text-white"
                        : "bg-gradient-to-r from-blue-500 to-blue-600 text-white"
                    }
                  >
                    {record.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
