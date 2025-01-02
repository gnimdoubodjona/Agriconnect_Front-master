import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/auth';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  displayName$: Observable<string | null>;
  currentUser$: Observable<User | null>;
  isProfileMenuOpen = false;
  currentUser: User | null = null;
  defaultAvatar = 'assets/images/avatars/avatar-2.jpg';

  constructor(
    public authService: AuthService, 
    private router: Router
  ) {
    this.displayName$ = this.authService.currentUser$.pipe(
      map(user => user ? `${user.firstName} ${user.lastName}` : null)
    );
    this.currentUser$ = this.authService.currentUser$;
  }

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });
  }

  toggleProfileMenu(): void {
    this.isProfileMenuOpen = !this.isProfileMenuOpen;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    const profileMenu = document.querySelector('.profile-menu');
    const profileButton = document.querySelector('.profile-button');
    
    // Si le clic n'est pas sur le menu ou le bouton de profil, fermer le menu
    if (!target.closest('.profile-menu') && !target.closest('.profile-button')) {
      this.isProfileMenuOpen = false;
    }
  }

  getInitials(user: User | null): string {
    if (!user?.firstName || !user?.lastName) return '';
    return `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase();
  }

  getProfilePhotoUrl(user: User | null): string {
    if (user?.profile_photo) {
      return `${this.authService.apiUrl}${user.profile_photo}`;
    }
    return this.defaultAvatar;
  }

  logout(): void {
    this.isProfileMenuOpen = false;
    this.authService.logout();
    this.router.navigate(['/auth']);
  }
}
