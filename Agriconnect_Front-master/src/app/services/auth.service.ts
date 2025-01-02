import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { AuthResponse, LoginCredentials, RegisterCredentials, User } from '../models/auth';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  readonly apiUrl = 'http://localhost:8000/api';
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

  private isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }

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
    return this.http.post<AuthResponse>(`${this.apiUrl}/auth/login/`, credentials).pipe(
      tap(response => {
        this.currentUserSubject.next(response.user);
        this.setLocalStorage('currentUser', JSON.stringify(response.user));
        this.setLocalStorage('token', response.token);
        if (!response.user.profile_completed) {
          this.showProfileCompletionSubject.next(true);
        }
      })
    );
  }

  register(credentials: RegisterCredentials): Observable<AuthResponse> {
    const registrationData = {
      first_name: credentials.firstName,
      last_name: credentials.lastName,
      email: credentials.email,
      password: credentials.password,
      confirm_password: credentials.confirmPassword,
      profession: credentials.profession,
      location: credentials.location,
      role: credentials.role.toLowerCase()
    };

    return this.http.post<AuthResponse>(`${this.apiUrl}/auth/register/`, registrationData).pipe(
      tap(response => {
        this.currentUserSubject.next(response.user);
        this.setLocalStorage('currentUser', JSON.stringify(response.user));
        this.setLocalStorage('token', response.token);
        this.showProfileCompletionSubject.next(true);
      })
    );
  }

  logout(): void {
    this.currentUserSubject.next(null);
    this.showProfileCompletionSubject.next(false);
    this.removeLocalStorage('currentUser');
    this.removeLocalStorage('token');
  }

  updateProfile(profileData: FormData): Observable<User> {
    const token = this.getToken();
    return this.http.patch<User>(
      `${this.apiUrl}/auth/profile/`, 
      profileData,
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    ).pipe(
      tap(user => {
        this.currentUserSubject.next(user);
        this.setLocalStorage('currentUser', JSON.stringify(user));
        if (user.profile_completed) {
          this.showProfileCompletionSubject.next(false);
        }
      })
    );
  }

  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/auth/users/`);
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  getToken(): string | null {
    return this.getLocalStorage('token');
  }

  isAuthenticated(): boolean {
    return !!this.getCurrentUser() && !!this.getToken();
  }

  public showProfileCompletion(): void {
    this.showProfileCompletionSubject.next(true);
  }

  public hideProfileCompletion(): void {
    this.showProfileCompletionSubject.next(false);
  }

  public toggleProfileCompletion(): void {
    const currentValue = this.showProfileCompletionSubject.value;
    this.showProfileCompletionSubject.next(!currentValue);
  }

  closeProfileCompletion(): void {
    const currentUser = this.getCurrentUser();
    if (currentUser?.profile_completed) {
      this.hideProfileCompletion();
    }
  }
}
