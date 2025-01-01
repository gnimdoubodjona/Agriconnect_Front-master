import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private apiUrl = 'http://localhost:8000/api';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  private getHeaders() {
    const token = this.authService.getToken();
    console.log('Current token:', token); // Debug
    if (!token) {
      console.error('No token found!');
      return new HttpHeaders();
    }
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  updateProfile(profileData: any) {
    const headers = this.getHeaders();
    console.log('Headers for update:', headers); // Debug
    console.log('Profile data:', profileData); // Debug
    
    return this.http.patch<any>(
      `${this.apiUrl}/update-profile/`, 
      profileData,
      { headers }
    ).pipe(
      tap(
        response => console.log('Update success:', response),
        error => console.error('Update error:', error)
      )
    );
  }

  uploadProfilePhoto(photo: File) {
    const headers = this.getHeaders();
    console.log('Headers for photo upload:', headers); // Debug
    
    const formData = new FormData();
    formData.append('profil_photo', photo);
    
    return this.http.patch<any>(
      `${this.apiUrl}/update-profile/`, 
      formData,
      { headers }
    ).pipe(
      tap(
        response => console.log('Upload success:', response),
        error => console.error('Upload error:', error)
      )
    );
  }
}