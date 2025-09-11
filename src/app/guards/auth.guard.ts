import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

// Modern functional guard for authentication
export const authGuard: CanActivateFn = () => {
    const authService = inject(AuthService);
    const router = inject(Router);
    if (authService.isAuthenticated()) {
        return true;
    } else {
        router.navigate(['/login']);
        return false;
    }
};

// Guard for client-only routes
export const clientGuard: CanActivateFn = () => {
    const authService = inject(AuthService);
    const router = inject(Router);
    if (authService.isAuthenticated() && authService.isClient()) {
        return true;
    } else {
        router.navigate(['/login']);
        return false;
    }
};

// Guard for employee-only routes
export const employeeGuard: CanActivateFn = () => {
    const authService = inject(AuthService);
    const router = inject(Router);
    if (authService.isAuthenticated() && authService.isEmployee()) {
        return true;
    } else {
        router.navigate(['/login']);
        return false;
    }
};

// Guard to redirect authenticated users away from login
export const loginGuard: CanActivateFn = () => {
    const authService = inject(AuthService);
    const router = inject(Router);
    if (authService.isAuthenticated()) {
        if (authService.isClient()) {
            router.navigate(['/dashboard']);
        } else {
            router.navigate(['/admin']);
        }
        return false;
    }
    return true;
};
