"use client"
import { motion } from "framer-motion"
import { useQuery } from "@tanstack/react-query"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Breadcrumb } from "@/components/breadcrumb"
import {
  TrendingUp,
  TrendingDown,
  Clock,
  CheckCircle,
  AlertCircle,
  Users,
  Calendar,
  BarChart3,
  PieChart,
  Activity,
  FolderOpen,
} from "lucide-react"
import { api } from "@/lib/api"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart as RechartsPieChart,
  Cell,
  Pie,
} from "recharts"

// Mock analytics data
const approvalTrendData = [
  { month: "Jan", approved: 45, rejected: 8, pending: 12 },
  { month: "Feb", approved: 52, rejected: 6, pending: 15 },
  { month: "Mar", approved: 48, rejected: 9, pending: 18 },
  { month: "Apr", approved: 61, rejected: 4, pending: 14 },
  { month: "May", approved: 55, rejected: 7, pending: 22 },
  { month: "Jun", approved: 67, rejected: 5, pending: 19 },
]

const contentTypeData = [
  { name: "Instagram Posts", value: 35, color: "#8B5CF6" },
  { name: "LinkedIn Posts", value: 25, color: "#3B82F6" },
  { name: "Twitter Posts", value: 20, color: "#10B981" },
  { name: "Instagram Stories", value: 15, color: "#F59E0B" },
  { name: "Executive Posts", value: 5, color: "#EF4444" },
]

const teamPerformanceData = [
  { name: "Sarah Chen", approved: 28, rejected: 2, avgTime: "2.3h" },
  { name: "Mike Johnson", approved: 35, rejected: 4, avgTime: "1.8h" },
  { name: "Lisa Wang", approved: 22, rejected: 1, avgTime: "3.1h" },
  { name: "Tom Wilson", approved: 31, rejected: 3, avgTime: "2.7h" },
  { name: "Alex Rivera", approved: 19, rejected: 2, avgTime: "2.9h" },
]

const weeklyActivityData = [
  { day: "Mon", submissions: 12, approvals: 8 },
  { day: "Tue", submissions: 15, approvals: 11 },
  { day: "Wed", submissions: 18, approvals: 14 },
  { day: "Thu", submissions: 22, approvals: 16 },
  { day: "Fri", submissions: 16, approvals: 13 },
  { day: "Sat", submissions: 8, approvals: 6 },
  { day: "Sun", submissions: 5, approvals: 4 },
]

export default function Dashboard() {
  const { data: projects = [], isLoading: projectsLoading } = useQuery({
    queryKey: ["projects"],
    queryFn: api.getProjects,
  })

  const { data: approvals = [], isLoading: approvalsLoading } = useQuery({
    queryKey: ["approvals"],
    queryFn: api.getApprovals,
  })

  // Calculate key metrics
  const totalProjects = projects.length
  const activeProjects = projects.filter((p) => p.status === "active").length
  const pendingApprovals = approvals.length
  const avgApprovalTime = "2.4 hours" // Mock data
  const approvalRate = "89%" // Mock data

  return (
    <div className="min-h-screen">
      {/* Header with Breadcrumb */}
      <header className="bg-white border-b border-gray-200">
        <div className="px-4 sm:px-6 lg:px-8 py-4">
          <Breadcrumb />
        </div>
      </header>

      {/* Main Content */}
      <div className="px-4 sm:px-6 lg:px-8 py-6">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <FolderOpen className="w-8 h-8 text-blue-600" />
                  <div className="ml-4">
                    <p className="text-2xl font-bold text-gray-900">{totalProjects}</p>
                    <p className="text-sm text-gray-600">Total Projects</p>
                  </div>
                </div>
                <div className="mt-4 flex items-center text-sm">
                  <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                  <span className="text-green-600">+12%</span>
                  <span className="text-gray-500 ml-1">vs last month</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <Activity className="w-8 h-8 text-green-600" />
                  <div className="ml-4">
                    <p className="text-2xl font-bold text-gray-900">{activeProjects}</p>
                    <p className="text-sm text-gray-600">Active Projects</p>
                  </div>
                </div>
                <div className="mt-4 flex items-center text-sm">
                  <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                  <span className="text-green-600">+8%</span>
                  <span className="text-gray-500 ml-1">vs last month</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <Clock className="w-8 h-8 text-yellow-600" />
                  <div className="ml-4">
                    <p className="text-2xl font-bold text-gray-900">{pendingApprovals}</p>
                    <p className="text-sm text-gray-600">Pending Approvals</p>
                  </div>
                </div>
                <div className="mt-4 flex items-center text-sm">
                  <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
                  <span className="text-red-600">-5%</span>
                  <span className="text-gray-500 ml-1">vs last week</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                  <div className="ml-4">
                    <p className="text-2xl font-bold text-gray-900">{approvalRate}</p>
                    <p className="text-sm text-gray-600">Approval Rate</p>
                  </div>
                </div>
                <div className="mt-4 flex items-center text-sm">
                  <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                  <span className="text-green-600">+3%</span>
                  <span className="text-gray-500 ml-1">vs last month</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <Calendar className="w-8 h-8 text-purple-600" />
                  <div className="ml-4">
                    <p className="text-2xl font-bold text-gray-900">{avgApprovalTime}</p>
                    <p className="text-sm text-gray-600">Avg Approval Time</p>
                  </div>
                </div>
                <div className="mt-4 flex items-center text-sm">
                  <TrendingDown className="w-4 h-4 text-green-500 mr-1" />
                  <span className="text-green-600">-15%</span>
                  <span className="text-gray-500 ml-1">vs last month</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Approval Trends */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3 className="w-5 h-5 mr-2" />
                  Approval Trends
                </CardTitle>
                <CardDescription>Monthly approval, rejection, and pending content</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={approvalTrendData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="approved" stroke="#10B981" strokeWidth={2} />
                    <Line type="monotone" dataKey="rejected" stroke="#EF4444" strokeWidth={2} />
                    <Line type="monotone" dataKey="pending" stroke="#F59E0B" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>

          {/* Content Type Distribution */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <PieChart className="w-5 h-5 mr-2" />
                  Content Type Distribution
                </CardTitle>
                <CardDescription>Breakdown of content types this month</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsPieChart>
                    <Pie
                      data={contentTypeData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {contentTypeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Weekly Activity and Team Performance */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Weekly Activity */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Activity className="w-5 h-5 mr-2" />
                  Weekly Activity
                </CardTitle>
                <CardDescription>Content submissions and approvals by day</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={weeklyActivityData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="submissions" fill="#3B82F6" />
                    <Bar dataKey="approvals" fill="#10B981" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>

          {/* Team Performance */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9 }}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="w-5 h-5 mr-2" />
                  Team Performance
                </CardTitle>
                <CardDescription>Individual approval statistics this month</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {teamPerformanceData.map((member, index) => (
                    <motion.div
                      key={member.name}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 1 + index * 0.1 }}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                          <span className="text-white text-xs font-medium">
                            {member.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{member.name}</p>
                          <p className="text-sm text-gray-600">Avg: {member.avgTime}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-center">
                          <div className="flex items-center space-x-1">
                            <CheckCircle className="w-4 h-4 text-green-600" />
                            <span className="text-sm font-medium text-green-600">{member.approved}</span>
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="flex items-center space-x-1">
                            <AlertCircle className="w-4 h-4 text-red-600" />
                            <span className="text-sm font-medium text-red-600">{member.rejected}</span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
