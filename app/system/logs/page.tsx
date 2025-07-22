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
import { FileText, Search, Download, Filter, AlertTriangle, Clock, User, Database, Loader2, X, Eye } from "lucide-react"

export default function SystemLogs() {
  const [logType, setLogType] = useState("all")
  const [keyword, setKeyword] = useState("")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [isExporting, setIsExporting] = useState(false)
  const [selectedLog, setSelectedLog] = useState<any>(null)

  const pageSize = 20

  // 模拟系统日志数据
  const allLogs = [
    {
      id: "log1",
      type: "系统异常",
      level: "ERROR",
      time: "2024-01-16 14:30:25",
      source: "WorkflowEngine",
      message: "流程引擎执行异常：无法连接到数据库",
      details:
        "java.sql.SQLException: Connection timeout after 30000ms\n  at com.workflow.engine.DatabaseManager.getConnection(DatabaseManager.java:45)\n  at com.workflow.engine.ProcessExecutor.execute(ProcessExecutor.java:123)",
      user: "系统",
      ip: "192.168.1.100",
    },
    {
      id: "log2",
      type: "慢SQL",
      level: "WARN",
      time: "2024-01-16 14:25:18",
      source: "DatabaseMonitor",
      message: "慢查询检测：查询执行时间超过5秒",
      details:
        "SQL: SELECT * FROM workflow_instance w LEFT JOIN workflow_node n ON w.id = n.workflow_id WHERE w.status = 'RUNNING' AND w.create_time > '2024-01-01'\nExecution Time: 8.5s\nRows Examined: 125,000",
      user: "系统",
      ip: "192.168.1.101",
    },
    {
      id: "log3",
      type: "登录记录",
      level: "INFO",
      time: "2024-01-16 14:20:45",
      source: "AuthenticationService",
      message: "用户登录成功",
      details: "用户名: zhangsan\n登录方式: 用户名密码\n浏览器: Chrome 120.0.0.0\n操作系统: Windows 10",
      user: "张三",
      ip: "192.168.1.50",
    },
    {
      id: "log4",
      type: "系统异常",
      level: "ERROR",
      time: "2024-01-16 14:15:32",
      source: "EmailService",
      message: "邮件发送失败",
      details:
        "javax.mail.MessagingException: Could not connect to SMTP host: smtp.company.com, port: 587\n  at com.sun.mail.smtp.SMTPTransport.openServer(SMTPTransport.java:2118)\n  at com.notification.EmailSender.send(EmailSender.java:67)",
      user: "系统",
      ip: "192.168.1.100",
    },
    {
      id: "log5",
      type: "登录记录",
      level: "WARN",
      time: "2024-01-16 14:10:15",
      source: "AuthenticationService",
      message: "用户登录失败：密码错误",
      details: "用户名: admin\n失败原因: 密码错误\n尝试次数: 3\n浏览器: Firefox 121.0\n操作系统: macOS 14.0",
      user: "admin",
      ip: "192.168.1.25",
    },
    {
      id: "log6",
      type: "慢SQL",
      level: "WARN",
      time: "2024-01-16 14:05:42",
      source: "DatabaseMonitor",
      message: "慢查询检测：复杂关联查询性能问题",
      details:
        "SQL: SELECT u.*, d.name as dept_name, COUNT(w.id) as workflow_count FROM users u LEFT JOIN departments d ON u.dept_id = d.id LEFT JOIN workflow_instance w ON u.id = w.submitter_id GROUP BY u.id ORDER BY workflow_count DESC\nExecution Time: 12.3s\nRows Examined: 50,000",
      user: "系统",
      ip: "192.168.1.101",
    },
    {
      id: "log7",
      type: "系统异常",
      level: "ERROR",
      time: "2024-01-16 14:00:28",
      source: "FileUploadService",
      message: "文件上传服务异常：磁盘空间不足",
      details:
        "java.io.IOException: No space left on device\n  at java.io.FileOutputStream.writeBytes(Native Method)\n  at com.file.FileUploadHandler.saveFile(FileUploadHandler.java:89)\nDisk Usage: 98.5% (195GB/200GB)",
      user: "李四",
      ip: "192.168.1.75",
    },
    {
      id: "log8",
      type: "登录记录",
      level: "INFO",
      time: "2024-01-16 13:55:33",
      source: "AuthenticationService",
      message: "用户退出登录",
      details: "用户名: wangwu\n登录时长: 2小时15分钟\n浏览器: Edge 120.0.0.0\n操作系统: Windows 11",
      user: "王五",
      ip: "192.168.1.88",
    },
  ]

  // 过滤后的日志数据
  const filteredLogs = useMemo(() => {
    return allLogs.filter((log) => {
      // 日志类型过滤
      if (logType !== "all" && log.type !== logType) {
        return false
      }

      // 时间范围过滤
      if (startDate && log.time.split(" ")[0] < startDate) {
        return false
      }
      if (endDate && log.time.split(" ")[0] > endDate) {
        return false
      }

      // 关键词搜索
      if (keyword) {
        const searchText = keyword.toLowerCase()
        return (
          log.message.toLowerCase().includes(searchText) ||
          log.source.toLowerCase().includes(searchText) ||
          log.user.toLowerCase().includes(searchText) ||
          log.details.toLowerCase().includes(searchText)
        )
      }

      return true
    })
  }, [logType, keyword, startDate, endDate])

  // 分页数据
  const paginatedLogs = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize
    return filteredLogs.slice(startIndex, startIndex + pageSize)
  }, [filteredLogs, currentPage])

  const totalPages = Math.ceil(filteredLogs.length / pageSize)

  const handleExport = async (format: "txt" | "excel") => {
    setIsExporting(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000))
      console.log(`导出${format}格式日志`, {
        logType,
        keyword,
        startDate,
        endDate,
        totalRecords: filteredLogs.length,
      })
    } finally {
      setIsExporting(false)
    }
  }

  const getLevelBadge = (level: string) => {
    const variants = {
      ERROR: "bg-gradient-to-r from-red-500 to-red-600 text-white animate-pulse",
      WARN: "bg-gradient-to-r from-orange-500 to-orange-600 text-white",
      INFO: "bg-gradient-to-r from-blue-500 to-blue-600 text-white",
    }
    return <Badge className={variants[level as keyof typeof variants]}>{level}</Badge>
  }

  const getTypeBadge = (type: string) => {
    const variants = {
      系统异常: "bg-gradient-to-r from-red-500 to-red-600 text-white",
      慢SQL: "bg-gradient-to-r from-orange-500 to-orange-600 text-white",
      登录记录: "bg-gradient-to-r from-green-500 to-green-600 text-white",
    }
    return <Badge className={variants[type as keyof typeof variants]}>{type}</Badge>
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "系统异常":
        return <AlertTriangle className="w-4 h-4 text-red-600" />
      case "慢SQL":
        return <Database className="w-4 h-4 text-orange-600" />
      case "登录记录":
        return <User className="w-4 h-4 text-green-600" />
      default:
        return <FileText className="w-4 h-4 text-gray-600" />
    }
  }

  const clearFilters = () => {
    setLogType("all")
    setKeyword("")
    setStartDate("")
    setEndDate("")
    setCurrentPage(1)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* 页面标题 */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl shadow-lg">
            <FileText className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
              系统日志管理
            </h1>
            <p className="text-lg text-gray-600 mt-2">查看和分析系统运行日志</p>
          </div>
        </div>

        {/* 筛选区域 */}
        <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg">
                  <Filter className="w-5 h-5 text-white" />
                </div>
                <CardTitle className="text-xl">日志筛选</CardTitle>
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant="outline" className="text-sm">
                  找到 {filteredLogs.length} 条日志
                </Badge>
                {(logType !== "all" || keyword || startDate || endDate) && (
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
            <div className="space-y-6">
              {/* 第一行：日志类型和关键词搜索 */}
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-3">
                  <Label className="text-sm font-medium text-gray-700">日志类型</Label>
                  <Select value={logType} onValueChange={setLogType}>
                    <SelectTrigger className="border-2 border-gray-200 focus:border-blue-500 transition-colors">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">全部类型</SelectItem>
                      <SelectItem value="系统异常">系统异常</SelectItem>
                      <SelectItem value="慢SQL">慢SQL</SelectItem>
                      <SelectItem value="登录记录">登录记录</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-3">
                  <Label className="text-sm font-medium text-gray-700">关键词搜索</Label>
                  <div className="relative">
                    <Input
                      placeholder="搜索日志内容、来源、用户..."
                      value={keyword}
                      onChange={(e) => setKeyword(e.target.value)}
                      className="border-2 border-gray-200 focus:border-blue-500 transition-colors pl-10"
                    />
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  </div>
                </div>
              </div>

              {/* 第二行：时间范围 */}
              <div className="grid gap-6 md:grid-cols-3">
                <div className="space-y-3">
                  <Label className="text-sm font-medium text-gray-700">开始日期</Label>
                  <Input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="border-2 border-gray-200 focus:border-blue-500 transition-colors"
                  />
                </div>
                <div className="space-y-3">
                  <Label className="text-sm font-medium text-gray-700">结束日期</Label>
                  <Input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="border-2 border-gray-200 focus:border-blue-500 transition-colors"
                  />
                </div>
                <div className="flex items-end">
                  <Button
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                    onClick={() => setCurrentPage(1)}
                  >
                    <Search className="mr-2 h-4 w-4" />
                    搜索日志
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 统计概览 */}
        <div className="grid gap-6 md:grid-cols-4">
          {[
            {
              title: "总日志数",
              value: filteredLogs.length,
              icon: FileText,
              gradient: "from-blue-500 to-blue-600",
            },
            {
              title: "系统异常",
              value: filteredLogs.filter((l) => l.type === "系统异常").length,
              icon: AlertTriangle,
              gradient: "from-red-500 to-red-600",
            },
            {
              title: "慢SQL",
              value: filteredLogs.filter((l) => l.type === "慢SQL").length,
              icon: Database,
              gradient: "from-orange-500 to-orange-600",
            },
            {
              title: "登录记录",
              value: filteredLogs.filter((l) => l.type === "登录记录").length,
              icon: User,
              gradient: "from-green-500 to-green-600",
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

        {/* 日志列表 */}
        <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-lg">
                  <Clock className="w-5 h-5 text-white" />
                </div>
                <div>
                  <CardTitle className="text-xl">系统日志列表</CardTitle>
                  <CardDescription className="text-gray-600">
                    第 {currentPage} 页，共 {totalPages} 页，显示 {paginatedLogs.length} 条记录
                  </CardDescription>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      className="border-green-200 text-green-700 hover:bg-green-50 bg-transparent"
                      disabled={filteredLogs.length === 0}
                    >
                      <Download className="mr-2 h-4 w-4" />
                      导出
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>导出系统日志</DialogTitle>
                      <DialogDescription>选择导出格式和范围</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="font-medium text-gray-700">日志类型:</span>
                            <span className="text-gray-900">{logType === "all" ? "全部类型" : logType}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="font-medium text-gray-700">时间范围:</span>
                            <span className="text-gray-900">
                              {startDate || "不限"} ~ {endDate || "不限"}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="font-medium text-gray-700">记录数量:</span>
                            <span className="text-gray-900">{filteredLogs.length} 条</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline">取消</Button>
                      <Button
                        onClick={() => handleExport("txt")}
                        disabled={isExporting}
                        className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
                      >
                        {isExporting ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            导出中...
                          </>
                        ) : (
                          "导出TXT"
                        )}
                      </Button>
                      <Button
                        onClick={() => handleExport("excel")}
                        disabled={isExporting}
                        className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800"
                      >
                        {isExporting ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            导出中...
                          </>
                        ) : (
                          "导出Excel"
                        )}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {filteredLogs.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                  <Search className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">未找到匹配的日志</h3>
                <p className="text-gray-600 mb-4">请尝试调整搜索条件</p>
                <Button onClick={clearFilters} variant="outline">
                  清除所有筛选
                </Button>
              </div>
            ) : (
              <>
                <div className="overflow-hidden rounded-xl border border-gray-200">
                  <Table>
                    <TableHeader className="bg-gradient-to-r from-gray-50 to-gray-100">
                      <TableRow>
                        <TableHead className="font-semibold text-gray-700">时间</TableHead>
                        <TableHead className="font-semibold text-gray-700">类型</TableHead>
                        <TableHead className="font-semibold text-gray-700">级别</TableHead>
                        <TableHead className="font-semibold text-gray-700">来源</TableHead>
                        <TableHead className="font-semibold text-gray-700">消息</TableHead>
                        <TableHead className="font-semibold text-gray-700">用户</TableHead>
                        <TableHead className="font-semibold text-gray-700">IP地址</TableHead>
                        <TableHead className="font-semibold text-gray-700">操作</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {paginatedLogs.map((log) => (
                        <TableRow
                          key={log.id}
                          className="hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-200"
                        >
                          <TableCell className="font-mono text-sm text-gray-600">{log.time}</TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              {getTypeIcon(log.type)}
                              {getTypeBadge(log.type)}
                            </div>
                          </TableCell>
                          <TableCell>{getLevelBadge(log.level)}</TableCell>
                          <TableCell className="font-medium text-blue-600">{log.source}</TableCell>
                          <TableCell className="max-w-xs">
                            <div className="truncate" title={log.message}>
                              {log.message}
                            </div>
                          </TableCell>
                          <TableCell>{log.user}</TableCell>
                          <TableCell className="font-mono text-sm">{log.ip}</TableCell>
                          <TableCell>
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="border-blue-200 text-blue-700 hover:bg-blue-50 bg-transparent"
                                  onClick={() => setSelectedLog(log)}
                                >
                                  <Eye className="mr-1 h-3 w-3" />
                                  详情
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-4xl">
                                <DialogHeader>
                                  <DialogTitle className="flex items-center space-x-2">
                                    {getTypeIcon(selectedLog?.type)}
                                    <span>日志详情</span>
                                  </DialogTitle>
                                  <DialogDescription>{selectedLog?.time}</DialogDescription>
                                </DialogHeader>
                                {selectedLog && (
                                  <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                      <div className="space-y-2">
                                        <div className="flex justify-between">
                                          <span className="font-medium text-gray-700">日志类型:</span>
                                          {getTypeBadge(selectedLog.type)}
                                        </div>
                                        <div className="flex justify-between">
                                          <span className="font-medium text-gray-700">级别:</span>
                                          {getLevelBadge(selectedLog.level)}
                                        </div>
                                        <div className="flex justify-between">
                                          <span className="font-medium text-gray-700">来源:</span>
                                          <span className="text-blue-600 font-medium">{selectedLog.source}</span>
                                        </div>
                                      </div>
                                      <div className="space-y-2">
                                        <div className="flex justify-between">
                                          <span className="font-medium text-gray-700">用户:</span>
                                          <span className="text-gray-900">{selectedLog.user}</span>
                                        </div>
                                        <div className="flex justify-between">
                                          <span className="font-medium text-gray-700">IP地址:</span>
                                          <span className="font-mono text-gray-900">{selectedLog.ip}</span>
                                        </div>
                                        <div className="flex justify-between">
                                          <span className="font-medium text-gray-700">时间:</span>
                                          <span className="font-mono text-gray-900">{selectedLog.time}</span>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="space-y-2">
                                      <span className="font-medium text-gray-700">消息:</span>
                                      <div className="p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
                                        <p className="text-gray-900">{selectedLog.message}</p>
                                      </div>
                                    </div>
                                    <div className="space-y-2">
                                      <span className="font-medium text-gray-700">详细信息:</span>
                                      <div className="p-3 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg border border-gray-200">
                                        <pre className="text-xs text-gray-700 whitespace-pre-wrap font-mono">
                                          {selectedLog.details}
                                        </pre>
                                      </div>
                                    </div>
                                  </div>
                                )}
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

                {/* 分页控件 */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-between mt-6">
                    <div className="text-sm text-gray-600">
                      显示第 {(currentPage - 1) * pageSize + 1} -{" "}
                      {Math.min(currentPage * pageSize, filteredLogs.length)} 条，共 {filteredLogs.length} 条记录
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                        disabled={currentPage === 1}
                      >
                        上一页
                      </Button>
                      <div className="flex items-center space-x-1">
                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                          const page = i + 1
                          return (
                            <Button
                              key={page}
                              variant={currentPage === page ? "default" : "outline"}
                              size="sm"
                              onClick={() => setCurrentPage(page)}
                              className={
                                currentPage === page ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white" : ""
                              }
                            >
                              {page}
                            </Button>
                          )
                        })}
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                        disabled={currentPage === totalPages}
                      >
                        下一页
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
