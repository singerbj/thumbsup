export interface WorkflowStep {
  id: string
  name: string
  description: string
  order: number
  type: 'approval' | 'review' | 'edit' | 'publish'
  required: boolean
  assigneeRoles: string[]
  timeLimit?: number // hours
  conditions?: WorkflowCondition[]
}

export interface WorkflowCondition {
  field: string
  operator: 'equals' | 'not_equals' | 'contains' | 'greater_than' | 'less_than'
  value: string
}

export interface WorkflowTemplate {
  id: string
  name: string
  description: string
  contentType: ContentType
  organizationId: string
  steps: WorkflowStep[]
  active: boolean
  isDefault: boolean
  createdAt: string
  updatedAt: string
  createdBy: string
}

export interface WorkflowInstance {
  id: string
  templateId: string
  deliverableId: string
  currentStepId: string
  status: 'active' | 'completed' | 'cancelled'
  stepInstances: WorkflowStepInstance[]
  createdAt: string
  updatedAt: string
}

export interface WorkflowStepInstance {
  id: string
  stepId: string
  status: 'pending' | 'in_progress' | 'completed' | 'skipped' | 'rejected'
  assigneeId?: string
  startedAt?: string
  completedAt?: string
  comment?: string
  attachments?: string[]
  timeSpent?: number // minutes
}

export type ContentType = 
  // Social Content
  | 'instagram_post'
  | 'instagram_story'
  | 'instagram_reel'
  | 'linkedin_post'
  | 'linkedin_article'
  | 'twitter_post'
  | 'twitter_thread'
  | 'facebook_post'
  | 'facebook_story'
  | 'tiktok_video'
  | 'youtube_video'
  | 'youtube_short'
  | 'pinterest_pin'
  | 'snapchat_story'
  // Web Content
  | 'blog_post'
  | 'website_copy'
  | 'landing_page'
  | 'email_campaign'
  | 'newsletter'
  | 'press_release'
  | 'case_study'
  | 'whitepaper'
  // Marketing Materials
  | 'display_ad'
  | 'video_ad'
  | 'print_ad'
  | 'brochure'
  | 'infographic'
  | 'presentation'
  // Executive Content
  | 'executive_post'
  | 'executive_statement'
  | 'investor_update'

export interface ContentTypeConfig {
  id: ContentType
  name: string
  category: 'social' | 'web' | 'marketing' | 'executive'
  description: string
  icon: string
  fields: ContentField[]
  defaultWorkflowTemplate?: string
  mediaTypes: MediaType[]
  platforms?: string[]
}

export interface ContentField {
  id: string
  name: string
  type: 'text' | 'textarea' | 'rich_text' | 'media' | 'date' | 'select' | 'multi_select' | 'url' | 'number'
  required: boolean
  placeholder?: string
  options?: string[]
  validation?: FieldValidation
}

export interface FieldValidation {
  minLength?: number
  maxLength?: number
  pattern?: string
  customMessage?: string
}

export type MediaType = 'image' | 'video' | 'gif' | 'audio' | 'document' | 'graphic'