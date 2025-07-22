"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
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
import { Textarea } from "@/components/ui/textarea"
import {
  Database,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Clock,
  Settings,
  TrendingUp,
  Activity,
  Loader2,
  Eye,
} from "lucide-react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts"

export default function DataSyncMonitor() {
  const [selectedSystem, setSelectedSystem] = useState<any>(null)
  const [alertConfig, setAlertConfig] = useState({
    failureThreshold: 3,
    emailEnabled: true,
    dingTalkEnabled: false,
    emailRecipients: "admin@company.com,it@company.com",
    dingTalkWebhook: "",
  })
  const [isSaving, setIsSaving] = useState(false)

  // 模拟同步系统数据
  const syncSystems = [
    {
      id: "ad",
      name: "AD域同步",
      description: "Active Directory用户和组织架构同步",
      status: "running",
      lastSyncTime: "2024-01-16 14:30:00",
      nextSyncTime: "2024-01-16 15:30:00",
      syncInterval: "1小时",
      successCount: 1247,
      failureCount: 3,
      avgDuration: "2.3秒",
      lastFailureReason: "连接超时",
      lastFailureTime: "2024-01-16 12:15:00",
      enabled: true,
      syncType: "增量同步",
      dataSource: "ldap://ad.company.com:389",
    },
    {
      id: "erp",
      name: "ERP系统同步",
      description: "ERP系统员工信息和部门数据同步",
      status: "success",
      lastSyncTime: "2024-01-16 14:00:00",
      nextSyncTime: "2024-01-17 08:00:00",
      syncInterval: "每日",
      successCount: 892,
      failureCount: 1,
      avgDuration: "15.6秒",
      lastFailureReason: "数据格式错误",
      lastFailureTime: "2024-01-15 08:05:00",
      enabled: true,
      syncType: "全量同步",
      dataSource: "http://erp.company.com/api/sync",
    },
    {
      id: "hr",
      name: "HR系统同步",
      description: "人力资源系统员工档案同步",
      status: "failed",
      lastSyncTime: "2024-01-16 13:45:00",
      nextSyncTime: "2024-01-16 14:45:00",
      syncInterval: "1小时",
      successCount: 654,
      failureCount: 8,
      avgDuration: "8.9秒",
      lastFailureReason: "API认证失败",
      lastFailureTime: "2024-01-16 13:45:00",
      enabled: true,
      syncType: "增量同步",
      dataSource: "https://hr.company.com/api/v2/sync",
    },
    {
      id: "crm",
      name: "CRM系统同步",
      description: "客户关系管理系统数据同步",
      status: "stopped",
      lastSyncTime: "2024-01-16 10:30:00",
      nextSyncTime: "暂停中",
      syncInterval: "4小时",
      successCount: 423,
      failureCount: 2,
      avgDuration: "5.2秒",
      lastFailureReason: "无",
      lastFailureTime: "2024-01-15 14:30:00",
      enabled: false,
      syncType: "增量同步",
      dataSource: "http://crm.company.com/sync",
    },
  ]

  // 模拟趋势数据
  const trendData = [
    { time: "08:00", success: 45, failure: 1 },
    { time: "09:00", success: 52, failure: 0 },
    { time: "10:00", success: 38, failure: 2 },
    { time: "11:00", success: 61, failure: 1 },
    { time: "12:00", success: 48, failure: 3 },
    { time: "13:00", success: 55, failure: 2 },
    { time: "14:00", success: 42, failure: 1 },
  ]

  // 模拟失败详情数据
  const recentFailures = [
    {
      id: "fail1",
      system: "HR系统同步",
      time: "2024-01-16 13:45:00",
      reason: "API认证失败",
      details: "HTTP 401 Unauthorized: Invalid API token",
      duration: "0.5秒",
    },
    {
      id: "fail2",
      system: "AD域同步",
      time: "2024-01-16 12:15:00",
      reason: "连接超时",
      details: "Connection timeout after 30 seconds to ldap://ad.company.com:389",
      duration: "30.0秒",
    },
    {
      id: "fail3",
      system: "ERP系统同步",
      time: "2024-01-15 08:05:00",
      reason: "数据格式错误",
      details: "Invalid JSON format in response: Unexpected token at position 1247",
      duration: "12.3秒",
    },
  ]

  const getStatusBadge = (status: string) => {
    const variants = {
      running: "bg-gradient-to-r from-blue-500 to-blue-600 text-white animate-pulse",
      success: "bg-gradient-to-r from-green-500 to-green-600 text-white",
      failed: "bg-gradient-to-r from-red-500 to-red-600 text-white animate-pulse",
      stopped: "bg-gradient-to-r from-gray-500 to-gray-600 text-white",
    }
    const labels = {
      running: "同步中",
      success: "正常",
      failed: "失败",
      stopped: "已停止",
    }
    return <Badge className={variants[status as keyof typeof variants]}>{labels[status as keyof typeof labels]}</Badge>
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "running":
        return <RefreshCw className="w-4 h-4 text-blue-600 animate-spin" />
      case "success":
        return <CheckCircle className="w-4 h-4 text-green-600" />
      case "failed":
        return <AlertTriangle className="w-4 h-4 text-red-600" />
      case "stopped":
        return <Clock className="w-4 h-4 text-gray-600" />
      default:
        return <Database className="w-4 h-4 text-gray-600" />
    }
  }

  const handleToggleSystem = (systemId: string, enabled: boolean) => {
    console.log("切换同步状态:", systemId, enabled)
  }

  const handleManualSync = (systemId: string) => {
    console.log("手动同步:", systemId)
  }

  const handleSaveAlertConfig = async () => {
    setIsSaving(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      console.log("保存告警配置:", alertConfig)
    } finally {
      setIsSaving(false)
    }
  }

  // 统计数据
  const stats = useMemo(() => {
    return {
      totalSystems: syncSystems.length,
      runningSystems: syncSystems.filter((s) => s.status === "running").length,
      failedSystems: syncSystems.filter((s) => s.status === "failed").length,
      totalSuccess: syncSystems.reduce((sum, s) => sum + s.successCount, 0),
      totalFailures: syncSystems.reduce((sum, s) => sum + s.failureCount, 0),
      avgDuration: "6.5秒",
    }
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* 页面标题 */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl shadow-lg">
            <Database className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
              数据同步监控
            </h1>
            <p className="text-lg text-gray-600 mt-2">监控泛微OA与外部系统的数据同步状态</p>
          </div>
        </div>

        {/* 统计概览 */}
        <div className="grid gap-6 md:grid-cols-6">
          {[
            { title: "同步系统", value: stats.totalSystems, icon: Database, gradient: "from-blue-500 to-blue-600" },
            {
              title: "运行中",
              value: stats.runningSystems,
              icon: RefreshCw,
              gradient: "from-blue-500 to-blue-600",
            },
            { title: "异常系统", value: stats.failedSystems, icon: AlertTriangle, gradient: "from-red-500 to-red-600" },
            {
              title: "成功次数",
              value: stats.totalSuccess,
              icon: CheckCircle,
              gradient: "from-green-500 to-green-600",
            },
            { title: "失败次数", value: stats.totalFailures, icon: AlertTriangle, gradient: "from-red-500 to-red-600" },
            { title: "平均耗时", value: stats.avgDuration, icon: Clock, gradient: "from-purple-500 to-purple-600" },
          ].map((stat, index) => (
            <Card
              key={index}
              className="relative overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white to-gray-50 opacity-80" />
              <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-700">{stat.title}</CardTitle>
                <div className={`p-2 rounded-lg bg-gradient-to-r ${stat.gradient} shadow-lg`}>
                  <stat.icon className="h-4 w-4 text-white" />
                </div>
              </CardHeader>
              <CardContent className="relative">
                <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* 同步趋势图表 */}
        <div className="grid gap-8 lg:grid-cols-2">
          <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg">
                  <TrendingUp className="w-5 h-5 text-white" />
                </div>
                <div>
                  <CardTitle className="text-xl">同步成功率趋势</CardTitle>
                  <CardDescription className="text-gray-600">今日各时段同步成功和失败次数</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={trendData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                    <XAxis dataKey="time" stroke="#6B7280" />
                    <YAxis stroke="#6B7280" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "white",
                        border: "none",
                        borderRadius: "12px",
                        boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="success"
                      stroke="#10B981"
                      strokeWidth={3}
                      dot={{ fill: "#10B981", strokeWidth: 2, r: 4 }}
                      name="成功"
                    />
                    <Line
                      type="monotone"
                      dataKey="failure"
                      stroke="#EF4444"
                      strokeWidth={3}
                      dot={{ fill: "#EF4444", strokeWidth: 2, r: 4 }}
                      name="失败"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg">
                  <Activity className="w-5 h-5 text-white" />
                </div>
                <div>
                  <CardTitle className="text-xl">系统同步统计</CardTitle>
                  <CardDescription className="text-gray-600">各系统成功和失败次数对比</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={syncSystems}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                    <XAxis dataKey="name" stroke="#6B7280" />
                    <YAxis stroke="#6B7280" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "white",
                        border: "none",
                        borderRadius: "12px",
                        boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
                      }}
                    />
                    <Bar dataKey="successCount" fill="#10B981" name="成功" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="failureCount" fill="#EF4444" name="失败" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 同步系统列表 */}
        <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
          <CardHeader className="pb-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-lg">
                <Database className="w-5 h-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-xl">同步系统列表</CardTitle>
                <CardDescription className="text-gray-600">所有外部系统的同步状态和配置</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-hidden rounded-xl border border-gray-200">
              <Table>
                <TableHeader className="bg-gradient-to-r from-gray-50 to-gray-100">
                  <TableRow>
                    <TableHead className="font-semibold text-gray-700">系统名称</TableHead>
                    <TableHead className="font-semibold text-gray-700">状态</TableHead>
                    <TableHead className="font-semibold text-gray-700">最后同步</TableHead>
                    <TableHead className="font-semibold text-gray-700">下次同步</TableHead>
                    <TableHead className="font-semibold text-gray-700">成功/失败</TableHead>
                    <TableHead className="font-semibold text-gray-700">平均耗时</TableHead>
                    <TableHead className="font-semibold text-gray-700">启用状态</TableHead>
                    <TableHead className="font-semibold text-gray-700">操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {syncSystems.map((system) => (
                    <TableRow
                      key={system.id}
                      className="hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-200"
                    >
                      <TableCell>
                        <div>
                          <div className="font-medium text-gray-900">{system.name}</div>
                          <div className="text-sm text-gray-600">{system.description}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(system.status)}
                          {getStatusBadge(system.status)}
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-gray-600">{system.lastSyncTime}</TableCell>
                      <TableCell className="text-sm text-gray-600">{system.nextSyncTime}</TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <Badge className="bg-gradient-to-r from-green-500 to-green-600 text-white">
                            成功 {system.successCount}
                          </Badge>
                          <Badge className="bg-gradient-to-r from-red-500 to-red-600 text-white">
                            失败 {system.failureCount}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm font-mono">{system.avgDuration}</TableCell>
                      <TableCell>
                        <Switch
                          checked={system.enabled}
                          onCheckedChange={(checked) => handleToggleSystem(system.id, checked)}
                          className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-green-500 data-[state=checked]:to-green-600"
                        />
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleManualSync(system.id)}
                            disabled={!system.enabled}
                            className="border-blue-200 text-blue-700 hover:bg-blue-50 bg-transparent"
                          >
                            <RefreshCw className="mr-1 h-3 w-3" />
                            同步
                          </Button>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                size="sm"
                                variant="outline"
                                className="border-purple-200 text-purple-700 hover:bg-purple-50 bg-transparent"
                                onClick={() => setSelectedSystem(system)}
                              >
                                <Eye className="mr-1 h-3 w-3" />
                                详情
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl">
                              <DialogHeader>
                                <DialogTitle className="flex items-center space-x-2">
                                  <Database className="w-5 h-5 text-blue-600" />
                                  <span>{selectedSystem?.name}</span>
                                </DialogTitle>
                                <DialogDescription>{selectedSystem?.description}</DialogDescription>
                              </DialogHeader>
                              {selectedSystem && (
                                <div className="space-y-4">
                                  <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div className="space-y-3">
                                      <div>
                                        <p className="font-medium text-gray-700">同步状态</p>
                                        <div className="mt-1 flex items-center space-x-2">
                                          {getStatusIcon(selectedSystem.status)}
                                          {getStatusBadge(selectedSystem.status)}
                                        </div>
                                      </div>
                                      <div>
                                        <p className="font-medium text-gray-700">同步类型</p>
                                        <p className="text-gray-900">{selectedSystem.syncType}</p>
                                      </div>
                                      <div>
                                        <p className="font-medium text-gray-700">同步间隔</p>
                                        <p className="text-gray-900">{selectedSystem.syncInterval}</p>
                                      </div>
                                      <div>
                                        <p className="font-medium text-gray-700">数据源</p>
                                        <p className="text-blue-600 font-mono text-xs break-all">
                                          {selectedSystem.dataSource}
                                        </p>
                                      </div>
                                    </div>
                                    <div className="space-y-3">
                                      <div>
                                        <p className="font-medium text-gray-700">最后同步</p>
                                        <p className="text-gray-900 font-mono">{selectedSystem.lastSyncTime}</p>
                                      </div>
                                      <div>
                                        <p className="font-medium text-gray-700">下次同步</p>
                                        <p className="text-gray-900 font-mono">{selectedSystem.nextSyncTime}</p>
                                      </div>
                                      <div>
                                        <p className="font-medium text-gray-700">平均耗时</p>
                                        <p className="text-gray-900">{selectedSystem.avgDuration}</p>
                                      </div>
                                      <div>
                                        <p className="font-medium text-gray-700">成功率</p>
                                        <p className="text-green-600 font-medium">
                                          {(
                                            (selectedSystem.successCount /
                                              (selectedSystem.successCount + selectedSystem.failureCount)) *
                                            100
                                          ).toFixed(1)}
                                          %
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                  {selectedSystem.lastFailureReason && selectedSystem.lastFailureReason !== "无" && (
                                    <div className="p-4 bg-gradient-to-r from-red-50 to-pink-50 rounded-xl border border-red-200">
                                      <div className="flex items-start space-x-2">
                                        <AlertTriangle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                                        <div className="flex-1">
                                          <p className="font-medium text-red-800">最近失败原因</p>
                                          <p className="text-red-700 mt-1">{selectedSystem.lastFailureReason}</p>
                                          <p className="text-red-600 text-xs mt-1">
                                            失败时间: {selectedSystem.lastFailureTime}
                                          </p>
                                        </div>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              )}
                              <DialogFooter>
                                <Button variant="outline">关闭</Button>
                                <Button
                                  onClick={() => handleManualSync(selectedSystem?.id)}
                                  className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
                                >
                                  <RefreshCw className="mr-2 h-4 w-4" />
                                  立即同步
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
          </CardContent>
        </Card>

        {/* 最近失败明细 */}
        <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
          <CardHeader className="pb-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-red-500 to-red-600 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-xl">最近失败明细</CardTitle>
                <CardDescription className="text-gray-600">最近发生的同步失败记录</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentFailures.map((failure) => (
                <div
                  key={failure.id}
                  className="p-4 border-2 border-red-100 rounded-xl hover:border-red-200 transition-all duration-200 bg-gradient-to-r from-red-50 to-pink-50"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3">
                      <div className="p-2 bg-gradient-to-r from-red-500 to-red-600 rounded-lg">
                        <AlertTriangle className="h-4 w-4 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h4 className="font-medium text-gray-900">{failure.system}</h4>
                          <Badge className="bg-gradient-to-r from-red-500 to-red-600 text-white">失败</Badge>
                        </div>
                        <p className="text-red-700 font-medium mb-1">{failure.reason}</p>
                        <p className="text-sm text-gray-600 mb-2">{failure.details}</p>
                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                          <span className="flex items-center space-x-1">
                            <Clock className="w-3 h-3" />
                            <span>{failure.time}</span>
                          </span>
                          <span>耗时: {failure.duration}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* 告警配置 */}
        <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
          <CardHeader className="pb-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg">
                <Settings className="w-5 h-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-xl">告警配置</CardTitle>
                <CardDescription className="text-gray-600">配置同步失败的告警规则和通知方式</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  <div className="space-y-3">
                    <Label className="text-sm font-medium text-gray-700">失败阈值</Label>
                    <Select
                      value={alertConfig.failureThreshold.toString()}
                      onValueChange={(value) =>
                        setAlertConfig((prev) => ({ ...prev, failureThreshold: Number.parseInt(value) }))
                      }
                    >
                      <SelectTrigger className="border-2 border-gray-200 focus:border-orange-500 transition-colors">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">连续失败 1 次</SelectItem>
                        <SelectItem value="2">连续失败 2 次</SelectItem>
                        <SelectItem value="3">连续失败 3 次</SelectItem>
                        <SelectItem value="5">连续失败 5 次</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-3">
                    <Label className="text-sm font-medium text-gray-700">邮件通知</Label>
                    <div className="flex items-center space-x-3">
                      <Switch
                        checked={alertConfig.emailEnabled}
                        onCheckedChange={(checked) => setAlertConfig((prev) => ({ ...prev, emailEnabled: checked }))}
                        className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-green-500 data-[state=checked]:to-green-600"
                      />
                      <span className="text-sm text-gray-600">启用邮件告警</span>
                    </div>
                    {alertConfig.emailEnabled && (
                      <Textarea
                        placeholder="输入邮件接收人，多个邮箱用逗号分隔"
                        value={alertConfig.emailRecipients}
                        onChange={(e) => setAlertConfig((prev) => ({ ...prev, emailRecipients: e.target.value }))}
                        className="border-2 border-gray-200 focus:border-orange-500 transition-colors"
                      />
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-3">
                    <Label className="text-sm font-medium text-gray-700">钉钉通知</Label>
                    <div className="flex items-center space-x-3">
                      <Switch
                        checked={alertConfig.dingTalkEnabled}
                        onCheckedChange={(checked) => setAlertConfig((prev) => ({ ...prev, dingTalkEnabled: checked }))}
                        className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-green-500 data-[state=checked]:to-green-600"
                      />
                      <span className="text-sm text-gray-600">启用钉钉告警</span>
                    </div>
                    {alertConfig.dingTalkEnabled && (
                      <Input
                        placeholder="输入钉钉机器人Webhook地址"
                        value={alertConfig.dingTalkWebhook}
                        onChange={(e) => setAlertConfig((prev) => ({ ...prev, dingTalkWebhook: e.target.value }))}
                        className="border-2 border-gray-200 focus:border-orange-500 transition-colors"
                      />
                    )}
                  </div>

                  <div className="pt-4">
                    <Button
                      onClick={handleSaveAlertConfig}
                      disabled={isSaving}
                      className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700"
                    >
                      {isSaving ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          保存中...
                        </>
                      ) : (
                        <>
                          <Settings className="mr-2 h-4 w-4" />
                          保存配置
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>

              {/* 告警规则说明 */}
              <div className="p-4 bg-gradient-to-r from-orange-50 to-yellow-50 rounded-xl border border-orange-200">
                <div className="flex items-start space-x-3">
                  <AlertTriangle className="w-5 h-5 text-orange-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium text-orange-800 mb-2">告警规则说明</h4>
                    <ul className="text-sm text-orange-700 space-y-1">
                      <li>• 当同步失败次数达到设定阈值时，系统将自动发送告警通知</li>
                      <li>• 邮件通知支持多个接收人，请用逗号分隔邮箱地址</li>
                      <li>• 钉钉通知需要配置机器人Webhook地址</li>
                      <li>• 告警将包含失败系统、失败原因、失败时间等详细信息</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
