export interface LoginCredentials {
  email: string;
  password: string;
}

export enum UserRole {
  Agriculteur = 'agriculteur',
  Eleveur = 'eleveur',
  Prestataire = 'prestataire',
  Veterinaire = 'veterinaire',
}

export interface RegisterCredentials {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  profession: string;
  location: string;
  role: string;
}

export interface ProfileCompletion {
  profilePicture?: File;
  phoneNumber: string;
  availability: string;
}

export interface User {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  profession: string;
  location: string;
  profile_photo?: string;
  phone_number?: string;
  availability?: string;
  profile_completed: boolean;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface ProfileUpdateResponse {
  id: number;
  profile_photo?: string;
  phone_number?: string;
  availability?: string;
  profile_completed: boolean;
}
