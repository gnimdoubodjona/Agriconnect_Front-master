export interface LoginCredentials {
  username: string;
  password: string;
}

export enum UserRole {
  Agriculteur = 'agriculteur',
  Eleveur = 'eleveur',
  Prestataire = 'prestataire',
  Veterinaire = 'veterinaire',
}

export interface RegisterCredentials extends LoginCredentials {
  role: UserRole;
}

export interface User {
  id: number;
  username: string;
  email: string;
  role: string;
  profile_completed?: boolean;
}

export interface AuthResponse {
  user: User;
  token: string;
}
