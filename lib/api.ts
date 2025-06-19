// Mock API functions with realistic delays

export interface Project {
  _id: string
  name: string
  description: string
  status: "active" | "inactive" | "completed"
  progress: number
  deliverableCount: number
  workstream: {
    id: string
    name: string
  }
}

export interface Workstream {
  _id: string
  name: string
  description: string
  status: "active" | "inactive" | "completed"
  progress: number
  projectCount: number
}

export interface Deliverable {
  _id: string
  name: string
  type: string
  status: "draft" | "pending-approval" | "in-review" | "approved" | "rejected" | "published"
  content: {
    text: string
    hashtags: string[]
    mentions: string[]
    media?: MediaItem[]
  }
  assignee: { name: string; avatar: string; email?: string }
  approvers: Array<{
    name: string
    avatar: string
    status: "pending" | "approved" | "rejected"
    email?: string
    comment?: string
    timestamp?: string
  }>
  dueDate: string
  createdAt: string
  project?: {
    id: string
    name: string
    workstream: string
  }
  priority?: "low" | "normal" | "high" | "urgent"
  escalated?: boolean
  requestedAt?: string
  history?: Array<{
    id: number
    action: string
    user: { name: string; avatar: string }
    timestamp: string
    comment?: string
  }>
}

export interface MediaItem {
  id: string
  type: "image" | "video" | "gif"
  url: string
  alt?: string
  thumbnail?: string
}

export interface ApprovalRule {
  id: string
  name: string
  description: string
  active: boolean
  conditions: Array<{
    field: string
    operator: string
    value: string
  }>
  approvers: Array<{
    role: string
    required: boolean
    order: number
  }>
  settings: {
    parallel_approval: boolean
    escalation_days: number
  }
}

// Mock data
const mockProjects: Project[] = [
  {
    _id: "1",
    name: "Instagram Stories Campaign",
    description: "Daily story content for product awareness",
    status: "active",
    progress: 65,
    deliverableCount: 8,
    workstream: {
      id: "ws-1",
      name: "Q1 2024 Campaign",
    },
  },
  {
    _id: "2",
    name: "LinkedIn Content Series",
    description: "Professional content for B2B audience",
    status: "active",
    progress: 40,
    deliverableCount: 5,
    workstream: {
      id: "ws-1",
      name: "Q1 2024 Campaign",
    },
  },
  {
    _id: "3",
    name: "Executive Communications",
    description: "CEO thought leadership posts",
    status: "in-review",
    progress: 80,
    deliverableCount: 3,
    workstream: {
      id: "ws-2",
      name: "Brand Authority",
    },
  },
  {
    _id: "4",
    name: "Product Launch Teasers",
    description: "Building anticipation for new product release",
    status: "pending-approval",
    progress: 25,
    deliverableCount: 12,
    workstream: {
      id: "ws-3",
      name: "Product Marketing",
    },
  },
  {
    _id: "5",
    name: "Holiday Campaign",
    description: "Seasonal content for holiday marketing",
    status: "completed",
    progress: 100,
    deliverableCount: 15,
    workstream: {
      id: "ws-4",
      name: "Seasonal Campaigns",
    },
  },
]

const mockWorkstreams: Workstream[] = [
  {
    _id: "ws-1",
    name: "Q1 2024 Campaign",
    description: "Social media campaign for product launch",
    status: "active",
    progress: 65,
    projectCount: 4,
  },
  {
    _id: "ws-2",
    name: "Brand Authority",
    description: "Building thought leadership and brand recognition",
    status: "active",
    progress: 40,
    projectCount: 2,
  },
  {
    _id: "ws-3",
    name: "Product Marketing",
    description: "Marketing campaigns for new product releases",
    status: "active",
    progress: 30,
    projectCount: 3,
  },
  {
    _id: "ws-4",
    name: "Seasonal Campaigns",
    description: "Holiday and seasonal marketing content",
    status: "completed",
    progress: 100,
    projectCount: 6,
  },
  {
    _id: "ws-5",
    name: "Customer Success Stories",
    description: "Showcasing customer testimonials and case studies",
    status: "inactive",
    progress: 15,
    projectCount: 1,
  },
]

