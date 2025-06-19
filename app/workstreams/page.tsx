"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { useQuery } from "@tanstack/react-query"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Breadcrumb } from "@/components/breadcrumb"
import { FolderOpen, Plus, Search, Filter, FileText, LayoutGrid, List, X, Loader2, AlertCircle } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CreateWorkstreamDialog } from "@/components/create-workstream-dialog"
import { api } from "@/lib/api"
import Link from "next/link"

const statusColors = {
  active: "bg-blue-100 text-blue-800",
  inactive: "bg-gray-100 text-gray-800",
  completed: "bg-green-100 text-green-800",
}

// Function to format status text
const formatStatus = (status: string) => {
  return status
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")
}

export default function WorkstreamsPage() {
  const [selectedView, setSelectedView] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [showCreateWorkstream, setShowCreateWorkstream] = useState(false)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")

  const {
    data: workstreams = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["workstreams"],
    queryFn: api.getWorkstreams,
  })

  const filteredWorkstreams = workstreams.filter((workstream) => {
    const matchesSearch =
      workstream.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      workstream.description.toLowerCase().includes(searchQuery.toLowerCase())

    if (selectedView === "all") return matchesSearch
    return matchesSearch && workstream.status === selectedView
  })

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Error loading workstreams</h1>
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
          <Breadcrumb badge={{ label: "workstreams", count: filteredWorkstreams.length }} />
        </div>
      </header>

      {/* Main Content */}
      <div className="px-4 sm:px-6 lg:px-8 py-6">
        {/* Filters and Actions */}
        <div className="flex flex-col sm:flex-row gap-3 lg:gap-4 mb-6 lg:mb-8">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search workstreams..."
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
              <SelectItem value="all">All Workstreams</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
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
          <Button onClick={() => setShowCreateWorkstream(true)}>
            <Plus className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">New Workstream</span>
            <span className="sm:hidden">New</span>
          </Button>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            <span className="ml-2 text-gray-600">Loading workstreams...</span>
          </div>
        )}

        {/* Workstreams Grid */}
        {!isLoading && filteredWorkstreams.length === 0 ? (
          <div className="text-center py-12">
            <FolderOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No workstreams found</h3>
            <p className="text-gray-500 mb-4 px-4">
              {searchQuery ? "Try adjusting your search terms" : "Get started by creating your first workstream"}
            </p>
            <Button onClick={() => setShowCreateWorkstream(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Create Workstream
            </Button>
          </div>
        ) : (
          <>
            {viewMode === "grid" ? (
              <div className="grid gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filteredWorkstreams.map((workstream, index) => (
                  <Link href={`/projects?workstream=${workstream._id}`} key={workstream._id}>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ scale: 1.02 }}
                      className="cursor-pointer"
                    >
                      <Card className="h-full hover:shadow-lg transition-shadow">
                        <CardHeader className="pb-3">
                          <div className="flex items-center justify-between mb-2">
                            <Badge className={statusColors[workstream.status as keyof typeof statusColors]}>
                              {formatStatus(workstream.status)}
                            </Badge>
                            <FolderOpen className="w-5 h-5 text-blue-600" />
                          </div>
                          <CardTitle className="text-lg">{workstream.name}</CardTitle>
                          <CardDescription className="text-sm">{workstream.description}</CardDescription>
                        </CardHeader>
                        <CardContent className="pt-0">
                          <div className="space-y-4">
                            {workstream.progress !== undefined && (
                              <div>
                                <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                                  <span>Progress</span>
                                  <span>{workstream.progress}%</span>
                                </div>
                                <Progress value={workstream.progress} className="h-2" />
                              </div>
                            )}

                            <div className="flex items-center justify-between text-sm text-gray-600">
                              <div className="flex items-center space-x-1">
                                <FileText className="w-4 h-4" />
                                <span>{workstream.projectCount} projects</span>
                              </div>
                              <div className="text-xs text-gray-500">{formatStatus(workstream.status)} workstream</div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredWorkstreams.map((workstream, index) => (
                  <Link href={`/projects?workstream=${workstream._id}`} key={workstream._id}>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      whileHover={{ scale: 1.01 }}
                      className="cursor-pointer"
                    >
                      <Card className="hover:shadow-md transition-shadow">
                        <CardContent className="p-4 lg:p-6">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4 min-w-0 flex-1">
                              <div className="flex-shrink-0">
                                <FolderOpen className="w-8 h-8 text-blue-600" />
                              </div>
                              <div className="min-w-0 flex-1">
                                <div className="flex items-center space-x-2 mb-1">
                                  <h3 className="text-lg font-semibold text-gray-900 truncate">{workstream.name}</h3>
                                  <Badge className={statusColors[workstream.status as keyof typeof statusColors]}>
                                    {formatStatus(workstream.status)}
                                  </Badge>
                                </div>
                                <p className="text-sm text-gray-600 truncate">{workstream.description}</p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-6 flex-shrink-0">
                              <div className="text-center hidden sm:block">
                                <div className="text-lg font-semibold text-gray-900">{workstream.projectCount}</div>
                                <div className="text-xs text-gray-500">Projects</div>
                              </div>
                              <div className="text-center hidden md:block">
                                <div className="text-lg font-semibold text-gray-900">{workstream.progress}%</div>
                                <div className="text-xs text-gray-500">Complete</div>
                              </div>
                              <div className="w-24 hidden lg:block">
                                <Progress value={workstream.progress} className="h-2" />
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  </Link>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* Create Workstream Dialog */}
      <CreateWorkstreamDialog open={showCreateWorkstream} onOpenChange={setShowCreateWorkstream} />
    </div>
  )
}
