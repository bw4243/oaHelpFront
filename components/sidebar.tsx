"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Home,
  GitBranch,
  Users,
  Building2,
  Settings,
  ChevronDown,
  ChevronRight,
  FileText,
  BarChart3,
  UserCheck,
  Database,
  Clock,
  Search,
  Activity,
} from "lucide-react"

const menuItems = [
  {
    title: "首页",
    href: "/",
    icon: Home,
    gradient: "from-blue-500 to-blue-600",
  },
  {
    title: "流程管理",
    icon: GitBranch,
    gradient: "from-purple-500 to-purple-600",
    children: [
      { title: "流程撤回/终止", href: "/workflow/recall", icon: FileText },
      { title: "流程监控", href: "/workflow/monitor", icon: BarChart3 },
      { title: "流程追踪", href: "/workflow/tracking", icon: Search },
    ],
  },
  {
    title: "审批人员维护",
    icon: Users,
    gradient: "from-green-500 to-green-600",
    children: [
      { title: "批量替换", href: "/approver/replace", icon: UserCheck },
      { title: "审批代理", href: "/approver/delegate", icon: Users },
      { title: "导入导出", href: "/approver/import-export", icon: Database },
    ],
  },
  {
    title: "组织架构维护",
    icon: Building2,
    gradient: "from-orange-500 to-orange-600",
    children: [
      { title: "架构对比", href: "/organization/compare", icon: BarChart3 },
      { title: "离职清理", href: "/organization/cleanup", icon: UserCheck },
      { title: "虚拟账号检测", href: "/organization/virtual-accounts", icon: Search },
    ],
  },
  {
    title: "系统运维",
    icon: Settings,
    gradient: "from-red-500 to-red-600",
    children: [
      { title: "定时任务", href: "/system/tasks", icon: Clock },
      { title: "系统日志", href: "/system/logs", icon: FileText },
      { title: "数据同步监控", href: "/system/sync", icon: Database },
    ],
  },
]

export function Sidebar() {
  const pathname = usePathname()
  const [expandedItems, setExpandedItems] = useState<string[]>([])

  const toggleExpanded = (title: string) => {
    setExpandedItems((prev) => (prev.includes(title) ? prev.filter((item) => item !== title) : [...prev, title]))
  }

  return (
    <div className="w-72 border-r bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white shadow-2xl">
      {/* Logo区域 */}
      <div className="p-6 border-b border-slate-700">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl shadow-lg">
            <Activity className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
              泛微OA管理
            </h2>
            <p className="text-xs text-slate-400">管理运维平台</p>
          </div>
        </div>
      </div>

      <ScrollArea className="flex-1 px-4 py-6">
        <div className="space-y-2">
          {menuItems.map((item) => (
            <div key={item.title}>
              {item.children ? (
                <div>
                  <Button
                    variant="ghost"
                    className={cn(
                      "w-full justify-start text-slate-300 hover:text-white hover:bg-slate-800/50 transition-all duration-200",
                      expandedItems.includes(item.title) && "bg-slate-800/30",
                    )}
                    onClick={() => toggleExpanded(item.title)}
                  >
                    <div className={`p-1.5 rounded-lg bg-gradient-to-r ${item.gradient} mr-3 shadow-sm`}>
                      <item.icon className="h-4 w-4 text-white" />
                    </div>
                    <span className="flex-1 text-left">{item.title}</span>
                    {expandedItems.includes(item.title) ? (
                      <ChevronDown className="h-4 w-4 transition-transform duration-200" />
                    ) : (
                      <ChevronRight className="h-4 w-4 transition-transform duration-200" />
                    )}
                  </Button>
                  {expandedItems.includes(item.title) && (
                    <div className="ml-6 mt-2 space-y-1 border-l border-slate-700 pl-4">
                      {item.children.map((child) => (
                        <Button
                          key={child.href}
                          variant="ghost"
                          size="sm"
                          className={cn(
                            "w-full justify-start text-slate-400 hover:text-white hover:bg-slate-800/30 transition-all duration-200",
                            pathname === child.href &&
                              "bg-gradient-to-r from-blue-600/20 to-indigo-600/20 text-white border-r-2 border-blue-500",
                          )}
                          asChild
                        >
                          <Link href={child.href}>
                            <child.icon className="mr-3 h-4 w-4" />
                            {child.title}
                          </Link>
                        </Button>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Button
                  variant="ghost"
                  className={cn(
                    "w-full justify-start text-slate-300 hover:text-white hover:bg-slate-800/50 transition-all duration-200",
                    pathname === item.href &&
                      "bg-gradient-to-r from-blue-600/20 to-indigo-600/20 text-white border-r-2 border-blue-500",
                  )}
                  asChild
                >
                  <Link href={item.href}>
                    <div className={`p-1.5 rounded-lg bg-gradient-to-r ${item.gradient} mr-3 shadow-sm`}>
                      <item.icon className="h-4 w-4 text-white" />
                    </div>
                    {item.title}
                  </Link>
                </Button>
              )}
            </div>
          ))}
        </div>
      </ScrollArea>

      {/* 底部状态 */}
      <div className="p-4 border-t border-slate-700">
        <div className="flex items-center space-x-3 p-3 bg-slate-800/50 rounded-xl">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <div className="flex-1">
            <p className="text-xs font-medium text-slate-300">系统状态</p>
            <p className="text-xs text-slate-500">运行正常</p>
          </div>
        </div>
      </div>
    </div>
  )
}
