import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

// Modern functional interceptor for adding auth headers
export const authInterceptor: HttpInterceptorFn = (req, next) => {
    const authService = inject(AuthService);
    const currentUser = authService.currentUser();

    if (currentUser) {
        const authReq = req.clone({
            setHeaders: {
                Authorization: `Bearer ${currentUser.id}`,
                'X-Client-Type': currentUser.type,
                'X-Client-ID': currentUser.clientId || ''
            }
        });
        return next(authReq);
    }

    return next(req);
};
