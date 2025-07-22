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
  Search,
  Shield,
  Filter,
  Ban,
  AlertTriangle,
  Clock,
  Database,
  Eye,
  Loader2,
  X,
  Users,
  Activity,
} from "lucide-react"

export default function VirtualAccountsDetection() {
  const [selectedAccounts, setSelectedAccounts] = useState<string[]>([])
  const [disableReason, setDisableReason] = useState("")
  const [isDisabling, setIsDisabling] = useState(false)
  const [detectionDays, setDetectionDays] = useState("30")

  // 搜索条件状态
  const [searchFilters, setSearchFilters] = useState({
    source: "all",
    department: "all",
    riskLevel: "all",
    lastLoginDays: "all",
    keyword: "",
  })

  // 模拟虚拟账号数据
  const virtualAccounts = [
    {
      id: "acc1",
      username: "test_user_001",
      displayName: "测试用户001",
      department: "技术部",
      createTime: "2023-08-15 10:30",
      lastLoginTime: "2023-12-20 14:20",
      daysSinceLastLogin: 27,
      loginCount: 5,
      source: "接口生成",
      sourceDetail: "AD域同步接口",
      riskLevel: "中",
      status: "启用",
      usageFrequency: "极低",
      email: "test001@company.com",
      creator: "系统接口",
    },
    {
      id: "acc2",
      username: "temp_admin_002",
      displayName: "临时管理员002",
      department: "IT部",
      createTime: "2023-06-10 09:15",
      lastLoginTime: "2023-11-30 16:45",
      daysSinceLastLogin: 47,
      loginCount: 2,
      source: "手动创建",
      sourceDetail: "管理员手动创建",
      riskLevel: "高",
      status: "启用",
      usageFrequency: "极低",
      email: "temp002@company.com",
      creator: "张管理员",
    },
    {
      id: "acc3",
      username: "service_account_003",
      displayName: "服务账号003",
      department: "系统服务",
      createTime: "2023-09-20 11:00",
      lastLoginTime: "从未登录",
      daysSinceLastLogin: 999,
      loginCount: 0,
      source: "接口生成",
      sourceDetail: "自动化脚本创建",
      riskLevel: "高",
      status: "启用",
      usageFrequency: "无",
      email: "service003@company.com",
      creator: "自动化系统",
    },
    {
      id: "acc4",
      username: "guest_user_004",
      displayName: "访客用户004",
      department: "外部访客",
      createTime: "2023-10-05 14:30",
      lastLoginTime: "2024-01-10 09:20",
      daysSinceLastLogin: 6,
      loginCount: 12,
      source: "手动创建",
      sourceDetail: "前台手动创建",
      riskLevel: "低",
      status: "启用",
      usageFrequency: "低",
      email: "guest004@company.com",
      creator: "前台接待",
    },
    {
      id: "acc5",
      username: "backup_admin_005",
      displayName: "备份管理员005",
      department: "IT部",
      createTime: "2023-07-12 16:20",
      lastLoginTime: "2023-10-15 13:30",
      daysSinceLastLogin: 93,
      loginCount: 1,
      source: "接口生成",
      sourceDetail: "备份系统接口",
      riskLevel: "高",
      status: "启用",
      usageFrequency: "极低",
      email: "backup005@company.com",
      creator: "备份系统",
    },
    {
      id: "acc6",
      username: "demo_user_006",
      displayName: "演示用户006",
      department: "市场部",
      createTime: "2023-11-08 10:45",
      lastLoginTime: "2023-12-25 11:15",
      daysSinceLastLogin: 22,
      loginCount: 8,
      source: "手动创建",
      sourceDetail: "演示需要创建",
      riskLevel: "中",
      status: "启用",
      usageFrequency: "低",
      email: "demo006@company.com",
      creator: "市场经理",
    },
  ]

  // 过滤后的账号数据
  const filteredAccounts = useMemo(() => {
    return virtualAccounts.filter((account) => {
      // 来源过滤
      if (searchFilters.source !== "all" && account.source !== searchFilters.source) {
        return false
      }

      // 部门过滤
      if (searchFilters.department !== "all" && account.department !== searchFilters.department) {
        return false
      }

      // 风险等级过滤
      if (searchFilters.riskLevel !== "all" && account.riskLevel !== searchFilters.riskLevel) {
        return false
      }

      // 最后登录天数过滤
      if (searchFilters.lastLoginDays !== "all") {
        const days = Number.parseInt(searchFilters.lastLoginDays)
        if (account.daysSinceLastLogin < days) {
          return false
        }
      }

      // 关键词搜索
      if (searchFilters.keyword) {
        const keyword = searchFilters.keyword.toLowerCase()
        return (
          account.username.toLowerCase().includes(keyword) ||
          account.displayName.toLowerCase().includes(keyword) ||
          account.department.toLowerCase().includes(keyword) ||
          account.email.toLowerCase().includes(keyword) ||
          account.creator.toLowerCase().includes(keyword)
        )
      }

      return true
    })
  }, [searchFilters])

  // 统计数据
  const stats = useMemo(() => {
    return {
      total: filteredAccounts.length,
      highRisk: filteredAccounts.filter((a) => a.riskLevel === "高").length,
      mediumRisk: filteredAccounts.filter((a) => a.riskLevel === "中").length,
      lowRisk: filteredAccounts.filter((a) => a.riskLevel === "低").length,
      neverLogin: filteredAccounts.filter((a) => a.lastLoginTime === "从未登录").length,
      longInactive: filteredAccounts.filter((a) => a.daysSinceLastLogin > 60).length,
      apiGenerated: filteredAccounts.filter((a) => a.source === "接口生成").length,
    }
  }, [filteredAccounts])

  const handleAccountSelect = (accountId: string, checked: boolean) => {
    if (checked) {
      setSelectedAccounts([...selectedAccounts, accountId])
    } else {
      setSelectedAccounts(selectedAccounts.filter((id) => id !== accountId))
    }
  }

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedAccounts(filteredAccounts.map((a) => a.id))
    } else {
      setSelectedAccounts([])
    }
  }

  const handleBatchDisable = async () => {
    setIsDisabling(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000))
      console.log("批量禁用账号", { selectedAccounts, disableReason })
      setSelectedAccounts([])
      setDisableReason("")
    } finally {
      setIsDisabling(false)
    }
  }

  const handleDetectionScan = async () => {
    console.log("执行检测扫描", { detectionDays })
  }

  const getRiskLevelBadge = (riskLevel: string) => {
    const variants = {
      高: "bg-gradient-to-r from-red-500 to-red-600 text-white animate-pulse",
      中: "bg-gradient-to-r from-orange-500 to-orange-600 text-white",
      低: "bg-gradient-to-r from-green-500 to-green-600 text-white",
    }
    return <Badge className={variants[riskLevel as keyof typeof variants]}>{riskLevel}风险</Badge>
  }

  const getSourceBadge = (source: string) => {
    const variants = {
      接口生成: "bg-gradient-to-r from-blue-500 to-blue-600 text-white",
      手动创建: "bg-gradient-to-r from-purple-500 to-purple-600 text-white",
    }
    return <Badge className={variants[source as keyof typeof variants]}>{source}</Badge>
  }

  const handleClearSearch = () => {
    setSearchFilters({
      source: "all",
      department: "all",
      riskLevel: "all",
      lastLoginDays: "all",
      keyword: "",
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* 页面标题 */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-orange-600 to-red-600 rounded-2xl shadow-lg">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
              虚拟账号检测
            </h1>
            <p className="text-lg text-gray-600 mt-2">检测长期未登录和可疑的虚拟账号</p>
          </div>
        </div>

        {/* 检测设置 */}
        <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
          <CardHeader className="pb-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg">
                <Activity className="w-5 h-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-xl">检测设置</CardTitle>
                <CardDescription className="text-gray-600">配置虚拟账号检测参数</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-4">
              <div className="space-y-3">
                <Label className="text-sm font-medium text-gray-700">检测天数阈值</Label>
                <Select value={detectionDays} onValueChange={setDetectionDays}>
                  <SelectTrigger className="border-2 border-gray-200 focus:border-blue-500 transition-colors">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7">7天</SelectItem>
                    <SelectItem value="15">15天</SelectItem>
                    <SelectItem value="30">30天</SelectItem>
                    <SelectItem value="60">60天</SelectItem>
                    <SelectItem value="90">90天</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-3">
                <Label className="text-sm font-medium text-gray-700">检测范围</Label>
                <Select defaultValue="all">
                  <SelectTrigger className="border-2 border-gray-200 focus:border-blue-500 transition-colors">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">全部账号</SelectItem>
                    <SelectItem value="api">仅接口生成</SelectItem>
                    <SelectItem value="manual">仅手动创建</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-3">
                <Label className="text-sm font-medium text-gray-700">风险等级</Label>
                <Select defaultValue="medium">
                  <SelectTrigger className="border-2 border-gray-200 focus:border-blue-500 transition-colors">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">全部等级</SelectItem>
                    <SelectItem value="high">仅高风险</SelectItem>
                    <SelectItem value="medium">中风险以上</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-end">
                <Button
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                  onClick={handleDetectionScan}
                >
                  <Search className="mr-2 h-4 w-4" />
                  执行检测
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 统计概览 */}
        <div className="grid gap-6 md:grid-cols-7">
          {[
            { title: "总账号数", value: stats.total, icon: Users, gradient: "from-blue-500 to-blue-600" },
            { title: "高风险", value: stats.highRisk, icon: AlertTriangle, gradient: "from-red-500 to-red-600" },
            {
              title: "中风险",
              value: stats.mediumRisk,
              icon: AlertTriangle,
              gradient: "from-orange-500 to-orange-600",
            },
            { title: "低风险", value: stats.lowRisk, icon: Shield, gradient: "from-green-500 to-green-600" },
            { title: "从未登录", value: stats.neverLogin, icon: Ban, gradient: "from-gray-500 to-gray-600" },
            { title: "长期未活跃", value: stats.longInactive, icon: Clock, gradient: "from-purple-500 to-purple-600" },
            { title: "接口生成", value: stats.apiGenerated, icon: Database, gradient: "from-indigo-500 to-indigo-600" },
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

        {/* 搜索筛选区域 */}
        <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg">
                  <Filter className="w-5 h-5 text-white" />
                </div>
                <CardTitle className="text-xl">搜索筛选</CardTitle>
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant="outline" className="text-sm">
                  找到 {filteredAccounts.length} 个账号
                </Badge>
                {(searchFilters.source !== "all" ||
                  searchFilters.department !== "all" ||
                  searchFilters.riskLevel !== "all" ||
                  searchFilters.lastLoginDays !== "all" ||
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
                    placeholder="搜索用户名、显示名、部门、邮箱、创建人..."
                    value={searchFilters.keyword}
                    onChange={(e) => setSearchFilters((prev) => ({ ...prev, keyword: e.target.value }))}
                    className="border-2 border-gray-200 focus:border-blue-500 transition-colors pl-10"
                  />
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                </div>
              </div>

              {/* 筛选条件 */}
              <div className="grid gap-6 md:grid-cols-5">
                <div className="space-y-3">
                  <Label className="text-sm font-medium text-gray-700">账号来源</Label>
                  <Select
                    value={searchFilters.source}
                    onValueChange={(value) => setSearchFilters((prev) => ({ ...prev, source: value }))}
                  >
                    <SelectTrigger className="border-2 border-gray-200 focus:border-blue-500 transition-colors">
                      <SelectValue placeholder="选择来源" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">全部来源</SelectItem>
                      <SelectItem value="接口生成">接口生成</SelectItem>
                      <SelectItem value="手动创建">手动创建</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-3">
                  <Label className="text-sm font-medium text-gray-700">所属部门</Label>
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
                      <SelectItem value="IT部">IT部</SelectItem>
                      <SelectItem value="市场部">市场部</SelectItem>
                      <SelectItem value="系统服务">系统服务</SelectItem>
                      <SelectItem value="外部访客">外部访客</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-3">
                  <Label className="text-sm font-medium text-gray-700">风险等级</Label>
                  <Select
                    value={searchFilters.riskLevel}
                    onValueChange={(value) => setSearchFilters((prev) => ({ ...prev, riskLevel: value }))}
                  >
                    <SelectTrigger className="border-2 border-gray-200 focus:border-blue-500 transition-colors">
                      <SelectValue placeholder="选择风险等级" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">全部等级</SelectItem>
                      <SelectItem value="高">高风险</SelectItem>
                      <SelectItem value="中">中风险</SelectItem>
                      <SelectItem value="低">低风险</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-3">
                  <Label className="text-sm font-medium text-gray-700">未登录天数</Label>
                  <Select
                    value={searchFilters.lastLoginDays}
                    onValueChange={(value) => setSearchFilters((prev) => ({ ...prev, lastLoginDays: value }))}
                  >
                    <SelectTrigger className="border-2 border-gray-200 focus:border-blue-500 transition-colors">
                      <SelectValue placeholder="选择天数" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">全部</SelectItem>
                      <SelectItem value="7">7天以上</SelectItem>
                      <SelectItem value="30">30天以上</SelectItem>
                      <SelectItem value="60">60天以上</SelectItem>
                      <SelectItem value="90">90天以上</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-end">
                  <Button
                    className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
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
              <div className="p-2 bg-gradient-to-r from-red-500 to-red-600 rounded-lg">
                <Ban className="w-5 h-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-xl">批量操作</CardTitle>
                <CardDescription className="text-gray-600">
                  已选择 {selectedAccounts.length} 个账号进行批量禁用
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-3">
                <Label>禁用理由</Label>
                <Textarea
                  placeholder="请输入批量禁用的理由，如：长期未使用、安全风险等..."
                  value={disableReason}
                  onChange={(e) => setDisableReason(e.target.value)}
                  className="border-2 border-gray-200 focus:border-red-500 transition-colors"
                />
              </div>
              <div className="flex flex-col justify-end space-y-3">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800"
                      disabled={selectedAccounts.length === 0}
                    >
                      <Ban className="mr-2 h-4 w-4" />
                      批量禁用 ({selectedAccounts.length})
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle className="flex items-center space-x-2">
                        <AlertTriangle className="w-5 h-5 text-red-500" />
                        <span>确认批量禁用账号</span>
                      </DialogTitle>
                      <DialogDescription>此操作将禁用选中的账号，禁用后账号将无法登录系统</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="p-4 bg-gradient-to-r from-red-50 to-pink-50 rounded-xl border border-red-200">
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="font-medium text-gray-700">禁用账号数:</span>
                            <span className="text-gray-900">{selectedAccounts.length} 个</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="font-medium text-gray-700">高风险账号:</span>
                            <span className="text-red-600 font-medium">
                              {
                                filteredAccounts.filter((a) => selectedAccounts.includes(a.id) && a.riskLevel === "高")
                                  .length
                              }{" "}
                              个
                            </span>
                          </div>
                          <div className="pt-2 border-t border-red-200">
                            <span className="font-medium text-gray-700">禁用理由:</span>
                            <p className="text-gray-900 mt-1">{disableReason || "未填写"}</p>
                          </div>
                        </div>
                      </div>
                      <div className="max-h-40 overflow-y-auto">
                        <p className="text-sm font-medium text-gray-700 mb-2">将要禁用的账号：</p>
                        <div className="space-y-1">
                          {filteredAccounts
                            .filter((a) => selectedAccounts.includes(a.id))
                            .map((account) => (
                              <div
                                key={account.id}
                                className="flex items-center justify-between p-2 bg-gray-50 rounded text-xs"
                              >
                                <span className="font-medium">{account.username}</span>
                                <span className="text-gray-600">{account.displayName}</span>
                                {getRiskLevelBadge(account.riskLevel)}
                              </div>
                            ))}
                        </div>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" disabled={isDisabling}>
                        取消
                      </Button>
                      <Button
                        onClick={handleBatchDisable}
                        disabled={isDisabling || !disableReason.trim()}
                        className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800"
                      >
                        {isDisabling ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            禁用中...
                          </>
                        ) : (
                          "确认禁用"
                        )}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
                <p className="text-xs text-gray-500 text-center">
                  {selectedAccounts.length === 0 && "请先选择要禁用的账号"}
                  {selectedAccounts.length > 0 && !disableReason.trim() && "请填写禁用理由"}
                  {selectedAccounts.length > 0 && disableReason.trim() && "可以执行批量禁用操作"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 虚拟账号列表 */}
        <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg">
                  <Users className="w-5 h-5 text-white" />
                </div>
                <div>
                  <CardTitle className="text-xl">可疑账号列表</CardTitle>
                  <CardDescription className="text-gray-600">显示检测到的虚拟和可疑账号</CardDescription>
                </div>
              </div>
              <Badge className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-3 py-1">
                {filteredAccounts.length} 个账号
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            {filteredAccounts.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                  <Search className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">未找到匹配的账号</h3>
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
                      <TableHead className="w-12">
                        <Checkbox
                          checked={selectedAccounts.length === filteredAccounts.length && filteredAccounts.length > 0}
                          onCheckedChange={handleSelectAll}
                        />
                      </TableHead>
                      <TableHead className="font-semibold text-gray-700">用户名</TableHead>
                      <TableHead className="font-semibold text-gray-700">显示名</TableHead>
                      <TableHead className="font-semibold text-gray-700">部门</TableHead>
                      <TableHead className="font-semibold text-gray-700">最后登录</TableHead>
                      <TableHead className="font-semibold text-gray-700">未登录天数</TableHead>
                      <TableHead className="font-semibold text-gray-700">登录次数</TableHead>
                      <TableHead className="font-semibold text-gray-700">账号来源</TableHead>
                      <TableHead className="font-semibold text-gray-700">风险等级</TableHead>
                      <TableHead className="font-semibold text-gray-700">操作</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredAccounts.map((account) => (
                      <TableRow
                        key={account.id}
                        className="hover:bg-gradient-to-r hover:from-orange-50 hover:to-red-50 transition-all duration-200"
                      >
                        <TableCell>
                          <Checkbox
                            checked={selectedAccounts.includes(account.id)}
                            onCheckedChange={(checked) => handleAccountSelect(account.id, checked as boolean)}
                          />
                        </TableCell>
                        <TableCell className="font-mono font-medium text-blue-600">{account.username}</TableCell>
                        <TableCell className="font-medium">{account.displayName}</TableCell>
                        <TableCell>{account.department}</TableCell>
                        <TableCell className="text-sm">
                          {account.lastLoginTime === "从未登录" ? (
                            <Badge className="bg-gradient-to-r from-gray-500 to-gray-600 text-white">从未登录</Badge>
                          ) : (
                            <span className="text-gray-600">{account.lastLoginTime}</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={
                              account.daysSinceLastLogin > 60
                                ? "bg-gradient-to-r from-red-500 to-red-600 text-white"
                                : account.daysSinceLastLogin > 30
                                  ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white"
                                  : "bg-gradient-to-r from-green-500 to-green-600 text-white"
                            }
                          >
                            {account.daysSinceLastLogin > 999 ? "从未" : `${account.daysSinceLastLogin}天`}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="border-blue-200 text-blue-700 bg-blue-50">
                            {account.loginCount}次
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            {getSourceBadge(account.source)}
                            <div className="text-xs text-gray-500">{account.sourceDetail}</div>
                          </div>
                        </TableCell>
                        <TableCell>{getRiskLevelBadge(account.riskLevel)}</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="border-blue-200 text-blue-700 hover:bg-blue-50 bg-transparent"
                                >
                                  <Eye className="mr-1 h-3 w-3" />
                                  详情
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-2xl">
                                <DialogHeader>
                                  <DialogTitle>{account.displayName} - 账号详情</DialogTitle>
                                  <DialogDescription>用户名: {account.username}</DialogDescription>
                                </DialogHeader>
                                <div className="space-y-4">
                                  <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div className="space-y-3">
                                      <div>
                                        <p className="font-medium text-gray-700">基本信息</p>
                                        <div className="mt-1 space-y-1 text-gray-600">
                                          <p>部门: {account.department}</p>
                                          <p>邮箱: {account.email}</p>
                                          <p>创建时间: {account.createTime}</p>
                                          <p>创建人: {account.creator}</p>
                                        </div>
                                      </div>
                                      <div>
                                        <p className="font-medium text-gray-700">账号来源</p>
                                        <div className="mt-1 space-y-1">
                                          {getSourceBadge(account.source)}
                                          <p className="text-xs text-gray-600">{account.sourceDetail}</p>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="space-y-3">
                                      <div>
                                        <p className="font-medium text-gray-700">使用情况</p>
                                        <div className="mt-1 space-y-1 text-gray-600">
                                          <p>最后登录: {account.lastLoginTime}</p>
                                          <p>未登录天数: {account.daysSinceLastLogin}天</p>
                                          <p>总登录次数: {account.loginCount}次</p>
                                          <p>使用频率: {account.usageFrequency}</p>
                                        </div>
                                      </div>
                                      <div>
                                        <p className="font-medium text-gray-700">风险评估</p>
                                        <div className="mt-1">{getRiskLevelBadge(account.riskLevel)}</div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <DialogFooter>
                                  <Button variant="outline">关闭</Button>
                                  <Button
                                    className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800"
                                    onClick={() => console.log("禁用单个账号", account.id)}
                                  >
                                    <Ban className="mr-2 h-4 w-4" />
                                    禁用账号
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
      </div>
    </div>
  )
}
