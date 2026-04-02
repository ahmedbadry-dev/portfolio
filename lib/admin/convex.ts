import { anyApi } from "convex/server"
import type { CanonicalProjectInputValidated } from "@/lib/projects/validation"
import {
  getConvexAdminMutationKey,
  getConvexServerClient,
} from "@/lib/convex/serverClient"

function getClient() {
  return getConvexServerClient()
}

export async function listAdminProjectsFromConvex() {
  const client = getClient()
  return client.query(anyApi.projects.listAdmin, {})
}

export async function createProjectInConvex(project: CanonicalProjectInputValidated) {
  const client = getClient()
  return client.mutation(anyApi.projects.create, {
    adminKey: getConvexAdminMutationKey(),
    project,
  })
}

export async function updateProjectInConvex(
  id: string,
  project: CanonicalProjectInputValidated
) {
  const client = getClient()
  return client.mutation(anyApi.projects.update, {
    adminKey: getConvexAdminMutationKey(),
    id,
    project,
  })
}

export async function removeProjectInConvex(id: string) {
  const client = getClient()
  return client.mutation(anyApi.projects.remove, {
    adminKey: getConvexAdminMutationKey(),
    id,
  })
}

export async function listAdminSubmissionsFromConvex() {
  const client = getClient()
  return client.query(anyApi.contactSubmissions.list, {
    adminKey: getConvexAdminMutationKey(),
  })
}

export async function markSubmissionReadInConvex(id: string) {
  const client = getClient()
  return client.mutation(anyApi.contactSubmissions.markRead, {
    adminKey: getConvexAdminMutationKey(),
    id,
  })
}

export async function removeSubmissionInConvex(id: string) {
  const client = getClient()
  return client.mutation(anyApi.contactSubmissions.remove, {
    adminKey: getConvexAdminMutationKey(),
    id,
  })
}
