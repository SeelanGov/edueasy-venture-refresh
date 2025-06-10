
export interface ApiError {
  message: string;
  code?: string;
  status?: number;
}

export interface AuthResponse {
  user: any | null;
  session: any | null;
  error?: string | null;
}
