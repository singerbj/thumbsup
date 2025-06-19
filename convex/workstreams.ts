import { query, mutation } from "./_generated/server"
import { v } from "convex/values"

export const list = query({
  args: { organizationId: v.id("organizations") },
  handler: async (ctx, args) => {
    const workstreams = await ctx.db
      .query("workstreams")
      .withIndex("by_organization", (q) => q.eq("organizationId", args.organizationId))
      .collect()

    // Get project counts for each workstream
    const workstreamsWithCounts = await Promise.all(
      workstreams.map(async (workstream) => {
        const projects = await ctx.db
          .query("projects")
          .withIndex("by_workstream", (q) => q.eq("workstreamId", workstream._id))
          .collect()

        return {
          ...workstream,
          projectCount: projects.length,
        }
      }),
    )

    return workstreamsWithCounts
  },
})

export const create = mutation({
  args: {
    name: v.string(),
    description: v.string(),
    organizationId: v.id("organizations"),
    createdBy: v.id("users"),
  },
  handler: async (ctx, args) => {
    const workstreamId = await ctx.db.insert("workstreams", {
      name: args.name,
      description: args.description,
      status: "active",
      organizationId: args.organizationId,
      createdBy: args.createdBy,
      progress: 0,
    })
    return workstreamId
  },
})

export const get = query({
  args: { id: v.id("workstreams") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id)
  },
})
