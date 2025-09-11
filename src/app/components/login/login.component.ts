import { Component, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterLink],
    templateUrl: './login.component.html',
    styleUrl: './login.component.scss'
})
export class LoginComponent {
    private authService = inject(AuthService);
    private router = inject(Router);

    // Signals for reactive state management
    email = signal('');
    password = signal('');
    showEmployeeLogin = signal(false);
    loginType = signal<'client' | 'employee'>('client');
    errorMessage = signal('');

    // Computed signals
    isLoading = this.authService.isLoading;
    isFormValid = computed(() =>
        this.email().trim() !== '' && this.password().length >= 6
    );

    // Demo credentials for testing
    demoCredentials = [
        { email: 'john.doe@sunshine-hotels.com', password: 'demo123', type: 'Sunshine Hotels Client' },
        { email: 'sarah.smith@mountainview.com', password: 'demo123', type: 'Mountain View Client' },
        { email: 'admin@maxxton.com', password: 'admin123', type: 'Maxxton Employee' }
    ];

    onEmailChange(event: Event) {
        const value = (event.target as HTMLInputElement).value;
        this.email.set(value);
        this.errorMessage.set('');
    }

    onPasswordChange(event: Event) {
        const value = (event.target as HTMLInputElement).value;
        this.password.set(value);
        this.errorMessage.set('');
    }

    toggleEmployeeLogin() {
        this.showEmployeeLogin.set(!this.showEmployeeLogin());
        this.loginType.set(this.showEmployeeLogin() ? 'employee' : 'client');
        this.errorMessage.set('');
    }

    onSubmit(form: NgForm) {
        if (!this.isFormValid()) return;

        const email = this.email();
        const password = this.password();

        const loginObservable = this.loginType() === 'employee'
            ? this.authService.employeeLogin(email, password)
            : this.authService.clientLogin(email, password);

        loginObservable.subscribe({
            next: (user) => {
                console.log('Login successful:', user);
                if (user.type === 'client') {
                    this.router.navigate(['/dashboard']);
                } else {
                    this.router.navigate(['/admin']);
                }
            },
            error: (error) => {
                this.errorMessage.set(error.message || 'Login failed. Please try again.');
            }
        });
    }

    fillDemoCredentials(cred: any) {
        this.email.set(cred.email);
        this.password.set(cred.password);
        this.loginType.set(cred.email.includes('@maxxton.com') ? 'employee' : 'client');
        this.showEmployeeLogin.set(cred.email.includes('@maxxton.com'));
    }
}
