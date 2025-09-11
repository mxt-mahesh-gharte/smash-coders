import { Injectable, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { delay, map, tap } from 'rxjs/operators';

export interface User {
  id: string;
  email: string;
  fullName: string;
  username: string;
  type: 'client' | 'employee';
  clientId?: string;
  avatar?: string;
  lastLogin?: Date;
}

export interface Client {
  id: string;
  name: string;
  logo: string;
  primaryColor: string;
  welcomeMessage: string;
  backgroundImage?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Modern Angular Signals for reactive state management
  private _currentUser = signal<User | null>(null);
  private _isLoading = signal(false);
  private _currentClient = signal<Client | null>(null);

  // Computed signals for derived state
  currentUser = this._currentUser.asReadonly();
  isLoading = this._isLoading.asReadonly();
  currentClient = this._currentClient.asReadonly();
  isAuthenticated = computed(() => this._currentUser() !== null);
  isClient = computed(() => this._currentUser()?.type === 'client');
  isEmployee = computed(() => this._currentUser()?.type === 'employee');

  // Mock client data for personalization
  private mockClients: Client[] = [
    {
      id: 'client-1',
      name: 'Sunshine Hotels',
      logo: '/assets/clients/sunshine-logo.png',
      primaryColor: '#FF6B35',
      welcomeMessage: 'Welcome back to Sunshine Hotels! Ready to brighten your day?',
      backgroundImage: '/assets/clients/sunshine-bg.jpg'
    },
    {
      id: 'client-2',
      name: 'Mountain View Resorts',
      logo: '/assets/clients/mountain-logo.png',
      primaryColor: '#2E8B57',
      welcomeMessage: 'Welcome to Mountain View Resorts - Where adventure meets comfort!',
      backgroundImage: '/assets/clients/mountain-bg.jpg'
    },
    {
      id: 'client-3',
      name: 'Ocean Breeze Villas',
      logo: '/assets/clients/ocean-logo.png',
      primaryColor: '#1E90FF',
      welcomeMessage: 'Dive into luxury at Ocean Breeze Villas!',
      backgroundImage: '/assets/clients/ocean-bg.jpg'
    }
  ];

  constructor(private router: Router) {
    this.loadStoredAuth();
  }

  // Client Login
  clientLogin(email: string, password: string): Observable<User> {
    this._isLoading.set(true);

    // Simulate API call with delay
    return of(null).pipe(
      delay(1500),
      map(() => {
        // Mock authentication logic
        if (email && password.length >= 6) {
          const clientId = this.determineClientId(email);
          const user: User = {
            id: 'user-' + Date.now(),
            email,
            fullName: this.extractFullNameFromEmail(email),
            username: email.split('@')[0],
            type: 'client',
            clientId,
            avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(this.extractFullNameFromEmail(email))}&background=random`,
            lastLogin: new Date()
          };

          this._currentUser.set(user);
          this.loadClientBranding(clientId);
          this.storeAuth(user);
          this._isLoading.set(false);

          return user;
        } else {
          this._isLoading.set(false);
          throw new Error('Invalid credentials');
        }
      })
    );
  }

  // Employee Login
  employeeLogin(email: string, password: string): Observable<User> {
    this._isLoading.set(true);

    return of(null).pipe(
      delay(1000),
      map(() => {
        // Mock employee authentication
        if (email.includes('@maxxton.com') && password === 'admin123') {
          const user: User = {
            id: 'emp-' + Date.now(),
            email,
            fullName: 'Maxxton Employee',
            username: email.split('@')[0],
            type: 'employee',
            avatar: `https://ui-avatars.com/api/?name=Maxxton+Employee&background=0066cc&color=fff`,
            lastLogin: new Date()
          };

          this._currentUser.set(user);
          this.storeAuth(user);
          this._isLoading.set(false);

          return user;
        } else {
          this._isLoading.set(false);
          throw new Error('Invalid employee credentials');
        }
      })
    );
  }

  // Client Signup
  clientSignup(signupData: {
    fullName: string;
    email: string;
    username: string;
    password: string;
  }): Observable<User> {
    this._isLoading.set(true);

    return of(null).pipe(
      delay(2000),
      map(() => {
        const clientId = this.determineClientId(signupData.email);
        const user: User = {
          id: 'user-' + Date.now(),
          email: signupData.email,
          fullName: signupData.fullName,
          username: signupData.username,
          type: 'client',
          clientId,
          avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(signupData.fullName)}&background=random`,
          lastLogin: new Date()
        };

        this._currentUser.set(user);
        this.loadClientBranding(clientId);
        this.storeAuth(user);
        this._isLoading.set(false);

        return user;
      })
    );
  }

  // Logout
  logout(): void {
    this._currentUser.set(null);
    this._currentClient.set(null);
    localStorage.removeItem('maxxton_auth');
    this.router.navigate(['/login']);
  }

  // Get client by email domain
  private determineClientId(email: string): string {
    const domain = email.split('@')[1];
    switch (domain) {
      case 'sunshine-hotels.com':
        return 'client-1';
      case 'mountainview.com':
        return 'client-2';
      case 'oceanbreeze.com':
        return 'client-3';
      default:
        return 'client-1'; // Default client
    }
  }

  private extractFullNameFromEmail(email: string): string {
    const name = email.split('@')[0];
    return name.split('.').map(part =>
      part.charAt(0).toUpperCase() + part.slice(1)
    ).join(' ');
  }

  private loadClientBranding(clientId: string): void {
    const client = this.mockClients.find(c => c.id === clientId);
    if (client) {
      this._currentClient.set(client);
    }
  }

  private storeAuth(user: User): void {
    localStorage.setItem('maxxton_auth', JSON.stringify(user));
  }

  private loadStoredAuth(): void {
    const stored = localStorage.getItem('maxxton_auth');
    if (stored) {
      try {
        const user = JSON.parse(stored);
        this._currentUser.set(user);
        if (user.clientId) {
          this.loadClientBranding(user.clientId);
        }
      } catch (error) {
        localStorage.removeItem('maxxton_auth');
      }
    }
  }

  // Get client branding data
  getClientBranding(clientId: string): Client | null {
    return this.mockClients.find(c => c.id === clientId) || null;
  }
}
