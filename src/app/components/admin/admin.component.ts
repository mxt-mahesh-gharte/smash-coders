import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss'
})
export class AdminComponent {
  private authService = inject(AuthService);

  currentUser = this.authService.currentUser;

  logout() {
    this.authService.logout().subscribe({
      next: () => {
        // Logout handled in service
      },
      error: (error) => {
        console.error('Logout error:', error);
        // Still navigate even if logout API fails
      }
    });
  }
}
