"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"
import {
  ArrowLeft,
  MessageSquare,
  ThumbsUp,
  ThumbsDown,
  Clock,
  CheckCircle,
  AlertCircle,
  Edit,
  Send,
  Eye,
  GitBranch,
  Users,
  Brain,
  Palette,
  Target,
  MessageCircle,
  Lightbulb,
  TrendingUp,
  Loader2,
} from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { api } from "@/lib/api"
import { toast } from "@/hooks/use-toast"
import Link from "next/link"
import { useParams } from "next/navigation"

// Function to format status text
const formatStatus = (status: string) => {
  return status
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")
}

// Mock AI assessment data (this would come from an API in a real app)
const aiAssessment = {
  overallScore: 87,
  verbalIdentity: {
    score: 92,
    voiceAndTone: {
      score: 95,
      assessment:
        "Excellent alignment with brand's playful and energetic voice. The use of emojis and exclamation marks perfectly captures the brand's enthusiasm.",
      suggestions: ["Consider adding more brand-specific language patterns"],
    },
    messagingPillars: {
      score: 88,
      assessment: "Strong reinforcement of innovation pillar. Could better emphasize community aspect.",
      suggestions: ["Include community-focused language", "Reference user collaboration"],
    },
    taglineSlogan: {
      score: 92,
      assessment: "Subtle integration of brand messaging without being overly promotional.",
      suggestions: ["Consider incorporating tagline elements more directly"],
    },
  },
  strategicFoundation: {
    score: 85,
    brandPurpose: {
      score: 90,
      assessment: "Content clearly reflects the brand's mission to empower productivity and innovation.",
      suggestions: ["Strengthen connection to core values"],
    },
    positioning: {
      score: 82,
      assessment:
        "Good demonstration of unique problem-solving approach. Could be more specific about differentiation.",
      suggestions: ["Highlight unique features more prominently", "Compare benefits to alternatives"],
    },
    valueProposition: {
      score: 83,
      assessment: "Value is communicated through excitement and anticipation, but could be more explicit.",
      suggestions: ["Include specific benefit statements", "Add measurable outcomes"],
    },
  },
  visualIdentity: {
    score: 84,
    logo: {
      score: 88,
      assessment: "Logo placement and visibility are appropriate for the platform.",
      suggestions: ["Ensure logo is visible in all media elements"],
    },
    colorPalette: {
      score: 85,
      assessment: "Color scheme aligns with brand guidelines. Good use of primary brand colors.",
      suggestions: ["Consider incorporating secondary brand colors"],
    },
    imageryStyle: {
      score: 79,
      assessment: "Image style is consistent with brand aesthetic but could be more distinctive.",
      suggestions: ["Use more brand-specific visual elements", "Apply consistent filter/treatment"],
    },
  },
  recommendations: [
    "Add more community-focused language to strengthen messaging pillars",
    "Include specific benefit statements to improve value proposition clarity",
    "Consider incorporating secondary brand colors for visual variety",
    "Apply consistent visual treatment to maintain brand distinctiveness",
  ],
}

const statusColors = {
  draft: "bg-gray-100 text-gray-800",
  "pending-approval": "bg-yellow-100 text-yellow-800",
  "in-review": "bg-blue-100 text-blue-800",
  approved: "bg-green-100 text-green-800",
  rejected: "bg-red-100 text-red-800",
}

const getScoreColor = (score: number) => {
  if (score >= 90) return "text-green-600"
  if (score >= 80) return "text-blue-600"
  if (score >= 70) return "text-yellow-600"
  return "text-red-600"
}

const getScoreBgColor = (score: number) => {
  if (score >= 90) return "bg-green-100"
  if (score >= 80) return "bg-blue-100"
  if (score >= 70) return "bg-yellow-100"
  return "bg-red-100"
}

