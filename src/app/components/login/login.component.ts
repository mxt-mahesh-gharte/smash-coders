import { Component, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';

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
  private toastService = inject(ToastService);

  // Signals for reactive state management
  email = signal('');
  password = signal('');
  showEmployeeLogin = signal(false);
  loginType = signal<'client' | 'employee'>('client');
  errorMessage = signal('');
  showDemoCredentials = signal(false);
  showSignupSuggestion = signal(false);
  showPassword = signal(false);
  showEmpPassword = signal(false);

  // Computed signals
  isLoading = this.authService.isLoading;
  isFormValid = computed(() =>
    this.email().trim() !== '' && this.password().length >= 6
  );    // Demo credentials for testing (use actual API accounts)
  demoCredentials = [
    { email: 'chaky@gmail.com', password: '@chakyBro09', type: 'Registered User' },
    { email: 'demo@maxxton.com', password: 'demo123', type: 'Demo Account' },
    { email: 'test@client.com', password: 'test123', type: 'Test Client' }
  ];

  onEmailChange(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.email.set(value);
    this.errorMessage.set('');
    this.showSignupSuggestion.set(false);
  }

  onPasswordChange(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.password.set(value);
    this.errorMessage.set('');
    this.showSignupSuggestion.set(false);
  }

  toggleEmployeeLogin() {
    this.showEmployeeLogin.set(!this.showEmployeeLogin());
    this.loginType.set(this.showEmployeeLogin() ? 'employee' : 'client');
    this.errorMessage.set('');
  }

  toggleShowPassword() {
    this.showPassword.set(!this.showPassword());
  }

  toggleShowEmpPassword() {
    this.showEmpPassword.set(!this.showEmpPassword());
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
        this.showSignupSuggestion.set(false); // Hide signup suggestion on success
        this.errorMessage.set(''); // Clear any error messages

        // Show success toast with personalized message
        const welcomeMessage = user.type === 'client'
          ? `Welcome back, ${user.fullName}! 🎉`
          : `Welcome back, ${user.fullName}! Ready to manage your clients? 🚀`;

        this.toastService.showSuccess(welcomeMessage);

        // Navigate based on user type with a small delay to ensure toast is visible
        setTimeout(() => {
          if (user.type === 'client') {
            this.router.navigate(['/dashboard']);
          } else {
            this.router.navigate(['/admin']);
          }
        }, 500); // 500ms delay to show toast before navigation
      },
      error: (error) => {
        const errorMsg = error.message || 'Login failed. Please try again.';
        this.errorMessage.set(errorMsg);

        // Show signup suggestion if user not found
        if (errorMsg.includes('not found') || errorMsg.includes('Account not found')) {
          this.showSignupSuggestion.set(true);
        } else {
          this.showSignupSuggestion.set(false);
        }
      }
    });
  }

  fillDemoCredentials(cred: any) {
    this.email.set(cred.email);
    this.password.set(cred.password);
    this.loginType.set(cred.email.includes('@maxxton.com') ? 'employee' : 'client');
    this.showEmployeeLogin.set(cred.email.includes('@maxxton.com'));
  }

  toggleDemoCredentials() {
    this.showDemoCredentials.set(!this.showDemoCredentials());
  }
}
