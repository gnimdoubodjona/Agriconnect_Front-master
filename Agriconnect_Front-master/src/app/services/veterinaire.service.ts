import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
//import { environment } from '../../environments/environment';

export interface Veterinaire {
  id: number;
  utilisateur: {
    username: string;
  };
  specialisation: string;
  disponibilite: boolean;
  latitude: number;
  longitude: number;
  adresse: string;
  qualifications: string;
  experience: number;
  distance?: number;
}

@Injectable({
  providedIn: 'root'
})
export class VeterinaireService {
  private apiUrl = 'http://localhost:8000/api/veterinaires';

  constructor(private http: HttpClient) { }

  // Recherche par localisation
  searchByLocation(latitude: number, longitude: number, radius: number): Observable<Veterinaire[]> {
    const params = new HttpParams()
      .set('latitude', latitude.toString())
      .set('longitude', longitude.toString())
      .set('radius', radius.toString());

    return this.http.get<Veterinaire[]>(`${this.apiUrl}/search_by_location/`, { params });
  }

  // Recherche par spécialisation
  searchBySpecialisation(specialisation: string): Observable<Veterinaire[]> {
    const params = new HttpParams()
      .set('specialisation', specialisation);

    return this.http.get<Veterinaire[]>(`${this.apiUrl}/search_by_specialisation/`, { params });
  }

  // Recherche combinée (disponibilité, localisation, spécialisation)
  searchVeterinaires(filters: {
    disponibilite?: boolean;
    latitude?: number;
    longitude?: number;
    radius?: number;
    specialisation?: string;
  }): Observable<Veterinaire[]> {
    let params = new HttpParams();

    if (filters.disponibilite !== undefined) {
      params = params.set('disponibilite', filters.disponibilite.toString());
    }
    if (filters.specialisation) {
      params = params.set('specialisation', filters.specialisation);
    }
    if (filters.latitude && filters.longitude) {
      params = params.set('latitude', filters.latitude.toString())
        .set('longitude', filters.longitude.toString())
        .set('radius', (filters.radius || 10).toString());
      return this.http.get<Veterinaire[]>(`${this.apiUrl}/search_by_location/`, { params });
    }

    return this.http.get<Veterinaire[]>(`${this.apiUrl}/`, { params });
  }

  // Vérifier si le profil est complété
  checkProfileCompletion(): Observable<boolean> {
    return this.http.get<boolean>(`${this.apiUrl}/profile/check-completion/`);
  }

  // Nouvelle méthode pour mettre à jour le profil
  updateProfile(profileData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/profile/`, profileData);
  }
}
