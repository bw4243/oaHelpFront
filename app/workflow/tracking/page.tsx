"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
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
import {
  Search,
  GitBranch,
  User,
  Clock,
  CheckCircle,
  AlertCircle,
  SkipForward,
  FileText,
  MessageSquare,
  History,
  Eye,
} from "lucide-react"

export default function WorkflowTracking() {
  const [selectedWorkflow, setSelectedWorkflow] = useState("WF001")
  const [selectedNode, setSelectedNode] = useState("node2")
  const [jumpToNode, setJumpToNode] = useState("")
  const [jumpReason, setJumpReason] = useState("")
  const [newApprover, setNewApprover] = useState("")
  const [jumpComment, setJumpComment] = useState("")

  // 模拟流程数据
  const workflowData = {
    WF001: {
      id: "WF001",
      title: "张三的请假申请",
      type: "请假流程",
      submitter: "张三",
      submitTime: "2024-01-15 09:30",
      currentNode: "node2",
      status: "审批中",
      nodes: [
        {
          id: "node1",
          name: "提交申请",
          type: "start",
          approver: "张三",
          status: "completed",
          completedTime: "2024-01-15 09:30",
          comment: "申请3天年假",
          position: { x: 50, y: 100 },
        },
        {
          id: "node2",
          name: "部门经理审批",
          type: "approval",
          approver: "李经理",
          status: "pending",
          receivedTime: "2024-01-15 09:35",
          deadline: "2024-01-17 09:35",
          position: { x: 250, y: 100 },
        },
        {
          id: "node3",
          name: "HR审批",
          type: "approval",
          approver: "王主管",
          status: "waiting",
          position: { x: 450, y: 100 },
        },
        {
          id: "node4",
          name: "流程结束",
          type: "end",
          status: "waiting",
          position: { x: 650, y: 100 },
        },
      ],
      connections: [
        { from: "node1", to: "node2" },
        { from: "node2", to: "node3" },
        { from: "node3", to: "node4" },
      ],
      history: [
        {
          id: "1",
          nodeId: "node1",
          nodeName: "提交申请",
          approver: "张三",
          action: "提交",
          time: "2024-01-15 09:30",
          comment: "申请3天年假，用于处理个人事务",
          status: "completed",
        },
      ],
    },
  }

  // 可用审批人员
  const availableApprovers = [
    { id: "liu", name: "刘经理", department: "技术部", position: "部门经理" },
    { id: "chen", name: "陈主管", department: "人事部", position: "HR主管" },
    { id: "zhao", name: "赵经理", department: "财务部", position: "财务经理" },
    { id: "wang", name: "王总监", department: "管理层", position: "运营总监" },
  ]

  const currentWorkflow = workflowData[selectedWorkflow as keyof typeof workflowData]
  const currentNodeData = currentWorkflow?.nodes.find((node) => node.id === selectedNode)

  // 获取可跳转的节点（排除当前节点和已完成节点）
  const availableJumpNodes = currentWorkflow?.nodes.filter(
    (node) => node.id !== selectedNode && node.status !== "completed" && node.type !== "start",
  )

  const handleNodeClick = (nodeId: string) => {
    setSelectedNode(nodeId)
  }

  const handleJumpNode = async () => {
    if (!jumpToNode || !jumpReason) return

    // 模拟跳转操作
    console.log("执行节点跳转:", {
      from: selectedNode,
      to: jumpToNode,
      reason: jumpReason,
      newApprover: newApprover,
      comment: jumpComment,
    })

    // 这里会调用API执行实际的跳转操作
    // 重置表单
    setJumpToNode("")
    setJumpReason("")
    setNewApprover("")
    setJumpComment("")
  }

  const getNodeStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-500"
      case "pending":
        return "bg-red-500 animate-pulse"
      case "waiting":
        return "bg-gray-400"
      default:
        return "bg-gray-300"
    }
  }

  const getNodeStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-500 text-white">已完成</Badge>
      case "pending":
        return <Badge className="bg-red-500 text-white animate-pulse">进行中</Badge>
      case "waiting":
        return <Badge className="bg-gray-500 text-white">等待中</Badge>
      default:
        return <Badge variant="outline">未知</Badge>
    }
  }

  const FlowChart = () => (
    <div className="relative w-full h-96 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border-2 border-blue-200 overflow-hidden">
      <svg width="100%" height="100%" className="absolute inset-0">
        {/* 绘制连接线 */}
        {currentWorkflow?.connections.map((conn, index) => {
          const fromNode = currentWorkflow.nodes.find((n) => n.id === conn.from)
          const toNode = currentWorkflow.nodes.find((n) => n.id === conn.to)
          if (!fromNode || !toNode) return null

          return (
            <line
              key={index}
              x1={fromNode.position.x + 60}
              y1={fromNode.position.y + 30}
              x2={toNode.position.x}
              y2={toNode.position.y + 30}
              stroke="#3B82F6"
              strokeWidth="2"
              markerEnd="url(#arrowhead)"
            />
          )
        })}

        {/* 箭头标记 */}
        <defs>
          <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto" fill="#3B82F6">
            <polygon points="0 0, 10 3.5, 0 7" />
          </marker>
        </defs>
      </svg>

      {/* 绘制节点 */}
      {currentWorkflow?.nodes.map((node) => (
        <div
          key={node.id}
          className={`absolute cursor-pointer transition-all duration-200 hover:scale-105 ${
            selectedNode === node.id ? "ring-4 ring-blue-500 ring-opacity-50" : ""
          }`}
          style={{
            left: node.position.x,
            top: node.position.y,
            transform: "translate(-50%, -50%)",
          }}
          onClick={() => handleNodeClick(node.id)}
        >
          <div className="flex flex-col items-center space-y-2">
            {/* 节点圆圈 */}
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center text-white shadow-lg ${getNodeStatusColor(
                node.status,
              )}`}
            >
              {node.type === "start" && <FileText className="w-5 h-5" />}
              {node.type === "approval" && <User className="w-5 h-5" />}
              {node.type === "end" && <CheckCircle className="w-5 h-5" />}
            </div>
            {/* 节点标签 */}
            <div className="bg-white px-3 py-1 rounded-lg shadow-md border border-gray-200 text-xs font-medium text-gray-700 whitespace-nowrap">
              {node.name}
            </div>
            {/* 审批人 */}
            {node.approver && (
              <div className="text-xs text-gray-600 bg-white px-2 py-1 rounded shadow-sm">{node.approver}</div>
            )}
          </div>
        </div>
      ))}
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* 页面标题 */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl shadow-lg">
            <GitBranch className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
              流程追踪与节点跳转
            </h1>
            <p className="text-lg text-gray-600 mt-2">可视化流程追踪，支持管理员节点跳转操作</p>
          </div>
        </div>

        {/* 流程选择 */}
        <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
          <CardHeader className="pb-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg">
                <Search className="w-5 h-5 text-white" />
              </div>
              <CardTitle className="text-xl">流程选择</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label>流程编号</Label>
                <Input value={selectedWorkflow} onChange={(e) => setSelectedWorkflow(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>流程标题</Label>
                <Input value={currentWorkflow?.title || ""} disabled />
              </div>
              <div className="space-y-2">
                <Label>流程状态</Label>
                <Badge className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                  {currentWorkflow?.status}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 主要内容区域 */}
        <div className="grid gap-8 lg:grid-cols-3">
          {/* 左侧：流程图 */}
          <div className="lg:col-span-2">
            <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-lg">
                      <GitBranch className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-xl">流程图</CardTitle>
                      <CardDescription className="text-gray-600">点击节点查看详情，当前节点标红显示</CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4 text-sm">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="text-gray-600">已完成</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                      <span className="text-gray-600">进行中</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                      <span className="text-gray-600">等待中</span>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <FlowChart />
              </CardContent>
            </Card>
          </div>

          {/* 右侧：节点详情和操作 */}
          <div className="space-y-6">
            {/* 当前节点详情 */}
            <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-gradient-to-r from-green-500 to-green-600 rounded-lg">
                    <Eye className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">节点详情</CardTitle>
                    <CardDescription className="text-gray-600">当前选中节点的详细信息</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {currentNodeData && (
                  <>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700">节点名称</span>
                        <span className="font-semibold text-gray-900">{currentNodeData.name}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700">审批人</span>
                        <span className="text-gray-900">{currentNodeData.approver || "无"}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700">状态</span>
                        {getNodeStatusBadge(currentNodeData.status)}
                      </div>
                      {currentNodeData.receivedTime && (
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-700">接收时间</span>
                          <span className="text-gray-600 text-sm">{currentNodeData.receivedTime}</span>
                        </div>
                      )}
                      {currentNodeData.completedTime && (
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-700">完成时间</span>
                          <span className="text-gray-600 text-sm">{currentNodeData.completedTime}</span>
                        </div>
                      )}
                      {currentNodeData.deadline && (
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-700">截止时间</span>
                          <span className="text-red-600 text-sm font-medium">{currentNodeData.deadline}</span>
                        </div>
                      )}
                      {currentNodeData.comment && (
                        <div className="space-y-2">
                          <span className="text-sm font-medium text-gray-700">审批意见</span>
                          <div className="p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
                            <p className="text-sm text-gray-700">{currentNodeData.comment}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {/* 节点跳转操作 */}
            <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg">
                    <SkipForward className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">节点跳转</CardTitle>
                    <CardDescription className="text-gray-600">管理员可强制跳转到指定节点</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <Label>跳转到节点</Label>
                  <Select value={jumpToNode} onValueChange={setJumpToNode}>
                    <SelectTrigger>
                      <SelectValue placeholder="选择目标节点" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableJumpNodes?.map((node) => (
                        <SelectItem key={node.id} value={node.id}>
                          <div className="flex items-center space-x-2">
                            <div className={`w-3 h-3 rounded-full ${getNodeStatusColor(node.status)}`}></div>
                            <span>{node.name}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {jumpToNode && (
                  <>
                    <div className="space-y-3">
                      <Label>新审批人（可选）</Label>
                      <Select value={newApprover} onValueChange={setNewApprover}>
                        <SelectTrigger>
                          <SelectValue placeholder="选择新审批人" />
                        </SelectTrigger>
                        <SelectContent>
                          {availableApprovers.map((approver) => (
                            <SelectItem key={approver.id} value={approver.id}>
                              <div className="flex flex-col">
                                <span className="font-medium">{approver.name}</span>
                                <span className="text-xs text-gray-500">
                                  {approver.department} · {approver.position}
                                </span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-3">
                      <Label>跳转理由 *</Label>
                      <Textarea
                        placeholder="请输入跳转理由，如：原审批人离职、紧急处理等..."
                        value={jumpReason}
                        onChange={(e) => setJumpReason(e.target.value)}
                        className="border-2 border-gray-200 focus:border-orange-500 transition-colors"
                      />
                    </div>

                    <div className="space-y-3">
                      <Label>跳转说明（可选）</Label>
                      <Textarea
                        placeholder="补充说明信息，将记录到审批历史中..."
                        value={jumpComment}
                        onChange={(e) => setJumpComment(e.target.value)}
                        className="border-2 border-gray-200 focus:border-orange-500 transition-colors"
                      />
                    </div>

                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700"
                          disabled={!jumpToNode || !jumpReason}
                        >
                          <SkipForward className="mr-2 h-4 w-4" />
                          执行跳转
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-md">
                        <DialogHeader>
                          <DialogTitle className="flex items-center space-x-2">
                            <AlertCircle className="w-5 h-5 text-orange-500" />
                            <span>确认节点跳转</span>
                          </DialogTitle>
                          <DialogDescription>此操作将强制跳转流程节点，请确认操作无误。</DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div className="p-4 bg-gradient-to-r from-orange-50 to-red-50 rounded-xl border border-orange-200">
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span className="font-medium text-gray-700">当前节点:</span>
                                <span className="text-gray-900">{currentNodeData?.name}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="font-medium text-gray-700">跳转到:</span>
                                <span className="text-gray-900">
                                  {availableJumpNodes?.find((n) => n.id === jumpToNode)?.name}
                                </span>
                              </div>
                              {newApprover && (
                                <div className="flex justify-between">
                                  <span className="font-medium text-gray-700">新审批人:</span>
                                  <span className="text-gray-900">
                                    {availableApprovers.find((a) => a.id === newApprover)?.name}
                                  </span>
                                </div>
                              )}
                              <div className="pt-2 border-t border-orange-200">
                                <span className="font-medium text-gray-700">跳转理由:</span>
                                <p className="text-gray-900 mt-1">{jumpReason}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                        <DialogFooter>
                          <Button variant="outline">取消</Button>
                          <Button
                            onClick={handleJumpNode}
                            className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700"
                          >
                            确认跳转
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* 审批历史 */}
        <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
          <CardHeader className="pb-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg">
                <History className="w-5 h-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-xl">审批历史</CardTitle>
                <CardDescription className="text-gray-600">流程的完整审批记录和操作历史</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {currentWorkflow?.history.map((record, index) => (
                <div
                  key={record.id}
                  className="flex items-start space-x-4 p-4 border-2 border-gray-100 rounded-xl hover:border-gray-200 transition-all duration-200 bg-gradient-to-r from-gray-50 to-white"
                >
                  <div className="p-2 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex-shrink-0">
                    {record.action === "提交" ? (
                      <FileText className="h-4 w-4 text-white" />
                    ) : record.action === "跳转" ? (
                      <SkipForward className="h-4 w-4 text-white" />
                    ) : (
                      <CheckCircle className="h-4 w-4 text-white" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-3">
                        <h4 className="font-medium text-gray-900">{record.nodeName}</h4>
                        <Badge
                          className={
                            record.status === "completed"
                              ? "bg-gradient-to-r from-green-500 to-green-600 text-white"
                              : "bg-gradient-to-r from-blue-500 to-blue-600 text-white"
                          }
                        >
                          {record.action}
                        </Badge>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <User className="w-4 h-4" />
                        <span>{record.approver}</span>
                        <Clock className="w-4 h-4 ml-2" />
                        <span>{record.time}</span>
                      </div>
                    </div>
                    {record.comment && (
                      <div className="p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
                        <div className="flex items-start space-x-2">
                          <MessageSquare className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                          <p className="text-sm text-gray-700">{record.comment}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {/* 示例跳转记录 */}
              <div className="flex items-start space-x-4 p-4 border-2 border-orange-200 rounded-xl bg-gradient-to-r from-orange-50 to-red-50">
                <div className="p-2 bg-gradient-to-r from-orange-500 to-red-600 rounded-lg flex-shrink-0">
                  <SkipForward className="h-4 w-4 text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-3">
                      <h4 className="font-medium text-gray-900">管理员跳转操作</h4>
                      <Badge className="bg-gradient-to-r from-orange-500 to-red-600 text-white">跳转</Badge>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <User className="w-4 h-4" />
                      <span>系统管理员</span>
                      <Clock className="w-4 h-4 ml-2" />
                      <span>2024-01-16 14:30</span>
                    </div>
                  </div>
                  <div className="p-3 bg-white/70 rounded-lg border border-orange-200">
                    <div className="flex items-start space-x-2">
                      <MessageSquare className="w-4 h-4 text-orange-600 mt-0.5 flex-shrink-0" />
                      <div className="text-sm text-gray-700">
                        <p className="font-medium">跳转说明：原审批人李经理已离职，流程跳转至HR审批节点</p>
                        <p className="mt-1 text-gray-600">
                          跳转路径：部门经理审批 → HR审批 | 新审批人：王主管 | 操作原因：审批人离职处理
                        </p>
                      </div>
                    </div>
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