const mockDeliverables: Record<string, Deliverable[]> = {
  "1": [
    {
      _id: "d-1",
      name: "Story Set #1 - Product Teaser",
      type: "instagram_story",
      status: "pending-approval",
      content: {
        text: "🚀 Something amazing is coming! Stay tuned for our biggest product launch yet. #Innovation #ComingSoon",
        hashtags: ["#Innovation", "#ComingSoon", "#ProductLaunch"],
        mentions: ["@company"],
        media: [
          {
            id: "media-1",
            type: "image",
            url: "/placeholder.svg?height=400&width=300",
            alt: "Product preview",
          },
        ],
      },
      assignee: { name: "Sarah Chen", avatar: "SC", email: "sarah@company.com" },
      approvers: [
        {
          name: "Mike Johnson",
          avatar: "MJ",
          status: "approved",
          email: "mike@company.com",
          comment: "Looks great! Love the energy and the hashtags are on point.",
          timestamp: "2024-01-16T10:30:00Z",
        },
        { name: "Lisa Wang", avatar: "LW", status: "pending", email: "lisa@company.com" },
      ],
      dueDate: "2024-01-25",
      createdAt: "2024-01-15",
      history: [
        {
          id: 1,
          action: "created",
          user: { name: "Sarah Chen", avatar: "SC" },
          timestamp: "2024-01-15T14:00:00Z",
          comment: "Initial draft created",
        },
        {
          id: 2,
          action: "submitted",
          user: { name: "Sarah Chen", avatar: "SC" },
          timestamp: "2024-01-15T16:30:00Z",
          comment: "Submitted for approval",
        },
        {
          id: 3,
          action: "approved",
          user: { name: "Mike Johnson", avatar: "MJ" },
          timestamp: "2024-01-16T10:30:00Z",
          comment: "Looks great! Love the energy and the hashtags are on point.",
        },
      ],
    },
    {
      _id: "d-2",
      name: "Story Set #2 - Behind the Scenes",
      type: "instagram_story",
      status: "draft",
      content: {
        text: "Behind the scenes of our amazing team working on something special! 👨‍💻👩‍💻 #TeamWork #BehindTheScenes",
        hashtags: ["#TeamWork", "#BehindTheScenes", "#Culture"],
        mentions: ["@company"],
        media: [
          {
            id: "media-2",
            type: "image",
            url: "/placeholder.svg?height=400&width=300",
            alt: "Behind the scenes",
          },
        ],
      },
      assignee: { name: "Tom Wilson", avatar: "TW", email: "tom@company.com" },
      approvers: [],
      dueDate: "2024-01-28",
      createdAt: "2024-01-16",
      history: [
        {
          id: 1,
          action: "created",
          user: { name: "Tom Wilson", avatar: "TW" },
          timestamp: "2024-01-16T14:00:00Z",
          comment: "Initial draft created",
        },
      ],
    },
    {
      _id: "d-3",
      name: "Story Set #3 - Feature Highlight",
      type: "instagram_story",
      status: "approved",
      content: {
        text: "✨ New feature alert! Our latest update makes everything faster and more intuitive. Try it now! #NewFeature #Update",
        hashtags: ["#NewFeature", "#Update", "#ProductNews"],
        mentions: ["@company"],
        media: [
          {
            id: "media-3",
            type: "image",
            url: "/placeholder.svg?height=400&width=300",
            alt: "Feature highlight",
          },
        ],
      },
      assignee: { name: "Alex Rivera", avatar: "AR", email: "alex@company.com" },
      approvers: [
        { name: "Mike Johnson", avatar: "MJ", status: "approved", email: "mike@company.com" },
        { name: "Lisa Wang", avatar: "LW", status: "approved", email: "lisa@company.com" },
      ],
      dueDate: "2024-01-22",
      createdAt: "2024-01-12",
      history: [
        {
          id: 1,
          action: "created",
          user: { name: "Alex Rivera", avatar: "AR" },
          timestamp: "2024-01-12T14:00:00Z",
          comment: "Initial draft created",
        },
        {
          id: 2,
          action: "approved",
          user: { name: "Mike Johnson", avatar: "MJ" },
          timestamp: "2024-01-13T10:30:00Z",
          comment: "Great work on the feature highlight!",
        },
        {
          id: 3,
          action: "approved",
          user: { name: "Lisa Wang", avatar: "LW" },
          timestamp: "2024-01-13T14:15:00Z",
          comment: "Perfect timing for the launch.",
        },
      ],
    },
    {
      _id: "d-4",
      name: "Story Set #4 - User Testimonial",
      type: "instagram_story",
      status: "in-review",
      content: {
        text: "💬 'This product changed how we work!' - Happy customer sharing their success story. #CustomerLove #Testimonial",
        hashtags: ["#CustomerLove", "#Testimonial", "#Success"],
        mentions: ["@company", "@customer"],
        media: [
          {
            id: "media-4",
            type: "image",
            url: "/placeholder.svg?height=400&width=300",
            alt: "Customer testimonial",
          },
        ],
      },
      assignee: { name: "Emma Davis", avatar: "ED", email: "emma@company.com" },
      approvers: [{ name: "Mike Johnson", avatar: "MJ", status: "pending", email: "mike@company.com" }],
      dueDate: "2024-01-30",
      createdAt: "2024-01-18",
      history: [
        {
          id: 1,
          action: "created",
          user: { name: "Emma Davis", avatar: "ED" },
          timestamp: "2024-01-18T14:00:00Z",
          comment: "Initial draft created",
        },
        {
          id: 2,
          action: "submitted",
          user: { name: "Emma Davis", avatar: "ED" },
          timestamp: "2024-01-18T16:30:00Z",
          comment: "Submitted for review",
        },
      ],
    },
  ],
  "2": [
    {
      _id: "d-5",
      name: "Thought Leadership Post #1",
      type: "linkedin_post",
      status: "approved",
      content: {
        text: "The future of work is here. As we navigate the evolving landscape of remote collaboration, it's clear that adaptability and innovation are key to success. Here's what we've learned... 🧵",
        hashtags: ["#FutureOfWork", "#RemoteWork", "#Innovation"],
        mentions: ["@company"],
        media: [
          {
            id: "media-5",
            type: "image",
            url: "/placeholder.svg?height=400&width=600",
            alt: "Future of work infographic",
          },
        ],
      },
      assignee: { name: "David Kim", avatar: "DK", email: "david@company.com" },
      approvers: [
        { name: "Mike Johnson", avatar: "MJ", status: "approved", email: "mike@company.com" },
        { name: "Lisa Wang", avatar: "LW", status: "approved", email: "lisa@company.com" },
      ],
      dueDate: "2024-01-24",
      createdAt: "2024-01-14",
      history: [
        {
          id: 1,
          action: "created",
          user: { name: "David Kim", avatar: "DK" },
          timestamp: "2024-01-14T14:00:00Z",
          comment: "Initial draft created",
        },
        {
          id: 2,
          action: "approved",
          user: { name: "Mike Johnson", avatar: "MJ" },
          timestamp: "2024-01-15T10:30:00Z",
          comment: "Excellent thought leadership content.",
        },
        {
          id: 3,
          action: "approved",
          user: { name: "Lisa Wang", avatar: "LW" },
          timestamp: "2024-01-15T14:15:00Z",
          comment: "Great insights on remote work trends.",
        },
      ],
    },
    {
      _id: "d-6",
      name: "Industry Insights Post",
      type: "linkedin_post",
      status: "draft",
      content: {
        text: "Industry Report: 73% of companies are investing in digital transformation this year. What does this mean for your business? Let's break it down... 📊",
        hashtags: ["#DigitalTransformation", "#IndustryInsights", "#BusinessGrowth"],
        mentions: ["@company"],
        media: [
          {
            id: "media-6",
            type: "image",
            url: "/placeholder.svg?height=400&width=600",
            alt: "Digital transformation statistics",
          },
        ],
      },
      assignee: { name: "Rachel Green", avatar: "RG", email: "rachel@company.com" },
      approvers: [],
      dueDate: "2024-01-26",
      createdAt: "2024-01-17",
      history: [
        {
          id: 1,
          action: "created",
          user: { name: "Rachel Green", avatar: "RG" },
          timestamp: "2024-01-17T14:00:00Z",
          comment: "Initial draft created",
        },
      ],
    },
  ],
}

