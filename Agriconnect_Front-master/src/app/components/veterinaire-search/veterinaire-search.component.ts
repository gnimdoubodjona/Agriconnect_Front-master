import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { VeterinaireService, Veterinaire } from '../../services/veterinaire.service';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-veterinaire-search',
  templateUrl: './veterinaire-search.component.html',
  styleUrls: ['./veterinaire-search.component.css']
})
export class VeterinaireSearchComponent implements OnInit {
  searchForm: FormGroup;
  veterinaires: Veterinaire[] = [];
  loading = false;
  error: string | null = null;

  constructor(
    private fb: FormBuilder,
    private veterinaireService: VeterinaireService
  ) {
    this.searchForm = this.fb.group({
      specialisation: [''],
      disponibilite: [null],
      useLocation: [false],
      latitude: [null],
      longitude: [null],
      radius: [10]
    });
  }

  ngOnInit() {
    // Réagir aux changements du formulaire
    this.searchForm.valueChanges.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      switchMap(formValue => {
        this.loading = true;
        this.error = null;
        
        const filters: any = {};
        if (formValue.specialisation) {
          filters.specialisation = formValue.specialisation;
        }
        if (formValue.disponibilite !== null) {
          filters.disponibilite = formValue.disponibilite;
        }
        if (formValue.useLocation && formValue.latitude && formValue.longitude) {
          filters.latitude = formValue.latitude;
          filters.longitude = formValue.longitude;
          filters.radius = formValue.radius;
        }

        return this.veterinaireService.searchVeterinaires(filters);
      })
    ).subscribe({
      next: (results) => {
        this.veterinaires = results;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Une erreur est survenue lors de la recherche.';
        this.loading = false;
        console.error('Erreur de recherche:', err);
      }
    });
  }

  // Utiliser la géolocalisation du navigateur
  useCurrentLocation() {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.searchForm.patchValue({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            useLocation: true
          });
        },
        (error) => {
          console.error('Erreur de géolocalisation:', error);
          this.error = 'Impossible d\'obtenir votre position.';
        }
      );
    } else {
      this.error = 'La géolocalisation n\'est pas supportée par votre navigateur.';
    }
  }
}
