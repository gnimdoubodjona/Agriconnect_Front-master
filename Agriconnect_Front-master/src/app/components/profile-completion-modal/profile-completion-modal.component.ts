// profile-completion-modal.component.ts
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProfileService } from '../../services/profile.service';
import { AuthService } from '../../services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-profile-completion-modal',
  templateUrl: './profile-completion-modal.component.html',
  styleUrls: ['./profile-completion-modal.component.scss']
})
export class ProfileCompletionModalComponent implements OnInit {
  formData = {
    location: '',
    phoneNumber: '',
    profilePhoto: null as File | null
  };

  constructor(
    private profileService: ProfileService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    // Initialisation si nécessaire
  }

  getProgressPercentage(): number {
    let progress = 0;
    const totalFields = 3; // location, phone, photo
    
    if (this.formData.location) progress++;
    if (this.formData.phoneNumber) progress++;
    if (this.formData.profilePhoto) progress++;
    
    return (progress / totalFields) * 100;
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      if (file.type.match(/image\/*/) && file.size <= 5000000) { // 5MB max
        this.formData.profilePhoto = file;
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Fichier non valide',
          text: 'Veuillez sélectionner une image de moins de 5MB'
        });
      }
    }
  }

  removePhoto() {
    this.formData.profilePhoto = null;
  }

  closeModal() {
    // Vérifier si les champs requis sont remplis
    if (!this.formData.location || !this.formData.phoneNumber) {
      Swal.fire({
        icon: 'warning',
        title: 'Action non autorisée',
        text: 'Veuillez compléter votre profil avant de continuer.',
        showConfirmButton: true
      });
      return;
    }
    this.authService.closeProfileCompletion();
  }

  submitProfile() {
    if (!this.formData.location || !this.formData.phoneNumber) {
      Swal.fire({
        icon: 'error',
        title: 'Champs manquants',
        text: 'Veuillez remplir tous les champs requis'
      });
      return;
    }

    console.log('Token avant envoi:', localStorage.getItem('token')); // Débogage

    // Gérer la photo de profil séparément si elle existe
    if (this.formData.profilePhoto) {
      this.profileService.uploadProfilePhoto(this.formData.profilePhoto).subscribe({
        next: () => console.log('Photo uploadée avec succès'),
        error: (error) => console.error('Erreur upload photo:', error)
      });
    }
    
    // N'envoyer que les champs qui existent dans le modèle Django
    const profileData = {
      location: this.formData.location,
      phone_number: this.formData.phoneNumber
    };

    console.log('Données envoyées:', profileData); // Débogage

    this.profileService.updateProfile(profileData).subscribe({
      next: (response) => {
        console.log('Profil mis à jour avec succès:', response);
        this.closeModal();
        const username = this.authService.getCurrentUser()?.username || 'utilisateur';
        
        Swal.fire({
          icon: 'success',
          title: 'Profil configuré avec succès !',
          text: `Bienvenue ${username} !`,
          showConfirmButton: false,
          timer: 2000
        }).then(() => {
          this.router.navigate(['/dashboard']);
        });
      },
      error: (error) => {
        console.error('Erreur détaillée:', error);
        Swal.fire({
          icon: 'error',
          title: 'Erreur',
          text: error.error?.detail || error.error?.error || 'Une erreur est survenue lors de la mise à jour du profil'
        });
      }
    });
  }
}