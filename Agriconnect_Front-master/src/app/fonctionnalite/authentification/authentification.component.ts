import { Component, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { UserRole, LoginCredentials, RegisterCredentials } from '../../models/auth';
import Swal from 'sweetalert2';

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
      this.authService.login(this.credentials).subscribe({
        next: (response) => {
          console.log('Connexion réussie:', response);
          if (response.user.role === UserRole.Veterinaire && !response.user.profile_completed) {
            // Si c'est un vétérinaire, rediriger vers le formulaire complet
            this.router.navigate(['/veterinaire-profile']);
          } else {
            // Pour les autres rôles ou profils déjà complétés
            this.router.navigate(['/dashboard']);
          }
        },
        error: (error) => {
          console.error('Erreur de connexion:', error);
          this.error = error.error?.detail || 'Une erreur est survenue lors de la connexion';
        }
      });
    } else {
      this.authService.register(this.credentials).subscribe({
        next: (response) => {
          console.log('Inscription réussie:', response);
          if (response.user.role === UserRole.Veterinaire) {
            // Pour les vétérinaires, rediriger vers le formulaire complet
            Swal.fire({
              icon: 'success',
              title: 'Inscription réussie!',
              text: 'Veuillez compléter votre profil de vétérinaire.',
              showConfirmButton: false,
              timer: 2000
            }).then(() => {
              this.router.navigate(['/veterinaire-profile']);
            });
          } else {
            // Pour les autres rôles, afficher le modal simple
            this.authService.showProfileCompletion();
            // Ne pas rediriger tant que le profil n'est pas complété
          }
        },
        error: (error) => {
          console.error('Erreur d\'inscription:', error);
          this.error = error.error?.detail || 'Une erreur est survenue lors de l\'inscription';
        }
      });
    }
  }
}
