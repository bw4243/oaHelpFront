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
import {
  Database,
  Upload,
  Download,
  Search,
  Filter,
  FileSpreadsheet,
  CheckCircle,
  AlertTriangle,
  Loader2,
  X,
  Eye,
  Users,
} from "lucide-react"

export default function ApproverImportExport() {
  const [selectedNodes, setSelectedNodes] = useState<string[]>([])
  const [isImporting, setIsImporting] = useState(false)
  const [isExporting, setIsExporting] = useState(false)
  const [importFile, setImportFile] = useState<File | null>(null)
  const [importResult, setImportResult] = useState<any>(null)
  const [exportFormat, setExportFormat] = useState("excel")

  // 搜索筛选状态
  const [searchFilters, setSearchFilters] = useState({
    workflowType: "all",
    department: "all",
    keyword: "",
  })

  // 模拟节点人员数据
  const allNodePersonnel = [
    {
      id: "node1",
      workflowName: "请假流程",
      nodeName: "部门经理审批",
      personnelName: "张三",
      workId: "E001",
      department: "技术部",
      position: "部门经理",
      email: "zhangsan@company.com",
      phone: "13800138001",
    },
    {
      id: "node2",
      workflowName: "请假流程",
      nodeName: "HR审批",
      personnelName: "李四",
      workId: "E002",
      department: "人事部",
      position: "HR主管",
      email: "lisi@company.com",
      phone: "13800138002",
    },
    {
      id: "node3",
      workflowName: "报销流程",
      nodeName: "财务审批",
      personnelName: "王五",
      workId: "E003",
      department: "财务部",
      position: "财务经理",
      email: "wangwu@company.com",
      phone: "13800138003",
    },
    {
      id: "node4",
      workflowName: "采购流程",
      nodeName: "部门经理审批",
      personnelName: "张三",
      workId: "E001",
      department: "技术部",
      position: "部门经理",
      email: "zhangsan@company.com",
      phone: "13800138001",
    },
    {
      id: "node5",
      workflowName: "采购流程",
      nodeName: "财务审批",
      personnelName: "王五",
      workId: "E003",
      department: "财务部",
      position: "财务经理",
      email: "wangwu@company.com",
      phone: "13800138003",
    },
    {
      id: "node6",
      workflowName: "合同审批",
      nodeName: "法务审批",
      personnelName: "赵六",
      workId: "E004",
      department: "法务部",
      position: "法务经理",
      email: "zhaoliu@company.com",
      phone: "13800138004",
    },
    {
      id: "node7",
      workflowName: "合同审批",
      nodeName: "总经理审批",
      personnelName: "孙七",
      workId: "E005",
      department: "管理层",
      position: "总经理",
      email: "sunqi@company.com",
      phone: "13800138005",
    },
    {
      id: "node8",
      workflowName: "薪资调整",
      nodeName: "HR审批",
      personnelName: "李四",
      workId: "E002",
      department: "人事部",
      position: "HR主管",
      email: "lisi@company.com",
      phone: "13800138002",
    },
  ]

  // 过滤后的数据
  const filteredNodePersonnel = useMemo(() => {
    return allNodePersonnel.filter((node) => {
      // 流程类型过滤
      if (searchFilters.workflowType !== "all") {
        const typeMap: { [key: string]: string } = {
          leave: "请假流程",
          expense: "报销流程",
          purchase: "采购流程",
          contract: "合同审批",
          salary: "薪资调整",
        }
        if (node.workflowName !== typeMap[searchFilters.workflowType]) {
          return false
        }
      }

      // 部门过滤
      if (searchFilters.department !== "all" && node.department !== searchFilters.department) {
        return false
      }

      // 关键词搜索
      if (searchFilters.keyword) {
        const keyword = searchFilters.keyword.toLowerCase()
        return (
          node.workflowName.toLowerCase().includes(keyword) ||
          node.nodeName.toLowerCase().includes(keyword) ||
          node.personnelName.toLowerCase().includes(keyword) ||
          node.workId.toLowerCase().includes(keyword) ||
          node.department.toLowerCase().includes(keyword)
        )
      }

      return true
    })
  }, [searchFilters])

  const handleNodeSelect = (nodeId: string, checked: boolean) => {
    if (checked) {
      setSelectedNodes([...selectedNodes, nodeId])
    } else {
      setSelectedNodes(selectedNodes.filter((id) => id !== nodeId))
    }
  }

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedNodes(filteredNodePersonnel.map((n) => n.id))
    } else {
      setSelectedNodes([])
    }
  }

  const handleExport = async () => {
    setIsExporting(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000))
      console.log("导出节点人员数据", {
        format: exportFormat,
        selectedNodes: selectedNodes,
        totalRecords: selectedNodes.length > 0 ? selectedNodes.length : filteredNodePersonnel.length,
      })
    } finally {
      setIsExporting(false)
    }
  }

  const handleImport = async () => {
    if (!importFile) return

    setIsImporting(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 2500))

      // 模拟导入结果
      const mockResult = {
        total: 25,
        success: 22,
        failed: 3,
        errors: [
          { row: 5, error: "工号E999不存在系统中" },
          { row: 12, error: "流程名称'测试流程'不存在" },
          { row: 18, error: "节点名称格式错误" },
        ],
        warnings: [
          { row: 8, warning: "该人员已存在于此节点，已跳过" },
          { row: 15, warning: "部门信息与系统不一致，已自动更正" },
        ],
      }

      setImportResult(mockResult)
    } finally {
      setIsImporting(false)
    }
  }

  const handleDownloadTemplate = () => {
    console.log("下载导入模板")
  }

  const clearFilters = () => {
    setSearchFilters({
      workflowType: "all",
      department: "all",
      keyword: "",
    })
  }

  // 统计数据
  const stats = useMemo(() => {
    const uniqueWorkflows = new Set(filteredNodePersonnel.map((n) => n.workflowName)).size
    const uniquePersonnel = new Set(filteredNodePersonnel.map((n) => n.workId)).size
    const uniqueDepartments = new Set(filteredNodePersonnel.map((n) => n.department)).size

    return {
      totalNodes: filteredNodePersonnel.length,
      uniqueWorkflows,
      uniquePersonnel,
      uniqueDepartments,
    }
  }, [filteredNodePersonnel])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* 页面标题 */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl shadow-lg">
            <Database className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
              节点人员导入导出
            </h1>
            <p className="text-lg text-gray-600 mt-2">批量管理流程节点的审批人员配置</p>
          </div>
        </div>

        {/* 操作区域 */}
        <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg">
                  <FileSpreadsheet className="w-5 h-5 text-white" />
                </div>
                <CardTitle className="text-xl">批量操作</CardTitle>
              </div>
              <div className="flex items-center space-x-3">
                {/* 批量导入 */}
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700">
                      <Upload className="mr-2 h-4 w-4" />
                      批量导入
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-3xl">
                    <DialogHeader>
                      <DialogTitle>批量导入节点人员</DialogTitle>
                      <DialogDescription>上传Excel文件批量配置流程节点审批人员</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-6">
                      <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
                        <h4 className="font-medium text-blue-800 mb-3">Excel格式要求</h4>
                        <div className="grid grid-cols-2 gap-4 text-sm text-blue-700">
                          <div>
                            <p className="font-medium mb-2">必填字段：</p>
                            <ul className="space-y-1">
                              <li>• 流程名称</li>
                              <li>• 节点名称</li>
                              <li>• 人员工号</li>
                            </ul>
                          </div>
                          <div>
                            <p className="font-medium mb-2">可选字段：</p>
                            <ul className="space-y-1">
                              <li>• 人员姓名</li>
                              <li>• 部门名称</li>
                              <li>• 职位名称</li>
                            </ul>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <Label>选择Excel文件</Label>
                        <Input
                          type="file"
                          accept=".xlsx,.xls"
                          onChange={(e) => setImportFile(e.target.files?.[0] || null)}
                          className="border-2 border-gray-200 focus:border-blue-500 transition-colors"
                        />
                      </div>

                      {importResult && (
                        <div className="space-y-4">
                          <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
                            <div className="flex items-center space-x-2 mb-3">
                              <CheckCircle className="w-5 h-5 text-green-600" />
                              <h4 className="font-medium text-green-800">导入完成</h4>
                            </div>
                            <div className="grid grid-cols-3 gap-4 text-sm">
                              <div>
                                <p className="text-gray-600">总记录数</p>
                                <p className="font-medium text-gray-900 text-lg">{importResult.total}</p>
                              </div>
                              <div>
                                <p className="text-gray-600">成功导入</p>
                                <p className="font-medium text-green-600 text-lg">{importResult.success}</p>
                              </div>
                              <div>
                                <p className="text-gray-600">导入失败</p>
                                <p className="font-medium text-red-600 text-lg">{importResult.failed}</p>
                              </div>
                            </div>
                          </div>

                          {importResult.errors.length > 0 && (
                            <div className="p-4 bg-gradient-to-r from-red-50 to-pink-50 rounded-xl border border-red-200">
                              <h4 className="font-medium text-red-800 mb-2 flex items-center space-x-2">
                                <AlertTriangle className="w-4 h-4" />
                                <span>错误详情</span>
                              </h4>
                              <div className="space-y-1 text-sm max-h-32 overflow-y-auto">
                                {importResult.errors.map((error: any, index: number) => (
                                  <p key={index} className="text-red-700">
                                    第{error.row}行: {error.error}
                                  </p>
                                ))}
                              </div>
                            </div>
                          )}

                          {importResult.warnings && importResult.warnings.length > 0 && (
                            <div className="p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl border border-yellow-200">
                              <h4 className="font-medium text-yellow-800 mb-2">警告信息</h4>
                              <div className="space-y-1 text-sm max-h-32 overflow-y-auto">
                                {importResult.warnings.map((warning: any, index: number) => (
                                  <p key={index} className="text-yellow-700">
                                    第{warning.row}行: {warning.warning}
                                  </p>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={handleDownloadTemplate}>
                        <Download className="mr-2 h-4 w-4" />
                        下载模板
                      </Button>
                      <Button
                        onClick={handleImport}
                        disabled={!importFile || isImporting}
                        className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
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

                {/* 批量导出 */}
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="border-blue-200 text-blue-700 hover:bg-blue-50 bg-transparent">
                      <Download className="mr-2 h-4 w-4" />
                      批量导出
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>导出节点人员配置</DialogTitle>
                      <DialogDescription>选择导出格式和范围</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-6">
                      <div className="space-y-3">
                        <Label>导出格式</Label>
                        <Select value={exportFormat} onValueChange={setExportFormat}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="excel">Excel格式 (.xlsx)</SelectItem>
                            <SelectItem value="csv">CSV格式 (.csv)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
                        <h4 className="font-medium text-blue-800 mb-2">导出内容</h4>
                        <div className="grid grid-cols-2 gap-4 text-sm text-blue-700">
                          <div>
                            <p className="font-medium">导出范围:</p>
                            <p>{selectedNodes.length > 0 ? `已选择 ${selectedNodes.length} 条记录` : "全部记录"}</p>
                          </div>
                          <div>
                            <p className="font-medium">包含字段:</p>
                            <p>流程名称、节点名称、人员工号、姓名、部门、职位</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline">取消</Button>
                      <Button
                        onClick={handleExport}
                        disabled={isExporting}
                        className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                      >
                        {isExporting ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            导出中...
                          </>
                        ) : (
                          "确认导出"
                        )}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
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
                  找到 {filteredNodePersonnel.length} 条记录
                </Badge>
                {selectedNodes.length > 0 && (
                  <Badge className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                    已选择 {selectedNodes.length} 条
                  </Badge>
                )}
                {(searchFilters.workflowType !== "all" ||
                  searchFilters.department !== "all" ||
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
            <div className="grid gap-6 md:grid-cols-4">
              <div className="space-y-3">
                <Label className="text-sm font-medium text-gray-700">流程类型</Label>
                <Select
                  value={searchFilters.workflowType}
                  onValueChange={(value) => setSearchFilters((prev) => ({ ...prev, workflowType: value }))}
                >
                  <SelectTrigger className="border-2 border-gray-200 focus:border-blue-500 transition-colors">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">全部流程</SelectItem>
                    <SelectItem value="leave">请假流程</SelectItem>
                    <SelectItem value="expense">报销流程</SelectItem>
                    <SelectItem value="purchase">采购流程</SelectItem>
                    <SelectItem value="contract">合同审批</SelectItem>
                    <SelectItem value="salary">薪资调整</SelectItem>
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
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">全部部门</SelectItem>
                    <SelectItem value="技术部">技术部</SelectItem>
                    <SelectItem value="财务部">财务部</SelectItem>
                    <SelectItem value="人事部">人事部</SelectItem>
                    <SelectItem value="法务部">法务部</SelectItem>
                    <SelectItem value="管理层">管理层</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-3">
                <Label className="text-sm font-medium text-gray-700">关键词搜索</Label>
                <div className="relative">
                  <Input
                    placeholder="搜索流程、节点、人员..."
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
            { title: "节点配置", value: stats.totalNodes, icon: Database, gradient: "from-blue-500 to-blue-600" },
            {
              title: "涉及流程",
              value: stats.uniqueWorkflows,
              icon: FileSpreadsheet,
              gradient: "from-green-500 to-green-600",
            },
            { title: "审批人员", value: stats.uniquePersonnel, icon: Users, gradient: "from-purple-500 to-purple-600" },
            {
              title: "涉及部门",
              value: stats.uniqueDepartments,
              icon: Database,
              gradient: "from-orange-500 to-orange-600",
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

        {/* 节点人员列表 */}
        <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
          <CardHeader className="pb-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-lg">
                <Users className="w-5 h-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-xl">节点人员配置</CardTitle>
                <CardDescription className="text-gray-600">流程节点的审批人员配置详情</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {filteredNodePersonnel.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                  <Database className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">暂无节点人员配置</h3>
                <p className="text-gray-600 mb-4">请调整搜索条件或导入配置数据</p>
                <Button onClick={clearFilters} variant="outline">
                  清除筛选条件
                </Button>
              </div>
            ) : (
              <div className="overflow-hidden rounded-xl border border-gray-200">
                <Table>
                  <TableHeader className="bg-gradient-to-r from-gray-50 to-gray-100">
                    <TableRow>
                      <TableHead className="w-12">
                        <Checkbox
                          checked={
                            selectedNodes.length === filteredNodePersonnel.length && filteredNodePersonnel.length > 0
                          }
                          onCheckedChange={handleSelectAll}
                        />
                      </TableHead>
                      <TableHead className="font-semibold text-gray-700">流程名称</TableHead>
                      <TableHead className="font-semibold text-gray-700">节点名称</TableHead>
                      <TableHead className="font-semibold text-gray-700">人员工号</TableHead>
                      <TableHead className="font-semibold text-gray-700">人员姓名</TableHead>
                      <TableHead className="font-semibold text-gray-700">部门</TableHead>
                      <TableHead className="font-semibold text-gray-700">职位</TableHead>
                      <TableHead className="font-semibold text-gray-700">联系方式</TableHead>
                      <TableHead className="font-semibold text-gray-700">操作</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredNodePersonnel.map((node) => (
                      <TableRow
                        key={node.id}
                        className="hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 transition-all duration-200"
                      >
                        <TableCell>
                          <Checkbox
                            checked={selectedNodes.includes(node.id)}
                            onCheckedChange={(checked) => handleNodeSelect(node.id, checked as boolean)}
                          />
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="border-blue-200 text-blue-700 bg-blue-50">
                            {node.workflowName}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-medium">{node.nodeName}</TableCell>
                        <TableCell className="font-mono font-medium text-blue-600">{node.workId}</TableCell>
                        <TableCell className="font-medium">{node.personnelName}</TableCell>
                        <TableCell>{node.department}</TableCell>
                        <TableCell className="text-gray-600">{node.position}</TableCell>
                        <TableCell>
                          <div className="space-y-1 text-sm text-gray-600">
                            <div>{node.email}</div>
                            <div>{node.phone}</div>
                          </div>
                        </TableCell>
                        <TableCell>
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
                                <DialogTitle>节点人员详情</DialogTitle>
                                <DialogDescription>
                                  {node.workflowName} - {node.nodeName}
                                </DialogDescription>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                  <div className="space-y-3">
                                    <div>
                                      <p className="font-medium text-gray-700">流程信息</p>
                                      <div className="mt-1 space-y-1 text-gray-600">
                                        <p>流程名称: {node.workflowName}</p>
                                        <p>节点名称: {node.nodeName}</p>
                                      </div>
                                    </div>
                                    <div>
                                      <p className="font-medium text-gray-700">人员信息</p>
                                      <div className="mt-1 space-y-1 text-gray-600">
                                        <p>姓名: {node.personnelName}</p>
                                        <p>工号: {node.workId}</p>
                                        <p>部门: {node.department}</p>
                                        <p>职位: {node.position}</p>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="space-y-3">
                                    <div>
                                      <p className="font-medium text-gray-700">联系方式</p>
                                      <div className="mt-1 space-y-1 text-gray-600">
                                        <p>邮箱: {node.email}</p>
                                        <p>电话: {node.phone}</p>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <DialogFooter>
                                <Button variant="outline">关闭</Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
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
