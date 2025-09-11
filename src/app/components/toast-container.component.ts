import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService, ToastMessage } from '../services/toast.service';

@Component({
    selector: 'app-toast-container',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="toast-container">
      @for (toast of toastService.toasts(); track toast.id) {
        <div
          class="toast"
          [class]="'toast-' + toast.type"
          (click)="removeToast(toast.id)">
          <div class="toast-content">
            <div class="toast-icon">
              @switch (toast.type) {
                @case ('success') {
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                  </svg>
                }
                @case ('error') {
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                  </svg>
                }
                @case ('warning') {
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/>
                  </svg>
                }
                @case ('info') {
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
                  </svg>
                }
              }
            </div>
            <span class="toast-message">{{ toast.message }}</span>
            <button class="toast-close" (click)="removeToast(toast.id)" type="button">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
              </svg>
            </button>
          </div>
        </div>
      }
    </div>
  `,
    styles: [`
    .toast-container {
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 9999;
      display: flex;
      flex-direction: column;
      gap: 12px;
      max-width: 400px;
    }

    .toast {
      display: flex;
      align-items: center;
      padding: 16px;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      cursor: pointer;
      transform: translateX(100%);
      animation: slideIn 0.3s ease-out forwards;
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.2);
    }

    .toast:hover {
      transform: translateX(0) scale(1.02);
      transition: transform 0.2s ease;
    }

    .toast-content {
      display: flex;
      align-items: center;
      width: 100%;
      gap: 12px;
    }

    .toast-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .toast-message {
      flex: 1;
      font-weight: 500;
      font-size: 14px;
      line-height: 1.4;
    }

    .toast-close {
      background: none;
      border: none;
      cursor: pointer;
      padding: 4px;
      border-radius: 4px;
      display: flex;
      align-items: center;
      justify-content: center;
      opacity: 0.7;
      transition: opacity 0.2s ease;
    }

    .toast-close:hover {
      opacity: 1;
      background-color: rgba(255, 255, 255, 0.1);
    }

    /* Toast type styles */
    .toast-success {
      background: linear-gradient(135deg, #10b981 0%, #059669 100%);
      color: white;
    }

    .toast-error {
      background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
      color: white;
    }

    .toast-warning {
      background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
      color: white;
    }

    .toast-info {
      background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
      color: white;
    }

    @keyframes slideIn {
      from {
        transform: translateX(100%);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }

    @media (max-width: 480px) {
      .toast-container {
        left: 20px;
        right: 20px;
        max-width: none;
      }

      .toast {
        padding: 12px;
      }

      .toast-message {
        font-size: 13px;
      }
    }
  `]
})
export class ToastContainerComponent {
    toastService = inject(ToastService);

    removeToast(id: string) {
        this.toastService.removeToast(id);
    }
}
