import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const createWorkspace = mutation({
  args: {
    name: v.string(),
    user: v.string(),
  },
  handler: async (ctx, args) => {
    const newWorkspaceId = await ctx.db.insert("workspaces", {
      name: args.name,
      user: args.user,
    });

    return newWorkspaceId;
  },
});

export const getWorkspaces = query({
  args: {
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    const workspaces = await ctx.db
      .query("workspaces")
      .filter((q) => q.eq(q.field("user"), args.userId))
      .collect();

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

export const saveQuestions = mutation({
  args: {
    workspaceId: v.id("workspaces"),
    questions: v.array(
      v.object({
        question: v.string(),
        answer: v.string(),
      })
    ),
  },
  handler: async (ctx, args) => {
    const workspaceId = await ctx.db.patch(args.workspaceId, {
      questions: args.questions,
    });

    return workspaceId;
  },
});
