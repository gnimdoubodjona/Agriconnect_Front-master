// profile-completion-modal.component.ts
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-profile-completion-modal',
  templateUrl: './profile-completion-modal.component.html',
  styleUrls: ['./profile-completion-modal.component.scss']
})
export class ProfileCompletionModalComponent implements OnInit {
  formData = {
    profile_photo: null as File | null,
    phone_number: '',
    availability: ''
  };

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    const currentUser = this.authService.getCurrentUser();
    if (currentUser?.profile_completed) {
      this.authService.hideProfileCompletion();
    }
  }

  getProgressPercentage(): number {
    let progress = 0;
    const totalFields = 3; // photo, phone, availability
    
    if (this.formData.profile_photo) progress++;
    if (this.formData.phone_number) progress++;
    if (this.formData.availability) progress++;
    
    return (progress / totalFields) * 100;
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      if (file.type.match(/image\/*/) && file.size <= 5000000) { // 5MB max
        this.formData.profile_photo = file;
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Fichier non valide',
          text: 'Veuillez sélectionner une image de moins de 5MB'
        });
      }
    }
  }

  onSubmit() {
    if (this.getProgressPercentage() < 100) {
      Swal.fire({
        icon: 'warning',
        title: 'Formulaire incomplet',
        text: 'Veuillez remplir tous les champs requis'
      });
      return;
    }

    const formData = new FormData();
    if (this.formData.profile_photo) {
      formData.append('profile_photo', this.formData.profile_photo);
    }
    formData.append('phone_number', this.formData.phone_number);
    formData.append('availability', this.formData.availability);
    formData.append('profile_completed', 'true');

    this.authService.updateProfile(formData).subscribe({
      next: (user) => {
        Swal.fire({
          icon: 'success',
          title: 'Profil mis à jour',
          text: 'Votre profil a été complété avec succès!'
        }).then(() => {
          this.authService.hideProfileCompletion();
          this.router.navigate(['/dashboard']);
        });
      },
      error: (error) => {
        console.error('Erreur lors de la mise à jour du profil:', error);
        let errorMessage = 'Une erreur est survenue lors de la mise à jour du profil';
        
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
          title: 'Erreur',
          text: errorMessage,
          html: errorMessage.replace(/\n/g, '<br>')
        });
      }
    });
  }

  onCancel() {
    Swal.fire({
      title: 'Êtes-vous sûr?',
      text: 'Vous pourrez compléter votre profil plus tard',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Oui, plus tard',
      cancelButtonText: 'Non, continuer'
    }).then((result) => {
      if (result.isConfirmed) {
        this.authService.hideProfileCompletion();
      }
    });
  }
}