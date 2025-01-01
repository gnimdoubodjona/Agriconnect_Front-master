import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { VeterinaireService } from '../../services/veterinaire.service';

@Component({
  selector: 'app-veterinaire-profile',
  templateUrl: './veterinaire-profile.component.html',
  styleUrls: ['./veterinaire-profile.component.css']
})
export class VeterinaireProfileComponent implements OnInit {
  profileForm!: FormGroup;  
  specialisations = [
    'Animaux de compagnie',
    'Animaux de ferme',
    'Chevaux',
    'Oiseaux',
    'Animaux exotiques'
  ];

  constructor(
    private fb: FormBuilder,
    private veterinaireService: VeterinaireService,
    private router: Router
  ) {}

  ngOnInit() {
    this.initForm();
    this.getCurrentLocation();
  }

  private initForm() {
    this.profileForm = this.fb.group({
      specialisation: ['', Validators.required],
      adresse: ['', Validators.required],
      latitude: [null],
      longitude: [null],
      experience: ['', [Validators.required, Validators.min(0)]],
      qualifications: ['', Validators.required],
      disponibilites: this.fb.group({
        lundi: [false],
        mardi: [false],
        mercredi: [false],
        jeudi: [false],
        vendredi: [false],
        samedi: [false],
        dimanche: [false]
      })
    });
  }

  getCurrentLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.profileForm.patchValue({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        });
      });
    }
  }

  onSubmit() {
    if (this.profileForm.valid) {
      this.veterinaireService.updateProfile(this.profileForm.value).subscribe({
        next: () => {
          this.router.navigate(['/dashboard']);
        },
        error: (error) => {
          console.error('Erreur lors de la mise à jour du profil:', error);
        }
      });
    }
  }
}
