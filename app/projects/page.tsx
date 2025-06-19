"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { useQuery } from "@tanstack/react-query"
import { useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Breadcrumb } from "@/components/breadcrumb"
import {
  FolderOpen,
  FileText,
  Clock,
  CheckCircle,
  AlertCircle,
  Plus,
  Filter,
  Search,
  X,
  LayoutGrid,
  List,
  Loader2,
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CreateProjectDialog } from "@/components/create-project-dialog"
import { CreateDeliverableDialog } from "@/components/create-deliverable-dialog"
import { api } from "@/lib/api"
import Link from "next/link"

const statusColors = {
  draft: "bg-gray-100 text-gray-800",
  "pending-approval": "bg-yellow-100 text-yellow-800",
  "in-review": "bg-blue-100 text-blue-800",
  approved: "bg-green-100 text-green-800",
  rejected: "bg-red-100 text-red-800",
  active: "bg-blue-100 text-blue-800",
  inactive: "bg-gray-100 text-gray-800",
  completed: "bg-green-100 text-green-800",
}

const statusIcons = {
  draft: FileText,
  "pending-approval": Clock,
  "in-review": AlertCircle,
  approved: CheckCircle,
  rejected: AlertCircle,
  active: CheckCircle,
  inactive: AlertCircle,
  completed: CheckCircle,
}

// Function to format status text
const formatStatus = (status: string) => {
  return status
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")
}

