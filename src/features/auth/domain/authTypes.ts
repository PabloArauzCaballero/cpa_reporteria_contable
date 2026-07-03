export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthenticatedUser {
  token: string;
  userName: string;
  userEmail: string;
}
