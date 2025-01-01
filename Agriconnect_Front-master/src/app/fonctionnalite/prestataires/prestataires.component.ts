import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Prestataire } from '../../models/services';
import { ApiService } from '../../services/api.service';
//import { ApiService } from '../../core/services/api.service';
//import { Prestataire } from '../../core/models/service.model';

@Component({
  selector: 'app-prestataires',
  templateUrl: './prestataires.component.html',
  styleUrl: './prestataires.component.css'
})
export class PrestatairesComponent implements OnInit {
  prestataires: Prestataire[] = [];

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.apiService.getPrestataires().subscribe(
      prestataires => this.prestataires = prestataires
    );
  }
}
