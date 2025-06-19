import { ContentTypeConfig, ContentType } from '@/types/workflow'

export const contentTypeConfigs: Record<ContentType, ContentTypeConfig> = {
  // Social Content
  instagram_post: {
    id: 'instagram_post',
    name: 'Instagram Post',
    category: 'social',
    description: 'Standard Instagram feed post with image/video and caption',
    icon: 'Instagram',
    platforms: ['Instagram'],
    mediaTypes: ['image', 'video'],
    fields: [
      {
        id: 'caption',
        name: 'Caption',
        type: 'textarea',
        required: true,
        placeholder: 'Write your Instagram caption...',
        validation: { maxLength: 2200 }
      },
      {
        id: 'media',
        name: 'Media',
        type: 'media',
        required: true
      },
      {
        id: 'hashtags',
        name: 'Hashtags',
        type: 'multi_select',
        required: false,
        placeholder: 'Add hashtags...'
      },
      {
        id: 'mentions',
        name: 'Mentions',
        type: 'multi_select',
        required: false,
        placeholder: 'Tag accounts...'
      },
      {
        id: 'location',
        name: 'Location',
        type: 'text',
        required: false,
        placeholder: 'Add location...'
      },
      {
        id: 'scheduledDate',
        name: 'Scheduled Date',
        type: 'date',
        required: false
      }
    ]
  },
  instagram_story: {
    id: 'instagram_story',
    name: 'Instagram Story',
    category: 'social',
    description: '24-hour Instagram story content',
    icon: 'Instagram',
    platforms: ['Instagram'],
    mediaTypes: ['image', 'video'],
    fields: [
      {
        id: 'media',
        name: 'Media',
        type: 'media',
        required: true
      },
      {
        id: 'text_overlay',
        name: 'Text Overlay',
        type: 'text',
        required: false,
        placeholder: 'Add text overlay...'
      },
      {
        id: 'stickers',
        name: 'Stickers/GIFs',
        type: 'multi_select',
        required: false
      },
      {
        id: 'mentions',
        name: 'Mentions',
        type: 'multi_select',
        required: false
      },
      {
        id: 'hashtags',
        name: 'Hashtags',
        type: 'multi_select',
        required: false
      }
    ]
  },
  instagram_reel: {
    id: 'instagram_reel',
    name: 'Instagram Reel',
    category: 'social',
    description: 'Short-form video content for Instagram Reels',
    icon: 'Instagram',
    platforms: ['Instagram'],
    mediaTypes: ['video'],
    fields: [
      {
        id: 'video',
        name: 'Video',
        type: 'media',
        required: true
      },
      {
        id: 'caption',
        name: 'Caption',
        type: 'textarea',
        required: true,
        validation: { maxLength: 2200 }
      },
      {
        id: 'cover_image',
        name: 'Cover Image',
        type: 'media',
        required: false
      },
      {
        id: 'audio_track',
        name: 'Audio Track',
        type: 'text',
        required: false
      },
      {
        id: 'hashtags',
        name: 'Hashtags',
        type: 'multi_select',
        required: false
      }
    ]
  },
  linkedin_post: {
    id: 'linkedin_post',
    name: 'LinkedIn Post',
    category: 'social',
    description: 'Professional LinkedIn post for business networking',
    icon: 'Linkedin',
    platforms: ['LinkedIn'],
    mediaTypes: ['image', 'video', 'document'],
    fields: [
      {
        id: 'content',
        name: 'Post Content',
        type: 'textarea',
        required: true,
        placeholder: 'Share your professional insights...',
        validation: { maxLength: 3000 }
      },
      {
        id: 'media',
        name: 'Media',
        type: 'media',
        required: false
      },
      {
        id: 'hashtags',
        name: 'Hashtags',
        type: 'multi_select',
        required: false
      },
      {
        id: 'mentions',
        name: 'Mentions',
        type: 'multi_select',
        required: false
      },
      {
        id: 'article_link',
        name: 'Article Link',
        type: 'url',
        required: false
      }
    ]
  },
  linkedin_article: {
    id: 'linkedin_article',
    name: 'LinkedIn Article',
    category: 'social',
    description: 'Long-form LinkedIn article for thought leadership',
    icon: 'Linkedin',
    platforms: ['LinkedIn'],
    mediaTypes: ['image'],
    fields: [
      {
        id: 'title',
        name: 'Article Title',
        type: 'text',
        required: true,
        validation: { maxLength: 150 }
      },
      {
        id: 'subtitle',
        name: 'Subtitle',
        type: 'text',
        required: false,
        validation: { maxLength: 200 }
      },
      {
        id: 'content',
        name: 'Article Content',
        type: 'rich_text',
        required: true
      },
      {
        id: 'cover_image',
        name: 'Cover Image',
        type: 'media',
        required: false
      },
      {
        id: 'tags',
        name: 'Tags',
        type: 'multi_select',
        required: false
      }
    ]
  },
  twitter_post: {
    id: 'twitter_post',
    name: 'Twitter Post',
    category: 'social',
    description: 'Single tweet with text and optional media',
    icon: 'Twitter',
    platforms: ['Twitter/X'],
    mediaTypes: ['image', 'video', 'gif'],
    fields: [
      {
        id: 'content',
        name: 'Tweet Content',
        type: 'textarea',
        required: true,
        validation: { maxLength: 280 }
      },
      {
        id: 'media',
        name: 'Media',
        type: 'media',
        required: false
      },
      {
        id: 'hashtags',
        name: 'Hashtags',
        type: 'multi_select',
        required: false
      },
      {
        id: 'mentions',
        name: 'Mentions',
        type: 'multi_select',
        required: false
      },
      {
        id: 'reply_to',
        name: 'Reply To',
        type: 'text',
        required: false
      }
    ]
  },
  twitter_thread: {
    id: 'twitter_thread',
    name: 'Twitter Thread',
    category: 'social',
    description: 'Multi-tweet thread for longer content',
    icon: 'Twitter',
    platforms: ['Twitter/X'],
    mediaTypes: ['image', 'video', 'gif'],
    fields: [
      {
        id: 'thread_content',
        name: 'Thread Content',
        type: 'textarea',
        required: true,
        placeholder: 'Write your thread... Use --- to separate tweets'
      },
      {
        id: 'media',
        name: 'Media',
        type: 'media',
        required: false
      },
      {
        id: 'hashtags',
        name: 'Hashtags',
        type: 'multi_select',
        required: false
      }
    ]
  },
  // Web Content
  blog_post: {
    id: 'blog_post',
    name: 'Blog Post',
    category: 'web',
    description: 'Long-form blog content for website',
    icon: 'FileText',
    mediaTypes: ['image', 'video'],
    fields: [
      {
        id: 'title',
        name: 'Title',
        type: 'text',
        required: true,
        validation: { maxLength: 100 }
      },
      {
        id: 'slug',
        name: 'URL Slug',
        type: 'text',
        required: true
      },
      {
        id: 'excerpt',
        name: 'Excerpt',
        type: 'textarea',
        required: true,
        validation: { maxLength: 300 }
      },
      {
        id: 'content',
        name: 'Content',
        type: 'rich_text',
        required: true
      },
      {
        id: 'featured_image',
        name: 'Featured Image',
        type: 'media',
        required: false
      },
      {
        id: 'category',
        name: 'Category',
        type: 'select',
        required: true,
        options: ['Technology', 'Business', 'Marketing', 'Product', 'Company News']
      },
      {
        id: 'tags',
        name: 'Tags',
        type: 'multi_select',
        required: false
      },
      {
        id: 'meta_description',
        name: 'Meta Description',
        type: 'textarea',
        required: false,
        validation: { maxLength: 160 }
      },
      {
        id: 'publish_date',
        name: 'Publish Date',
        type: 'date',
        required: false
      }
    ]
  },
  website_copy: {
    id: 'website_copy',
    name: 'Website Copy',
    category: 'web',
    description: 'Copy for website pages and sections',
    icon: 'Globe',
    mediaTypes: ['image'],
    fields: [
      {
        id: 'page_title',
        name: 'Page Title',
        type: 'text',
        required: true
      },
      {
        id: 'section',
        name: 'Section',
        type: 'select',
        required: true,
        options: ['Homepage', 'About', 'Products', 'Services', 'Contact', 'Footer', 'Navigation']
      },
      {
        id: 'headline',
        name: 'Headline',
        type: 'text',
        required: true
      },
      {
        id: 'subheadline',
        name: 'Subheadline',
        type: 'text',
        required: false
      },
      {
        id: 'body_copy',
        name: 'Body Copy',
        type: 'rich_text',
        required: true
      },
      {
        id: 'cta_text',
        name: 'Call-to-Action Text',
        type: 'text',
        required: false
      },
      {
        id: 'cta_url',
        name: 'Call-to-Action URL',
        type: 'url',
        required: false
      }
    ]
  },
  landing_page: {
    id: 'landing_page',
    name: 'Landing Page',
    category: 'web',
    description: 'Dedicated landing page content',
    icon: 'Layout',
    mediaTypes: ['image', 'video'],
    fields: [
      {
        id: 'page_title',
        name: 'Page Title',
        type: 'text',
        required: true
      },
      {
        id: 'hero_headline',
        name: 'Hero Headline',
        type: 'text',
        required: true
      },
      {
        id: 'hero_subheadline',
        name: 'Hero Subheadline',
        type: 'text',
        required: true
      },
      {
        id: 'hero_image',
        name: 'Hero Image/Video',
        type: 'media',
        required: false
      },
      {
        id: 'value_proposition',
        name: 'Value Proposition',
        type: 'rich_text',
        required: true
      },
      {
        id: 'features',
        name: 'Features/Benefits',
        type: 'rich_text',
        required: true
      },
      {
        id: 'testimonials',
        name: 'Testimonials',
        type: 'rich_text',
        required: false
      },
      {
        id: 'cta_primary',
        name: 'Primary CTA',
        type: 'text',
        required: true
      },
      {
        id: 'cta_secondary',
        name: 'Secondary CTA',
        type: 'text',
        required: false
      }
    ]
  },
  email_campaign: {
    id: 'email_campaign',
    name: 'Email Campaign',
    category: 'web',
    description: 'Marketing email content',
    icon: 'Mail',
    mediaTypes: ['image'],
    fields: [
      {
        id: 'subject_line',
        name: 'Subject Line',
        type: 'text',
        required: true,
        validation: { maxLength: 50 }
      },
      {
        id: 'preview_text',
        name: 'Preview Text',
        type: 'text',
        required: true,
        validation: { maxLength: 90 }
      },
      {
        id: 'sender_name',
        name: 'Sender Name',
        type: 'text',
        required: true
      },
      {
        id: 'content',
        name: 'Email Content',
        type: 'rich_text',
        required: true
      },
      {
        id: 'cta_text',
        name: 'Call-to-Action',
        type: 'text',
        required: true
      },
      {
        id: 'cta_url',
        name: 'CTA URL',
        type: 'url',
        required: true
      },
      {
        id: 'audience_segment',
        name: 'Audience Segment',
        type: 'select',
        required: true,
        options: ['All Subscribers', 'New Users', 'Active Users', 'Premium Users', 'Inactive Users']
      }
    ]
  },
  // Marketing Materials
  display_ad: {
    id: 'display_ad',
    name: 'Display Ad',
    category: 'marketing',
    description: 'Digital display advertisement',
    icon: 'Monitor',
    mediaTypes: ['image', 'video'],
    fields: [
      {
        id: 'ad_size',
        name: 'Ad Size',
        type: 'select',
        required: true,
        options: ['Banner (728x90)', 'Leaderboard (970x250)', 'Rectangle (300x250)', 'Skyscraper (160x600)', 'Square (250x250)']
      },
      {
        id: 'headline',
        name: 'Headline',
        type: 'text',
        required: true,
        validation: { maxLength: 30 }
      },
      {
        id: 'description',
        name: 'Description',
        type: 'textarea',
        required: true,
        validation: { maxLength: 90 }
      },
      {
        id: 'creative',
        name: 'Creative Asset',
        type: 'media',
        required: true
      },
      {
        id: 'cta_text',
        name: 'Call-to-Action',
        type: 'text',
        required: true
      },
      {
        id: 'landing_url',
        name: 'Landing URL',
        type: 'url',
        required: true
      },
      {
        id: 'target_audience',
        name: 'Target Audience',
        type: 'text',
        required: true
      }
    ]
  },
  video_ad: {
    id: 'video_ad',
    name: 'Video Ad',
    category: 'marketing',
    description: 'Video advertisement for digital platforms',
    icon: 'Video',
    mediaTypes: ['video'],
    fields: [
      {
        id: 'video_file',
        name: 'Video File',
        type: 'media',
        required: true
      },
      {
        id: 'duration',
        name: 'Duration (seconds)',
        type: 'number',
        required: true
      },
      {
        id: 'title',
        name: 'Ad Title',
        type: 'text',
        required: true
      },
      {
        id: 'description',
        name: 'Description',
        type: 'textarea',
        required: true
      },
      {
        id: 'thumbnail',
        name: 'Thumbnail',
        type: 'media',
        required: true
      },
      {
        id: 'cta_text',
        name: 'Call-to-Action',
        type: 'text',
        required: true
      },
      {
        id: 'platform',
        name: 'Platform',
        type: 'select',
        required: true,
        options: ['YouTube', 'Facebook', 'Instagram', 'LinkedIn', 'TikTok', 'Twitter']
      }
    ]
  },
  // Executive Content
  executive_post: {
    id: 'executive_post',
    name: 'Executive Post',
    category: 'executive',
    description: 'Social media post from company executives',
    icon: 'Crown',
    mediaTypes: ['image', 'video'],
    fields: [
      {
        id: 'platform',
        name: 'Platform',
        type: 'select',
        required: true,
        options: ['LinkedIn', 'Twitter', 'Instagram', 'Facebook']
      },
      {
        id: 'executive',
        name: 'Executive',
        type: 'select',
        required: true,
        options: ['CEO', 'CTO', 'CMO', 'COO', 'CFO']
      },
      {
        id: 'content',
        name: 'Post Content',
        type: 'textarea',
        required: true
      },
      {
        id: 'tone',
        name: 'Tone',
        type: 'select',
        required: true,
        options: ['Professional', 'Inspirational', 'Thought Leadership', 'Personal', 'Industry Insights']
      },
      {
        id: 'media',
        name: 'Media',
        type: 'media',
        required: false
      },
      {
        id: 'hashtags',
        name: 'Hashtags',
        type: 'multi_select',
        required: false
      }
    ]
  },
  // Additional content types with basic configurations
  facebook_post: {
    id: 'facebook_post',
    name: 'Facebook Post',
    category: 'social',
    description: 'Facebook feed post',
    icon: 'Facebook',
    platforms: ['Facebook'],
    mediaTypes: ['image', 'video'],
    fields: [
      { id: 'content', name: 'Post Content', type: 'textarea', required: true },
      { id: 'media', name: 'Media', type: 'media', required: false },
      { id: 'hashtags', name: 'Hashtags', type: 'multi_select', required: false }
    ]
  },
  facebook_story: {
    id: 'facebook_story',
    name: 'Facebook Story',
    category: 'social',
    description: 'Facebook story content',
    icon: 'Facebook',
    platforms: ['Facebook'],
    mediaTypes: ['image', 'video'],
    fields: [
      { id: 'media', name: 'Media', type: 'media', required: true },
      { id: 'text_overlay', name: 'Text Overlay', type: 'text', required: false }
    ]
  },
  tiktok_video: {
    id: 'tiktok_video',
    name: 'TikTok Video',
    category: 'social',
    description: 'TikTok short-form video',
    icon: 'Music',
    platforms: ['TikTok'],
    mediaTypes: ['video'],
    fields: [
      { id: 'video', name: 'Video', type: 'media', required: true },
      { id: 'caption', name: 'Caption', type: 'textarea', required: true },
      { id: 'hashtags', name: 'Hashtags', type: 'multi_select', required: false }
    ]
  },
  youtube_video: {
    id: 'youtube_video',
    name: 'YouTube Video',
    category: 'social',
    description: 'YouTube long-form video',
    icon: 'Youtube',
    platforms: ['YouTube'],
    mediaTypes: ['video'],
    fields: [
      { id: 'title', name: 'Title', type: 'text', required: true },
      { id: 'description', name: 'Description', type: 'textarea', required: true },
      { id: 'video', name: 'Video', type: 'media', required: true },
      { id: 'thumbnail', name: 'Thumbnail', type: 'media', required: true }
    ]
  },
  youtube_short: {
    id: 'youtube_short',
    name: 'YouTube Short',
    category: 'social',
    description: 'YouTube short-form video',
    icon: 'Youtube',
    platforms: ['YouTube'],
    mediaTypes: ['video'],
    fields: [
      { id: 'video', name: 'Video', type: 'media', required: true },
      { id: 'title', name: 'Title', type: 'text', required: true }
    ]
  },
  pinterest_pin: {
    id: 'pinterest_pin',
    name: 'Pinterest Pin',
    category: 'social',
    description: 'Pinterest pin content',
    icon: 'Image',
    platforms: ['Pinterest'],
    mediaTypes: ['image'],
    fields: [
      { id: 'image', name: 'Image', type: 'media', required: true },
      { id: 'title', name: 'Title', type: 'text', required: true },
      { id: 'description', name: 'Description', type: 'textarea', required: true }
    ]
  },
  snapchat_story: {
    id: 'snapchat_story',
    name: 'Snapchat Story',
    category: 'social',
    description: 'Snapchat story content',
    icon: 'Camera',
    platforms: ['Snapchat'],
    mediaTypes: ['image', 'video'],
    fields: [
      { id: 'media', name: 'Media', type: 'media', required: true },
      { id: 'text_overlay', name: 'Text Overlay', type: 'text', required: false }
    ]
  },
  newsletter: {
    id: 'newsletter',
    name: 'Newsletter',
    category: 'web',
    description: 'Email newsletter content',
    icon: 'Mail',
    mediaTypes: ['image'],
    fields: [
      { id: 'subject', name: 'Subject', type: 'text', required: true },
      { id: 'content', name: 'Content', type: 'rich_text', required: true }
    ]
  },
  press_release: {
    id: 'press_release',
    name: 'Press Release',
    category: 'web',
    description: 'Official press release',
    icon: 'FileText',
    mediaTypes: ['image'],
    fields: [
      { id: 'headline', name: 'Headline', type: 'text', required: true },
      { id: 'content', name: 'Content', type: 'rich_text', required: true }
    ]
  },
  case_study: {
    id: 'case_study',
    name: 'Case Study',
    category: 'web',
    description: 'Customer case study',
    icon: 'FileText',
    mediaTypes: ['image'],
    fields: [
      { id: 'title', name: 'Title', type: 'text', required: true },
      { id: 'content', name: 'Content', type: 'rich_text', required: true }
    ]
  },
  whitepaper: {
    id: 'whitepaper',
    name: 'Whitepaper',
    category: 'web',
    description: 'Technical whitepaper',
    icon: 'FileText',
    mediaTypes: ['document'],
    fields: [
      { id: 'title', name: 'Title', type: 'text', required: true },
      { id: 'content', name: 'Content', type: 'rich_text', required: true }
    ]
  },
  print_ad: {
    id: 'print_ad',
    name: 'Print Ad',
    category: 'marketing',
    description: 'Print advertisement',
    icon: 'Printer',
    mediaTypes: ['image'],
    fields: [
      { id: 'headline', name: 'Headline', type: 'text', required: true },
      { id: 'creative', name: 'Creative', type: 'media', required: true }
    ]
  },
  brochure: {
    id: 'brochure',
    name: 'Brochure',
    category: 'marketing',
    description: 'Marketing brochure',
    icon: 'BookOpen',
    mediaTypes: ['document'],
    fields: [
      { id: 'title', name: 'Title', type: 'text', required: true },
      { id: 'content', name: 'Content', type: 'rich_text', required: true }
    ]
  },
  infographic: {
    id: 'infographic',
    name: 'Infographic',
    category: 'marketing',
    description: 'Visual infographic',
    icon: 'BarChart',
    mediaTypes: ['graphic'],
    fields: [
      { id: 'title', name: 'Title', type: 'text', required: true },
      { id: 'graphic', name: 'Graphic', type: 'media', required: true }
    ]
  },
  presentation: {
    id: 'presentation',
    name: 'Presentation',
    category: 'marketing',
    description: 'Business presentation',
    icon: 'Presentation',
    mediaTypes: ['document'],
    fields: [
      { id: 'title', name: 'Title', type: 'text', required: true },
      { id: 'slides', name: 'Slides', type: 'media', required: true }
    ]
  },
  executive_statement: {
    id: 'executive_statement',
    name: 'Executive Statement',
    category: 'executive',
    description: 'Official executive statement',
    icon: 'Crown',
    mediaTypes: ['image'],
    fields: [
      { id: 'statement', name: 'Statement', type: 'rich_text', required: true },
      { id: 'executive', name: 'Executive', type: 'select', required: true, options: ['CEO', 'CTO', 'CMO'] }
    ]
  },
  investor_update: {
    id: 'investor_update',
    name: 'Investor Update',
    category: 'executive',
    description: 'Investor communication',
    icon: 'TrendingUp',
    mediaTypes: ['document'],
    fields: [
      { id: 'title', name: 'Title', type: 'text', required: true },
      { id: 'content', name: 'Content', type: 'rich_text', required: true }
    ]
  }
}

export const contentCategories = [
  { id: 'social', name: 'Social Media', icon: 'Share2' },
  { id: 'web', name: 'Web Content', icon: 'Globe' },
  { id: 'marketing', name: 'Marketing Materials', icon: 'Target' },
  { id: 'executive', name: 'Executive Content', icon: 'Crown' }
] as const

export function getContentTypesByCategory(category: string) {
  return Object.values(contentTypeConfigs).filter(config => config.category === category)
}

export function getContentTypeConfig(contentType: ContentType): ContentTypeConfig {
  return contentTypeConfigs[contentType]
}