import { query, mutation } from "./_generated/server"
import { v } from "convex/values"

export const list = query({
  args: { organizationId: v.id("organizations") },
  handler: async (ctx, args) => {
    // Get all workstreams for the organization
    const workstreams = await ctx.db
      .query("workstreams")
      .withIndex("by_organization", (q) => q.eq("organizationId", args.organizationId))
      .collect()

    // Get all projects for these workstreams
    const allProjects = []
    for (const workstream of workstreams) {
      const projects = await ctx.db
        .query("projects")
        .withIndex("by_workstream", (q) => q.eq("workstreamId", workstream._id))
        .collect()

      // Add workstream info to each project
      const projectsWithWorkstream = projects.map((project) => ({
        ...project,
        workstream: {
          id: workstream._id,
          name: workstream.name,
        },
      }))

      allProjects.push(...projectsWithWorkstream)
    }

    // Get deliverable counts for each project
    const projectsWithCounts = await Promise.all(
      allProjects.map(async (project) => {
        const deliverables = await ctx.db
          .query("deliverables")
          .withIndex("by_project", (q) => q.eq("projectId", project._id))
          .collect()

        return {
          ...project,
          deliverableCount: deliverables.length,
        }
      }),
    )

    return projectsWithCounts
  },
})

export const create = mutation({
  args: {
    name: v.string(),
    description: v.string(),
    workstreamId: v.id("workstreams"),
    createdBy: v.id("users"),
  },
  handler: async (ctx, args) => {
    const projectId = await ctx.db.insert("projects", {
      name: args.name,
      description: args.description,
      status: "active",
      workstreamId: args.workstreamId,
      createdBy: args.createdBy,
      progress: 0,
    })
    return projectId
  },
})

export const getByWorkstream = query({
  args: { workstreamId: v.id("workstreams") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("projects")
      .withIndex("by_workstream", (q) => q.eq("workstreamId", args.workstreamId))
      .collect()
  },
})
