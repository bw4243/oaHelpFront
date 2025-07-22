"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"
import { FileText, AlertTriangle, CheckCircle, Users, TrendingUp, Activity, Clock } from "lucide-react"

export default function WorkflowMonitor() {
  const stats = [
    {
      title: "运行中流程",
      value: "1,234",
      change: "+12%",
      icon: FileText,
      gradient: "from-blue-500 to-blue-600",
      bgGradient: "from-blue-50 to-blue-100",
    },
    {
      title: "超时流程",
      value: "23",
      change: "-5%",
      icon: AlertTriangle,
      gradient: "from-red-500 to-red-600",
      bgGradient: "from-red-50 to-red-100",
    },
    {
      title: "今日完成",
      value: "156",
      change: "+18%",
      icon: CheckCircle,
      gradient: "from-green-500 to-green-600",
      bgGradient: "from-green-50 to-green-100",
    },
    {
      title: "待处理人员",
      value: "89",
      change: "+3%",
      icon: Users,
      gradient: "from-orange-500 to-orange-600",
      bgGradient: "from-orange-50 to-orange-100",
    },
  ]

  const nodeTimeData = [
    { name: "部门经理审批", avgTime: 2.5, count: 45 },
    { name: "财务审批", avgTime: 4.2, count: 32 },
    { name: "总经理审批", avgTime: 6.8, count: 28 },
    { name: "HR审批", avgTime: 1.8, count: 52 },
    { name: "IT审批", avgTime: 3.1, count: 38 },
  ]

  const workflowTypeData = [
    { name: "请假流程", value: 35, color: "#3B82F6" },
    { name: "报销流程", value: 28, color: "#10B981" },
    { name: "采购流程", value: 20, color: "#F59E0B" },
    { name: "合同审批", value: 17, color: "#8B5CF6" },
  ]

  const trendData = [
    { date: "01-10", submitted: 45, completed: 38, timeout: 2 },
    { date: "01-11", submitted: 52, completed: 41, timeout: 3 },
    { date: "01-12", submitted: 38, completed: 45, timeout: 1 },
    { date: "01-13", submitted: 61, completed: 52, timeout: 4 },
    { date: "01-14", submitted: 48, completed: 39, timeout: 2 },
    { date: "01-15", submitted: 55, completed: 48, timeout: 3 },
    { date: "01-16", submitted: 42, completed: 51, timeout: 1 },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* 页面标题 */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl shadow-lg">
            <Activity className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
              流程监控仪表盘
            </h1>
            <p className="text-lg text-gray-600 mt-2">实时监控流程运行状态和性能指标</p>
          </div>
        </div>

        {/* 统计卡片 */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <Card
              key={index}
              className="relative overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${stat.bgGradient} opacity-50`} />
              <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-700">{stat.title}</CardTitle>
                <div className={`p-2 rounded-lg bg-gradient-to-r ${stat.gradient} shadow-lg`}>
                  <stat.icon className="h-5 w-5 text-white" />
                </div>
              </CardHeader>
              <CardContent className="relative">
                <div className="text-3xl font-bold text-gray-900">{stat.value}</div>
                <div className="flex items-center mt-2">
                  <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
                  <span
                    className={`text-sm font-medium ${stat.change.startsWith("+") ? "text-green-600" : "text-red-600"}`}
                  >
                    {stat.change}
                  </span>
                  <span className="text-sm text-gray-500 ml-1">较昨日</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* 流程趋势图 */}
        <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
          <CardHeader className="pb-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-lg">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-xl">流程处理趋势</CardTitle>
                <CardDescription className="text-gray-600">最近7天流程提交、完成和超时情况</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={trendData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis dataKey="date" stroke="#6B7280" />
                  <YAxis stroke="#6B7280" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "white",
                      border: "none",
                      borderRadius: "12px",
                      boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
                    }}
                  />
                  <Bar dataKey="submitted" fill="url(#blueGradient)" name="提交" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="completed" fill="url(#greenGradient)" name="完成" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="timeout" fill="url(#redGradient)" name="超时" radius={[4, 4, 0, 0]} />
                  <defs>
                    <linearGradient id="blueGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#3B82F6" />
                      <stop offset="100%" stopColor="#1D4ED8" />
                    </linearGradient>
                    <linearGradient id="greenGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#10B981" />
                      <stop offset="100%" stopColor="#059669" />
                    </linearGradient>
                    <linearGradient id="redGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#EF4444" />
                      <stop offset="100%" stopColor="#DC2626" />
                    </linearGradient>
                  </defs>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* 节点耗时分析 */}
          <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg">
                  <Clock className="w-5 h-5 text-white" />
                </div>
                <div>
                  <CardTitle className="text-xl">节点耗时分析</CardTitle>
                  <CardDescription className="text-gray-600">各审批节点平均处理时间（小时）</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {nodeTimeData.map((node, index) => (
                <div key={index} className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-700">{node.name}</span>
                    <div className="text-right">
                      <span className="text-sm font-semibold text-gray-900">{node.avgTime}h</span>
                      <span className="text-xs text-gray-500 ml-1">({node.count}个)</span>
                    </div>
                  </div>
                  <div className="relative">
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className="h-3 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full transition-all duration-1000 ease-out shadow-sm"
                        style={{ width: `${Math.min((node.avgTime / 8) * 100, 100)}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* 流程类型分布 */}
          <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gradient-to-r from-green-500 to-green-600 rounded-lg">
                  <FileText className="w-5 h-5 text-white" />
                </div>
                <div>
                  <CardTitle className="text-xl">流程类型分布</CardTitle>
                  <CardDescription className="text-gray-600">当前运行中的流程类型占比</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={workflowTypeData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {workflowTypeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "white",
                        border: "none",
                        borderRadius: "12px",
                        boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="grid grid-cols-2 gap-3 mt-6">
                {workflowTypeData.map((item, index) => (
                  <div key={index} className="flex items-center space-x-3 p-2 rounded-lg bg-gray-50">
                    <div className="w-4 h-4 rounded-full" style={{ backgroundColor: item.color }} />
                    <div className="flex-1">
                      <span className="text-sm font-medium text-gray-700">{item.name}</span>
                      <span className="text-xs text-gray-500 ml-2">{item.value}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 超时流程预警 */}
        <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
          <CardHeader className="pb-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-red-500 to-red-600 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-xl text-red-700">超时流程预警</CardTitle>
                <CardDescription className="text-gray-600">需要关注的超时或即将超时的流程</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { id: "WF001", title: "张三的请假申请", node: "部门经理审批", overdue: "2小时", level: "high" },
                { id: "WF002", title: "办公设备采购", node: "财务审批", overdue: "30分钟", level: "medium" },
                { id: "WF003", title: "差旅费报销", node: "总经理审批", overdue: "即将超时", level: "low" },
              ].map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 border-2 border-gray-100 rounded-xl hover:border-gray-200 transition-all duration-200 bg-gradient-to-r from-gray-50 to-white"
                >
                  <div className="flex items-center space-x-4">
                    <div
                      className={`w-3 h-3 rounded-full ${
                        item.level === "high"
                          ? "bg-red-500 animate-pulse"
                          : item.level === "medium"
                            ? "bg-yellow-500"
                            : "bg-blue-500"
                      }`}
                    />
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline" className="text-xs">
                          {item.id}
                        </Badge>
                        <span className="font-medium text-gray-900">{item.title}</span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">当前节点: {item.node}</p>
                    </div>
                  </div>
                  <Badge
                    className={
                      item.level === "high"
                        ? "bg-gradient-to-r from-red-500 to-red-600 text-white"
                        : item.level === "medium"
                          ? "bg-gradient-to-r from-yellow-500 to-yellow-600 text-white"
                          : "bg-gradient-to-r from-blue-500 to-blue-600 text-white"
                    }
                  >
                    {item.overdue}
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
