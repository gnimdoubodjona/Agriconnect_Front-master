import { Component, HostListener, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { RegisterCredentials, UserRole } from '../../models/auth';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  //username$: Observable<string | null>;
  //isProfileMenuOpen = false;

  //constructor(
    //public authService: AuthService, 
  //   private router: Router
  // ) {
  //   // S'abonner à l'utilisateur courant pour obtenir le nom d'utilisateur
  //   this.username$ = this.authService.currentUser$.pipe(
  //     map(user => user ? user.username : null)
  //   );
  // }

  // ngOnInit(): void {}

  // toggleProfileMenu() {
  //   this.isProfileMenuOpen = !this.isProfileMenuOpen;
  // }

  // getInitials(username: string | null): string {
  //   if (!username) return 'U';
  //   return username.charAt(0).toUpperCase();
  // }

  // logout() {
  //   this.isProfileMenuOpen = false;
  //   this.authService.logout();
  //   this.router.navigate(['/']); // Redirige vers la page d'accueil après déconnexion
  // }
  currentUser: any;
  showProfileMenu = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.currentUser = this.authService.getCurrentUser();
  }

  toggleProfileMenu() {
    this.showProfileMenu = !this.showProfileMenu;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const profileMenu = document.querySelector('.profile-menu');
    const profileButton = document.querySelector('.profile-button');
    
    if (!profileMenu?.contains(event.target as Node) && 
        !profileButton?.contains(event.target as Node)) {
      this.showProfileMenu = false;
    }
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/auth']);
  }

  // Pour le changement de background des liens de navigation
  // changeBackground(element: HTMLElement) {
  //   const links = document.querySelectorAll('.flex a');
  //   links.forEach(link => {
  //     link.classList.remove('bg-gray-400');
  //   });
  //   element.classList.add('bg-gray-400');
  // }
}
