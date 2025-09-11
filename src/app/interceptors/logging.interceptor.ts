import { HttpInterceptorFn } from '@angular/common/http';
import { tap } from 'rxjs/operators';

// Modern functional interceptor for logging requests
export const loggingInterceptor: HttpInterceptorFn = (req, next) => {
    const startTime = Date.now();

    console.log(`🚀 HTTP Request: ${req.method} ${req.url}`);

    return next(req).pipe(
        tap({
            next: (event) => {
                const duration = Date.now() - startTime;
                console.log(`✅ HTTP Response: ${req.method} ${req.url} (${duration}ms)`);
            },
            error: (error) => {
                const duration = Date.now() - startTime;
                console.error(`❌ HTTP Error: ${req.method} ${req.url} (${duration}ms)`, error);
            }
        })
    );
};
