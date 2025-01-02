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
  confirmPasswordVisible = false;

  loginCredentials: LoginCredentials = {
    email: '',
    password: ''
  };

  registerCredentials: RegisterCredentials = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    profession: '',
    location: '',
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

  toggleConfirmPasswordVisibility(): void {
    this.confirmPasswordVisible = !this.confirmPasswordVisible;
  }

  validatePasswords(): boolean {
    if (!this.isLoginMode) {
      return this.registerCredentials.password === this.registerCredentials.confirmPassword;
    }
    return true;
  }

  onSubmit(): void {
    if (!this.authForm.valid) return;

    if (this.isLoginMode) {
      this.authService.login(this.loginCredentials).subscribe({
        next: () => {
          this.router.navigate(['/dashboard']);
        },
        error: (error) => {
          console.error('Erreur de connexion:', error);
          Swal.fire({
            icon: 'error',
            title: 'Erreur de connexion',
            text: 'Email ou mot de passe incorrect'
          });
        }
      });
    } else {
      this.authService.register(this.registerCredentials).subscribe({
        next: () => {
          // Afficher d'abord le modal
          this.authService.showProfileCompletion();
          
          // Puis afficher l'alerte qui se fermera automatiquement
          Swal.fire({
            icon: 'success',
            title: 'Inscription réussie',
            text: 'Veuillez compléter votre profil',
            timer: 1500, // L'alerte se fermera automatiquement après 1.5 secondes
            showConfirmButton: false
          });
        },
        error: (error) => {
          console.error('Erreur d\'inscription:', error);
          let errorMessage = 'Une erreur est survenue lors de l\'inscription.';
          
          if (error.error) {
            if (typeof error.error === 'object') {
              const errors = [];
              for (const [key, value] of Object.entries(error.error)) {
                errors.push(`${key}: ${value}`);
              }
              errorMessage = errors.join('\n');
            } else if (typeof error.error === 'string') {
              errorMessage = error.error;
            }
          }

          Swal.fire({
            icon: 'error',
            title: 'Erreur d\'inscription',
            text: errorMessage
          });
        }
      });
    }
  }

  // Debug method to list all users
  listUsers(): void {
    this.authService.getAllUsers().subscribe({
      next: (users) => {
        console.log('Liste des utilisateurs:', users);
      },
      error: (error) => {
        console.error('Erreur lors de la récupération des utilisateurs:', error);
      }
    });
  }
}
