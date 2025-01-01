import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { AuthResponse, LoginCredentials, RegisterCredentials, User } from '../models/auth';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8000/api';
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  currentUser$ = this.currentUserSubject.asObservable();
  private showProfileCompletionSubject = new BehaviorSubject<boolean>(false);
  showProfileCompletion$ = this.showProfileCompletionSubject.asObservable();

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    if (isPlatformBrowser(this.platformId)) {
      const savedUser = this.getLocalStorage('currentUser');
      if (savedUser) {
        try {
          const parsedUser = JSON.parse(savedUser);
          this.currentUserSubject.next(parsedUser);
        } catch (error) {
          console.error('Error parsing saved user:', error);
          this.removeLocalStorage('currentUser');
        }
      }
    }
  }

  // Méthode utilitaire pour vérifier si nous sommes dans un navigateur
  private isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }

  // Méthode sécurisée pour accéder au localStorage
  private setLocalStorage(key: string, value: string): void {
    if (this.isBrowser()) {
      localStorage.setItem(key, value);
    }
  }

  private getLocalStorage(key: string): string | null {
    if (this.isBrowser()) {
      return localStorage.getItem(key);
    }
    return null;
  }

  private removeLocalStorage(key: string): void {
    if (this.isBrowser()) {
      localStorage.removeItem(key);
    }
  }

  login(credentials: LoginCredentials): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login/`, credentials).pipe(
      tap(response => {
        console.log('Login response:', response); // Debug
        if (response.token) {
          this.setLocalStorage('token', response.token);
          this.setLocalStorage('currentUser', JSON.stringify(response.user));
          this.currentUserSubject.next(response.user);
        }
      })
    );
  }

  register(credentials: RegisterCredentials): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register/`, credentials).pipe(
      tap(response => {
        console.log('Register response:', response); // Debug
        if (response.token) {
          this.setLocalStorage('token', response.token);
          this.setLocalStorage('currentUser', JSON.stringify(response.user));
          this.currentUserSubject.next(response.user);
          this.showProfileCompletionSubject.next(true);
        }
      })
    );
  }

  logout(): void {
    this.removeLocalStorage('token');
    this.removeLocalStorage('currentUser');
    this.currentUserSubject.next(null);
  }

  getToken(): string | null {
    return this.getLocalStorage('token');
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    return !!token;
  }

  closeProfileCompletion() {
    this.showProfileCompletionSubject.next(false);
  }
}
