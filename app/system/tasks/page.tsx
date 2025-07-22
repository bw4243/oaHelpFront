"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
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
import {
  Clock,
  Play,
  Pause,
  Settings,
  AlertCircle,
  CheckCircle,
  Activity,
  Zap,
  Search,
  Filter,
  Loader2,
  X,
} from "lucide-react"

export default function SystemTasks() {
  const [selectedTask, setSelectedTask] = useState<any>(null)
  const [cronExpression, setCronExpression] = useState("")
  const [isSearching, setIsSearching] = useState(false)

  // 搜索条件状态
  const [searchFilters, setSearchFilters] = useState({
    status: "all",
    enabled: "all",
    keyword: "",
  })

  // 模拟的完整任务数据
  const allTasks = [
    {
      id: "1",
      name: "数据备份任务",
      description: "每日凌晨2点执行数据库备份",
      cron: "0 2 * * *",
      nextRun: "2024-01-17 02:00:00",
      lastRun: "2024-01-16 02:00:00",
      status: "running",
      enabled: true,
      lastResult: "success",
      category: "数据管理",
    },
    {
      id: "2",
      name: "流程超时检查",
      description: "每小时检查超时流程并发送提醒",
      cron: "0 * * * *",
      nextRun: "2024-01-16 15:00:00",
      lastRun: "2024-01-16 14:00:00",
      status: "running",
      enabled: true,
      lastResult: "success",
      category: "流程监控",
    },
    {
      id: "3",
      name: "组织架构同步",
      description: "每天早上8点同步AD域用户信息",
      cron: "0 8 * * *",
      nextRun: "2024-01-17 08:00:00",
      lastRun: "2024-01-16 08:00:00",
      status: "error",
      enabled: true,
      lastResult: "failed",
      errorMessage: "连接AD域失败",
      category: "系统同步",
    },
    {
      id: "4",
      name: "日志清理任务",
      description: "每周日凌晨清理30天前的系统日志",
      cron: "0 1 * * 0",
      nextRun: "2024-01-21 01:00:00",
      lastRun: "2024-01-14 01:00:00",
      status: "stopped",
      enabled: false,
      lastResult: "success",
      category: "系统维护",
    },
    {
      id: "5",
      name: "邮件通知发送",
      description: "每15分钟检查并发送待发邮件",
      cron: "*/15 * * * *",
      nextRun: "2024-01-16 14:45:00",
      lastRun: "2024-01-16 14:30:00",
      status: "running",
      enabled: true,
      lastResult: "success",
      category: "通知服务",
    },
    {
      id: "6",
      name: "系统性能监控",
      description: "每5分钟收集系统性能指标",
      cron: "*/5 * * * *",
      nextRun: "2024-01-16 14:40:00",
      lastRun: "2024-01-16 14:35:00",
      status: "running",
      enabled: true,
      lastResult: "success",
      category: "性能监控",
    },
    {
      id: "7",
      name: "缓存清理任务",
      description: "每天凌晨3点清理过期缓存",
      cron: "0 3 * * *",
      nextRun: "2024-01-17 03:00:00",
      lastRun: "2024-01-16 03:00:00",
      status: "running",
      enabled: true,
      lastResult: "success",
      category: "系统维护",
    },
    {
      id: "8",
      name: "报表生成任务",
      description: "每月1号生成上月统计报表",
      cron: "0 6 1 * *",
      nextRun: "2024-02-01 06:00:00",
      lastRun: "2024-01-01 06:00:00",
      status: "stopped",
      enabled: false,
      lastResult: "success",
      category: "报表生成",
    },
  ]

  // 搜索建议
  const searchSuggestions = ["备份", "同步", "清理", "监控", "通知", "数据", "系统", "流程"]

  // 过滤后的任务数据
  const filteredTasks = useMemo(() => {
    return allTasks.filter((task) => {
      // 状态过滤
      if (searchFilters.status !== "all" && task.status !== searchFilters.status) {
        return false
      }

      // 启用状态过滤
      if (searchFilters.enabled !== "all") {
        const enabledFilter = searchFilters.enabled === "enabled"
        if (task.enabled !== enabledFilter) {
          return false
        }
      }

      // 关键词搜索
      if (searchFilters.keyword) {
        const keyword = searchFilters.keyword.toLowerCase()
        return (
          task.name.toLowerCase().includes(keyword) ||
          task.description.toLowerCase().includes(keyword) ||
          task.category.toLowerCase().includes(keyword) ||
          task.cron.toLowerCase().includes(keyword)
        )
      }

      return true
    })
  }, [searchFilters])

  const handleSearch = async () => {
    setIsSearching(true)
    await new Promise((resolve) => setTimeout(resolve, 500))
    setIsSearching(false)
  }

  const handleClearSearch = () => {
    setSearchFilters({
      status: "all",
      enabled: "all",
      keyword: "",
    })
  }

  const handleToggleTask = (taskId: string, enabled: boolean) => {
    console.log("切换任务状态:", taskId, enabled)
  }

  const handleManualRun = (taskId: string) => {
    console.log("手动执行任务:", taskId)
  }

  const handleEditCron = () => {
    console.log("更新Cron表达式:", selectedTask?.id, cronExpression)
    setSelectedTask(null)
    setCronExpression("")
  }

  const getStatusBadge = (status: string, lastResult: string) => {
    if (status === "error") {
      return <Badge className="bg-gradient-to-r from-red-500 to-red-600 text-white">异常</Badge>
    }
    if (status === "stopped") {
      return <Badge className="bg-gradient-to-r from-gray-500 to-gray-600 text-white">已停止</Badge>
    }
    if (lastResult === "success") {
      return <Badge className="bg-gradient-to-r from-green-500 to-green-600 text-white">正常运行</Badge>
    }
    return <Badge variant="outline">未知</Badge>
  }

  const cronExamples = [
    { desc: "每分钟", cron: "* * * * *" },
    { desc: "每小时", cron: "0 * * * *" },
    { desc: "每天凌晨2点", cron: "0 2 * * *" },
    { desc: "每周一上午9点", cron: "0 9 * * 1" },
    { desc: "每月1号凌晨1点", cron: "0 1 1 * *" },
  ]

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
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl shadow-lg">
            <Clock className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
              定时任务管理
            </h1>
            <p className="text-lg text-gray-600 mt-2">管理系统定时任务的执行和调度</p>
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
                  找到 {filteredTasks.length} 个任务
                </Badge>
                {(searchFilters.status !== "all" || searchFilters.enabled !== "all" || searchFilters.keyword) && (
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
                    placeholder="搜索任务名称、描述、分类..."
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
                  <Label className="text-sm font-medium text-gray-700">任务状态</Label>
                  <Select
                    value={searchFilters.status}
                    onValueChange={(value) => setSearchFilters((prev) => ({ ...prev, status: value }))}
                  >
                    <SelectTrigger className="border-2 border-gray-200 focus:border-blue-500 transition-colors">
                      <SelectValue placeholder="选择状态" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">全部状态</SelectItem>
                      <SelectItem value="running">运行中</SelectItem>
                      <SelectItem value="stopped">已停止</SelectItem>
                      <SelectItem value="error">异常</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-3">
                  <Label className="text-sm font-medium text-gray-700">启用状态</Label>
                  <Select
                    value={searchFilters.enabled}
                    onValueChange={(value) => setSearchFilters((prev) => ({ ...prev, enabled: value }))}
                  >
                    <SelectTrigger className="border-2 border-gray-200 focus:border-blue-500 transition-colors">
                      <SelectValue placeholder="选择启用状态" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">全部</SelectItem>
                      <SelectItem value="enabled">已启用</SelectItem>
                      <SelectItem value="disabled">已禁用</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="md:col-span-2 flex items-end">
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
                        搜索任务
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 搜索结果统计 */}
        {(searchFilters.status !== "all" || searchFilters.enabled !== "all" || searchFilters.keyword) && (
          <Card className="border-0 shadow-lg bg-gradient-to-r from-indigo-50 to-purple-50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Search className="w-5 h-5 text-indigo-600" />
                  <div>
                    <p className="font-medium text-gray-900">
                      搜索结果: 找到 <span className="text-indigo-600 font-bold">{filteredTasks.length}</span>{" "}
                      个匹配的任务
                    </p>
                    <p className="text-sm text-gray-600">
                      {searchFilters.keyword && `关键词: "${searchFilters.keyword}"`}
                      {searchFilters.status !== "all" && ` | 状态: ${searchFilters.status}`}
                      {searchFilters.enabled !== "all" && ` | 启用: ${searchFilters.enabled}`}
                    </p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  onClick={handleClearSearch}
                  className="text-indigo-600 border-indigo-200 hover:bg-indigo-50 bg-transparent"
                >
                  清除筛选
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* 任务统计 */}
        <div className="grid gap-6 md:grid-cols-4">
          {[
            { title: "总任务数", value: filteredTasks.length, icon: Clock, gradient: "from-blue-500 to-blue-600" },
            {
              title: "运行中",
              value: filteredTasks.filter((t) => t.status === "running").length,
              icon: CheckCircle,
              gradient: "from-green-500 to-green-600",
            },
            {
              title: "异常任务",
              value: filteredTasks.filter((t) => t.status === "error").length,
              icon: AlertCircle,
              gradient: "from-red-500 to-red-600",
            },
            {
              title: "已停止",
              value: filteredTasks.filter((t) => t.status === "stopped").length,
              icon: Pause,
              gradient: "from-gray-500 to-gray-600",
            },
          ].map((stat, index) => (
            <Card
              key={index}
              className="relative overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white to-gray-50 opacity-80" />
              <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-700">{stat.title}</CardTitle>
                <div className={`p-2 rounded-lg bg-gradient-to-r ${stat.gradient} shadow-lg`}>
                  <stat.icon className="h-5 w-5 text-white" />
                </div>
              </CardHeader>
              <CardContent className="relative">
                <div className="text-3xl font-bold text-gray-900">{stat.value}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* 任务列表 */}
        <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
          <CardHeader className="pb-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg">
                <Activity className="w-5 h-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-xl">定时任务列表</CardTitle>
                <CardDescription className="text-gray-600">系统中所有定时任务的状态和配置</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {filteredTasks.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                  <Search className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">未找到匹配的任务</h3>
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
                      <TableHead className="font-semibold text-gray-700">任务名称</TableHead>
                      <TableHead className="font-semibold text-gray-700">描述</TableHead>
                      <TableHead className="font-semibold text-gray-700">分类</TableHead>
                      <TableHead className="font-semibold text-gray-700">Cron表达式</TableHead>
                      <TableHead className="font-semibold text-gray-700">下次执行</TableHead>
                      <TableHead className="font-semibold text-gray-700">上次执行</TableHead>
                      <TableHead className="font-semibold text-gray-700">状态</TableHead>
                      <TableHead className="font-semibold text-gray-700">启用</TableHead>
                      <TableHead className="font-semibold text-gray-700">操作</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTasks.map((task) => (
                      <TableRow
                        key={task.id}
                        className="hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-200"
                      >
                        <TableCell className="font-medium">{highlightText(task.name, searchFilters.keyword)}</TableCell>
                        <TableCell className="max-w-xs">
                          <div>
                            <p className="text-sm">{highlightText(task.description, searchFilters.keyword)}</p>
                            {task.errorMessage && (
                              <p className="text-xs text-red-600 mt-1 p-1 bg-red-50 rounded">{task.errorMessage}</p>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="border-purple-200 text-purple-700 bg-purple-50">
                            {highlightText(task.category, searchFilters.keyword)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <code className="text-xs bg-gradient-to-r from-gray-100 to-gray-200 px-3 py-1 rounded-full font-mono">
                            {highlightText(task.cron, searchFilters.keyword)}
                          </code>
                        </TableCell>
                        <TableCell className="text-sm text-gray-600">{task.nextRun}</TableCell>
                        <TableCell className="text-sm text-gray-600">{task.lastRun}</TableCell>
                        <TableCell>{getStatusBadge(task.status, task.lastResult)}</TableCell>
                        <TableCell>
                          <Switch
                            checked={task.enabled}
                            onCheckedChange={(checked) => handleToggleTask(task.id, checked)}
                            className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-green-500 data-[state=checked]:to-green-600"
                          />
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleManualRun(task.id)}
                              disabled={!task.enabled}
                              className="border-blue-200 text-blue-700 hover:bg-blue-50 hover:border-blue-300 transition-all duration-200"
                            >
                              <Play className="mr-1 h-3 w-3" />
                              执行
                            </Button>
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="border-purple-200 text-purple-700 hover:bg-purple-50 hover:border-purple-300 transition-all duration-200 bg-transparent"
                                  onClick={() => {
                                    setSelectedTask(task)
                                    setCronExpression(task.cron)
                                  }}
                                >
                                  <Settings className="mr-1 h-3 w-3" />
                                  编辑
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-2xl">
                                <DialogHeader>
                                  <DialogTitle className="flex items-center space-x-2">
                                    <Settings className="w-5 h-5 text-purple-600" />
                                    <span>编辑定时任务</span>
                                  </DialogTitle>
                                  <DialogDescription>修改任务的执行时间规则</DialogDescription>
                                </DialogHeader>
                                <div className="space-y-6">
                                  <div className="p-4 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl border border-purple-200">
                                    <h4 className="font-medium text-gray-900">{selectedTask?.name}</h4>
                                    <p className="text-sm text-gray-600 mt-1">{selectedTask?.description}</p>
                                    <Badge
                                      variant="outline"
                                      className="mt-2 border-purple-200 text-purple-700 bg-purple-50"
                                    >
                                      {selectedTask?.category}
                                    </Badge>
                                  </div>
                                  <div className="space-y-3">
                                    <Label htmlFor="cron" className="text-sm font-medium text-gray-700">
                                      Cron表达式
                                    </Label>
                                    <Input
                                      id="cron"
                                      value={cronExpression}
                                      onChange={(e) => setCronExpression(e.target.value)}
                                      placeholder="0 2 * * *"
                                      className="border-2 border-gray-200 focus:border-purple-500 transition-colors font-mono"
                                    />
                                    <p className="text-xs text-gray-500">
                                      格式: 分 时 日 月 周 (例如: 0 2 * * * 表示每天凌晨2点)
                                    </p>
                                  </div>
                                  <div className="space-y-3">
                                    <Label className="text-sm font-medium text-gray-700">常用表达式</Label>
                                    <div className="grid grid-cols-2 gap-3">
                                      {cronExamples.map((example, index) => (
                                        <Button
                                          key={index}
                                          variant="outline"
                                          size="sm"
                                          className="justify-start bg-gradient-to-r from-gray-50 to-white hover:from-purple-50 hover:to-indigo-50 border-gray-200 hover:border-purple-300 transition-all duration-200"
                                          onClick={() => setCronExpression(example.cron)}
                                        >
                                          <div className="text-left">
                                            <div className="text-xs font-medium text-gray-700">{example.desc}</div>
                                            <code className="text-xs text-gray-500 font-mono">{example.cron}</code>
                                          </div>
                                        </Button>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                                <DialogFooter>
                                  <Button variant="outline" onClick={() => setSelectedTask(null)}>
                                    取消
                                  </Button>
                                  <Button
                                    onClick={handleEditCron}
                                    className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                                  >
                                    保存
                                  </Button>
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
            )}
          </CardContent>
        </Card>

        {/* 执行日志 */}
        <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
          <CardHeader className="pb-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-green-500 to-green-600 rounded-lg">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-xl">最近执行日志</CardTitle>
                <CardDescription className="text-gray-600">任务执行的详细记录</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { task: "数据备份任务", time: "2024-01-16 02:00:15", status: "success", duration: "2.3s" },
                { task: "流程超时检查", time: "2024-01-16 14:00:02", status: "success", duration: "0.8s" },
                {
                  task: "组织架构同步",
                  time: "2024-01-16 08:00:05",
                  status: "failed",
                  duration: "15.2s",
                  error: "连接超时",
                },
                { task: "流程超时检查", time: "2024-01-16 13:00:01", status: "success", duration: "0.9s" },
                { task: "邮件通知发送", time: "2024-01-16 14:30:03", status: "success", duration: "1.2s" },
                { task: "系统性能监控", time: "2024-01-16 14:35:01", status: "success", duration: "0.5s" },
              ].map((log, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 border-2 border-gray-100 rounded-xl hover:border-gray-200 transition-all duration-200 bg-gradient-to-r from-gray-50 to-white"
                >
                  <div className="flex items-center space-x-4">
                    <div
                      className={`p-2 rounded-lg ${
                        log.status === "success"
                          ? "bg-gradient-to-r from-green-500 to-green-600"
                          : "bg-gradient-to-r from-red-500 to-red-600"
                      }`}
                    >
                      {log.status === "success" ? (
                        <CheckCircle className="h-4 w-4 text-white" />
                      ) : (
                        <AlertCircle className="h-4 w-4 text-white" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{log.task}</p>
                      <p className="text-sm text-gray-600">
                        {log.time} · 耗时 {log.duration}
                        {log.error && <span className="text-red-600"> · {log.error}</span>}
                      </p>
                    </div>
                  </div>
                  <Badge
                    className={
                      log.status === "success"
                        ? "bg-gradient-to-r from-green-500 to-green-600 text-white"
                        : "bg-gradient-to-r from-red-500 to-red-600 text-white"
                    }
                  >
                    {log.status === "success" ? "成功" : "失败"}
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
