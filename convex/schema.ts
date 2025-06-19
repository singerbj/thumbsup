import { defineSchema, defineTable } from "convex/server"
import { v } from "convex/values"

export default defineSchema({
  users: defineTable({
    name: v.string(),
    email: v.string(),
    avatar: v.optional(v.string()),
    role: v.string(),
    organizationId: v.id("organizations"),
  }).index("by_email", ["email"]),

  organizations: defineTable({
    name: v.string(),
    slug: v.string(),
  }).index("by_slug", ["slug"]),

  workstreams: defineTable({
    name: v.string(),
    description: v.string(),
    status: v.union(v.literal("active"), v.literal("inactive"), v.literal("completed")),
    organizationId: v.id("organizations"),
    createdBy: v.id("users"),
    progress: v.optional(v.number()),
  }).index("by_organization", ["organizationId"]),

  projects: defineTable({
    name: v.string(),
    description: v.string(),
    status: v.union(v.literal("active"), v.literal("inactive"), v.literal("completed")),
    workstreamId: v.id("workstreams"),
    createdBy: v.id("users"),
    progress: v.optional(v.number()),
  }).index("by_workstream", ["workstreamId"]),

  deliverables: defineTable({
    name: v.string(),
    type: v.union(
      v.literal("instagram_post"),
      v.literal("instagram_story"),
      v.literal("linkedin_post"),
      v.literal("twitter_post"),
      v.literal("facebook_post"),
      v.literal("executive_post"),
    ),
    status: v.union(
      v.literal("draft"),
      v.literal("pending-approval"),
      v.literal("in-review"),
      v.literal("approved"),
      v.literal("rejected"),
      v.literal("published"),
    ),
    content: v.object({
      text: v.string(),
      hashtags: v.array(v.string()),
      mentions: v.array(v.string()),
      scheduledDate: v.optional(v.string()),
    }),
    projectId: v.id("projects"),
    assigneeId: v.id("users"),
    dueDate: v.optional(v.string()),
  }).index("by_project", ["projectId"]),

  approvals: defineTable({
    deliverableId: v.id("deliverables"),
    userId: v.id("users"),
    status: v.union(v.literal("pending"), v.literal("approved"), v.literal("rejected")),
    comment: v.optional(v.string()),
    order: v.number(),
    required: v.boolean(),
  }).index("by_deliverable", ["deliverableId"]),

  approvalRules: defineTable({
    name: v.string(),
    description: v.string(),
    active: v.boolean(),
    organizationId: v.id("organizations"),
    conditions: v.array(
      v.object({
        field: v.string(),
        operator: v.string(),
        value: v.string(),
      }),
    ),
    approvers: v.array(
      v.object({
        role: v.string(),
        required: v.boolean(),
        order: v.number(),
      }),
    ),
    settings: v.object({
      parallel_approval: v.boolean(),
      escalation_days: v.number(),
    }),
  }).index("by_organization", ["organizationId"]),
})
