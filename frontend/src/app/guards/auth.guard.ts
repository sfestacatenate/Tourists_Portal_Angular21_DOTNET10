import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth';
import { catchError, map, of } from 'rxjs';

export const authGuard = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const user = authService.currentUser();
  if (user) return true;

  return authService.checkSession().pipe(
    map(() => true),
    catchError(() => of(router.parseUrl('/login')))
  );
};
