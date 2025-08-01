"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Activity, AlertTriangle, CheckCircle, Clock, Users, FileText, Server, TrendingUp, Zap } from "lucide-react"

export default function Dashboard() {
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
      title: "活跃用户",
      value: "856",
      change: "+8%",
      icon: Users,
      gradient: "from-green-500 to-green-600",
      bgGradient: "from-green-50 to-green-100",
    },
    {
      title: "系统健康度",
      value: "98.5%",
      change: "+0.2%",
      icon: Activity,
      gradient: "from-emerald-500 to-emerald-600",
      bgGradient: "from-emerald-50 to-emerald-100",
    },
  ]

  const recentActivities = [
    { type: "流程撤回", user: "张三", time: "2分钟前", status: "success", icon: FileText },
    { type: "审批代理", user: "李四", time: "5分钟前", status: "info", icon: Users },
    { type: "组织变更", user: "王五", time: "10分钟前", status: "warning", icon: AlertTriangle },
    { type: "系统同步", user: "系统", time: "15分钟前", status: "success", icon: Zap },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="space-y-8 p-6">
        {/* 页面标题 */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl shadow-lg">
            <Activity className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
              办公协同运维平台

            </h1>
            <p className="text-lg text-gray-600 mt-2">系统运行状态总览</p>
          </div>
        </div>

        {/* 统计卡片 */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <Card
              key={index}
              className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
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
                  <span className="text-sm font-medium text-green-600">{stat.change}</span>
                  <span className="text-sm text-gray-500 ml-1">较上周</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* 流程状态分析 */}
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg">
                  <FileText className="w-5 h-5 text-white" />
                </div>
                <div>
                  <CardTitle className="text-xl">流程状态分析</CardTitle>
                  <CardDescription className="text-gray-600">各类流程处理情况</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {[
                { name: "请假流程", value: 85, color: "from-blue-500 to-blue-600" },
                { name: "报销流程", value: 72, color: "from-green-500 to-green-600" },
                { name: "采购流程", value: 68, color: "from-yellow-500 to-yellow-600" },
                { name: "合同审批", value: 91, color: "from-purple-500 to-purple-600" },
              ].map((item, index) => (
                <div key={index} className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-700">{item.name}</span>
                    <span className="text-sm font-semibold text-gray-900">{item.value}%</span>
                  </div>
                  <div className="relative">
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className={`h-3 bg-gradient-to-r ${item.color} rounded-full transition-all duration-1000 ease-out shadow-sm`}
                        style={{ width: `${item.value}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* 最近活动 */}
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-lg">
                  <Clock className="w-5 h-5 text-white" />
                </div>
                <div>
                  <CardTitle className="text-xl">最近活动</CardTitle>
                  <CardDescription className="text-gray-600">系统操作记录</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivities.map((activity, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-4 p-3 rounded-xl bg-gradient-to-r from-gray-50 to-gray-100 hover:from-gray-100 hover:to-gray-200 transition-all duration-200"
                  >
                    <div
                      className={`p-2 rounded-lg ${
                        activity.status === "success"
                          ? "bg-gradient-to-r from-green-500 to-green-600"
                          : activity.status === "warning"
                            ? "bg-gradient-to-r from-yellow-500 to-yellow-600"
                            : "bg-gradient-to-r from-blue-500 to-blue-600"
                      }`}
                    >
                      <activity.icon className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{activity.type}</p>
                      <p className="text-sm text-gray-600">
                        {activity.user} · {activity.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 系统健康状态 */}
        <div className="grid gap-6 md:grid-cols-3">
          {[
            { title: "数据库连接", status: "正常", detail: "响应时间: 12ms", icon: CheckCircle, color: "green" },
            { title: "外部接口", status: "延迟", detail: "平均响应: 2.3s", icon: Clock, color: "yellow" },
            { title: "服务器负载", status: "65%", detail: "CPU使用率", icon: Server, color: "blue" },
          ].map((item, index) => (
            <Card
              key={index}
              className="border-0 shadow-lg bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300"
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-700">{item.title}</CardTitle>
                <div
                  className={`p-2 rounded-lg ${
                    item.color === "green"
                      ? "bg-gradient-to-r from-green-500 to-green-600"
                      : item.color === "yellow"
                        ? "bg-gradient-to-r from-yellow-500 to-yellow-600"
                        : "bg-gradient-to-r from-blue-500 to-blue-600"
                  }`}
                >
                  <item.icon className="h-4 w-4 text-white" />
                </div>
              </CardHeader>
              <CardContent>
                <div
                  className={`text-2xl font-bold ${
                    item.color === "green"
                      ? "text-green-600"
                      : item.color === "yellow"
                        ? "text-yellow-600"
                        : "text-blue-600"
                  }`}
                >
                  {item.status}
                </div>
                <p className="text-sm text-gray-600 mt-1">{item.detail}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
