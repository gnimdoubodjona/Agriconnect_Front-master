import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const roleGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const expectedRole = route.data['role'];

  const currentUser = authService.getCurrentUser();
  if (currentUser && currentUser.role === expectedRole) {
    return true;
  }

  router.navigate(['/unauthorized']); // Redirige vers une page "Accès refusé"
  return false;
};
