import { Component, OnInit } from '@angular/core';
import { AuthService } from './services/auth.service';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { filter } from 'rxjs/operators';
import { VeterinaireService } from './services/veterinaire.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'AgriconnetF';
  shouldShowHeaderFooter = true;
  showProfileModal = false;
  isAuthRoute: boolean = false;
  showProfileCompletion$;

  constructor(
    public authService: AuthService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private veterinaireService: VeterinaireService
  ) {
    this.showProfileCompletion$ = this.authService.showProfileCompletion$;
  }

  ngOnInit() {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      // Mettre à jour isAuthRoute en fonction de l'URL actuelle
      this.isAuthRoute = event.url === '/auth';

      // Par défaut, toujours afficher le header/footer
      this.shouldShowHeaderFooter = true;
      
      let route = this.activatedRoute;
      while (route.firstChild) {
        route = route.firstChild;
      }
      
      // Ne masquer le header/footer que si explicitement demandé
      route.data.subscribe(data => {
        if (data['hideHeaderFooter'] === true) {
          this.shouldShowHeaderFooter = false;
        }
      });

      // Vérifier si on doit afficher le modal de complétion de profil
      if (this.authService.isAuthenticated()) {
        this.authService.showProfileCompletion$.subscribe(
          show => this.showProfileModal = show
        );
      }
    });
  }

  logout(): void {
    this.authService.logout();
  }
}
