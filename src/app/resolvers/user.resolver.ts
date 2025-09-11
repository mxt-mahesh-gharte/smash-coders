import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { AuthService, User } from '../services/auth.service';

// Modern functional resolver for user data
export const userResolver: ResolveFn<User | null> = () => {
    const authService = inject(AuthService);

    // Simulate loading user data
    return of(authService.currentUser()).pipe(
        delay(500) // Simulate network delay
    );
};

// Resolver for client branding data
export const clientBrandingResolver: ResolveFn<any> = () => {
    const authService = inject(AuthService);
    const currentUser = authService.currentUser();

    if (currentUser?.clientId) {
        const branding = authService.getClientBranding(currentUser.clientId);
        return of(branding).pipe(delay(300));
    }

    return of(null);
};
