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
  Users,
  Plus,
  Edit,
  Trash2,
  Upload,
  Download,
  Search,
  Filter,
  Calendar,
  UserCheck,
  Loader2,
  X,
  AlertTriangle,
  CheckCircle,
} from "lucide-react"

export default function ApproverDelegate() {
  const [selectedDelegates, setSelectedDelegates] = useState<string[]>([])
  const [isAddingDelegate, setIsAddingDelegate] = useState(false)
  const [isImporting, setIsImporting] = useState(false)
  const [importFile, setImportFile] = useState<File | null>(null)
  const [importResult, setImportResult] = useState<any>(null)

  // 新增代理表单状态
  const [newDelegate, setNewDelegate] = useState({
    delegatedUser: "",
    delegateUser: "",
    startDate: "",
    endDate: "",
    enabled: true,
    reason: "",
  })

  // 搜索筛选状态
  const [searchFilters, setSearchFilters] = useState({
    status: "all",
    delegatedUser: "",
    delegateUser: "",
    keyword: "",
  })

  // 模拟用户数据
  const availableUsers = [
    { id: "user1", name: "张三", workId: "E001", department: "技术部", position: "高级工程师" },
    { id: "user2", name: "李四", workId: "E002", department: "财务部", position: "会计主管" },
    { id: "user3", name: "王五", workId: "E003", department: "市场部", position: "市场经理" },
    { id: "user4", name: "赵六", workId: "E004", department: "人事部", position: "HR专员" },
    { id: "user5", name: "孙七", workId: "E005", department: "技术部", position: "技术经理" },
    { id: "user6", name: "周八", workId: "E006", department: "销售部", position: "销售主管" },
  ]

  // 模拟代理配置数据
  const allDelegates = [
    {
      id: "del1",
      delegatedUser: "张三",
      delegatedUserId: "user1",
      delegateUser: "孙七",
      delegateUserId: "user5",
      startDate: "2024-01-15",
      endDate: "2024-01-25",
      enabled: true,
      reason: "出差期间代理审批",
      createTime: "2024-01-14 10:30",
      status: "active",
    },
    {
      id: "del2",
      delegatedUser: "李四",
      delegatedUserId: "user2",
      delegateUser: "陈会计",
      delegateUserId: "user7",
      startDate: "2024-01-10",
      endDate: "2024-01-20",
      enabled: false,
      reason: "年假期间代理",
      createTime: "2024-01-09 14:20",
      status: "disabled",
    },
    {
      id: "del3",
      delegatedUser: "王五",
      delegatedUserId: "user3",
      delegateUser: "赵六",
      delegateUserId: "user4",
      startDate: "2024-01-20",
      endDate: "2024-01-30",
      enabled: true,
      reason: "培训期间代理",
      createTime: "2024-01-18 09:15",
      status: "pending",
    },
    {
      id: "del4",
      delegatedUser: "赵六",
      delegatedUserId: "user4",
      delegateUser: "周八",
      delegateUserId: "user6",
      startDate: "2024-01-05",
      endDate: "2024-01-15",
      enabled: true,
      reason: "病假期间代理",
      createTime: "2024-01-04 16:45",
      status: "expired",
    },
  ]

  // 过滤后的代理数据
  const filteredDelegates = useMemo(() => {
    return allDelegates.filter((delegate) => {
      // 状态过滤
      if (searchFilters.status !== "all" && delegate.status !== searchFilters.status) {
        return false
      }

      // 被代理人过滤
      if (
        searchFilters.delegatedUser &&
        !delegate.delegatedUser.toLowerCase().includes(searchFilters.delegatedUser.toLowerCase())
      ) {
        return false
      }

      // 代理人过滤
      if (
        searchFilters.delegateUser &&
        !delegate.delegateUser.toLowerCase().includes(searchFilters.delegateUser.toLowerCase())
      ) {
        return false
      }

      // 关键词搜索
      if (searchFilters.keyword) {
        const keyword = searchFilters.keyword.toLowerCase()
        return (
          delegate.delegatedUser.toLowerCase().includes(keyword) ||
          delegate.delegateUser.toLowerCase().includes(keyword) ||
          delegate.reason.toLowerCase().includes(keyword)
        )
      }

      return true
    })
  }, [searchFilters])

  const handleAddDelegate = async () => {
    if (!newDelegate.delegatedUser || !newDelegate.delegateUser || !newDelegate.startDate || !newDelegate.endDate) {
      return
    }

    setIsAddingDelegate(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      console.log("添加代理配置:", newDelegate)
      // 重置表单
      setNewDelegate({
        delegatedUser: "",
        delegateUser: "",
        startDate: "",
        endDate: "",
        enabled: true,
        reason: "",
      })
    } finally {
      setIsAddingDelegate(false)
    }
  }

  const handleToggleDelegate = (delegateId: string, enabled: boolean) => {
    console.log("切换代理状态:", delegateId, enabled)
  }

  const handleDeleteDelegate = (delegateId: string) => {
    console.log("删除代理配置:", delegateId)
  }

  const handleBatchImport = async () => {
    if (!importFile) return

    setIsImporting(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // 模拟导入结果
      const mockResult = {
        total: 15,
        success: 12,
        failed: 3,
        errors: [
          { row: 3, error: "用户工号E999不存在" },
          { row: 7, error: "代理时间格式错误" },
          { row: 12, error: "被代理人和代理人不能是同一人" },
        ],
      }

      setImportResult(mockResult)
    } finally {
      setIsImporting(false)
    }
  }

  const handleExportTemplate = () => {
    console.log("导出代理配置模板")
  }

  const handleExportCurrent = () => {
    console.log("导出当前代理配置")
  }

  const getStatusBadge = (status: string) => {
    const variants = {
      active: "bg-gradient-to-r from-green-500 to-green-600 text-white",
      pending: "bg-gradient-to-r from-blue-500 to-blue-600 text-white",
      expired: "bg-gradient-to-r from-gray-500 to-gray-600 text-white",
      disabled: "bg-gradient-to-r from-red-500 to-red-600 text-white",
    }
    const labels = {
      active: "生效中",
      pending: "待生效",
      expired: "已过期",
      disabled: "已禁用",
    }
    return <Badge className={variants[status as keyof typeof variants]}>{labels[status as keyof typeof labels]}</Badge>
  }

  const clearFilters = () => {
    setSearchFilters({
      status: "all",
      delegatedUser: "",
      delegateUser: "",
      keyword: "",
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* 页面标题 */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl shadow-lg">
            <Users className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
              审批代理设置
            </h1>
            <p className="text-lg text-gray-600 mt-2">管理审批人员的代理配置和权限</p>
          </div>
        </div>

        {/* 操作区域 */}
        <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg">
                  <UserCheck className="w-5 h-5 text-white" />
                </div>
                <CardTitle className="text-xl">代理管理</CardTitle>
              </div>
              <div className="flex items-center space-x-3">
                {/* 新增代理 */}
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700">
                      <Plus className="mr-2 h-4 w-4" />
                      新增代理
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>新增审批代理</DialogTitle>
                      <DialogDescription>设置审批人员的代理配置</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-6">
                      <div className="grid gap-6 md:grid-cols-2">
                        <div className="space-y-3">
                          <Label>被代理人 *</Label>
                          <Select
                            value={newDelegate.delegatedUser}
                            onValueChange={(value) => setNewDelegate((prev) => ({ ...prev, delegatedUser: value }))}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="选择被代理人" />
                            </SelectTrigger>
                            <SelectContent>
                              {availableUsers.map((user) => (
                                <SelectItem key={user.id} value={user.id}>
                                  <div className="flex flex-col">
                                    <span className="font-medium">{user.name}</span>
                                    <span className="text-xs text-gray-500">
                                      {user.workId} · {user.department} · {user.position}
                                    </span>
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-3">
                          <Label>代理人 *</Label>
                          <Select
                            value={newDelegate.delegateUser}
                            onValueChange={(value) => setNewDelegate((prev) => ({ ...prev, delegateUser: value }))}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="选择代理人" />
                            </SelectTrigger>
                            <SelectContent>
                              {availableUsers
                                .filter((user) => user.id !== newDelegate.delegatedUser)
                                .map((user) => (
                                  <SelectItem key={user.id} value={user.id}>
                                    <div className="flex flex-col">
                                      <span className="font-medium">{user.name}</span>
                                      <span className="text-xs text-gray-500">
                                        {user.workId} · {user.department} · {user.position}
                                      </span>
                                    </div>
                                  </SelectItem>
                                ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="grid gap-6 md:grid-cols-2">
                        <div className="space-y-3">
                          <Label>开始时间 *</Label>
                          <Input
                            type="date"
                            value={newDelegate.startDate}
                            onChange={(e) => setNewDelegate((prev) => ({ ...prev, startDate: e.target.value }))}
                            className="border-2 border-gray-200 focus:border-blue-500 transition-colors"
                          />
                        </div>
                        <div className="space-y-3">
                          <Label>结束时间 *</Label>
                          <Input
                            type="date"
                            value={newDelegate.endDate}
                            onChange={(e) => setNewDelegate((prev) => ({ ...prev, endDate: e.target.value }))}
                            className="border-2 border-gray-200 focus:border-blue-500 transition-colors"
                          />
                        </div>
                      </div>
                      <div className="space-y-3">
                        <Label>代理原因</Label>
                        <Textarea
                          placeholder="请输入设置代理的原因..."
                          value={newDelegate.reason}
                          onChange={(e) => setNewDelegate((prev) => ({ ...prev, reason: e.target.value }))}
                          className="border-2 border-gray-200 focus:border-blue-500 transition-colors"
                        />
                      </div>
                      <div className="flex items-center space-x-3">
                        <Switch
                          checked={newDelegate.enabled}
                          onCheckedChange={(checked) => setNewDelegate((prev) => ({ ...prev, enabled: checked }))}
                          className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-green-500 data-[state=checked]:to-green-600"
                        />
                        <Label>立即启用代理</Label>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline">取消</Button>
                      <Button
                        onClick={handleAddDelegate}
                        disabled={
                          isAddingDelegate ||
                          !newDelegate.delegatedUser ||
                          !newDelegate.delegateUser ||
                          !newDelegate.startDate ||
                          !newDelegate.endDate
                        }
                        className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                      >
                        {isAddingDelegate ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            添加中...
                          </>
                        ) : (
                          "确认添加"
                        )}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>

                {/* 批量导入 */}
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="border-blue-200 text-blue-700 hover:bg-blue-50 bg-transparent">
                      <Upload className="mr-2 h-4 w-4" />
                      批量导入
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>批量导入代理配置</DialogTitle>
                      <DialogDescription>上传Excel文件批量设置审批代理</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-6">
                      <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
                        <h4 className="font-medium text-blue-800 mb-2">导入格式说明</h4>
                        <ul className="text-sm text-blue-700 space-y-1">
                          <li>• 支持Excel格式文件(.xlsx, .xls)</li>
                          <li>• 必填字段：被代理人工号、代理人工号、开始时间、结束时间</li>
                          <li>• 时间格式：YYYY-MM-DD</li>
                          <li>• 系统会自动校验用户是否存在</li>
                        </ul>
                      </div>
                      <div className="space-y-3">
                        <Label>选择文件</Label>
                        <Input
                          type="file"
                          accept=".xlsx,.xls"
                          onChange={(e) => setImportFile(e.target.files?.[0] || null)}
                          className="border-2 border-gray-200 focus:border-blue-500 transition-colors"
                        />
                      </div>
                      {importResult && (
                        <div className="space-y-3">
                          <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
                            <div className="flex items-center space-x-2 mb-2">
                              <CheckCircle className="w-5 h-5 text-green-600" />
                              <h4 className="font-medium text-green-800">导入结果</h4>
                            </div>
                            <div className="grid grid-cols-3 gap-4 text-sm">
                              <div>
                                <p className="text-gray-600">总记录数</p>
                                <p className="font-medium text-gray-900">{importResult.total}</p>
                              </div>
                              <div>
                                <p className="text-gray-600">成功导入</p>
                                <p className="font-medium text-green-600">{importResult.success}</p>
                              </div>
                              <div>
                                <p className="text-gray-600">导入失败</p>
                                <p className="font-medium text-red-600">{importResult.failed}</p>
                              </div>
                            </div>
                          </div>
                          {importResult.errors.length > 0 && (
                            <div className="p-4 bg-gradient-to-r from-red-50 to-pink-50 rounded-xl border border-red-200">
                              <h4 className="font-medium text-red-800 mb-2">错误详情</h4>
                              <div className="space-y-1 text-sm">
                                {importResult.errors.map((error: any, index: number) => (
                                  <p key={index} className="text-red-700">
                                    第{error.row}行: {error.error}
                                  </p>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={handleExportTemplate}>
                        <Download className="mr-2 h-4 w-4" />
                        下载模板
                      </Button>
                      <Button
                        onClick={handleBatchImport}
                        disabled={!importFile || isImporting}
                        className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                      >
                        {isImporting ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            导入中...
                          </>
                        ) : (
                          "开始导入"
                        )}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>

                {/* 导出配置 */}
                <Button
                  variant="outline"
                  onClick={handleExportCurrent}
                  className="border-green-200 text-green-700 hover:bg-green-50 bg-transparent"
                >
                  <Download className="mr-2 h-4 w-4" />
                  导出配置
                </Button>
              </div>
            </div>
          </CardHeader>
        </Card>

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
                  找到 {filteredDelegates.length} 个代理配置
                </Badge>
                {(searchFilters.status !== "all" ||
                  searchFilters.delegatedUser ||
                  searchFilters.delegateUser ||
                  searchFilters.keyword) && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={clearFilters}
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
            <div className="grid gap-6 md:grid-cols-5">
              <div className="space-y-3">
                <Label className="text-sm font-medium text-gray-700">代理状态</Label>
                <Select
                  value={searchFilters.status}
                  onValueChange={(value) => setSearchFilters((prev) => ({ ...prev, status: value }))}
                >
                  <SelectTrigger className="border-2 border-gray-200 focus:border-blue-500 transition-colors">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">全部状态</SelectItem>
                    <SelectItem value="active">生效中</SelectItem>
                    <SelectItem value="pending">待生效</SelectItem>
                    <SelectItem value="expired">已过期</SelectItem>
                    <SelectItem value="disabled">已禁用</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-3">
                <Label className="text-sm font-medium text-gray-700">被代理人</Label>
                <Input
                  placeholder="输入被代理人姓名"
                  value={searchFilters.delegatedUser}
                  onChange={(e) => setSearchFilters((prev) => ({ ...prev, delegatedUser: e.target.value }))}
                  className="border-2 border-gray-200 focus:border-blue-500 transition-colors"
                />
              </div>
              <div className="space-y-3">
                <Label className="text-sm font-medium text-gray-700">代理人</Label>
                <Input
                  placeholder="输入代理人姓名"
                  value={searchFilters.delegateUser}
                  onChange={(e) => setSearchFilters((prev) => ({ ...prev, delegateUser: e.target.value }))}
                  className="border-2 border-gray-200 focus:border-blue-500 transition-colors"
                />
              </div>
              <div className="space-y-3">
                <Label className="text-sm font-medium text-gray-700">关键词搜索</Label>
                <div className="relative">
                  <Input
                    placeholder="搜索姓名、原因..."
                    value={searchFilters.keyword}
                    onChange={(e) => setSearchFilters((prev) => ({ ...prev, keyword: e.target.value }))}
                    className="border-2 border-gray-200 focus:border-blue-500 transition-colors pl-10"
                  />
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                </div>
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
          </CardContent>
        </Card>

        {/* 统计概览 */}
        <div className="grid gap-6 md:grid-cols-4">
          {[
            {
              title: "总代理数",
              value: filteredDelegates.length,
              icon: Users,
              gradient: "from-blue-500 to-blue-600",
            },
            {
              title: "生效中",
              value: filteredDelegates.filter((d) => d.status === "active").length,
              icon: CheckCircle,
              gradient: "from-green-500 to-green-600",
            },
            {
              title: "待生效",
              value: filteredDelegates.filter((d) => d.status === "pending").length,
              icon: Calendar,
              gradient: "from-blue-500 to-blue-600",
            },
            {
              title: "已过期",
              value: filteredDelegates.filter((d) => d.status === "expired").length,
              icon: AlertTriangle,
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
                  <stat.icon className="h-4 w-4 text-white" />
                </div>
              </CardHeader>
              <CardContent className="relative">
                <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* 代理配置列表 */}
        <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
          <CardHeader className="pb-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-lg">
                <UserCheck className="w-5 h-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-xl">代理配置列表</CardTitle>
                <CardDescription className="text-gray-600">当前所有的审批代理配置</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {filteredDelegates.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                  <Users className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">暂无代理配置</h3>
                <p className="text-gray-600 mb-4">请添加审批代理配置</p>
                <Button onClick={clearFilters} variant="outline">
                  清除筛选条件
                </Button>
              </div>
            ) : (
              <div className="overflow-hidden rounded-xl border border-gray-200">
                <Table>
                  <TableHeader className="bg-gradient-to-r from-gray-50 to-gray-100">
                    <TableRow>
                      <TableHead className="font-semibold text-gray-700">被代理人</TableHead>
                      <TableHead className="font-semibold text-gray-700">代理人</TableHead>
                      <TableHead className="font-semibold text-gray-700">代理时间</TableHead>
                      <TableHead className="font-semibold text-gray-700">代理原因</TableHead>
                      <TableHead className="font-semibold text-gray-700">状态</TableHead>
                      <TableHead className="font-semibold text-gray-700">创建时间</TableHead>
                      <TableHead className="font-semibold text-gray-700">启用状态</TableHead>
                      <TableHead className="font-semibold text-gray-700">操作</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredDelegates.map((delegate) => (
                      <TableRow
                        key={delegate.id}
                        className="hover:bg-gradient-to-r hover:from-purple-50 hover:to-indigo-50 transition-all duration-200"
                      >
                        <TableCell className="font-medium">{delegate.delegatedUser}</TableCell>
                        <TableCell className="font-medium text-blue-600">{delegate.delegateUser}</TableCell>
                        <TableCell>
                          <div className="space-y-1 text-sm">
                            <div className="flex items-center space-x-1">
                              <Calendar className="w-3 h-3 text-gray-500" />
                              <span>{delegate.startDate}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <span className="text-gray-500">至</span>
                              <span>{delegate.endDate}</span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="max-w-xs">
                          <div className="truncate" title={delegate.reason}>
                            {delegate.reason || "无"}
                          </div>
                        </TableCell>
                        <TableCell>{getStatusBadge(delegate.status)}</TableCell>
                        <TableCell className="text-sm text-gray-600">{delegate.createTime}</TableCell>
                        <TableCell>
                          <Switch
                            checked={delegate.enabled}
                            onCheckedChange={(checked) => handleToggleDelegate(delegate.id, checked)}
                            className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-green-500 data-[state=checked]:to-green-600"
                          />
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-blue-200 text-blue-700 hover:bg-blue-50 bg-transparent"
                            >
                              <Edit className="mr-1 h-3 w-3" />
                              编辑
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDeleteDelegate(delegate.id)}
                              className="border-red-200 text-red-700 hover:bg-red-50 bg-transparent"
                            >
                              <Trash2 className="mr-1 h-3 w-3" />
                              删除
                            </Button>
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
