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
  showSignupSuggestion = signal(false);
  showPassword = signal(false);
  showEmpPassword = signal(false);

  // Computed signals
  isLoading = this.authService.isLoading;
  isFormValid = computed(() =>
    this.email().trim() !== '' && this.password().length >= 6
  );

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
    console.log('🔐 Login form submitted');
    if (!this.isFormValid()) return;
    console.log('valid form submission');
    const email = this.email();
    const password = this.password();

    console.log('Attempting login with:', { email, password: '***', loginType: this.loginType() });

    const loginObservable = this.loginType() === 'employee'
      ? this.authService.employeeLogin(email, password)
      : this.authService.clientLogin(email, password);

    loginObservable.subscribe({
      next: (user) => {
        console.log('✅ Login successful:', user);
        console.log('✅ User type:', user.type);

        this.showSignupSuggestion.set(false);
        this.errorMessage.set('');

        // Show success toast with personalized message
        const welcomeMessage = user.type === 'client'
          ? `Welcome back, ${user.fullName}! 🎉`
          : `Welcome back, ${user.fullName}! Ready to manage your clients? 🚀`;

        this.toastService.showSuccess(welcomeMessage);

        // Use Angular router instead of window.location for proper navigation
        console.log('🔄 Starting navigation...');
        if (user.type === 'client') {
          console.log('🏠 Redirecting to dashboard...');
          this.router.navigate(['/dashboard']);
        } else if (user.type === 'employee') {
          console.log('🏢 Redirecting to admin...');
          this.router.navigate(['/admin']);
        } else {
          console.warn('⚠️ Unknown user type:', user.type);
          this.router.navigate(['/login']);
        }
      },
      error: (error) => {
        console.error('❌ Login failed:', error);
        const errorMsg = error.message || 'Login failed. Please try again.';
        this.errorMessage.set(errorMsg);
        console.log('Error message set to:', errorMsg);

        // Show signup suggestion if user not found
        if (errorMsg.includes('not found') || errorMsg.includes('Account not found')) {
          this.showSignupSuggestion.set(true);
          console.log('Showing signup suggestion');
        } else {
          this.showSignupSuggestion.set(false);
        }
      }
    });
  }
}
