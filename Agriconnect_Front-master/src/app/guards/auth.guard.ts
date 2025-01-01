//mécanisme de protection des routes, vérifie si le user est login avant de lui autoriser certaines routes
import { inject } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    return true;
  }

  router.navigate(['/auth'], { queryParams: { returnUrl: state.url }});
  return false;

  
};