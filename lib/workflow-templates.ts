import { WorkflowTemplate, WorkflowStep, ContentType } from '@/types/workflow'

export const defaultWorkflowTemplates: Record<string, WorkflowTemplate> = {
  // Social Media Workflows
  social_standard: {
    id: 'social_standard',
    name: 'Standard Social Media Workflow',
    description: 'Standard approval process for social media content',
    contentType: 'instagram_post',
    organizationId: 'org-1',
    active: true,
    isDefault: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    createdBy: 'user-1',
    steps: [
      {
        id: 'step-1',
        name: 'Content Creation',
        description: 'Create initial content draft',
        order: 1,
        type: 'edit',
        required: true,
        assigneeRoles: ['content_creator'],
        timeLimit: 24
      },
      {
        id: 'step-2',
        name: 'Content Review',
        description: 'Review content for quality and brand alignment',
        order: 2,
        type: 'review',
        required: true,
        assigneeRoles: ['content_manager'],
        timeLimit: 12
      },
      {
        id: 'step-3',
        name: 'Brand Approval',
        description: 'Final brand and legal approval',
        order: 3,
        type: 'approval',
        required: true,
        assigneeRoles: ['brand_manager'],
        timeLimit: 8
      },
      {
        id: 'step-4',
        name: 'Publish',
        description: 'Schedule and publish content',
        order: 4,
        type: 'publish',
        required: true,
        assigneeRoles: ['social_media_manager'],
        timeLimit: 2
      }
    ]
  },
  
  social_executive: {
    id: 'social_executive',
    name: 'Executive Social Media Workflow',
    description: 'Enhanced approval process for executive content',
    contentType: 'executive_post',
    organizationId: 'org-1',
    active: true,
    isDefault: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    createdBy: 'user-1',
    steps: [
      {
        id: 'step-1',
        name: 'Content Creation',
        description: 'Create initial executive content draft',
        order: 1,
        type: 'edit',
        required: true,
        assigneeRoles: ['content_creator', 'executive_assistant'],
        timeLimit: 48
      },
      {
        id: 'step-2',
        name: 'Content Review',
        description: 'Review content for messaging and tone',
        order: 2,
        type: 'review',
        required: true,
        assigneeRoles: ['content_manager'],
        timeLimit: 12
      },
      {
        id: 'step-3',
        name: 'Brand & Legal Review',
        description: 'Brand alignment and legal compliance check',
        order: 3,
        type: 'review',
        required: true,
        assigneeRoles: ['brand_manager', 'legal_counsel'],
        timeLimit: 24
      },
      {
        id: 'step-4',
        name: 'Executive Approval',
        description: 'Final approval from executive',
        order: 4,
        type: 'approval',
        required: true,
        assigneeRoles: ['executive'],
        timeLimit: 48
      },
      {
        id: 'step-5',
        name: 'Publish',
        description: 'Schedule and publish executive content',
        order: 5,
        type: 'publish',
        required: true,
        assigneeRoles: ['social_media_manager'],
        timeLimit: 2
      }
    ]
  },

  // Web Content Workflows
  web_blog: {
    id: 'web_blog',
    name: 'Blog Post Workflow',
    description: 'Comprehensive workflow for blog content',
    contentType: 'blog_post',
    organizationId: 'org-1',
    active: true,
    isDefault: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    createdBy: 'user-1',
    steps: [
      {
        id: 'step-1',
        name: 'Content Planning',
        description: 'Outline and plan blog content',
        order: 1,
        type: 'edit',
        required: true,
        assigneeRoles: ['content_strategist'],
        timeLimit: 24
      },
      {
        id: 'step-2',
        name: 'Writing',
        description: 'Write blog post content',
        order: 2,
        type: 'edit',
        required: true,
        assigneeRoles: ['content_writer'],
        timeLimit: 72
      },
      {
        id: 'step-3',
        name: 'Editorial Review',
        description: 'Edit for grammar, style, and clarity',
        order: 3,
        type: 'review',
        required: true,
        assigneeRoles: ['editor'],
        timeLimit: 24
      },
      {
        id: 'step-4',
        name: 'SEO Optimization',
        description: 'Optimize for search engines',
        order: 4,
        type: 'review',
        required: true,
        assigneeRoles: ['seo_specialist'],
        timeLimit: 12
      },
      {
        id: 'step-5',
        name: 'Final Approval',
        description: 'Final content approval',
        order: 5,
        type: 'approval',
        required: true,
        assigneeRoles: ['content_manager'],
        timeLimit: 8
      },
      {
        id: 'step-6',
        name: 'Publish',
        description: 'Publish blog post',
        order: 6,
        type: 'publish',
        required: true,
        assigneeRoles: ['web_manager'],
        timeLimit: 2
      }
    ]
  },

  web_landing_page: {
    id: 'web_landing_page',
    name: 'Landing Page Workflow',
    description: 'Workflow for landing page content creation',
    contentType: 'landing_page',
    organizationId: 'org-1',
    active: true,
    isDefault: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    createdBy: 'user-1',
    steps: [
      {
        id: 'step-1',
        name: 'Strategy & Planning',
        description: 'Define landing page strategy and goals',
        order: 1,
        type: 'edit',
        required: true,
        assigneeRoles: ['marketing_strategist'],
        timeLimit: 48
      },
      {
        id: 'step-2',
        name: 'Copywriting',
        description: 'Write compelling landing page copy',
        order: 2,
        type: 'edit',
        required: true,
        assigneeRoles: ['copywriter'],
        timeLimit: 48
      },
      {
        id: 'step-3',
        name: 'Design Review',
        description: 'Review visual design and layout',
        order: 3,
        type: 'review',
        required: true,
        assigneeRoles: ['designer'],
        timeLimit: 24
      },
      {
        id: 'step-4',
        name: 'Marketing Review',
        description: 'Review for marketing effectiveness',
        order: 4,
        type: 'review',
        required: true,
        assigneeRoles: ['marketing_manager'],
        timeLimit: 12
      },
      {
        id: 'step-5',
        name: 'Final Approval',
        description: 'Final approval before launch',
        order: 5,
        type: 'approval',
        required: true,
        assigneeRoles: ['marketing_director'],
        timeLimit: 24
      },
      {
        id: 'step-6',
        name: 'Launch',
        description: 'Deploy landing page',
        order: 6,
        type: 'publish',
        required: true,
        assigneeRoles: ['web_developer'],
        timeLimit: 4
      }
    ]
  },

  // Marketing Material Workflows
  marketing_ad: {
    id: 'marketing_ad',
    name: 'Advertisement Workflow',
    description: 'Workflow for digital and print advertisements',
    contentType: 'display_ad',
    organizationId: 'org-1',
    active: true,
    isDefault: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    createdBy: 'user-1',
    steps: [
      {
        id: 'step-1',
        name: 'Creative Brief',
        description: 'Define creative direction and requirements',
        order: 1,
        type: 'edit',
        required: true,
        assigneeRoles: ['creative_director'],
        timeLimit: 24
      },
      {
        id: 'step-2',
        name: 'Design Creation',
        description: 'Create advertisement design',
        order: 2,
        type: 'edit',
        required: true,
        assigneeRoles: ['graphic_designer'],
        timeLimit: 72
      },
      {
        id: 'step-3',
        name: 'Copy Review',
        description: 'Review advertisement copy',
        order: 3,
        type: 'review',
        required: true,
        assigneeRoles: ['copywriter'],
        timeLimit: 12
      },
      {
        id: 'step-4',
        name: 'Brand Review',
        description: 'Ensure brand compliance',
        order: 4,
        type: 'review',
        required: true,
        assigneeRoles: ['brand_manager'],
        timeLimit: 24
      },
      {
        id: 'step-5',
        name: 'Legal Review',
        description: 'Legal and compliance check',
        order: 5,
        type: 'review',
        required: true,
        assigneeRoles: ['legal_counsel'],
        timeLimit: 48
      },
      {
        id: 'step-6',
        name: 'Final Approval',
        description: 'Final approval for campaign launch',
        order: 6,
        type: 'approval',
        required: true,
        assigneeRoles: ['marketing_director'],
        timeLimit: 24
      },
      {
        id: 'step-7',
        name: 'Campaign Launch',
        description: 'Launch advertisement campaign',
        order: 7,
        type: 'publish',
        required: true,
        assigneeRoles: ['campaign_manager'],
        timeLimit: 4
      }
    ]
  },

  // Quick Approval Workflows
  quick_social: {
    id: 'quick_social',
    name: 'Quick Social Media Workflow',
    description: 'Streamlined workflow for time-sensitive social content',
    contentType: 'twitter_post',
    organizationId: 'org-1',
    active: true,
    isDefault: false,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    createdBy: 'user-1',
    steps: [
      {
        id: 'step-1',
        name: 'Content Creation',
        description: 'Create social media content',
        order: 1,
        type: 'edit',
        required: true,
        assigneeRoles: ['content_creator'],
        timeLimit: 2
      },
      {
        id: 'step-2',
        name: 'Quick Review',
        description: 'Fast review and approval',
        order: 2,
        type: 'approval',
        required: true,
        assigneeRoles: ['content_manager'],
        timeLimit: 1
      },
      {
        id: 'step-3',
        name: 'Publish',
        description: 'Immediate publishing',
        order: 3,
        type: 'publish',
        required: true,
        assigneeRoles: ['social_media_manager'],
        timeLimit: 0.5
      }
    ]
  }
}

export function getWorkflowTemplatesByContentType(contentType: ContentType): WorkflowTemplate[] {
  return Object.values(defaultWorkflowTemplates).filter(template => 
    template.contentType === contentType || template.contentType === 'instagram_post' // fallback
  )
}

export function getDefaultWorkflowTemplate(contentType: ContentType): WorkflowTemplate | null {
  const templates = getWorkflowTemplatesByContentType(contentType)
  return templates.find(template => template.isDefault) || templates[0] || null
}

export function createCustomWorkflowTemplate(
  name: string,
  description: string,
  contentType: ContentType,
  steps: WorkflowStep[],
  organizationId: string,
  createdBy: string
): WorkflowTemplate {
  return {
    id: `custom_${Date.now()}`,
    name,
    description,
    contentType,
    organizationId,
    steps: steps.map((step, index) => ({ ...step, order: index + 1 })),
    active: true,
    isDefault: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    createdBy
  }
}