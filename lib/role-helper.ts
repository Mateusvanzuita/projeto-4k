import type { User } from "@/types/auth"

/**
 * Helper functions to work with user roles
 */

export function isCoach(user: User | null): boolean {
  return user?.userType === "COACH"
}

export function isStudent(user: User | null): boolean {
  return user?.userType === "STUDENT"
}

export function isAdmin(user: User | null): boolean {
  return user?.role === "ADMIN"
}

export function getUserDisplayRole(user: User | null): string {
  if (!user) return "Visitante"
  if (user.userType === "COACH") return "Coach"
  if (user.userType === "STUDENT") return "Aluno"
  return "Usuário"
}
