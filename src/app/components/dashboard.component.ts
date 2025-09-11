import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
    selector: 'app-dashboard',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './dashboard.component.html',
    styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
    private authService = inject(AuthService);
    private router = inject(Router);

    currentUser = this.authService.currentUser;
    currentClient = this.authService.currentClient;

    // Demo data for client dashboard
    upcomingBookings = [
        { id: 1, property: 'Ocean View Suite', dates: 'Dec 15-18, 2024', guests: 2, status: 'confirmed' },
        { id: 2, property: 'Mountain Cabin', dates: 'Jan 22-25, 2025', guests: 4, status: 'pending' }
    ];

    recentActivity = [
        { action: 'Booking confirmed', property: 'Ocean View Suite', time: '2 hours ago' },
        { action: 'Payment processed', amount: '$450', time: '1 day ago' },
        { action: 'Review submitted', property: 'City Center Apartment', time: '3 days ago' }
    ];

    stats = computed(() => {
        const user = this.currentUser();
        if (!user) return null;

        return {
            totalBookings: 12,
            upcomingStays: 2,
            rewardPoints: 1250,
            memberSince: '2023'
        };
    });

    logout() {
        this.authService.logout();
    }

    getGreeting(): string {
        const hour = new Date().getHours();
        if (hour < 12) return 'Good morning';
        if (hour < 18) return 'Good afternoon';
        return 'Good evening';
    }
}
