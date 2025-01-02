import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthentificationComponent } from './fonctionnalite/authentification/authentification.component';
import { authGuard } from './guards/auth.guard';
import { UnauthorizedComponent } from './fonctionnalite/unauthorized/unauthorized.component';
import { AppComponent } from './app.component';
import { BodyComponent } from './main/body/body.component';
import { VeterinaireSearchComponent } from './components/veterinaire-search/veterinaire-search.component';
import { VeterinaireProfileComponent } from './components/veterinaire-profile/veterinaire-profile.component';
import { DashboardComponent } from './main/dashboard/dashboard.component';

const routes: Routes = [
  // Route pour l'authentification (ouverte à tous)
  { 
    path: 'auth', 
    component: AuthentificationComponent,
    data: { hideHeaderFooter: true }  // Modification de la propriété pour correspondre à celle utilisée dans app.component.ts
  },

  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [authGuard]
  },

  // Page d'accueil publique
  {
    path: 'accueil',
    component: BodyComponent
  },

  // Route pour le profil vétérinaire
  {
    path: 'veterinaire-profile',
    component: VeterinaireProfileComponent,
    canActivate: [authGuard]
  },

  // Recherche de vétérinaires
  {
    path: 'recherche-veterinaires',
    component: VeterinaireSearchComponent
  },

  // Route pour accès non autorisé
  { path: 'unauthorized', component: UnauthorizedComponent },

  // Redirection par défaut vers accueil
  { path: '', redirectTo: 'accueil', pathMatch: 'full' },

  // Route pour toutes les pages non trouvées
  { path: '**', redirectTo: 'accueil' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
