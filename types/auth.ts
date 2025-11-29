export type UserRole = "coach" | "aluno"

export interface User {
  id: string
  email: string
  name: string
  role: string // "USER" or "ADMIN" from backend
  userType: "COACH" | "STUDENT" // Backend uses userType, not role
  avatar?: string
  createdAt?: string
}

export interface LoginResponse {
  token: string // Backend returns single "token" field, not accessToken/refreshToken
  user: User
}

export interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
}

export interface RegisterData {
  email: string
  password: string
  name: string
  userType: "COACH" | "STUDENT"
}