const mockApprovals: Deliverable[] = [
  {
    _id: "d-1",
    name: "Story Set #1 - Product Teaser",
    type: "instagram_story",
    status: "pending-approval",
    priority: "high",
    content: {
      text: "🚀 Something amazing is coming! Stay tuned for our biggest product launch yet. #Innovation #ComingSoon",
      hashtags: ["#Innovation", "#ComingSoon", "#ProductLaunch"],
      mentions: ["@company"],
      media: [
        {
          id: "media-1",
          type: "image",
          url: "/placeholder.svg?height=400&width=300",
          alt: "Product preview",
        },
      ],
    },
    project: {
      id: "1",
      name: "Instagram Stories Campaign",
      workstream: "Q1 2024 Campaign",
    },
    assignee: { name: "Sarah Chen", avatar: "SC", email: "sarah@company.com" },
    approvers: [
      { name: "Mike Johnson", avatar: "MJ", status: "approved", email: "mike@company.com" },
      { name: "Lisa Wang", avatar: "LW", status: "pending", email: "lisa@company.com" },
    ],
    dueDate: "2024-01-25",
    createdAt: "2024-01-15",
    requestedAt: "2024-01-20",
    escalated: false,
    history: [
      {
        id: 1,
        action: "created",
        user: { name: "Sarah Chen", avatar: "SC" },
        timestamp: "2024-01-15T14:00:00Z",
        comment: "Initial draft created",
      },
      {
        id: 2,
        action: "submitted",
        user: { name: "Sarah Chen", avatar: "SC" },
        timestamp: "2024-01-15T16:30:00Z",
        comment: "Submitted for approval",
      },
      {
        id: 3,
        action: "approved",
        user: { name: "Mike Johnson", avatar: "MJ" },
        timestamp: "2024-01-16T10:30:00Z",
        comment: "Looks great! Love the energy and the hashtags are on point.",
      },
    ],
  },
  {
    _id: "d-7",
    name: "Executive LinkedIn Post - Industry Insights",
    type: "linkedin_post",
    status: "pending-approval",
    priority: "urgent",
    content: {
      text: "The future of AI in business is not just about automation—it's about augmentation. Here's how forward-thinking companies are leveraging AI to empower their teams and drive innovation...",
      hashtags: ["#AI", "#BusinessInnovation", "#FutureOfWork"],
      mentions: ["@company", "@ceo"],
      media: [
        {
          id: "media-7",
          type: "image",
          url: "/placeholder.svg?height=400&width=600",
          alt: "AI in business infographic",
        },
      ],
    },
    project: {
      id: "3",
      name: "Executive Communications",
      workstream: "Brand Authority",
    },
    assignee: { name: "Michael Torres", avatar: "MT", email: "michael@company.com" },
    approvers: [{ name: "Current User", avatar: "CU", status: "pending", email: "user@company.com" }],
    dueDate: "2024-01-23",
    createdAt: "2024-01-18",
    requestedAt: "2024-01-21",
    escalated: true,
    history: [
      {
        id: 1,
        action: "created",
        user: { name: "Michael Torres", avatar: "MT" },
        timestamp: "2024-01-18T14:00:00Z",
        comment: "Initial draft created",
      },
      {
        id: 2,
        action: "escalated",
        user: { name: "System", avatar: "SY" },
        timestamp: "2024-01-21T09:00:00Z",
        comment: "Automatically escalated due to urgency",
      },
    ],
  },
]

