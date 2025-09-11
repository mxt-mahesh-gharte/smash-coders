import { Routes } from '@angular/router';
import { authGuard, clientGuard, employeeGuard, loginGuard } from './guards/auth.guard';
import { userResolver, clientBrandingResolver } from './resolvers/user.resolver';

export const routes: Routes = [
    {
        path: '',
        redirectTo: '/login',
        pathMatch: 'full'
    },
    {
        path: 'login',
        loadComponent: () => import('./components/login.component').then(m => m.LoginComponent),
        canActivate: [loginGuard],
        title: 'Maxxton - Client Login'
    },
    {
        path: 'signup',
        loadComponent: () => import('./components/signup.component').then(m => m.SignupComponent),
        canActivate: [loginGuard],
        title: 'Maxxton - Create Account'
    },
    {
        path: 'dashboard',
        loadComponent: () => import('./components/dashboard.component').then(m => m.DashboardComponent),
        canActivate: [authGuard, clientGuard],
        resolve: {
            user: userResolver,
            branding: clientBrandingResolver
        },
        title: 'Client Dashboard - Maxxton'
    },
    {
        path: 'admin',
        loadComponent: () => import('./components/admin.component').then(m => m.AdminComponent),
        canActivate: [authGuard, employeeGuard],
        resolve: {
            user: userResolver
        },
        title: 'Admin Dashboard - Maxxton'
    },
    {
        path: '**',
        redirectTo: '/login'
    }
];
