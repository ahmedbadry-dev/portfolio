import { mutationGeneric, queryGeneric } from "convex/server"
import { v } from "convex/values"

const query = queryGeneric
const mutation = mutationGeneric

function requireAdminKey(adminKey: string): void {
  const expected = process.env.CONVEX_ADMIN_MUTATION_KEY
  if (!expected) {
    throw new Error("CONVEX_ADMIN_MUTATION_KEY is not configured.")
  }
  if (adminKey !== expected) {
    throw new Error("Unauthorized contact submission mutation.")
  }
}

export const list = query({
  args: { adminKey: v.string() },
  handler: async (ctx, args) => {
    requireAdminKey(args.adminKey)
    return await ctx.db
      .query("contactSubmissions")
      .withIndex("by_created")
      .order("desc")
      .take(100)
  },
})

export const create = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    message: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("contactSubmissions", {
      ...args,
      createdAt: Date.now(),
      read: false,
    })
  },
})

export const markRead = mutation({
  args: { adminKey: v.string(), id: v.id("contactSubmissions") },
  handler: async (ctx, { adminKey, id }) => {
    requireAdminKey(adminKey)
    await ctx.db.patch(id, { read: true })
  },
})

export const remove = mutation({
  args: { adminKey: v.string(), id: v.id("contactSubmissions") },
  handler: async (ctx, { adminKey, id }) => {
    requireAdminKey(adminKey)
    await ctx.db.delete(id)
  },
})
