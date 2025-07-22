"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
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
import { Search, UserCheck, History, Filter, Loader2, X, Users, CheckCircle, AlertTriangle } from "lucide-react"

export default function ApproverReplace() {
  const [selectedNodes, setSelectedNodes] = useState<string[]>([])
  const [newApprover, setNewApprover] = useState("")
  const [effectiveTime, setEffectiveTime] = useState("immediate")
  const [isSearching, setIsSearching] = useState(false)

  // 在现有的 useState 声明后添加以下状态
  const [operationResult, setOperationResult] = useState<any>(null)
  const [isReplacing, setIsReplacing] = useState(false)
  const [operationHistory, setOperationHistory] = useState([
    {
      id: "1",
      operation: "批量替换",
      oldApprover: "张经理",
      newApprover: "刘经理",
      affectedNodes: 5,
      operator: "管理员",
      time: "2024-01-15 14:30",
      status: "已完成",
      details: "技术部门经理审批节点替换",
    },
    {
      id: "2",
      operation: "批量替换",
      oldApprover: "李会计",
      newApprover: "陈会计",
      affectedNodes: 3,
      operator: "管理员",
      time: "2024-01-14 09:15",
      status: "已完成",
      details: "财务部审批节点替换",
    },
  ])

  // 添加可用的审批人员数据
  const availableApprovers = [
    { id: "liu", name: "刘经理", department: "技术部", position: "部门经理", email: "liu@company.com" },
    { id: "chen", name: "陈会计", department: "财务部", position: "会计主管", email: "chen@company.com" },
    { id: "zhao", name: "赵律师", department: "法务部", position: "法务经理", email: "zhao@company.com" },
    { id: "sun", name: "孙主管", department: "人事部", position: "HR主管", email: "sun@company.com" },
    { id: "wu", name: "吴总监", department: "管理层", position: "运营总监", email: "wu@company.com" },
    { id: "zhou", name: "周经理", department: "市场部", position: "市场经理", email: "zhou@company.com" },
  ]

  // 搜索条件状态
  const [searchFilters, setSearchFilters] = useState({
    workflowType: "all",
    nodeName: "all",
    department: "all",
    approver: "",
    keyword: "",
  })

  // 模拟的完整审批节点数据
  const allApproverNodes = [
    {
      id: "1",
      workflowType: "请假流程",
      nodeName: "部门经理审批",
      currentApprover: "张经理",
      currentApproverId: "zhang",
      department: "技术部",
      activeCount: 15,
      email: "zhang@company.com",
      lastActive: "2024-01-16 10:30",
    },
    {
      id: "2",
      workflowType: "报销流程",
      nodeName: "财务审批",
      currentApprover: "李会计",
      currentApproverId: "li",
      department: "财务部",
      activeCount: 8,
      email: "li@company.com",
      lastActive: "2024-01-15 16:45",
    },
    {
      id: "3",
      workflowType: "采购流程",
      nodeName: "部门经理审批",
      currentApprover: "张经理",
      currentApproverId: "zhang",
      department: "技术部",
      activeCount: 3,
      email: "zhang@company.com",
      lastActive: "2024-01-14 08:20",
    },
    {
      id: "4",
      workflowType: "合同审批",
      nodeName: "法务审批",
      currentApprover: "王律师",
      currentApproverId: "wang",
      department: "法务部",
      activeCount: 12,
      email: "wang@company.com",
      lastActive: "2024-01-13 19:55",
    },
    {
      id: "5",
      workflowType: "请假流程",
      nodeName: "HR审批",
      currentApprover: "陈主管",
      currentApproverId: "chen",
      department: "人事部",
      activeCount: 20,
      email: "chen@company.com",
      lastActive: "2024-01-12 11:10",
    },
    {
      id: "6",
      workflowType: "费用申请",
      nodeName: "财务审批",
      currentApprover: "李会计",
      currentApproverId: "li",
      department: "财务部",
      activeCount: 6,
      email: "li@company.com",
      lastActive: "2024-01-11 14:00",
    },
    {
      id: "7",
      workflowType: "采购流程",
      nodeName: "总经理审批",
      currentApprover: "刘总",
      currentApproverId: "liu",
      department: "管理层",
      activeCount: 4,
      email: "liu@company.com",
      lastActive: "2024-01-10 22:30",
    },
    {
      id: "8",
      workflowType: "薪资调整",
      nodeName: "HR审批",
      currentApprover: "陈主管",
      currentApproverId: "chen",
      department: "人事部",
      activeCount: 9,
      email: "chen@company.com",
      lastActive: "2024-01-09 09:45",
    },
  ]

  // 搜索建议
  const searchSuggestions = ["张经理", "李会计", "王律师", "技术部", "财务部", "审批", "经理", "主管"]

  // 过滤后的审批节点数据
  const filteredApproverNodes = useMemo(() => {
    return allApproverNodes.filter((node) => {
      // 流程类型过滤
      if (searchFilters.workflowType !== "all") {
        const typeMap: { [key: string]: string } = {
          leave: "请假流程",
          expense: "报销流程",
          purchase: "采购流程",
          contract: "合同审批",
          fee: "费用申请",
          salary: "薪资调整",
        }
        if (node.workflowType !== typeMap[searchFilters.workflowType]) {
          return false
        }
      }

      // 节点名称过滤
      if (searchFilters.nodeName !== "all") {
        const nodeMap: { [key: string]: string } = {
          dept: "部门经理审批",
          finance: "财务审批",
          legal: "法务审批",
          hr: "HR审批",
          ceo: "总经理审批",
        }
        if (node.nodeName !== nodeMap[searchFilters.nodeName]) {
          return false
        }
      }

      // 部门过滤
      if (searchFilters.department !== "all" && node.department !== searchFilters.department) {
        return false
      }

      // 审批人过滤
      if (
        searchFilters.approver &&
        !node.currentApprover.toLowerCase().includes(searchFilters.approver.toLowerCase())
      ) {
        return false
      }

      // 关键词搜索
      if (searchFilters.keyword) {
        const keyword = searchFilters.keyword.toLowerCase()
        return (
          node.workflowType.toLowerCase().includes(keyword) ||
          node.nodeName.toLowerCase().includes(keyword) ||
          node.currentApprover.toLowerCase().includes(keyword) ||
          node.department.toLowerCase().includes(keyword)
        )
      }

      return true
    })
  }, [searchFilters])

  const handleSearch = async () => {
    setIsSearching(true)
    await new Promise((resolve) => setTimeout(resolve, 600))
    setIsSearching(false)
  }

  const handleClearSearch = () => {
    setSearchFilters({
      workflowType: "all",
      nodeName: "all",
      department: "all",
      approver: "",
      keyword: "",
    })
  }

  const handleNodeSelect = (nodeId: string, checked: boolean) => {
    if (checked) {
      setSelectedNodes([...selectedNodes, nodeId])
    } else {
      setSelectedNodes(selectedNodes.filter((id) => id !== nodeId))
    }
  }

  // 添加调试信息
  console.log("Debug info:", {
    selectedNodes: selectedNodes,
    selectedNodesLength: selectedNodes.length,
    newApprover: newApprover,
    buttonDisabled: selectedNodes.length === 0 || !newApprover,
  })

  const handleBatchReplace = async () => {
    setIsReplacing(true)

    try {
      // 模拟API调用延迟
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // 获取选中的节点信息
      const selectedNodesData = filteredApproverNodes.filter((node) => selectedNodes.includes(node.id))

      // 获取新审批人信息
      const newApproverData = availableApprovers.find((approver) => approver.id === newApprover)

      // 模拟替换操作
      const operationId = Date.now().toString()
      const currentTime = new Date().toLocaleString("zh-CN", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      })

      // 创建操作记录
      const newOperation = {
        id: operationId,
        operation: "批量替换",
        oldApprover: selectedNodesData.map((node) => node.currentApprover).join(", "),
        newApprover: newApproverData?.name || newApprover,
        affectedNodes: selectedNodes.length,
        operator: "管理员",
        time: currentTime,
        status: "已完成",
        details: `替换了${selectedNodes.length}个审批节点的审批人`,
      }

      // 更新操作历史
      setOperationHistory((prev) => [newOperation, ...prev])

      // 模拟更新节点数据（在实际应用中这会通过API更新）
      // 这里我们只是模拟，实际数据不会改变，但会显示操作结果

      // 设置操作结果
      setOperationResult({
        success: true,
        message: `成功替换了 ${selectedNodes.length} 个审批节点的审批人`,
        details: {
          newApprover: newApproverData?.name || newApprover,
          affectedNodes: selectedNodesData.map((node) => ({
            id: node.id,
            workflowType: node.workflowType,
            nodeName: node.nodeName,
            oldApprover: node.currentApprover,
          })),
          effectiveTime: effectiveTime === "immediate" ? "立即生效" : "定时执行",
          operationTime: currentTime,
        },
      })

      // 清空选择
      setSelectedNodes([])
      setNewApprover("")
    } catch (error) {
      setOperationResult({
        success: false,
        message: "替换操作失败，请重试",
        error: "网络连接异常",
      })
    } finally {
      setIsReplacing(false)
    }
  }

  const highlightText = (text: string, keyword: string) => {
    if (!keyword) return text
    const regex = new RegExp(`(${keyword})`, "gi")
    const parts = text.split(regex)
    return parts.map((part, index) =>
      regex.test(part) ? (
        <mark key={index} className="bg-yellow-200 text-yellow-900 px-1 rounded">
          {part}
        </mark>
      ) : (
        part
      ),
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* 页面标题 */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl shadow-lg">
            <Users className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
              审批人批量替换
            </h1>
            <p className="text-lg text-gray-600 mt-2">批量替换流程节点的审批人员</p>
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
                  找到 {filteredApproverNodes.length} 个节点
                </Badge>
                {(searchFilters.workflowType !== "all" ||
                  searchFilters.nodeName !== "all" ||
                  searchFilters.department !== "all" ||
                  searchFilters.approver ||
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
                    placeholder="搜索流程类型、节点名称、审批人、部门..."
                    value={searchFilters.keyword}
                    onChange={(e) => setSearchFilters((prev) => ({ ...prev, keyword: e.target.value }))}
                    className="border-2 border-gray-200 focus:border-blue-500 transition-colors pl-10"
                  />
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                </div>
                {/* 搜索建议 */}
                {searchFilters.keyword && (
                  <div className="flex flex-wrap gap-2">
                    {searchSuggestions
                      .filter(
                        (suggestion) =>
                          suggestion.toLowerCase().includes(searchFilters.keyword.toLowerCase()) &&
                          suggestion.toLowerCase() !== searchFilters.keyword.toLowerCase(),
                      )
                      .slice(0, 5)
                      .map((suggestion, index) => (
                        <Button
                          key={index}
                          variant="outline"
                          size="sm"
                          className="text-xs h-7 bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100"
                          onClick={() => setSearchFilters((prev) => ({ ...prev, keyword: suggestion }))}
                        >
                          {suggestion}
                        </Button>
                      ))}
                  </div>
                )}
              </div>

              {/* 筛选条件 */}
              <div className="grid gap-6 md:grid-cols-5">
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
                      <SelectItem value="leave">请假流程</SelectItem>
                      <SelectItem value="expense">报销流程</SelectItem>
                      <SelectItem value="purchase">采购流程</SelectItem>
                      <SelectItem value="contract">合同审批</SelectItem>
                      <SelectItem value="fee">费用申请</SelectItem>
                      <SelectItem value="salary">薪资调整</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-3">
                  <Label className="text-sm font-medium text-gray-700">审批节点</Label>
                  <Select
                    value={searchFilters.nodeName}
                    onValueChange={(value) => setSearchFilters((prev) => ({ ...prev, nodeName: value }))}
                  >
                    <SelectTrigger className="border-2 border-gray-200 focus:border-blue-500 transition-colors">
                      <SelectValue placeholder="选择节点" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">全部节点</SelectItem>
                      <SelectItem value="dept">部门经理审批</SelectItem>
                      <SelectItem value="finance">财务审批</SelectItem>
                      <SelectItem value="legal">法务审批</SelectItem>
                      <SelectItem value="hr">HR审批</SelectItem>
                      <SelectItem value="ceo">总经理审批</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
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
                      <SelectItem value="法务部">法务部</SelectItem>
                      <SelectItem value="人事部">人事部</SelectItem>
                      <SelectItem value="管理层">管理层</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-3">
                  <Label className="text-sm font-medium text-gray-700">审批人</Label>
                  <Input
                    placeholder="输入审批人姓名"
                    value={searchFilters.approver}
                    onChange={(e) => setSearchFilters((prev) => ({ ...prev, approver: e.target.value }))}
                    className="border-2 border-gray-200 focus:border-blue-500 transition-colors"
                  />
                </div>
                <div className="flex items-end">
                  <Button
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all duration-200"
                    onClick={handleSearch}
                    disabled={isSearching}
                  >
                    {isSearching ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        搜索中...
                      </>
                    ) : (
                      <>
                        <Search className="mr-2 h-4 w-4" />
                        搜索
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 搜索结果统计 */}
        {(searchFilters.workflowType !== "all" ||
          searchFilters.nodeName !== "all" ||
          searchFilters.department !== "all" ||
          searchFilters.approver ||
          searchFilters.keyword) && (
          <Card className="border-0 shadow-lg bg-gradient-to-r from-green-50 to-emerald-50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Search className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="font-medium text-gray-900">
                      搜索结果: 找到 <span className="text-green-600 font-bold">{filteredApproverNodes.length}</span>{" "}
                      个匹配的审批节点
                    </p>
                    <p className="text-sm text-gray-600">
                      已选择 <span className="font-medium text-blue-600">{selectedNodes.length}</span> 个节点进行替换
                    </p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  onClick={handleClearSearch}
                  className="text-green-600 border-green-200 hover:bg-green-50 bg-transparent"
                >
                  清除筛选
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* 替换操作区 */}
        <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
          <CardHeader className="pb-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg">
                <UserCheck className="w-5 h-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-xl">替换操作</CardTitle>
                <CardDescription className="text-gray-600">选择要替换的节点和新的审批人</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label>新审批人</Label>
                <Select
                  value={newApprover}
                  onValueChange={(value) => {
                    console.log("Selected approver:", value)
                    setNewApprover(value)
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="选择新审批人" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableApprovers.map((approver) => (
                      <SelectItem key={approver.id} value={approver.id}>
                        <div className="flex flex-col">
                          <span className="font-medium">{approver.name}</span>
                          <span className="text-xs text-gray-500">
                            {approver.department} · {approver.position}
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {/* 添加调试显示 */}
                <div className="text-xs text-gray-500">
                  当前选择: {newApprover ? availableApprovers.find((a) => a.id === newApprover)?.name : "未选择"}
                </div>
              </div>
              <div className="space-y-2">
                <Label>生效时间</Label>
                <Select value={effectiveTime} onValueChange={setEffectiveTime}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="immediate">立即生效</SelectItem>
                    <SelectItem value="scheduled">定时执行</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-end">
                <div className="w-full space-y-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={selectedNodes.length === 0 || !newApprover}
                      >
                        <UserCheck className="mr-2 h-4 w-4" />
                        执行替换 ({selectedNodes.length})
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>确认批量替换</DialogTitle>
                        <DialogDescription>
                          将要替换 {selectedNodes.length} 个节点的审批人，此操作不可撤销。
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <p className="text-sm font-medium text-gray-700">新审批人</p>
                              <p className="text-lg font-semibold text-gray-900">
                                {availableApprovers.find((a) => a.id === newApprover)?.name || newApprover}
                              </p>
                              <p className="text-sm text-gray-600">
                                {availableApprovers.find((a) => a.id === newApprover)?.department} ·
                                {availableApprovers.find((a) => a.id === newApprover)?.position}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-700">生效时间</p>
                              <p className="text-lg font-semibold text-gray-900">
                                {effectiveTime === "immediate" ? "立即生效" : "定时执行"}
                              </p>
                              <p className="text-sm text-gray-600">影响 {selectedNodes.length} 个节点</p>
                            </div>
                          </div>
                        </div>

                        {/* 显示将要替换的节点详情 */}
                        <div className="max-h-60 overflow-y-auto">
                          <p className="text-sm font-medium text-gray-700 mb-2">将要替换的节点：</p>
                          <div className="space-y-2">
                            {filteredApproverNodes
                              .filter((node) => selectedNodes.includes(node.id))
                              .map((node) => (
                                <div
                                  key={node.id}
                                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                                >
                                  <div>
                                    <p className="font-medium text-gray-900">{node.workflowType}</p>
                                    <p className="text-sm text-gray-600">
                                      {node.nodeName} · {node.currentApprover}
                                    </p>
                                  </div>
                                  <Badge variant="outline" className="text-xs">
                                    {node.activeCount} 个活跃流程
                                  </Badge>
                                </div>
                              ))}
                          </div>
                        </div>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" disabled={isReplacing}>
                          取消
                        </Button>
                        <Button
                          onClick={handleBatchReplace}
                          disabled={isReplacing}
                          className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                        >
                          {isReplacing ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              替换中...
                            </>
                          ) : (
                            "确认替换"
                          )}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                  {/* 添加状态提示 */}
                  <div className="text-xs text-center text-gray-500">
                    {selectedNodes.length === 0 && "请先选择要替换的节点"}
                    {selectedNodes.length > 0 && !newApprover && "请选择新的审批人"}
                    {selectedNodes.length > 0 && newApprover && "可以执行替换操作"}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 审批节点列表 */}
        <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-lg">
                  <Users className="w-5 h-5 text-white" />
                </div>
                <div>
                  <CardTitle className="text-xl">审批节点列表</CardTitle>
                  <CardDescription className="text-gray-600">选择需要替换审批人的节点</CardDescription>
                </div>
              </div>
              <Badge className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-3 py-1">
                {filteredApproverNodes.length} 个节点
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            {filteredApproverNodes.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                  <Search className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">未找到匹配的审批节点</h3>
                <p className="text-gray-600 mb-4">请尝试调整搜索条件或清除筛选器</p>
                <Button onClick={handleClearSearch} variant="outline">
                  清除所有筛选
                </Button>
              </div>
            ) : (
              <div className="overflow-hidden rounded-xl border border-gray-200">
                <Table>
                  <TableHeader className="bg-gradient-to-r from-gray-50 to-gray-100">
                    <TableRow>
                      <TableHead className="w-12">选择</TableHead>
                      <TableHead className="font-semibold text-gray-700">流程类型</TableHead>
                      <TableHead className="font-semibold text-gray-700">节点名称</TableHead>
                      <TableHead className="font-semibold text-gray-700">当前审批人</TableHead>
                      <TableHead className="font-semibold text-gray-700">所属部门</TableHead>
                      <TableHead className="font-semibold text-gray-700">活跃流程数</TableHead>
                      <TableHead className="font-semibold text-gray-700">联系方式</TableHead>
                      <TableHead className="font-semibold text-gray-700">状态</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredApproverNodes.map((node) => (
                      <TableRow
                        key={node.id}
                        className="hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-200"
                      >
                        <TableCell>
                          <Checkbox
                            checked={selectedNodes.includes(node.id)}
                            onCheckedChange={(checked) => handleNodeSelect(node.id, checked as boolean)}
                          />
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="border-blue-200 text-blue-700 bg-blue-50">
                            {highlightText(node.workflowType, searchFilters.keyword)}
                          </Badge>
                        </TableCell>
                        <TableCell>{highlightText(node.nodeName, searchFilters.keyword)}</TableCell>
                        <TableCell className="font-medium">
                          {highlightText(node.currentApprover, searchFilters.keyword)}
                        </TableCell>
                        <TableCell>{highlightText(node.department, searchFilters.keyword)}</TableCell>
                        <TableCell>
                          <Badge variant="secondary" className="bg-gradient-to-r from-gray-100 to-gray-200">
                            {node.activeCount}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm text-gray-600">{node.email}</TableCell>
                        <TableCell>
                          <Badge className="bg-gradient-to-r from-green-500 to-green-600 text-white">正常</Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* 操作记录 */}
        <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
          <CardHeader className="pb-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg">
                <History className="w-5 h-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-xl">操作记录</CardTitle>
                <CardDescription className="text-gray-600">最近的批量替换操作历史</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-hidden rounded-xl border border-gray-200">
              <Table>
                <TableHeader className="bg-gradient-to-r from-gray-50 to-gray-100">
                  <TableRow>
                    <TableHead className="font-semibold text-gray-700">操作类型</TableHead>
                    <TableHead className="font-semibold text-gray-700">原审批人</TableHead>
                    <TableHead className="font-semibold text-gray-700">新审批人</TableHead>
                    <TableHead className="font-semibold text-gray-700">影响节点</TableHead>
                    <TableHead className="font-semibold text-gray-700">操作人</TableHead>
                    <TableHead className="font-semibold text-gray-700">操作时间</TableHead>
                    <TableHead className="font-semibold text-gray-700">状态</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {operationHistory.map((record) => (
                    <TableRow
                      key={record.id}
                      className="hover:bg-gradient-to-r hover:from-orange-50 hover:to-yellow-50 transition-all duration-200"
                    >
                      <TableCell>{record.operation}</TableCell>
                      <TableCell className="max-w-xs">
                        <div className="truncate" title={record.oldApprover}>
                          {record.oldApprover}
                        </div>
                      </TableCell>
                      <TableCell>{record.newApprover}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="border-orange-200 text-orange-700 bg-orange-50">
                          {record.affectedNodes} 个
                        </Badge>
                      </TableCell>
                      <TableCell>{record.operator}</TableCell>
                      <TableCell className="text-gray-600">{record.time}</TableCell>
                      <TableCell>
                        <Badge className="bg-gradient-to-r from-green-500 to-green-600 text-white">
                          {record.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
        {/* 操作结果提示 */}
        {operationResult && (
          <Card
            className={`border-0 shadow-xl ${
              operationResult.success
                ? "bg-gradient-to-r from-green-50 to-emerald-50 border-green-200"
                : "bg-gradient-to-r from-red-50 to-pink-50 border-red-200"
            }`}
          >
            <CardContent className="p-6">
              <div className="flex items-start space-x-4">
                <div
                  className={`p-2 rounded-full ${
                    operationResult.success
                      ? "bg-gradient-to-r from-green-500 to-green-600"
                      : "bg-gradient-to-r from-red-500 to-red-600"
                  }`}
                >
                  {operationResult.success ? (
                    <CheckCircle className="w-6 h-6 text-white" />
                  ) : (
                    <AlertTriangle className="w-6 h-6 text-white" />
                  )}
                </div>
                <div className="flex-1">
                  <h3
                    className={`text-lg font-semibold ${operationResult.success ? "text-green-800" : "text-red-800"}`}
                  >
                    {operationResult.success ? "替换操作成功！" : "替换操作失败"}
                  </h3>
                  <p className={`mt-1 ${operationResult.success ? "text-green-700" : "text-red-700"}`}>
                    {operationResult.message}
                  </p>

                  {operationResult.success && operationResult.details && (
                    <div className="mt-4 p-4 bg-white/50 rounded-lg">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="font-medium text-gray-700">新审批人</p>
                          <p className="text-gray-900">{operationResult.details.newApprover}</p>
                        </div>
                        <div>
                          <p className="font-medium text-gray-700">生效时间</p>
                          <p className="text-gray-900">{operationResult.details.effectiveTime}</p>
                        </div>
                        <div>
                          <p className="font-medium text-gray-700">操作时间</p>
                          <p className="text-gray-900">{operationResult.details.operationTime}</p>
                        </div>
                        <div>
                          <p className="font-medium text-gray-700">影响节点</p>
                          <p className="text-gray-900">{operationResult.details.affectedNodes.length} 个</p>
                        </div>
                      </div>

                      <div className="mt-4">
                        <p className="font-medium text-gray-700 mb-2">替换详情：</p>
                        <div className="space-y-1 max-h-32 overflow-y-auto">
                          {operationResult.details.affectedNodes.map((node: any, index: number) => (
                            <div key={index} className="text-xs text-gray-600 bg-white/70 p-2 rounded">
                              {node.workflowType} - {node.nodeName}: {node.oldApprover} →{" "}
                              {operationResult.details.newApprover}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {operationResult.error && (
                    <div className="mt-2 p-3 bg-red-100 rounded-lg">
                      <p className="text-sm text-red-800">错误详情: {operationResult.error}</p>
                    </div>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setOperationResult(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
