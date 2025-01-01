import { Component, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { UserRole, LoginCredentials, RegisterCredentials } from '../../models/auth';

@Component({
  selector: 'app-authentification',
  templateUrl: './authentification.component.html',
  styleUrls: ['./authentification.component.css']
})
export class AuthentificationComponent {
  
  @ViewChild('authForm') authForm!: NgForm;
  

  
  isLoginMode = true;
  error = '';
  passwordVisible = false;
  credentials: RegisterCredentials = {
    username: '',
    password: '',
    role: UserRole.Veterinaire
  };

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  get showProfileCompletion$() {
    return this.authService.showProfileCompletion$;
  }
  

  toggleMode(): void {
    this.isLoginMode = !this.isLoginMode;
    this.error = '';
  }

  togglePasswordVisibility(): void {
    this.passwordVisible = !this.passwordVisible;
  }

  onSubmit(): void {
    if (!this.authForm.valid) {
      return;
    }

    if (this.isLoginMode) {
      const loginCredentials: LoginCredentials = {
        username: this.credentials.username,
        password: this.credentials.password
      };
      
      this.authService.login(loginCredentials).subscribe({
        next: () => {
          this.router.navigate(['/dashboard']);
        },
        error: (error) => {
          this.error = error.message || 'Une erreur est survenue lors de la connexion';
        }
      });
    } else {
      // Préparer les données d'inscription
      const registerData = {
        username: this.credentials.username,
        password: this.credentials.password,
        role: UserRole.Veterinaire  // Utiliser l'énumération au lieu d'une chaîne
      };

      this.authService.register(registerData).subscribe({
        next: (response) => {
          console.log('Inscription réussie:', response);
          // Stocke le token
          localStorage.setItem('token', response.token);
          // Rediriger vers la création du profil vétérinaire
          this.router.navigate(['/veterinaire-profile']);
        },
        error: (error) => {
          console.error('Erreur d\'inscription:', error);
          this.error = error.error?.error || 'Une erreur est survenue lors de l\'inscription';
        }
      });
    }
  }
}
