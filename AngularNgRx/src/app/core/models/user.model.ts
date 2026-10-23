export type UserRole = 'admin'|'customer'|'captain';

export interface User {
  id:string,
  name:string,
  email: string,
  role: UserRole
}

export interface AuthResponse {
  message: string;
  token: string;
  user: User
}