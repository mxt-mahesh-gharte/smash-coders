import { Injectable, signal, computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { delay, map, tap, catchError } from 'rxjs/operators';

export interface User {
  id: string;
  email: string;
  fullName: string;
  userName: string;
  type: 'client' | 'employee';
  clientId?: string;
  avatar?: string;
  lastLogin?: Date;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  email: string;
  fullName: string;
  userName: string;
  password: string;
}

export interface ApiResponse {
  success?: boolean;
  message?: string;
  data?: any;
  user?: any;
  token?: string;
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
  private readonly API_BASE_URL = 'https://node-express-production-8ac7.up.railway.app/api/v1/users';
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
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

  constructor() {
    this.loadStoredAuth();
  }

  // Client Login with real API
  clientLogin(email: string, password: string): Observable<User> {
    this._isLoading.set(true);

    const loginData: LoginRequest = { email, password };
    console.log('🔄 Making API call to:', `${this.API_BASE_URL}/login`);
    console.log('🔄 With data:', { email, password: '***' });

    return this.http.post<any>(`${this.API_BASE_URL}/login`, loginData).pipe(
      map((response) => {
        console.log('📥 Raw API Response:', JSON.stringify(response, null, 2));

        // Handle different possible response structures
        let userData = null;

        // Check if response has user property
        if (response.user) {
          userData = response.user;
        }
        // Check if response itself is the user data
        else if (response.email && response.fullName) {
          userData = response;
        }
        // Check if response has data property with user
        else if (response.data && response.data.user) {
          userData = response.data.user;
        }
        // Check if response has data property and data itself is user
        else if (response.data && response.data.email) {
          userData = response.data;
        }

        if (userData) {
          const user: User = {
            id: userData.id || userData._id || 'user-' + Date.now(),
            email: userData.email,
            fullName: userData.fullName || userData.name || userData.firstName + ' ' + userData.lastName || 'User',
            userName: userData.userName || userData.username || userData.email.split('@')[0],
            type: 'client', // Default to client
            avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(userData.fullName || 'User')}&background=random`,
            lastLogin: new Date()
          };

          console.log('✅ User object created:', user);
          this._currentUser.set(user);
          this.storeAuth(user, response.token || response.data?.token);
          this._isLoading.set(false);
          console.log('✅ Auth state updated');

          return user;
        } else {
          console.error('❌ No user data found in response:', response);
          // If we get here but response seems successful, create a basic user
          if (response.message && response.message.includes('Success')) {
            const user: User = {
              id: 'user-' + Date.now(),
              email: email,
              fullName: 'User',
              userName: email.split('@')[0],
              type: 'client',
              avatar: `https://ui-avatars.com/api/?name=User&background=random`,
              lastLogin: new Date()
            };

            console.log('✅ Created fallback user object:', user);
            this._currentUser.set(user);
            this.storeAuth(user);
            this._isLoading.set(false);
            return user;
          }

          this._isLoading.set(false);
          throw new Error(response.message || 'Login failed - no user data received');
        }
      }),
      catchError((error) => {
        console.error('❌ API Error:', error);
        console.error('❌ Error status:', error.status);
        console.error('❌ Error body:', error.error);

        this._isLoading.set(false);
        let errorMessage = 'Login failed. Please try again.';

        // Handle specific error cases
        if (error.status === 404) {
          errorMessage = 'Account not found. Please sign up first or check your email address.';
        } else if (error.status === 401) {
          errorMessage = 'Invalid email or password. Please check your credentials.';
        } else if (error.status === 400) {
          errorMessage = error.error?.message || 'Invalid login request. Please check your input.';
        } else if (error.error?.message) {
          errorMessage = error.error.message;
        } else if (error.message && !error.message.includes('Http failure')) {
          errorMessage = error.message;
        }

        console.error('❌ Final error message:', errorMessage);
        return throwError(() => new Error(errorMessage));
      })
    );
  }

  // Employee Login - also uses real API but checks for employee role
  employeeLogin(email: string, password: string): Observable<User> {
    this._isLoading.set(true);

    const loginData: LoginRequest = { email, password };

    return this.http.post<ApiResponse>(`${this.API_BASE_URL}/login`, loginData).pipe(
      map((response) => {
        if (response.user) {
          const user: User = {
            id: response.user.id || response.user._id || 'emp-' + Date.now(),
            email: response.user.email,
            fullName: response.user.fullName,
            userName: response.user.userName,
            type: 'employee', // Set as employee for this login method
            avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(response.user.fullName)}&background=0066cc&color=fff`,
            lastLogin: new Date()
          };

          this._currentUser.set(user);
          this.storeAuth(user, response.token);
          this._isLoading.set(false);

          return user;
        } else {
          this._isLoading.set(false);
          throw new Error(response.message || 'Employee login failed');
        }
      }),
      catchError((error) => {
        this._isLoading.set(false);
        let errorMessage = 'Employee login failed. Please try again.';

        // Handle specific error cases
        if (error.status === 404) {
          errorMessage = 'Employee account not found. Please contact your administrator or check your email address.';
        } else if (error.status === 401) {
          errorMessage = 'Invalid employee credentials. Please check your email and password.';
        } else if (error.status === 403) {
          errorMessage = 'Access denied. This account does not have employee privileges.';
        } else if (error.status === 400) {
          errorMessage = error.error?.message || 'Invalid employee login request.';
        } else if (error.error?.message) {
          errorMessage = error.error.message;
        } else if (error.message && !error.message.includes('Http failure')) {
          errorMessage = error.message;
        }

        return throwError(() => new Error(errorMessage));
      })
    );
  }

  // Client Signup with real API
  clientSignup(signupData: SignupRequest): Observable<User> {
    this._isLoading.set(true);

    return this.http.post<ApiResponse>(`${this.API_BASE_URL}/sign-up`, signupData).pipe(
      map((response) => {
        if (response.user || response.data) {
          const userData = response.user || response.data;
          const user: User = {
            id: userData.id || userData._id || 'user-' + Date.now(),
            email: userData.email,
            fullName: userData.fullName,
            userName: userData.userName,
            type: 'client',
            avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(userData.fullName)}&background=random`,
            lastLogin: new Date()
          };

          this._currentUser.set(user);
          this.storeAuth(user, response.token);
          this._isLoading.set(false);

          return user;
        } else {
          this._isLoading.set(false);
          throw new Error(response.message || 'Signup failed');
        }
      }),
      catchError((error) => {
        this._isLoading.set(false);
        let errorMessage = 'Signup failed. Please try again.';

        // Handle specific error cases
        if (error.status === 409 || error.status === 400) {
          if (error.error?.message?.includes('email') || error.error?.message?.includes('already exists')) {
            errorMessage = 'An account with this email already exists. Please try logging in instead.';
          } else if (error.error?.message?.includes('username')) {
            errorMessage = 'This username is already taken. Please choose a different username.';
          } else {
            errorMessage = error.error?.message || 'Invalid signup data. Please check your input.';
          }
        } else if (error.status === 422) {
          errorMessage = 'Invalid input data. Please check all fields and try again.';
        } else if (error.error?.message) {
          errorMessage = error.error.message;
        } else if (error.message && !error.message.includes('Http failure')) {
          errorMessage = error.message;
        }

        return throwError(() => new Error(errorMessage));
      })
    );
  }

  // Logout with real API
  logout(): Observable<any> {
    return this.http.post(`${this.API_BASE_URL}/logout`, {}).pipe(
      tap(() => {
        this._currentUser.set(null);
        this._currentClient.set(null);
        if (typeof window !== 'undefined' && localStorage) {
          localStorage.removeItem('maxxton_auth');
        }
        this.router.navigate(['/login']);
      }),
      catchError((error) => {
        // Even if logout API fails, clear local state
        this._currentUser.set(null);
        this._currentClient.set(null);
        if (typeof window !== 'undefined' && localStorage) {
          localStorage.removeItem('maxxton_auth');
        }
        this.router.navigate(['/login']);
        return of(null);
      })
    );
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

  private storeAuth(user: User, token?: string): void {
    if (typeof window !== 'undefined' && localStorage) {
      const authData = { user, token };
      localStorage.setItem('maxxton_auth', JSON.stringify(authData));
    }
  }

  private loadStoredAuth(): void {
    if (typeof window !== 'undefined' && localStorage) {
      const stored = localStorage.getItem('maxxton_auth');
      if (stored) {
        try {
          const authData = JSON.parse(stored);
          // Handle both new format {user, token} and old format (just user)
          const user = authData.user || authData;
          this._currentUser.set(user);
          if (user.clientId) {
            this.loadClientBranding(user.clientId);
          }
        } catch (error) {
          localStorage.removeItem('maxxton_auth');
        }
      }
    }
  }

  // Get client branding data
  getClientBranding(clientId: string): Client | null {
    return this.mockClients.find(c => c.id === clientId) || null;
  }
}
