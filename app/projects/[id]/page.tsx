"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { useQuery } from "@tanstack/react-query"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import {
  ArrowLeft,
  FileText,
  Clock,
  CheckCircle,
  AlertCircle,
  Plus,
  Filter,
  Search,
  Calendar,
  Edit,
  Eye,
  Menu,
  X,
  LayoutGrid,
  List,
  Loader2,
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CreateDeliverableDialog } from "@/components/create-deliverable-dialog"
import { api } from "@/lib/api"
import Link from "next/link"
import { useParams } from "next/navigation"

const statusColors = {
  draft: "bg-gray-100 text-gray-800",
  "pending-approval": "bg-yellow-100 text-yellow-800",
  "in-review": "bg-blue-100 text-blue-800",
  approved: "bg-green-100 text-green-800",
  rejected: "bg-red-100 text-red-800",
  published: "bg-purple-100 text-purple-800",
}

const statusIcons = {
  draft: FileText,
  "pending-approval": Clock,
  "in-review": AlertCircle,
  approved: CheckCircle,
  rejected: AlertCircle,
  published: CheckCircle,
}

// Function to format status text
const formatStatus = (status: string) => {
  return status
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")
}

export default function ProjectDetailPage() {
  const params = useParams()
  const projectId = params.id as string
  const [selectedView, setSelectedView] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [showCreateDeliverable, setShowCreateDeliverable] = useState(false)
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")

  const {
    data: project,
    isLoading: projectLoading,
    error: projectError,
  } = useQuery({
    queryKey: ["project", projectId],
    queryFn: () => api.getProject(projectId),
  })

  const { data: deliverables = [], isLoading: deliverablesLoading } = useQuery({
    queryKey: ["deliverables", projectId],
    queryFn: () => api.getDeliverables(projectId),
    enabled: !!projectId,
  })

  const isLoading = projectLoading || deliverablesLoading

  if (projectError || (!projectLoading && !project)) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Project not found</h1>
          <p className="text-gray-600 mb-4">The project you're looking for doesn't exist.</p>
          <Link href="/">
            <Button>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Projects
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  const filteredDeliverables = deliverables.filter((deliverable) => {
    const matchesSearch =
      deliverable.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      deliverable.content.text.toLowerCase().includes(searchQuery.toLowerCase())

    if (selectedView === "all") return matchesSearch
    return matchesSearch && deliverable.status === selectedView
  })

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4 lg:py-6">
            <div className="flex items-center space-x-2 lg:space-x-3 min-w-0">
              <span className="text-2xl lg:text-3xl">👍</span>
              <div className="min-w-0">
                {isLoading ? (
                  <div className="animate-pulse">
                    <div className="h-6 bg-gray-200 rounded w-48 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-32"></div>
                  </div>
                ) : (
                  <>
                    <h1 className="text-lg lg:text-2xl font-bold text-gray-900 truncate">{project?.name}</h1>
                    <p className="text-xs lg:text-sm text-gray-600 truncate">
                      <span className="text-blue-600 font-medium">{project?.workstream.name}</span>
                      <span className="hidden sm:inline"> • {project?.description}</span>
                    </p>
                  </>
                )}
              </div>
            </div>

            {/* Desktop Actions */}
            <div className="hidden lg:flex items-center space-x-3">
              {!isLoading && project && (
                <Badge className="bg-blue-100 text-blue-800">{formatStatus(project.status)}</Badge>
              )}
              <Button variant="outline" size="sm">
                <Edit className="w-4 h-4 mr-2" />
                Edit Project
              </Button>
              <Button size="sm" onClick={() => setShowCreateDeliverable(true)}>
                <Plus className="w-4 h-4 mr-2" />
                New Deliverable
              </Button>
            </div>

            {/* Mobile Actions */}
            <div className="lg:hidden flex items-center space-x-2">
              {!isLoading && project && (
                <Badge className="bg-blue-100 text-blue-800 text-xs">{formatStatus(project.status)}</Badge>
              )}
              <Button variant="ghost" size="sm" onClick={() => setShowMobileMenu(!showMobileMenu)}>
                {showMobileMenu ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </Button>
            </div>
          </div>

          {/* Mobile Menu */}
          {showMobileMenu && (
            <div className="lg:hidden border-t border-gray-200 py-4">
              <div className="flex flex-col space-y-3">
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Project
                </Button>
                <Button
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => {
                    setShowCreateDeliverable(true)
                    setShowMobileMenu(false)
                  }}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  New Deliverable
                </Button>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            <span className="ml-2 text-gray-600">Loading project details...</span>
          </div>
        )}

        {!isLoading && project && (
          <>
            {/* Project Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-6 lg:mb-8">
              <Card>
                <CardContent className="p-4 lg:p-6">
                  <div className="flex items-center">
                    <FileText className="w-6 h-6 lg:w-8 lg:h-8 text-blue-600" />
                    <div className="ml-3 lg:ml-4">
                      <p className="text-lg lg:text-2xl font-bold text-gray-900">{deliverables.length}</p>
                      <p className="text-xs lg:text-sm text-gray-600">Total</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 lg:p-6">
                  <div className="flex items-center">
                    <CheckCircle className="w-6 h-6 lg:w-8 lg:h-8 text-green-600" />
                    <div className="ml-3 lg:ml-4">
                      <p className="text-lg lg:text-2xl font-bold text-gray-900">
                        {deliverables.filter((d) => d.status === "approved").length}
                      </p>
                      <p className="text-xs lg:text-sm text-gray-600">Approved</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 lg:p-6">
                  <div className="flex items-center">
                    <Clock className="w-6 h-6 lg:w-8 lg:h-8 text-yellow-600" />
                    <div className="ml-3 lg:ml-4">
                      <p className="text-lg lg:text-2xl font-bold text-gray-900">
                        {deliverables.filter((d) => d.status === "pending-approval" || d.status === "in-review").length}
                      </p>
                      <p className="text-xs lg:text-sm text-gray-600">Pending</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 lg:p-6">
                  <div className="flex items-center">
                    <AlertCircle className="w-6 h-6 lg:w-8 lg:h-8 text-gray-600" />
                    <div className="ml-3 lg:ml-4">
                      <p className="text-lg lg:text-2xl font-bold text-gray-900">
                        {deliverables.filter((d) => d.status === "draft").length}
                      </p>
                      <p className="text-xs lg:text-sm text-gray-600">Drafts</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Progress */}
            <Card className="mb-6 lg:mb-8">
              <CardContent className="p-4 lg:p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-base lg:text-lg font-semibold">Project Progress</h3>
                  <span className="text-xl lg:text-2xl font-bold text-blue-600">{project.progress}%</span>
                </div>
                <Progress value={project.progress} className="h-2 lg:h-3" />
                <p className="text-xs lg:text-sm text-gray-600 mt-2">
                  {deliverables.filter((d) => d.status === "approved").length} of {deliverables.length} deliverables
                  completed
                </p>
              </CardContent>
            </Card>

            {/* Filters with Back Button */}
            <div className="flex flex-col sm:flex-row gap-3 lg:gap-4 mb-6 lg:mb-8">
              <Link href="/">
                <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900 flex-shrink-0">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  <span className="hidden sm:inline">Back to Projects</span>
                  <span className="sm:hidden">Back</span>
                </Button>
              </Link>
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search deliverables..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-10"
                  />
                  {searchQuery && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0 hover:bg-gray-100"
                      onClick={() => setSearchQuery("")}
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  )}
                </div>
              </div>
              <Select value={selectedView} onValueChange={setSelectedView}>
                <SelectTrigger className="w-full sm:w-48">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Deliverables</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="pending-approval">Pending Approval</SelectItem>
                  <SelectItem value="in-review">In Review</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}
                className="flex items-center space-x-2"
              >
                {viewMode === "grid" ? <List className="w-4 h-4" /> : <LayoutGrid className="w-4 h-4" />}
                <span className="hidden sm:inline">{viewMode === "grid" ? "List" : "Grid"}</span>
              </Button>
            </div>

            {/* Deliverables Grid */}
            {filteredDeliverables.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No deliverables found</h3>
                <p className="text-gray-500 mb-4 px-4">
                  {searchQuery ? "Try adjusting your search terms" : "Get started by creating your first deliverable"}
                </p>
                <Button onClick={() => setShowCreateDeliverable(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Deliverable
                </Button>
              </div>
            ) : (
              <>
                {viewMode === "grid" ? (
                  <div className="grid gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {filteredDeliverables.map((deliverable, index) => {
                      const StatusIcon = statusIcons[deliverable.status as keyof typeof statusIcons]
                      return (
                        <motion.div
                          key={deliverable._id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          whileHover={{ scale: 1.02 }}
                          className="cursor-pointer"
                        >
                          <Link href={`/content/${deliverable._id}`}>
                            <Card className="h-full hover:shadow-lg transition-shadow">
                              <CardHeader className="pb-3">
                                <div className="flex items-center justify-between mb-2">
                                  <Badge className={statusColors[deliverable.status as keyof typeof statusColors]}>
                                    <StatusIcon className="w-3 h-3 mr-1" />
                                    {formatStatus(deliverable.status)}
                                  </Badge>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={(e) => {
                                      e.preventDefault()
                                      e.stopPropagation()
                                      // Handle quick actions
                                    }}
                                  >
                                    <Eye className="w-4 h-4" />
                                  </Button>
                                </div>
                                <CardTitle className="text-lg">{deliverable.name}</CardTitle>
                                <CardDescription className="text-sm">
                                  {deliverable.type.replace("_", " ").toUpperCase()}
                                </CardDescription>
                              </CardHeader>
                              <CardContent className="pt-0">
                                <div className="space-y-4">
                                  <div className="bg-gray-50 p-3 rounded-lg">
                                    <p className="text-sm text-gray-700 line-clamp-3">{deliverable.content.text}</p>
                                  </div>

                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-2">
                                      <Avatar className="w-6 h-6">
                                        <AvatarFallback className="text-xs">
                                          {deliverable.assignee.avatar}
                                        </AvatarFallback>
                                      </Avatar>
                                      <span className="text-sm text-gray-600">{deliverable.assignee.name}</span>
                                    </div>
                                    {deliverable.approvers.length > 0 && (
                                      <div className="flex -space-x-1">
                                        {deliverable.approvers.map((approver, aIndex) => (
                                          <Avatar
                                            key={aIndex}
                                            className={`w-6 h-6 border-2 ${
                                              approver.status === "approved" ? "border-green-500" : "border-yellow-500"
                                            }`}
                                          >
                                            <AvatarFallback className="text-xs">{approver.avatar}</AvatarFallback>
                                          </Avatar>
                                        ))}
                                      </div>
                                    )}
                                  </div>

                                  <div className="flex items-center justify-between text-xs text-gray-500">
                                    <div className="flex items-center space-x-1">
                                      <Calendar className="w-3 h-3" />
                                      <span>Due {deliverable.dueDate}</span>
                                    </div>
                                    <span>Created {deliverable.createdAt}</span>
                                  </div>

                                  {deliverable.content.hashtags.length > 0 && (
                                    <div className="flex flex-wrap gap-1">
                                      {deliverable.content.hashtags.slice(0, 3).map((tag, tagIndex) => (
                                        <Badge key={tagIndex} variant="outline" className="text-xs">
                                          {tag}
                                        </Badge>
                                      ))}
                                      {deliverable.content.hashtags.length > 3 && (
                                        <Badge variant="outline" className="text-xs">
                                          +{deliverable.content.hashtags.length - 3}
                                        </Badge>
                                      )}
                                    </div>
                                  )}
                                </div>
                              </CardContent>
                            </Card>
                          </Link>
                        </motion.div>
                      )
                    })}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredDeliverables.map((deliverable, index) => {
                      const StatusIcon = statusIcons[deliverable.status as keyof typeof statusIcons]
                      return (
                        <motion.div
                          key={deliverable._id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                          whileHover={{ scale: 1.01 }}
                          className="cursor-pointer"
                        >
                          <Link href={`/content/${deliverable._id}`}>
                            <Card className="hover:shadow-md transition-shadow">
                              <CardContent className="p-4 lg:p-6">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center space-x-4 min-w-0 flex-1">
                                    <div className="flex-shrink-0">
                                      <Badge className={statusColors[deliverable.status as keyof typeof statusColors]}>
                                        <StatusIcon className="w-3 h-3 mr-1" />
                                        {formatStatus(deliverable.status)}
                                      </Badge>
                                    </div>
                                    <div className="min-w-0 flex-1">
                                      <h3 className="text-lg font-semibold text-gray-900 truncate">
                                        {deliverable.name}
                                      </h3>
                                      <p className="text-sm text-blue-600 font-medium">
                                        {deliverable.type.replace("_", " ").toUpperCase()}
                                      </p>
                                      <p className="text-sm text-gray-600 line-clamp-2">{deliverable.content.text}</p>
                                    </div>
                                  </div>
                                  <div className="flex items-center space-x-6 flex-shrink-0">
                                    <div className="flex items-center space-x-2 hidden sm:flex">
                                      <Avatar className="w-6 h-6">
                                        <AvatarFallback className="text-xs">
                                          {deliverable.assignee.avatar}
                                        </AvatarFallback>
                                      </Avatar>
                                      <span className="text-sm text-gray-600 hidden md:inline">
                                        {deliverable.assignee.name}
                                      </span>
                                    </div>
                                    <div className="text-center hidden lg:block">
                                      <div className="text-sm text-gray-600">Due {deliverable.dueDate}</div>
                                    </div>
                                    {deliverable.approvers.length > 0 && (
                                      <div className="flex -space-x-1 hidden md:flex">
                                        {deliverable.approvers.map((approver, aIndex) => (
                                          <Avatar
                                            key={aIndex}
                                            className={`w-6 h-6 border-2 ${
                                              approver.status === "approved" ? "border-green-500" : "border-yellow-500"
                                            }`}
                                          >
                                            <AvatarFallback className="text-xs">{approver.avatar}</AvatarFallback>
                                          </Avatar>
                                        ))}
                                      </div>
                                    )}
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={(e) => {
                                        e.preventDefault()
                                        e.stopPropagation()
                                      }}
                                    >
                                      <Eye className="w-4 h-4" />
                                    </Button>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          </Link>
                        </motion.div>
                      )
                    })}
                  </div>
                )}
              </>
            )}
          </>
        )}
      </main>

      {/* Create Deliverable Dialog */}
      <CreateDeliverableDialog
        open={showCreateDeliverable}
        onOpenChange={setShowCreateDeliverable}
        projectId={projectId}
      />
    </div>
  )
}
