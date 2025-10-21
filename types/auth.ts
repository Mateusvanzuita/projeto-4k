export type UserRole = "coach" | "aluno"

export interface User {
  id: string
  email: string
  name: string
  role: UserRole
  avatar?: string
}

export interface LoginResponse {
  accessToken: string
  refreshToken: string
  user: User
}

export interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
}
