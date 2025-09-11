import { Injectable, signal } from '@angular/core';

export interface ToastMessage {
    id: string;
    message: string;
    type: 'success' | 'error' | 'info' | 'warning';
    duration?: number;
}

@Injectable({
    providedIn: 'root'
})
export class ToastService {
    private _toasts = signal<ToastMessage[]>([]);
    toasts = this._toasts.asReadonly();

    private defaultDuration = 4000; // 4 seconds

    showSuccess(message: string, duration?: number) {
        this.addToast({
            id: this.generateId(),
            message,
            type: 'success',
            duration: duration || this.defaultDuration
        });
    }

    showError(message: string, duration?: number) {
        this.addToast({
            id: this.generateId(),
            message,
            type: 'error',
            duration: duration || this.defaultDuration
        });
    }

    showInfo(message: string, duration?: number) {
        this.addToast({
            id: this.generateId(),
            message,
            type: 'info',
            duration: duration || this.defaultDuration
        });
    }

    showWarning(message: string, duration?: number) {
        this.addToast({
            id: this.generateId(),
            message,
            type: 'warning',
            duration: duration || this.defaultDuration
        });
    }

    private addToast(toast: ToastMessage) {
        this._toasts.update(toasts => [...toasts, toast]);

        // Auto-remove toast after duration
        setTimeout(() => {
            this.removeToast(toast.id);
        }, toast.duration);
    }

    removeToast(id: string) {
        this._toasts.update(toasts => toasts.filter(t => t.id !== id));
    }

    private generateId(): string {
        return 'toast-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
    }
}