export default function ProjectsPage() {
  const searchParams = useSearchParams()
  const workstreamFilter = searchParams.get("workstream")

  const [selectedView, setSelectedView] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [showCreateProject, setShowCreateProject] = useState(false)
  const [showCreateDeliverable, setShowCreateDeliverable] = useState(false)
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")

  const {
    data: projects = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["projects"],
    queryFn: api.getProjects,
  })

  const { data: workstreams = [], isLoading: workstreamsLoading } = useQuery({
    queryKey: ["workstreams"],
    queryFn: api.getWorkstreams,
  })

  // Get the selected workstream name for display
  const selectedWorkstream = workstreams.find((w) => w._id === workstreamFilter)

  const filteredProjects = projects.filter((project) => {
    const matchesSearch =
      project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.workstream.name.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesWorkstream = workstreamFilter ? project.workstream.id === workstreamFilter : true
    const matchesStatus = selectedView === "all" ? true : project.status === selectedView

    return matchesSearch && matchesWorkstream && matchesStatus
  })

  // Generate custom breadcrumb items when filtering by workstream
  const breadcrumbItems = selectedWorkstream
    ? [
        { label: "Dashboard", href: "/" },
        { label: "Workstreams", href: "/workstreams" },
        { label: selectedWorkstream.name },
      ]
    : undefined

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Error loading projects</h1>
          <p className="text-gray-600">Please try refreshing the page</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      {/* Header with Breadcrumb */}
      <header className="bg-white border-b border-gray-200">
        <div className="px-4 sm:px-6 lg:px-8 py-4">
          <Breadcrumb customItems={breadcrumbItems} badge={{ label: "projects", count: filteredProjects.length }} />
        </div>
      </header>

      {/* Main Content */}
      <div className="px-4 sm:px-6 lg:px-8 py-6">
        {/* Workstream Filter Notice */}
        {selectedWorkstream && (
          <div className="mb-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <FolderOpen className="w-5 h-5 text-blue-600" />
                  <span className="text-sm font-medium text-blue-900">
                    Showing projects from: <span className="font-semibold">{selectedWorkstream.name}</span>
                  </span>
                </div>
                <Link href="/projects">
                  <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-800">
                    <X className="w-4 h-4 mr-1" />
                    Clear Filter
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Filters and Actions */}
        <div className="flex flex-col sm:flex-row gap-3 lg:gap-4 mb-6 lg:mb-8">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search projects or workstreams..."
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
              <SelectItem value="all">All Projects</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="pending-approval">Pending Approval</SelectItem>
              <SelectItem value="in-review">In Review</SelectItem>
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
          <Button onClick={() => setShowCreateProject(true)}>
            <Plus className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">New Project</span>
            <span className="sm:hidden">New</span>
          </Button>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            <span className="ml-2 text-gray-600">Loading projects...</span>
          </div>
        )}

        {/* Projects Grid */}
        {!isLoading && filteredProjects.length === 0 ? (
          <div className="text-center py-12">
            <FolderOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No projects found</h3>
            <p className="text-gray-500 mb-4">
              {searchQuery || workstreamFilter
                ? "Try adjusting your search terms or filters"
                : "Get started by creating your first project"}
            </p>
            <div className="flex flex-col sm:flex-row gap-2 justify-center">
              {(searchQuery || workstreamFilter) && (
                <Link href="/projects">
                  <Button variant="outline">
                    <X className="w-4 h-4 mr-2" />
                    Clear Filters
                  </Button>
                </Link>
              )}
              <Button onClick={() => setShowCreateProject(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Create Project
              </Button>
            </div>
          </div>
        ) : (
          <>
            {viewMode === "grid" ? (
              <div className="grid gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filteredProjects.map((project, index) => {
                  const StatusIcon = statusIcons[project.status as keyof typeof statusIcons]
                  return (
                    <Link href={`/projects/${project._id}`} key={project._id}>
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ scale: 1.02 }}
                      >
                        <Card className="h-full hover:shadow-lg transition-shadow">
                          <CardHeader className="pb-3">
                            <div className="flex items-center justify-between mb-2">
                              <Badge className={statusColors[project.status as keyof typeof statusColors]}>
                                <StatusIcon className="w-3 h-3 mr-1" />
                                {formatStatus(project.status)}
                              </Badge>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => {
                                  e.preventDefault()
                                  e.stopPropagation()
                                  setSelectedProjectId(project._id)
                                  setShowCreateDeliverable(true)
                                }}
                              >
                                <Plus className="w-4 h-4" />
                              </Button>
                            </div>
                            <CardTitle className="text-lg">{project.name}</CardTitle>
                            <CardDescription className="text-sm">
                              <span className="text-blue-600 font-medium">{project.workstream.name}</span>
                              <br />
                              {project.description}
                            </CardDescription>
                          </CardHeader>
                          <CardContent className="pt-0">
                            <div className="space-y-4">
                              {project.progress !== undefined && (
                                <div>
                                  <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                                    <span>Progress</span>
                                    <span>{project.progress}%</span>
                                  </div>
                                  <Progress value={project.progress} className="h-2" />
                                </div>
                              )}

                              <div className="flex items-center justify-between text-sm text-gray-600">
                                <div className="flex items-center space-x-1">
                                  <FileText className="w-4 h-4" />
                                  <span>{project.deliverableCount} deliverables</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <Clock className="w-4 h-4" />
                                  <span>Active</span>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    </Link>
                  )
                })}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredProjects.map((project, index) => {
                  const StatusIcon = statusIcons[project.status as keyof typeof statusIcons]
                  return (
                    <Link href={`/projects/${project._id}`} key={project._id}>
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        whileHover={{ scale: 1.01 }}
                      >
                        <Card className="hover:shadow-md transition-shadow">
                          <CardContent className="p-4 lg:p-6">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-4 min-w-0 flex-1">
                                <div className="flex-shrink-0">
                                  <Badge className={statusColors[project.status as keyof typeof statusColors]}>
                                    <StatusIcon className="w-3 h-3 mr-1" />
                                    {formatStatus(project.status)}
                                  </Badge>
                                </div>
                                <div className="min-w-0 flex-1">
                                  <h3 className="text-lg font-semibold text-gray-900 truncate">{project.name}</h3>
                                  <p className="text-sm text-blue-600 font-medium">{project.workstream.name}</p>
                                  <p className="text-sm text-gray-600 truncate">{project.description}</p>
                                </div>
                              </div>
                              <div className="flex items-center space-x-6 flex-shrink-0">
                                <div className="text-center hidden sm:block">
                                  <div className="text-lg font-semibold text-gray-900">{project.deliverableCount}</div>
                                  <div className="text-xs text-gray-500">Deliverables</div>
                                </div>
                                <div className="text-center hidden md:block">
                                  <div className="text-lg font-semibold text-gray-900">{project.progress}%</div>
                                  <div className="text-xs text-gray-500">Complete</div>
                                </div>
                                <div className="w-24 hidden lg:block">
                                  <Progress value={project.progress} className="h-2" />
                                </div>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={(e) => {
                                    e.preventDefault()
                                    e.stopPropagation()
                                    setSelectedProjectId(project._id)
                                    setShowCreateDeliverable(true)
                                  }}
                                >
                                  <Plus className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    </Link>
                  )
                })}
              </div>
            )}
          </>
        )}
      </div>

      {/* Create Project Dialog */}
      <CreateProjectDialog open={showCreateProject} onOpenChange={setShowCreateProject} />

      {/* Create Deliverable Dialog */}
      {selectedProjectId && (
        <CreateDeliverableDialog
          open={showCreateDeliverable}
          onOpenChange={setShowCreateDeliverable}
          projectId={selectedProjectId}
        />
      )}
    </div>
  )
}
