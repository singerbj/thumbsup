"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import {
  ArrowLeft,
  ThumbsUp,
  ThumbsDown,
  Clock,
  MessageSquare,
  Filter,
  Search,
  Calendar,
  FileText,
  LayoutGrid,
  List,
  X,
  Loader2,
  AlertCircle,
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { api } from "@/lib/api"
import { toast } from "@/hooks/use-toast"
import Link from "next/link"

const statusColors = {
  "pending-approval": "bg-yellow-100 text-yellow-800",
  "in-review": "bg-blue-100 text-blue-800",
  urgent: "bg-red-100 text-red-800",
}

const priorityColors = {
  low: "bg-gray-100 text-gray-800",
  normal: "bg-blue-100 text-blue-800",
  high: "bg-orange-100 text-orange-800",
  urgent: "bg-red-100 text-red-800",
}

// Function to format status text
const formatStatus = (status: string) => {
  return status
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")
}

export default function ApprovalsPage() {
  const [selectedView, setSelectedView] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [comment, setComment] = useState("")
  const [selectedDeliverable, setSelectedDeliverable] = useState<string | null>(null)
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")

  const queryClient = useQueryClient()

  const {
    data: approvals = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["approvals"],
    queryFn: api.getApprovals,
  })

  const approveMutation = useMutation({
    mutationFn: ({ id, comment }: { id: string; comment?: string }) => api.approveDeliverable(id, comment),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["approvals"] })
      toast({
        title: "Success",
        description: "Deliverable approved successfully",
      })
      setComment("")
      setSelectedDeliverable(null)
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to approve deliverable. Please try again.",
        variant: "destructive",
      })
    },
  })

  const rejectMutation = useMutation({
    mutationFn: ({ id, comment }: { id: string; comment?: string }) => api.rejectDeliverable(id, comment),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["approvals"] })
      toast({
        title: "Success",
        description: "Deliverable rejected successfully",
      })
      setComment("")
      setSelectedDeliverable(null)
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to reject deliverable. Please try again.",
        variant: "destructive",
      })
    },
  })

  const filteredApprovals = approvals.filter((approval) => {
    const matchesSearch =
      approval.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      approval.content.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
      approval.project?.name.toLowerCase().includes(searchQuery.toLowerCase())

    if (selectedView === "all") return matchesSearch
    if (selectedView === "escalated") return matchesSearch && approval.escalated
    if (selectedView === "urgent") return matchesSearch && approval.priority === "urgent"
    return matchesSearch && approval.status === selectedView
  })

  const handleApprove = async (deliverableId: string) => {
    approveMutation.mutate({ id: deliverableId, comment: comment.trim() || undefined })
  }

  const handleReject = async (deliverableId: string) => {
    rejectMutation.mutate({ id: deliverableId, comment: comment.trim() || undefined })
  }

  const isSubmitting = approveMutation.isPending || rejectMutation.isPending

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Error loading approvals</h1>
          <p className="text-gray-600">Please try refreshing the page</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4 lg:py-6">
            <div className="flex items-center space-x-2 lg:space-x-3 min-w-0">
              <span className="text-2xl lg:text-3xl">👍</span>
              <div className="min-w-0">
                <h1 className="text-lg lg:text-2xl font-bold text-gray-900 truncate">My Approvals</h1>
                <p className="text-xs lg:text-sm text-gray-600 hidden sm:block">Content waiting for your review</p>
              </div>
            </div>

            {/* Desktop Badge */}
            <Badge variant="secondary" className="hidden sm:flex text-sm lg:text-lg px-2 lg:px-3 py-1">
              {isLoading ? "Loading..." : `${filteredApprovals.length} pending`}
            </Badge>

            {/* Mobile Badge */}
            <Badge variant="secondary" className="sm:hidden text-xs px-2 py-1">
              {isLoading ? "..." : filteredApprovals.length}
            </Badge>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
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
                placeholder="Search approvals..."
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
              <SelectItem value="all">All Approvals</SelectItem>
              <SelectItem value="pending-approval">Pending Approval</SelectItem>
              <SelectItem value="in-review">In Review</SelectItem>
              <SelectItem value="urgent">Urgent</SelectItem>
              <SelectItem value="escalated">Escalated</SelectItem>
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

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            <span className="ml-2 text-gray-600">Loading approvals...</span>
          </div>
        )}

        {/* Approvals List */}
        {!isLoading && filteredApprovals.length === 0 ? (
          <div className="text-center py-12">
            <ThumbsUp className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No approvals found</h3>
            <p className="text-gray-500">
              {searchQuery ? "Try adjusting your search terms" : "All caught up! No pending approvals at the moment."}
            </p>
          </div>
        ) : (
          <>
            {viewMode === "grid" ? (
              <div className="space-y-6">
                {filteredApprovals.map((approval, index) => (
                  <motion.div
                    key={approval._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className={`${approval.escalated ? "border-red-200 bg-red-50/30" : ""}`}>
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-wrap items-center gap-2 mb-2">
                              <Badge className={statusColors[approval.status as keyof typeof statusColors]}>
                                {formatStatus(approval.status)}
                              </Badge>
                              {approval.priority && (
                                <Badge className={priorityColors[approval.priority as keyof typeof priorityColors]}>
                                  {approval.priority.charAt(0).toUpperCase() + approval.priority.slice(1)}
                                </Badge>
                              )}
                              {approval.escalated && (
                                <Badge variant="destructive" className="animate-pulse">
                                  Escalated
                                </Badge>
                              )}
                            </div>
                            <CardTitle className="text-lg lg:text-xl truncate">{approval.name}</CardTitle>
                            <CardDescription className="text-sm">
                              {approval.project && (
                                <>
                                  <span className="text-blue-600 font-medium">{approval.project.workstream}</span> •{" "}
                                  <span className="hidden sm:inline">{approval.project.name} • </span>
                                </>
                              )}
                              {approval.type.replace("_", " ").toUpperCase()}
                            </CardDescription>
                          </div>
                          <div className="flex items-center space-x-2 ml-3 flex-shrink-0">
                            <Avatar className="w-6 h-6 lg:w-8 lg:h-8">
                              <AvatarFallback className="text-xs">{approval.assignee.avatar}</AvatarFallback>
                            </Avatar>
                            <div className="text-right text-xs lg:text-sm hidden sm:block">
                              <p className="font-medium">{approval.assignee.name}</p>
                              <p className="text-gray-500">Assignee</p>
                            </div>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {/* Content Preview */}
                          <div className="bg-gray-50 p-4 rounded-lg">
                            <p className="text-gray-800 leading-relaxed">{approval.content.text}</p>
                            {approval.content.hashtags.length > 0 && (
                              <div className="flex flex-wrap gap-1 mt-3">
                                {approval.content.hashtags.map((tag, tagIndex) => (
                                  <Badge key={tagIndex} variant="outline" className="text-xs">
                                    {tag}
                                  </Badge>
                                ))}
                              </div>
                            )}
                          </div>

                          {/* Metadata */}
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs lg:text-sm text-gray-600">
                            <div className="flex flex-wrap items-center gap-3 lg:gap-4">
                              <div className="flex items-center space-x-1">
                                <Calendar className="w-3 h-3 lg:w-4 lg:h-4" />
                                <span>Due {approval.dueDate}</span>
                              </div>
                              {approval.requestedAt && (
                                <div className="flex items-center space-x-1">
                                  <Clock className="w-3 h-3 lg:w-4 lg:h-4" />
                                  <span className="hidden sm:inline">Requested </span>
                                  <span>{approval.requestedAt}</span>
                                </div>
                              )}
                            </div>
                            <Link href={`/content/${approval._id}`}>
                              <Button variant="ghost" size="sm" className="text-xs lg:text-sm">
                                <FileText className="w-3 h-3 lg:w-4 lg:h-4 mr-1 lg:mr-2" />
                                <span className="hidden sm:inline">View Details</span>
                                <span className="sm:hidden">Details</span>
                              </Button>
                            </Link>
                          </div>

                          {/* Action Area */}
                          <div className="border-t pt-4">
                            {selectedDeliverable === approval._id ? (
                              <div className="space-y-3">
                                <Textarea
                                  placeholder="Add a comment (optional)..."
                                  value={comment}
                                  onChange={(e) => setComment(e.target.value)}
                                  rows={2}
                                />
                                <div className="flex items-center justify-between">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                      setSelectedDeliverable(null)
                                      setComment("")
                                    }}
                                    disabled={isSubmitting}
                                  >
                                    Cancel
                                  </Button>
                                  <div className="flex space-x-2">
                                    <Button
                                      variant="destructive"
                                      size="sm"
                                      onClick={() => handleReject(approval._id)}
                                      disabled={isSubmitting}
                                    >
                                      {isSubmitting ? (
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                      ) : (
                                        <ThumbsDown className="w-4 h-4 mr-2" />
                                      )}
                                      {isSubmitting ? "Rejecting..." : "Reject"}
                                    </Button>
                                    <Button
                                      size="sm"
                                      onClick={() => handleApprove(approval._id)}
                                      disabled={isSubmitting}
                                    >
                                      {isSubmitting ? (
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                      ) : (
                                        <ThumbsUp className="w-4 h-4 mr-2" />
                                      )}
                                      {isSubmitting ? "Approving..." : "Approve"}
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            ) : (
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2 text-xs lg:text-sm text-gray-600">
                                  <MessageSquare className="w-3 h-3 lg:w-4 lg:h-4" />
                                  <span className="hidden sm:inline">Ready for your review</span>
                                  <span className="sm:hidden">Ready</span>
                                </div>
                                <Button size="sm" onClick={() => setSelectedDeliverable(approval._id)}>
                                  <ThumbsUp className="w-4 h-4 mr-2" />
                                  Review
                                </Button>
                              </div>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {filteredApprovals.map((approval, index) => (
                  <motion.div
                    key={approval._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card
                      className={`${approval.escalated ? "border-red-200 bg-red-50/30" : ""} hover:shadow-md transition-shadow`}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4 min-w-0 flex-1">
                            <div className="flex flex-col space-y-1 flex-shrink-0">
                              <Badge
                                className={statusColors[approval.status as keyof typeof statusColors]}
                                className="text-xs"
                              >
                                {formatStatus(approval.status)}
                              </Badge>
                              {approval.priority && (
                                <Badge
                                  className={priorityColors[approval.priority as keyof typeof priorityColors]}
                                  className="text-xs"
                                >
                                  {approval.priority.charAt(0).toUpperCase() + approval.priority.slice(1)}
                                </Badge>
                              )}
                              {approval.escalated && (
                                <Badge variant="destructive" className="text-xs animate-pulse">
                                  Escalated
                                </Badge>
                              )}
                            </div>
                            <div className="min-w-0 flex-1">
                              <h3 className="text-lg font-semibold text-gray-900 truncate">{approval.name}</h3>
                              {approval.project && (
                                <p className="text-sm text-blue-600 font-medium">
                                  {approval.project.workstream} • {approval.project.name}
                                </p>
                              )}
                              <p className="text-sm text-gray-600 line-clamp-2">{approval.content.text}</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-4 flex-shrink-0">
                            <div className="flex items-center space-x-2 hidden sm:flex">
                              <Avatar className="w-6 h-6">
                                <AvatarFallback className="text-xs">{approval.assignee.avatar}</AvatarFallback>
                              </Avatar>
                              <div className="text-right text-xs hidden md:block">
                                <p className="font-medium">{approval.assignee.name}</p>
                                <p className="text-gray-500">Due {approval.dueDate}</p>
                              </div>
                            </div>
                            <Button size="sm" onClick={() => setSelectedDeliverable(approval._id)}>
                              <ThumbsUp className="w-4 h-4 mr-2" />
                              Review
                            </Button>
                          </div>
                        </div>
                        {selectedDeliverable === approval._id && (
                          <div className="mt-4 pt-4 border-t">
                            <div className="space-y-3">
                              <Textarea
                                placeholder="Add a comment (optional)..."
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                rows={2}
                              />
                              <div className="flex items-center justify-between">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    setSelectedDeliverable(null)
                                    setComment("")
                                  }}
                                  disabled={isSubmitting}
                                >
                                  Cancel
                                </Button>
                                <div className="flex space-x-2">
                                  <Button
                                    variant="destructive"
                                    size="sm"
                                    onClick={() => handleReject(approval._id)}
                                    disabled={isSubmitting}
                                  >
                                    {isSubmitting ? (
                                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    ) : (
                                      <ThumbsDown className="w-4 h-4 mr-2" />
                                    )}
                                    {isSubmitting ? "Rejecting..." : "Reject"}
                                  </Button>
                                  <Button size="sm" onClick={() => handleApprove(approval._id)} disabled={isSubmitting}>
                                    {isSubmitting ? (
                                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    ) : (
                                      <ThumbsUp className="w-4 h-4 mr-2" />
                                    )}
                                    {isSubmitting ? "Approving..." : "Approve"}
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  )
}
