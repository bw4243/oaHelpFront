"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, RotateCcw, StopCircle, FileText, Filter, AlertTriangle, Loader2, X } from "lucide-react"

export default function WorkflowRecall() {
  const [selectedWorkflow, setSelectedWorkflow] = useState<any>(null)
  const [recallReason, setRecallReason] = useState("")
  const [isSearching, setIsSearching] = useState(false)

  // 搜索条件状态
  const [searchFilters, setSearchFilters] = useState({
    workflowType: "all",
    submitter: "",
    submitDate: "",
    keyword: "",
  })

  // 模拟的完整数据集
  const allWorkflows = [
    {
      id: "WF001",
      title: "张三的请假申请",
      type: "请假流程",
      status: "审批中",
      currentNode: "部门经理审批",
      submitter: "张三",
      submitTime: "2024-01-15 09:30",
      canRecall: true,
      canTerminate: true,
      priority: "normal",
      department: "技术部",
    },
    {
      id: "WF002",
      title: "办公用品采购申请",
      type: "采购流程",
      status: "审批中",
      currentNode: "财务审批",
      submitter: "李四",
      submitTime: "2024-01-14 14:20",
      canRecall: false,
      canTerminate: true,
      priority: "high",
      department: "行政部",
    },
    {
      id: "WF003",
      title: "差旅费报销",
      type: "报销流程",
      status: "审批中",
      currentNode: "总经理审批",
      submitter: "王五",
      submitTime: "2024-01-13 16:45",
      canRecall: true,
      canTerminate: true,
      priority: "urgent",
      department: "销售部",
    },
    {
      id: "WF004",
      title: "年终奖发放申请",
      type: "薪资流程",
      status: "审批中",
      currentNode: "HR审批",
      submitter: "赵六",
      submitTime: "2024-01-12 10:15",
      canRecall: true,
      canTerminate: false,
      priority: "high",
      department: "人事部",
    },
    {
      id: "WF005",
      title: "服务器采购合同",
      type: "合同审批",
      status: "审批中",
      currentNode: "法务审批",
      submitter: "孙七",
      submitTime: "2024-01-11 15:30",
      canRecall: false,
      canTerminate: true,
      priority: "urgent",
      department: "技术部",
    },
    {
      id: "WF006",
      title: "市场推广费用申请",
      type: "费用申请",
      status: "审批中",
      currentNode: "部门经理审批",
      submitter: "周八",
      submitTime: "2024-01-10 11:20",
      canRecall: true,
      canTerminate: true,
      priority: "normal",
      department: "市场部",
    },
  ]

  // 搜索建议
  const searchSuggestions = ["张三", "李四", "王五", "请假", "采购", "报销", "合同", "技术部", "销售部"]

  // 过滤后的工作流数据
  const filteredWorkflows = useMemo(() => {
    return allWorkflows.filter((workflow) => {
      // 流程类型过滤
      if (searchFilters.workflowType !== "all") {
        const typeMap: { [key: string]: string } = {
          leave: "请假流程",
          purchase: "采购流程",
          expense: "报销流程",
          contract: "合同审批",
        }
        if (workflow.type !== typeMap[searchFilters.workflowType]) {
          return false
        }
      }

      // 提交人过滤
      if (
        searchFilters.submitter &&
        !workflow.submitter.toLowerCase().includes(searchFilters.submitter.toLowerCase())
      ) {
        return false
      }

      // 日期过滤
      if (searchFilters.submitDate) {
        const workflowDate = workflow.submitTime.split(" ")[0]
        if (workflowDate !== searchFilters.submitDate) {
          return false
        }
      }

      // 关键词搜索
      if (searchFilters.keyword) {
        const keyword = searchFilters.keyword.toLowerCase()
        return (
          workflow.title.toLowerCase().includes(keyword) ||
          workflow.id.toLowerCase().includes(keyword) ||
          workflow.submitter.toLowerCase().includes(keyword) ||
          workflow.currentNode.toLowerCase().includes(keyword) ||
          workflow.department.toLowerCase().includes(keyword)
        )
      }

      return true
    })
  }, [searchFilters])

  const handleSearch = async () => {
    setIsSearching(true)
    // 模拟搜索延迟
    await new Promise((resolve) => setTimeout(resolve, 800))
    setIsSearching(false)
  }

  const handleClearSearch = () => {
    setSearchFilters({
      workflowType: "all",
      submitter: "",
      submitDate: "",
      keyword: "",
    })
  }

  const handleRecall = () => {
    console.log("撤回流程:", selectedWorkflow?.id, "原因:", recallReason)
    setRecallReason("")
    setSelectedWorkflow(null)
  }

  const handleTerminate = (workflow: any) => {
    console.log("终止流程:", workflow.id)
  }

  const getPriorityBadge = (priority: string) => {
    const variants = {
      urgent: "bg-gradient-to-r from-red-500 to-red-600 text-white",
      high: "bg-gradient-to-r from-orange-500 to-orange-600 text-white",
      normal: "bg-gradient-to-r from-blue-500 to-blue-600 text-white",
    }
    const labels = { urgent: "紧急", high: "高", normal: "普通" }
    return (
      <Badge className={variants[priority as keyof typeof variants]}>{labels[priority as keyof typeof labels]}</Badge>
    )
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
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl shadow-lg">
            <FileText className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
              流程撤回/终止
            </h1>
            <p className="text-lg text-gray-600 mt-2">管理运行中的流程，支持撤回和强制终止</p>
          </div>
        </div>

        {/* 搜索区域 */}
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
                  找到 {filteredWorkflows.length} 个结果
                </Badge>
                {(searchFilters.workflowType !== "all" ||
                  searchFilters.submitter ||
                  searchFilters.submitDate ||
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
                    placeholder="搜索流程标题、编号、提交人、审批节点..."
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
              <div className="grid gap-6 md:grid-cols-4">
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
                      <SelectItem value="purchase">采购流程</SelectItem>
                      <SelectItem value="expense">报销流程</SelectItem>
                      <SelectItem value="contract">合同审批</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-3">
                  <Label className="text-sm font-medium text-gray-700">提交人</Label>
                  <Input
                    placeholder="输入提交人姓名"
                    value={searchFilters.submitter}
                    onChange={(e) => setSearchFilters((prev) => ({ ...prev, submitter: e.target.value }))}
                    className="border-2 border-gray-200 focus:border-blue-500 transition-colors"
                  />
                </div>
                <div className="space-y-3">
                  <Label className="text-sm font-medium text-gray-700">提交时间</Label>
                  <Input
                    type="date"
                    value={searchFilters.submitDate}
                    onChange={(e) => setSearchFilters((prev) => ({ ...prev, submitDate: e.target.value }))}
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
          searchFilters.submitter ||
          searchFilters.submitDate ||
          searchFilters.keyword) && (
          <Card className="border-0 shadow-lg bg-gradient-to-r from-blue-50 to-indigo-50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Search className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="font-medium text-gray-900">
                      搜索结果: 找到 <span className="text-blue-600 font-bold">{filteredWorkflows.length}</span>{" "}
                      个匹配的流程
                    </p>
                    <p className="text-sm text-gray-600">
                      {searchFilters.keyword && `关键词: "${searchFilters.keyword}"`}
                      {searchFilters.workflowType !== "all" && ` | 类型: ${searchFilters.workflowType}`}
                      {searchFilters.submitter && ` | 提交人: ${searchFilters.submitter}`}
                      {searchFilters.submitDate && ` | 日期: ${searchFilters.submitDate}`}
                    </p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  onClick={handleClearSearch}
                  className="text-blue-600 border-blue-200 hover:bg-blue-50 bg-transparent"
                >
                  清除筛选
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* 流程列表 */}
        <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gradient-to-r from-green-500 to-green-600 rounded-lg">
                  <FileText className="w-5 h-5 text-white" />
                </div>
                <div>
                  <CardTitle className="text-xl">可操作流程列表</CardTitle>
                  <CardDescription className="text-gray-600">显示当前可以撤回或终止的流程</CardDescription>
                </div>
              </div>
              <Badge className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-3 py-1">
                {filteredWorkflows.length} 个流程
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            {filteredWorkflows.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                  <Search className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">未找到匹配的流程</h3>
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
                      <TableHead className="font-semibold text-gray-700">流程编号</TableHead>
                      <TableHead className="font-semibold text-gray-700">流程标题</TableHead>
                      <TableHead className="font-semibold text-gray-700">流程类型</TableHead>
                      <TableHead className="font-semibold text-gray-700">当前节点</TableHead>
                      <TableHead className="font-semibold text-gray-700">提交人</TableHead>
                      <TableHead className="font-semibold text-gray-700">部门</TableHead>
                      <TableHead className="font-semibold text-gray-700">提交时间</TableHead>
                      <TableHead className="font-semibold text-gray-700">优先级</TableHead>
                      <TableHead className="font-semibold text-gray-700">操作</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredWorkflows.map((workflow, index) => (
                      <TableRow
                        key={workflow.id}
                        className="hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-200"
                      >
                        <TableCell className="font-mono font-medium text-blue-600">
                          {highlightText(workflow.id, searchFilters.keyword)}
                        </TableCell>
                        <TableCell className="font-medium">
                          {highlightText(workflow.title, searchFilters.keyword)}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="border-blue-200 text-blue-700 bg-blue-50">
                            {workflow.type}
                          </Badge>
                        </TableCell>
                        <TableCell>{highlightText(workflow.currentNode, searchFilters.keyword)}</TableCell>
                        <TableCell>{highlightText(workflow.submitter, searchFilters.keyword)}</TableCell>
                        <TableCell>{highlightText(workflow.department, searchFilters.keyword)}</TableCell>
                        <TableCell className="text-gray-600">{workflow.submitTime}</TableCell>
                        <TableCell>{getPriorityBadge(workflow.priority)}</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            {workflow.canRecall && (
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="border-green-200 text-green-700 hover:bg-green-50 hover:border-green-300 transition-all duration-200 bg-transparent"
                                    onClick={() => setSelectedWorkflow(workflow)}
                                  >
                                    <RotateCcw className="mr-1 h-3 w-3" />
                                    撤回
                                  </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-md">
                                  <DialogHeader>
                                    <DialogTitle className="flex items-center space-x-2">
                                      <AlertTriangle className="w-5 h-5 text-orange-500" />
                                      <span>撤回流程</span>
                                    </DialogTitle>
                                    <DialogDescription>确认要撤回以下流程吗？此操作不可恢复。</DialogDescription>
                                  </DialogHeader>
                                  <div className="space-y-4">
                                    <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
                                      <h4 className="font-medium text-gray-900">{selectedWorkflow?.title}</h4>
                                      <p className="text-sm text-gray-600 mt-1">流程编号: {selectedWorkflow?.id}</p>
                                      <p className="text-sm text-gray-600">当前节点: {selectedWorkflow?.currentNode}</p>
                                    </div>
                                    <div className="space-y-2">
                                      <Label htmlFor="reason" className="text-sm font-medium text-gray-700">
                                        撤回原因 *
                                      </Label>
                                      <Textarea
                                        id="reason"
                                        placeholder="请输入撤回原因..."
                                        value={recallReason}
                                        onChange={(e) => setRecallReason(e.target.value)}
                                        className="border-2 border-gray-200 focus:border-blue-500 transition-colors"
                                      />
                                    </div>
                                  </div>
                                  <DialogFooter>
                                    <Button variant="outline" onClick={() => setSelectedWorkflow(null)}>
                                      取消
                                    </Button>
                                    <Button
                                      onClick={handleRecall}
                                      disabled={!recallReason.trim()}
                                      className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800"
                                    >
                                      确认撤回
                                    </Button>
                                  </DialogFooter>
                                </DialogContent>
                              </Dialog>
                            )}
                            {workflow.canTerminate && (
                              <Button
                                size="sm"
                                variant="outline"
                                className="border-red-200 text-red-700 hover:bg-red-50 hover:border-red-300 transition-all duration-200 bg-transparent"
                                onClick={() => handleTerminate(workflow)}
                              >
                                <StopCircle className="mr-1 h-3 w-3" />
                                终止
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
