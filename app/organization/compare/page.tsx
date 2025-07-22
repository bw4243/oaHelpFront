"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
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
import {
  BarChart3,
  Download,
  Users,
  Building2,
  UserPlus,
  UserMinus,
  Plus,
  Minus,
  Calendar,
  FileText,
  Mail,
  Loader2,
  AlertTriangle,
} from "lucide-react"

export default function OrganizationCompare() {
  const [versionA, setVersionA] = useState("2024-01-15")
  const [versionB, setVersionB] = useState("2024-01-16")
  const [selectedChanges, setSelectedChanges] = useState<string[]>([])
  const [isExporting, setIsExporting] = useState(false)
  const [isSendingEmail, setIsSendingEmail] = useState(false)

  // 模拟组织架构快照版本
  const snapshots = [
    { date: "2024-01-16", time: "09:00", description: "最新快照" },
    { date: "2024-01-15", time: "09:00", description: "昨日快照" },
    { date: "2024-01-14", time: "09:00", description: "前日快照" },
    { date: "2024-01-13", time: "09:00", description: "周末快照" },
    { date: "2024-01-12", time: "09:00", description: "上周五快照" },
    { date: "2024-01-08", time: "09:00", description: "上周一快照" },
  ]

  // 模拟差异数据
  const organizationChanges = [
    {
      id: "org1",
      type: "新增组织",
      name: "数字化转型部",
      parentOrg: "技术中心",
      changeTime: "2024-01-16 08:30",
      operator: "HR系统",
      description: "新设立数字化转型部门",
    },
    {
      id: "org2",
      type: "删除组织",
      name: "传统业务部",
      parentOrg: "业务中心",
      changeTime: "2024-01-16 08:45",
      operator: "张主管",
      description: "部门合并，传统业务部撤销",
    },
    {
      id: "org3",
      type: "组织调整",
      name: "市场部",
      parentOrg: "销售中心 → 营销中心",
      changeTime: "2024-01-16 09:15",
      operator: "系统管理员",
      description: "市场部从销售中心调整至营销中心",
    },
  ]

  const personnelChanges = [
    {
      id: "per1",
      type: "新进人员",
      name: "李小明",
      department: "数字化转型部",
      position: "高级工程师",
      changeTime: "2024-01-16 10:00",
      operator: "HR系统",
      description: "新员工入职",
    },
    {
      id: "per2",
      type: "离职人员",
      name: "王大华",
      department: "传统业务部",
      position: "业务经理",
      changeTime: "2024-01-16 11:30",
      operator: "HR系统",
      description: "员工离职",
    },
    {
      id: "per3",
      type: "人员调动",
      name: "陈小红",
      department: "技术部 → 数字化转型部",
      position: "技术专员 → 高级技术专员",
      changeTime: "2024-01-16 14:20",
      operator: "部门经理",
      description: "内部调动晋升",
    },
    {
      id: "per4",
      type: "新进人员",
      name: "赵小强",
      department: "市场部",
      position: "市场专员",
      changeTime: "2024-01-16 15:45",
      operator: "HR系统",
      description: "校招新员工入职",
    },
  ]

  const allChanges = [...organizationChanges, ...personnelChanges]

  // 统计数据
  const stats = useMemo(() => {
    return {
      totalChanges: allChanges.length,
      newOrgs: organizationChanges.filter((c) => c.type === "新增组织").length,
      deletedOrgs: organizationChanges.filter((c) => c.type === "删除组织").length,
      newPersonnel: personnelChanges.filter((c) => c.type === "新进人员").length,
      leftPersonnel: personnelChanges.filter((c) => c.type === "离职人员").length,
      transfers: personnelChanges.filter((c) => c.type === "人员调动").length,
    }
  }, [])

  const handleChangeSelect = (changeId: string, checked: boolean) => {
    if (checked) {
      setSelectedChanges([...selectedChanges, changeId])
    } else {
      setSelectedChanges(selectedChanges.filter((id) => id !== changeId))
    }
  }

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedChanges(allChanges.map((c) => c.id))
    } else {
      setSelectedChanges([])
    }
  }

  const handleExportReport = async () => {
    setIsExporting(true)
    // 模拟导出延迟
    await new Promise((resolve) => setTimeout(resolve, 2000))
    console.log("导出变更报告", { versionA, versionB, selectedChanges })
    setIsExporting(false)
  }

  const handleSendEmail = async () => {
    setIsSendingEmail(true)
    // 模拟发送邮件延迟
    await new Promise((resolve) => setTimeout(resolve, 1500))
    console.log("发送邮件报告", { versionA, versionB, selectedChanges })
    setIsSendingEmail(false)
  }

  const getChangeTypeIcon = (type: string) => {
    switch (type) {
      case "新增组织":
        return <Plus className="w-4 h-4 text-green-600" />
      case "删除组织":
        return <Minus className="w-4 h-4 text-red-600" />
      case "新进人员":
        return <UserPlus className="w-4 h-4 text-blue-600" />
      case "离职人员":
        return <UserMinus className="w-4 h-4 text-red-600" />
      case "人员调动":
        return <Users className="w-4 h-4 text-orange-600" />
      case "组织调整":
        return <Building2 className="w-4 h-4 text-purple-600" />
      default:
        return <FileText className="w-4 h-4 text-gray-600" />
    }
  }

  const getChangeTypeBadge = (type: string) => {
    const variants = {
      新增组织: "bg-gradient-to-r from-green-500 to-green-600 text-white",
      删除组织: "bg-gradient-to-r from-red-500 to-red-600 text-white",
      新进人员: "bg-gradient-to-r from-blue-500 to-blue-600 text-white",
      离职人员: "bg-gradient-to-r from-red-500 to-red-600 text-white",
      人员调动: "bg-gradient-to-r from-orange-500 to-orange-600 text-white",
      组织调整: "bg-gradient-to-r from-purple-500 to-purple-600 text-white",
    }
    return <Badge className={variants[type as keyof typeof variants] || "bg-gray-500 text-white"}>{type}</Badge>
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* 页面标题 */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl shadow-lg">
            <BarChart3 className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
              组织架构对比分析
            </h1>
            <p className="text-lg text-gray-600 mt-2">对比不同时间点的组织架构变化，生成差异报告</p>
          </div>
        </div>

        {/* 版本选择器 */}
        <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
          <CardHeader className="pb-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg">
                <Calendar className="w-5 h-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-xl">对比版本选择</CardTitle>
                <CardDescription className="text-gray-600">选择要对比的两个时间点快照</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-3">
              <div className="space-y-3">
                <label className="text-sm font-medium text-gray-700">基准版本 (A)</label>
                <Select value={versionA} onValueChange={setVersionA}>
                  <SelectTrigger className="border-2 border-gray-200 focus:border-blue-500 transition-colors">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {snapshots.map((snapshot) => (
                      <SelectItem key={snapshot.date} value={snapshot.date}>
                        <div className="flex flex-col">
                          <span className="font-medium">{snapshot.date}</span>
                          <span className="text-xs text-gray-500">
                            {snapshot.time} - {snapshot.description}
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-3">
                <label className="text-sm font-medium text-gray-700">对比版本 (B)</label>
                <Select value={versionB} onValueChange={setVersionB}>
                  <SelectTrigger className="border-2 border-gray-200 focus:border-blue-500 transition-colors">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {snapshots.map((snapshot) => (
                      <SelectItem key={snapshot.date} value={snapshot.date}>
                        <div className="flex flex-col">
                          <span className="font-medium">{snapshot.date}</span>
                          <span className="text-xs text-gray-500">
                            {snapshot.time} - {snapshot.description}
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-end space-x-2">
                <Button
                  className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                  onClick={() => console.log("执行对比", { versionA, versionB })}
                >
                  <BarChart3 className="mr-2 h-4 w-4" />
                  执行对比
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 统计概览 */}
        <div className="grid gap-6 md:grid-cols-6">
          {[
            { title: "总变更数", value: stats.totalChanges, icon: FileText, gradient: "from-blue-500 to-blue-600" },
            { title: "新增组织", value: stats.newOrgs, icon: Plus, gradient: "from-green-500 to-green-600" },
            { title: "删除组织", value: stats.deletedOrgs, icon: Minus, gradient: "from-red-500 to-red-600" },
            { title: "新进人员", value: stats.newPersonnel, icon: UserPlus, gradient: "from-blue-500 to-blue-600" },
            { title: "离职人员", value: stats.leftPersonnel, icon: UserMinus, gradient: "from-red-500 to-red-600" },
            { title: "人员调动", value: stats.transfers, icon: Users, gradient: "from-orange-500 to-orange-600" },
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

        {/* 差异列表 */}
        <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-lg">
                  <FileText className="w-5 h-5 text-white" />
                </div>
                <div>
                  <CardTitle className="text-xl">变更详情列表</CardTitle>
                  <CardDescription className="text-gray-600">
                    {versionA} 与 {versionB} 之间的所有变更记录
                  </CardDescription>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Badge variant="outline" className="text-sm">
                  已选择 {selectedChanges.length} 项
                </Badge>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      className="border-green-200 text-green-700 hover:bg-green-50 bg-transparent"
                      disabled={selectedChanges.length === 0}
                    >
                      <Mail className="mr-2 h-4 w-4" />
                      发送邮件
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>发送变更报告邮件</DialogTitle>
                      <DialogDescription>将选中的变更记录通过邮件发送给相关人员</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="font-medium text-gray-700">对比版本:</span>
                            <span className="text-gray-900">
                              {versionA} vs {versionB}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="font-medium text-gray-700">变更数量:</span>
                            <span className="text-gray-900">{selectedChanges.length} 项</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="font-medium text-gray-700">发送对象:</span>
                            <span className="text-gray-900">HR部门、部门经理</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline">取消</Button>
                      <Button
                        onClick={handleSendEmail}
                        disabled={isSendingEmail}
                        className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800"
                      >
                        {isSendingEmail ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            发送中...
                          </>
                        ) : (
                          <>
                            <Mail className="mr-2 h-4 w-4" />
                            确认发送
                          </>
                        )}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
                <Button
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                  onClick={handleExportReport}
                  disabled={isExporting || selectedChanges.length === 0}
                >
                  {isExporting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      导出中...
                    </>
                  ) : (
                    <>
                      <Download className="mr-2 h-4 w-4" />
                      导出报告
                    </>
                  )}
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-hidden rounded-xl border border-gray-200">
              <Table>
                <TableHeader className="bg-gradient-to-r from-gray-50 to-gray-100">
                  <TableRow>
                    <TableHead className="w-12">
                      <Checkbox
                        checked={selectedChanges.length === allChanges.length}
                        onCheckedChange={handleSelectAll}
                      />
                    </TableHead>
                    <TableHead className="font-semibold text-gray-700">变更类型</TableHead>
                    <TableHead className="font-semibold text-gray-700">对象名称</TableHead>
                    <TableHead className="font-semibold text-gray-700">变更内容</TableHead>
                    <TableHead className="font-semibold text-gray-700">变更时间</TableHead>
                    <TableHead className="font-semibold text-gray-700">操作人</TableHead>
                    <TableHead className="font-semibold text-gray-700">说明</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {allChanges.map((change) => (
                    <TableRow
                      key={change.id}
                      className="hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-200"
                    >
                      <TableCell>
                        <Checkbox
                          checked={selectedChanges.includes(change.id)}
                          onCheckedChange={(checked) => handleChangeSelect(change.id, checked as boolean)}
                        />
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          {getChangeTypeIcon(change.type)}
                          {getChangeTypeBadge(change.type)}
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">{change.name}</TableCell>
                      <TableCell>
                        {"parentOrg" in change ? (
                          <span className="text-sm">{change.parentOrg}</span>
                        ) : (
                          <div className="space-y-1">
                            <div className="text-sm font-medium">{change.department}</div>
                            <div className="text-xs text-gray-600">{change.position}</div>
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="text-sm text-gray-600">{change.changeTime}</TableCell>
                      <TableCell className="text-sm">{change.operator}</TableCell>
                      <TableCell className="text-sm text-gray-600 max-w-xs">
                        <div className="truncate" title={change.description}>
                          {change.description}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* 快照管理 */}
        <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
          <CardHeader className="pb-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-green-500 to-green-600 rounded-lg">
                <Calendar className="w-5 h-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-xl">快照管理</CardTitle>
                <CardDescription className="text-gray-600">管理组织架构快照的生成和存储</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-4">
                <h4 className="font-medium text-gray-900">自动快照设置</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
                    <div>
                      <p className="font-medium text-gray-900">每日快照</p>
                      <p className="text-sm text-gray-600">每天上午9:00自动生成</p>
                    </div>
                    <Badge className="bg-gradient-to-r from-green-500 to-green-600 text-white">已启用</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg border border-gray-200">
                    <div>
                      <p className="font-medium text-gray-900">每周快照</p>
                      <p className="text-sm text-gray-600">每周一上午8:00自动生成</p>
                    </div>
                    <Badge className="bg-gradient-to-r from-green-500 to-green-600 text-white">已启用</Badge>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <h4 className="font-medium text-gray-900">手动操作</h4>
                <div className="space-y-3">
                  <Button
                    variant="outline"
                    className="w-full justify-start border-blue-200 text-blue-700 hover:bg-blue-50 bg-transparent"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    立即生成快照
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start border-orange-200 text-orange-700 hover:bg-orange-50 bg-transparent"
                  >
                    <Download className="mr-2 h-4 w-4" />
                    导出快照数据
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start border-red-200 text-red-700 hover:bg-red-50 bg-transparent"
                  >
                    <AlertTriangle className="mr-2 h-4 w-4" />
                    清理历史快照
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
