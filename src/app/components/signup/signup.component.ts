import { Component, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'app-signup',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterLink],
    templateUrl: './signup.component.html',
    styleUrl: './signup.component.scss'
})
export class SignupComponent {
    private authService = inject(AuthService);
    private router = inject(Router);

    // Signals for form state
    fullName = signal('');
    email = signal('');
    username = signal('');
    password = signal('');
    confirmPassword = signal('');
    currentStep = signal(1);
    errorMessage = signal('');

    // Computed validations
    isLoading = this.authService.isLoading;

    isStep1Valid = computed(() =>
        this.fullName().trim().length >= 2 &&
        this.email().includes('@') &&
        this.email().includes('.')
    );

    isStep2Valid = computed(() =>
        this.username().trim().length >= 3 &&
        this.password().length >= 6 &&
        this.password() === this.confirmPassword()
    );

    passwordsMatch = computed(() =>
        this.password() === this.confirmPassword() || this.confirmPassword() === ''
    );

    onFullNameChange(event: Event) {
        const value = (event.target as HTMLInputElement).value;
        this.fullName.set(value);
        this.errorMessage.set('');
    }

    onEmailChange(event: Event) {
        const value = (event.target as HTMLInputElement).value;
        this.email.set(value);
        this.errorMessage.set('');

        // Auto-generate username from email
        if (value.includes('@')) {
            const username = value.split('@')[0].toLowerCase();
            this.username.set(username);
        }
    }

    onUsernameChange(event: Event) {
        const value = (event.target as HTMLInputElement).value;
        this.username.set(value.toLowerCase().replace(/[^a-z0-9_]/g, ''));
        this.errorMessage.set('');
    }

    onPasswordChange(event: Event) {
        const value = (event.target as HTMLInputElement).value;
        this.password.set(value);
        this.errorMessage.set('');
    }

    onConfirmPasswordChange(event: Event) {
        const value = (event.target as HTMLInputElement).value;
        this.confirmPassword.set(value);
        this.errorMessage.set('');
    }

    nextStep() {
        if (this.currentStep() === 1 && this.isStep1Valid()) {
            this.currentStep.set(2);
        }
    }

    prevStep() {
        if (this.currentStep() === 2) {
            this.currentStep.set(1);
        }
    }

    onSubmit(form: NgForm) {
        if (!this.isStep2Valid()) return;

        const signupData = {
            fullName: this.fullName(),
            email: this.email(),
            userName: this.username(),
            password: this.password()
        };

        this.authService.clientSignup(signupData).subscribe({
            next: (user) => {
                console.log('Signup successful:', user);
                this.router.navigate(['/dashboard']);
            },
            error: (error) => {
                this.errorMessage.set(error.message || 'Signup failed. Please try again.');
            }
        });
    }
}
