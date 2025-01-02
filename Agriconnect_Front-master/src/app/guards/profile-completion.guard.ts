import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { map, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ProfileCompletionGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate() {
    return this.authService.currentUser$.pipe(
      take(1),
      map(user => {
        if (!user) {
          this.router.navigate(['/auth']);
          return false;
        }

        // Si l'utilisateur n'a pas complété son profil
        if (!user.profile_completed) {
          // Afficher le modal de complétion de profil
          this.authService.showProfileCompletionSubject.next(true);
          return false;
        }

        return true;
      })
    );
  }
}