export default function ContentDetail() {
  const params = useParams()
  const deliverableId = params.id as string
  const [comment, setComment] = useState("")

  const queryClient = useQueryClient()

  const {
    data: deliverable,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["deliverable", deliverableId],
    queryFn: () => api.getDeliverable(deliverableId),
  })

  const approveMutation = useMutation({
    mutationFn: ({ id, comment }: { id: string; comment?: string }) => api.approveDeliverable(id, comment),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["deliverable", deliverableId] })
      queryClient.invalidateQueries({ queryKey: ["approvals"] })
      toast({
        title: "Success",
        description: "Deliverable approved successfully",
      })
      setComment("")
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
      queryClient.invalidateQueries({ queryKey: ["deliverable", deliverableId] })
      queryClient.invalidateQueries({ queryKey: ["approvals"] })
      toast({
        title: "Success",
        description: "Deliverable rejected successfully",
      })
      setComment("")
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to reject deliverable. Please try again.",
        variant: "destructive",
      })
    },
  })

  const handleApprove = async () => {
    approveMutation.mutate({ id: deliverableId, comment: comment.trim() || undefined })
  }

  const handleReject = async () => {
    rejectMutation.mutate({ id: deliverableId, comment: comment.trim() || undefined })
  }

  const handleComment = async () => {
    if (!comment.trim()) return
    // This would be a separate API call in a real app
    toast({
      title: "Comment added",
      description: "Your comment has been added to the deliverable",
    })
    setComment("")
  }

  const isSubmitting = approveMutation.isPending || rejectMutation.isPending

  if (error || (!isLoading && !deliverable)) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Content not found</h1>
          <p className="text-gray-600 mb-4">The content you're looking for doesn't exist.</p>
          <Link href="/">
            <Button>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          <span className="ml-2 text-gray-600">Loading content...</span>
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
                <h1 className="text-lg lg:text-xl font-semibold text-gray-900 truncate">{deliverable.name}</h1>
                <p className="text-xs lg:text-sm text-gray-500">{deliverable.type.replace("-", " ").toUpperCase()}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2 lg:space-x-3 flex-shrink-0">
              <Badge className={statusColors[deliverable.status as keyof typeof statusColors]} className="text-xs">
                {formatStatus(deliverable.status)}
              </Badge>
              <Button variant="outline" size="sm" className="hidden sm:flex">
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </Button>
              <Button variant="outline" size="sm" className="sm:hidden">
                <Edit className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Bar */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-3">
            <Link href="/">
              <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Content Preview */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="preview" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="preview">
                  <Eye className="w-4 h-4 mr-2" />
                  Preview
                </TabsTrigger>
                <TabsTrigger value="ai-assessment">
                  <Brain className="w-4 h-4 mr-2" />
                  AI Assessment
                </TabsTrigger>
                <TabsTrigger value="history">
                  <GitBranch className="w-4 h-4 mr-2" />
                  History
                </TabsTrigger>
              </TabsList>

              <TabsContent value="preview" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Content Preview</CardTitle>
                    <CardDescription>How this will appear on {deliverable.type.replace("-", " ")}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {/* Mock Instagram Story Preview */}
                      <div className="max-w-sm mx-auto">
                        <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl p-1">
                          <div className="bg-black rounded-2xl overflow-hidden aspect-[9/16]">
                            <div className="relative h-full">
                              <img
                                src={deliverable.content.media?.[0]?.url || "/placeholder.svg?height=400&width=300"}
                                alt={deliverable.content.media?.[0]?.alt || "Content preview"}
                                className="w-full h-full object-cover"
                              />
                              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                                <p className="text-white text-sm leading-relaxed">{deliverable.content.text}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Content Details */}
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">Caption</h4>
                          <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">{deliverable.content.text}</p>
                        </div>

                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">Hashtags</h4>
                          <div className="flex flex-wrap gap-2">
                            {deliverable.content.hashtags.map((tag, index) => (
                              <Badge key={index} variant="secondary">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">Mentions</h4>
                          <div className="flex flex-wrap gap-2">
                            {deliverable.content.mentions.map((mention, index) => (
                              <Badge key={index} variant="outline">
                                {mention}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="ai-assessment" className="mt-6">
                <div className="space-y-6">
                  {/* Overall Score */}
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Brain className="w-5 h-5 text-purple-600" />
                          <CardTitle>AI Brand Compliance Assessment</CardTitle>
                        </div>
                        <div className="text-right">
                          <div className={`text-3xl font-bold ${getScoreColor(aiAssessment.overallScore)}`}>
                            {aiAssessment.overallScore}
                          </div>
                          <div className="text-sm text-gray-500">Overall Score</div>
                        </div>
                      </div>
                      <CardDescription>
                        Automated analysis of brand alignment across verbal identity, strategic foundation, and visual
                        identity
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        {/* Verbal Identity */}
                        <div>
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center space-x-2">
                              <MessageCircle className="w-4 h-4 text-blue-600" />
                              <h4 className="font-medium text-gray-900">Verbal Identity</h4>
                            </div>
                            <span className={`font-semibold ${getScoreColor(aiAssessment.verbalIdentity.score)}`}>
                              {aiAssessment.verbalIdentity.score}
                            </span>
                          </div>
                          <Progress value={aiAssessment.verbalIdentity.score} className="h-2 mb-4" />

                          <div className="grid gap-4 sm:grid-cols-3">
                            <div
                              className={`p-3 rounded-lg ${getScoreBgColor(aiAssessment.verbalIdentity.voiceAndTone.score)}`}
                            >
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium">Voice & Tone</span>
                                <span
                                  className={`text-sm font-semibold ${getScoreColor(aiAssessment.verbalIdentity.voiceAndTone.score)}`}
                                >
                                  {aiAssessment.verbalIdentity.voiceAndTone.score}
                                </span>
                              </div>
                              <p className="text-xs text-gray-600">
                                {aiAssessment.verbalIdentity.voiceAndTone.assessment}
                              </p>
                            </div>

                            <div
                              className={`p-3 rounded-lg ${getScoreBgColor(aiAssessment.verbalIdentity.messagingPillars.score)}`}
                            >
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium">Messaging Pillars</span>
                                <span
                                  className={`text-sm font-semibold ${getScoreColor(aiAssessment.verbalIdentity.messagingPillars.score)}`}
                                >
                                  {aiAssessment.verbalIdentity.messagingPillars.score}
                                </span>
                              </div>
                              <p className="text-xs text-gray-600">
                                {aiAssessment.verbalIdentity.messagingPillars.assessment}
                              </p>
                            </div>

                            <div
                              className={`p-3 rounded-lg ${getScoreBgColor(aiAssessment.verbalIdentity.taglineSlogan.score)}`}
                            >
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium">Tagline/Slogan</span>
                                <span
                                  className={`text-sm font-semibold ${getScoreColor(aiAssessment.verbalIdentity.taglineSlogan.score)}`}
                                >
                                  {aiAssessment.verbalIdentity.taglineSlogan.score}
                                </span>
                              </div>
                              <p className="text-xs text-gray-600">
                                {aiAssessment.verbalIdentity.taglineSlogan.assessment}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Strategic Foundation */}
                        <div>
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center space-x-2">
                              <Target className="w-4 h-4 text-green-600" />
                              <h4 className="font-medium text-gray-900">Strategic Foundation</h4>
                            </div>
                            <span className={`font-semibold ${getScoreColor(aiAssessment.strategicFoundation.score)}`}>
                              {aiAssessment.strategicFoundation.score}
                            </span>
                          </div>
                          <Progress value={aiAssessment.strategicFoundation.score} className="h-2 mb-4" />

                          <div className="grid gap-4 sm:grid-cols-3">
                            <div
                              className={`p-3 rounded-lg ${getScoreBgColor(aiAssessment.strategicFoundation.brandPurpose.score)}`}
                            >
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium">Brand Purpose</span>
                                <span
                                  className={`text-sm font-semibold ${getScoreColor(aiAssessment.strategicFoundation.brandPurpose.score)}`}
                                >
                                  {aiAssessment.strategicFoundation.brandPurpose.score}
                                </span>
                              </div>
                              <p className="text-xs text-gray-600">
                                {aiAssessment.strategicFoundation.brandPurpose.assessment}
                              </p>
                            </div>

                            <div
                              className={`p-3 rounded-lg ${getScoreBgColor(aiAssessment.strategicFoundation.positioning.score)}`}
                            >
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium">Positioning</span>
                                <span
                                  className={`text-sm font-semibold ${getScoreColor(aiAssessment.strategicFoundation.positioning.score)}`}
                                >
                                  {aiAssessment.strategicFoundation.positioning.score}
                                </span>
                              </div>
                              <p className="text-xs text-gray-600">
                                {aiAssessment.strategicFoundation.positioning.assessment}
                              </p>
                            </div>

                            <div
                              className={`p-3 rounded-lg ${getScoreBgColor(aiAssessment.strategicFoundation.valueProposition.score)}`}
                            >
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium">Value Proposition</span>
                                <span
                                  className={`text-sm font-semibold ${getScoreColor(aiAssessment.strategicFoundation.valueProposition.score)}`}
                                >
                                  {aiAssessment.strategicFoundation.valueProposition.score}
                                </span>
                              </div>
                              <p className="text-xs text-gray-600">
                                {aiAssessment.strategicFoundation.valueProposition.assessment}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Visual Identity */}
                        <div>
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center space-x-2">
                              <Palette className="w-4 h-4 text-purple-600" />
                              <h4 className="font-medium text-gray-900">Visual Identity</h4>
                            </div>
                            <span className={`font-semibold ${getScoreColor(aiAssessment.visualIdentity.score)}`}>
                              {aiAssessment.visualIdentity.score}
                            </span>
                          </div>
                          <Progress value={aiAssessment.visualIdentity.score} className="h-2 mb-4" />

                          <div className="grid gap-4 sm:grid-cols-3">
                            <div
                              className={`p-3 rounded-lg ${getScoreBgColor(aiAssessment.visualIdentity.logo.score)}`}
                            >
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium">Logo Usage</span>
                                <span
                                  className={`text-sm font-semibold ${getScoreColor(aiAssessment.visualIdentity.logo.score)}`}
                                >
                                  {aiAssessment.visualIdentity.logo.score}
                                </span>
                              </div>
                              <p className="text-xs text-gray-600">{aiAssessment.visualIdentity.logo.assessment}</p>
                            </div>

                            <div
                              className={`p-3 rounded-lg ${getScoreBgColor(aiAssessment.visualIdentity.colorPalette.score)}`}
                            >
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium">Color Palette</span>
                                <span
                                  className={`text-sm font-semibold ${getScoreColor(aiAssessment.visualIdentity.colorPalette.score)}`}
                                >
                                  {aiAssessment.visualIdentity.colorPalette.score}
                                </span>
                              </div>
                              <p className="text-xs text-gray-600">
                                {aiAssessment.visualIdentity.colorPalette.assessment}
                              </p>
                            </div>

                            <div
                              className={`p-3 rounded-lg ${getScoreBgColor(aiAssessment.visualIdentity.imageryStyle.score)}`}
                            >
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium">Imagery Style</span>
                                <span
                                  className={`text-sm font-semibold ${getScoreColor(aiAssessment.visualIdentity.imageryStyle.score)}`}
                                >
                                  {aiAssessment.visualIdentity.imageryStyle.score}
                                </span>
                              </div>
                              <p className="text-xs text-gray-600">
                                {aiAssessment.visualIdentity.imageryStyle.assessment}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Recommendations */}
                        <div>
                          <div className="flex items-center space-x-2 mb-3">
                            <Lightbulb className="w-4 h-4 text-yellow-600" />
                            <h4 className="font-medium text-gray-900">AI Recommendations</h4>
                          </div>
                          <div className="space-y-2">
                            {aiAssessment.recommendations.map((recommendation, index) => (
                              <div key={index} className="flex items-start space-x-2 p-3 bg-yellow-50 rounded-lg">
                                <TrendingUp className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                                <p className="text-sm text-gray-700">{recommendation}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="history" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Approval History</CardTitle>
                    <CardDescription>Track of all changes and approvals</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-96">
                      <div className="space-y-4">
                        {deliverable.history && deliverable.history.length > 0 ? (
                          deliverable.history.map((item, index) => (
                            <motion.div
                              key={item.id}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.1 }}
                              className="flex items-start space-x-3 pb-4 border-b border-gray-100 last:border-b-0"
                            >
                              <Avatar className="w-8 h-8">
                                <AvatarFallback className="text-xs">{item.user.avatar}</AvatarFallback>
                              </Avatar>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center space-x-2">
                                  <p className="text-sm font-medium text-gray-900">{item.user.name}</p>
                                  <p className="text-sm text-gray-500">{item.action}</p>
                                  <p className="text-xs text-gray-400">
                                    {new Date(item.timestamp).toLocaleDateString()}
                                  </p>
                                </div>
                                {item.comment && <p className="text-sm text-gray-700 mt-1">{item.comment}</p>}
                              </div>
                            </motion.div>
                          ))
                        ) : (
                          <div className="text-center py-8">
                            <GitBranch className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                            <p className="text-sm text-gray-500">No history available</p>
                          </div>
                        )}
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Approval Panel */}
          <div className="space-y-6">
            {/* Assignee & Approvers */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="w-5 h-5 mr-2" />
                  People
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">Assignee</p>
                  <div className="flex items-center space-x-3">
                    <Avatar className="w-8 h-8">
                      <AvatarFallback>{deliverable.assignee.avatar}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">{deliverable.assignee.name}</p>
                      {deliverable.assignee.email && (
                        <p className="text-xs text-gray-500">{deliverable.assignee.email}</p>
                      )}
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <p className="text-sm font-medium text-gray-700 mb-3">Approvers</p>
                  <div className="space-y-3">
                    {deliverable.approvers.map((approver, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center justify-between"
                      >
                        <div className="flex items-center space-x-3">
                          <Avatar className="w-8 h-8">
                            <AvatarFallback>{approver.avatar}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-sm font-medium">{approver.name}</p>
                            {approver.email && <p className="text-xs text-gray-500">{approver.email}</p>}
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          {approver.status === "approved" && <CheckCircle className="w-4 h-4 text-green-500" />}
                          {approver.status === "pending" && <Clock className="w-4 h-4 text-yellow-500" />}
                          {approver.status === "rejected" && <AlertCircle className="w-4 h-4 text-red-500" />}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Approval Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Your Review</CardTitle>
                <CardDescription>Approve, reject, or leave feedback</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex space-x-2">
                  <Button className="flex-1" onClick={handleApprove} disabled={isSubmitting}>
                    <ThumbsUp className="w-4 h-4 mr-2" />
                    Approve
                  </Button>
                  <Button variant="destructive" className="flex-1" onClick={handleReject} disabled={isSubmitting}>
                    <ThumbsDown className="w-4 h-4 mr-2" />
                    Reject
                  </Button>
                </div>

                <div className="space-y-2">
                  <Textarea
                    placeholder="Add a comment or feedback..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    rows={3}
                  />
                  <Button size="sm" onClick={handleComment} disabled={!comment.trim() || isSubmitting}>
                    <Send className="w-4 h-4 mr-2" />
                    Add Comment
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Comments */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MessageSquare className="w-5 h-5 mr-2" />
                  Comments
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-64">
                  <div className="space-y-4">
                    {deliverable.approvers
                      .filter((approver) => approver.comment)
                      .map((approver, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="flex items-start space-x-3"
                        >
                          <Avatar className="w-8 h-8">
                            <AvatarFallback>{approver.avatar}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <p className="text-sm font-medium">{approver.name}</p>
                              <p className="text-xs text-gray-500">
                                {approver.timestamp && new Date(approver.timestamp).toLocaleDateString()}
                              </p>
                            </div>
                            <p className="text-sm text-gray-700 bg-gray-50 p-2 rounded-lg">{approver.comment}</p>
                          </div>
                        </motion.div>
                      ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
