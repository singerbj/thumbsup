export interface User {
  id: string
  name: string
  email: string
  avatar: string
  role: string
  organizationId: string
}

export interface Organization {
  id: string
  name: string
  slug: string
  settings: {
    workflowStructure: WorkflowStructure[]
  }
}

export interface WorkflowStructure {
  id: string
  name: string
  level: number
  parentId?: string
  children?: WorkflowStructure[]
}

export interface Workstream {
  id: string
  name: string
  description: string
  status: "active" | "inactive" | "completed"
  organizationId: string
  projects: Project[]
  createdAt: string
  updatedAt: string
}

export interface Project {
  id: string
  name: string
  description: string
  status: "active" | "inactive" | "completed"
  workstreamId: string
  deliverables: Deliverable[]
  createdAt: string
  updatedAt: string
}

export interface Deliverable {
  id: string
  name: string
  type: ContentType
  status: "draft" | "pending-approval" | "in-review" | "approved" | "rejected" | "published"
  content: ContentData
  projectId: string
  assigneeId: string
  approvers: ApprovalRecord[]
  ruleId?: string
  createdAt: string
  updatedAt: string
  dueDate?: string
}

export interface ContentData {
  text: string
  media: MediaItem[]
  hashtags: string[]
  mentions: string[]
  scheduledDate?: string
}

export interface MediaItem {
  id: string
  type: "image" | "video" | "gif"
  url: string
  alt?: string
  thumbnail?: string
}

export interface ApprovalRecord {
  id: string
  userId: string
  status: "pending" | "approved" | "rejected"
  comment?: string
  timestamp?: string
  order: number
  required: boolean
}

export interface ApprovalRule {
  id: string
  name: string
  description: string
  active: boolean
  organizationId: string
  conditions: RuleCondition[]
  approvers: RuleApprover[]
  settings: RuleSettings
}

export interface RuleCondition {
  field: string
  operator: "equals" | "not_equals" | "contains" | "greater_than" | "less_than"
  value: string
}

export interface RuleApprover {
  role: string
  required: boolean
  order: number
}

export interface RuleSettings {
  parallel_approval: boolean
  auto_approve_threshold?: number
  escalation_days: number
}

export type ContentType =
  | "instagram_post"
  | "instagram_story"
  | "linkedin_post"
  | "twitter_post"
  | "facebook_post"
  | "executive_post"

export type Permission =
  | "create_content"
  | "approve_content"
  | "manage_rules"
  | "manage_users"
  | "view_analytics"
  | "admin"

export interface Role {
  id: string
  name: string
  permissions: Permission[]
  organizationId: string
}
