import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const createWorkspace = mutation({
  args: {
    name: v.string(),
  },
  handler: async (ctx, args) => {
    const newWorkspaceId = await ctx.db.insert("workspaces", {
      name: args.name,
    });
    return newWorkspaceId;
  },
});

export const getWorkspaces = query({
  handler: async (ctx) => {
    const workspaces = await ctx.db.query("workspaces").collect();

    return workspaces;
  },
});

export const getWorkspace = query({
  args: {
    id: v.id("workspaces"),
  },
  handler: async (ctx, args) => {
    const workspace = await ctx.db.get(args.id);
    return workspace;
  },
});
