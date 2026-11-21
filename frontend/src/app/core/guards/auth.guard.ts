// Authentication and role-based route guards.
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Role } from '../models/models';

export const roleGuard = (role: Role): CanActivateFn => () => {
  const auth = inject(AuthService), router = inject(Router);
  if (!auth.isLoggedIn()) return router.createUrlTree(['/login']);
  return auth.role() === role || router.createUrlTree([auth.role() === 'admin' ? '/admin' : '/dashboard']);
};

export const guestGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  return !auth.isLoggedIn() || inject(Router).createUrlTree([auth.role() === 'admin' ? '/admin' : '/dashboard']);
};