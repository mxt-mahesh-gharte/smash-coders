import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

// Modern functional interceptor for adding auth headers
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const currentUser = authService.currentUser();

  // Get stored token from localStorage
  let token = null;
  if (typeof window !== 'undefined' && localStorage) {
    const stored = localStorage.getItem('maxxton_auth');
    if (stored) {
      try {
        const authData = JSON.parse(stored);
        token = authData.token;
      } catch (error) {
        console.error('Error parsing auth data:', error);
      }
    }
  }

  if (currentUser && token) {
    const authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
        'X-Client-Type': currentUser.type,
        'Content-Type': 'application/json'
      }
    });
    return next(authReq);
  }

  return next(req);
};
