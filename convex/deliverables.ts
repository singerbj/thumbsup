import { query, mutation } from "./_generated/server"
import { v } from "convex/values"

export const list = query({
  args: { projectId: v.id("projects") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("deliverables")
      .withIndex("by_project", (q) => q.eq("projectId", args.projectId))
      .collect()
  },
})

export const create = mutation({
  args: {
    name: v.string(),
    type: v.union(
      v.literal("instagram_post"),
      v.literal("instagram_story"),
      v.literal("linkedin_post"),
      v.literal("twitter_post"),
      v.literal("facebook_post"),
      v.literal("executive_post"),
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
  },
  handler: async (ctx, args) => {
    const deliverableId = await ctx.db.insert("deliverables", {
      name: args.name,
      type: args.type,
      status: "draft",
      content: args.content,
      projectId: args.projectId,
      assigneeId: args.assigneeId,
      dueDate: args.dueDate,
    })
    return deliverableId
  },
})

export const get = query({
  args: { id: v.id("deliverables") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id)
  },
})
