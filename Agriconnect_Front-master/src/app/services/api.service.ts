import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Prestataire, Service } from '../models/services';
//import { Service, Prestataire } from '../models/service.model';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = 'http://localhost:8000/api';

  constructor(private http: HttpClient) {}

  getServices(): Observable<Service[]> {
    return this.http.get<Service[]>(`${this.apiUrl}/services/`);
  }

  getPrestataires(): Observable<Prestataire[]> {
    return this.http.get<Prestataire[]>(`${this.apiUrl}/prestataires/`);
  }

  createService(service: Partial<Service>): Observable<Service> {
    return this.http.post<Service>(`${this.apiUrl}/services/`, service);
  }
}