const mockRules: ApprovalRule[] = [
  {
    id: "rule-1",
    name: "Standard Content Approval",
    description: "Default approval flow for all content types",
    active: true,
    conditions: [
      { field: "content_type", operator: "equals", value: "any" },
      { field: "priority", operator: "equals", value: "normal" },
    ],
    approvers: [
      { role: "content_manager", required: true, order: 1 },
      { role: "brand_manager", required: true, order: 2 },
    ],
    settings: {
      parallel_approval: false,
      escalation_days: 3,
    },
  },
  {
    id: "rule-2",
    name: "High Priority Content",
    description: "Fast-track approval for urgent content",
    active: true,
    conditions: [{ field: "priority", operator: "equals", value: "high" }],
    approvers: [{ role: "content_manager", required: true, order: 1 }],
    settings: {
      parallel_approval: false,
      escalation_days: 1,
    },
  },
]

// API functions
export const api = {
  // Projects
  getProjects: async (): Promise<Project[]> => {
    await new Promise((resolve) => setTimeout(resolve, 800))
    return mockProjects
  },

  getProject: async (id: string): Promise<Project | null> => {
    await new Promise((resolve) => setTimeout(resolve, 500))
    return mockProjects.find((p) => p._id === id) || null
  },

  createProject: async (data: Omit<Project, "_id">): Promise<Project> => {
    await new Promise((resolve) => setTimeout(resolve, 1000))
    const newProject = {
      _id: `project-${Date.now()}`,
      ...data,
      deliverableCount: 0,
      progress: 0,
    }
    mockProjects.push(newProject)
    return newProject
  },

  // Workstreams
  getWorkstreams: async (): Promise<Workstream[]> => {
    await new Promise((resolve) => setTimeout(resolve, 600))
    return mockWorkstreams
  },

  createWorkstream: async (data: Omit<Workstream, "_id">): Promise<Workstream> => {
    await new Promise((resolve) => setTimeout(resolve, 1000))
    const newWorkstream = {
      _id: `ws-${Date.now()}`,
      ...data,
      projectCount: 0,
      progress: 0,
    }
    mockWorkstreams.push(newWorkstream)
    return newWorkstream
  },

  // Deliverables
  getDeliverables: async (projectId: string): Promise<Deliverable[]> => {
    await new Promise((resolve) => setTimeout(resolve, 700))
    return mockDeliverables[projectId] || []
  },

  getDeliverable: async (id: string): Promise<Deliverable | null> => {
    await new Promise((resolve) => setTimeout(resolve, 500))
    for (const deliverables of Object.values(mockDeliverables)) {
      const found = deliverables.find((d) => d._id === id)
      if (found) return found
    }
    return mockApprovals.find((d) => d._id === id) || null
  },

  createDeliverable: async (data: Omit<Deliverable, "_id"> & { projectId: string }): Promise<Deliverable> => {
    await new Promise((resolve) => setTimeout(resolve, 1200))
    const newDeliverable = {
      _id: `d-${Date.now()}`,
      ...data,
      status: "draft" as const,
      approvers: [],
      createdAt: new Date().toISOString().split("T")[0],
    }

    if (!mockDeliverables[data.projectId]) {
      mockDeliverables[data.projectId] = []
    }
    mockDeliverables[data.projectId].push(newDeliverable)
    return newDeliverable
  },

  // Approvals
  getApprovals: async (): Promise<Deliverable[]> => {
    await new Promise((resolve) => setTimeout(resolve, 600))
    return mockApprovals
  },

  approveDeliverable: async (id: string, comment?: string): Promise<void> => {
    await new Promise((resolve) => setTimeout(resolve, 800))
    console.log(`Approved deliverable ${id}`, comment ? `with comment: ${comment}` : "")
  },

  rejectDeliverable: async (id: string, comment?: string): Promise<void> => {
    await new Promise((resolve) => setTimeout(resolve, 800))
    console.log(`Rejected deliverable ${id}`, comment ? `with comment: ${comment}` : "")
  },

  // Rules
  getRules: async (): Promise<ApprovalRule[]> => {
    await new Promise((resolve) => setTimeout(resolve, 500))
    return mockRules
  },

  createRule: async (data: Omit<ApprovalRule, "id">): Promise<ApprovalRule> => {
    await new Promise((resolve) => setTimeout(resolve, 1000))
    const newRule = {
      id: `rule-${Date.now()}`,
      ...data,
    }
    mockRules.push(newRule)
    return newRule
  },

  updateRule: async (id: string, data: Partial<ApprovalRule>): Promise<ApprovalRule> => {
    await new Promise((resolve) => setTimeout(resolve, 800))
    const index = mockRules.findIndex((r) => r.id === id)
    if (index !== -1) {
      mockRules[index] = { ...mockRules[index], ...data }
      return mockRules[index]
    }
    throw new Error("Rule not found")
  },

  deleteRule: async (id: string): Promise<void> => {
    await new Promise((resolve) => setTimeout(resolve, 600))
    const index = mockRules.findIndex((r) => r.id === id)
    if (index !== -1) {
      mockRules.splice(index, 1)
    }
  },
}
