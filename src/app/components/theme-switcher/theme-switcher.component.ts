import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeService, Theme } from '../../services/theme.service';

@Component({
  selector: 'app-theme-switcher',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="theme-switcher">
      <div class="theme-switcher-header">
        <h3>Choose Theme</h3>
        <button 
          class="btn btn-sm btn-ghost"
          (click)="toggleExpanded()"
        >
          {{ isExpanded ? '▼' : '▶' }}
        </button>
      </div>
      
      @if (isExpanded) {
        <div class="theme-options">
          @for (theme of themeService.getAllThemes(); track theme.name) {
            <button
              class="theme-option"
              [class.active]="themeService.getCurrentTheme()() === theme.name"
              (click)="selectTheme(theme.name)"
            >
              <div class="theme-preview">
                <div 
                  class="theme-color primary"
                  [style.background-color]="theme.primaryColor"
                ></div>
                <div 
                  class="theme-color secondary"
                  [style.background-color]="theme.secondaryColor"
                ></div>
              </div>
              <div class="theme-info">
                <div class="theme-name">{{ theme.displayName }}</div>
                <div class="theme-description">{{ theme.description }}</div>
              </div>
            </button>
          }
        </div>
        
        <div class="dark-mode-toggle">
          <label class="toggle-label">
            <input 
              type="checkbox" 
              [checked]="themeService.isDarkMode()"
              (change)="toggleDarkMode()"
            />
            <span>Dark Mode</span>
          </label>
        </div>
      }
    </div>
  `,
  styles: [`
    .theme-switcher {
      position: fixed;
      top: var(--space-4);
      right: var(--space-4);
      background: var(--color-glass-light);
      backdrop-filter: blur(15px);
      border: 1px solid var(--color-glass-border);
      border-radius: var(--radius-xl);
      padding: var(--space-4);
      box-shadow: var(--shadow-glass);
      z-index: var(--z-index-dropdown);
      min-width: 280px;
    }

    .theme-switcher-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: var(--space-3);

      h3 {
        color: white;
        font-size: var(--font-size-base);
        font-weight: var(--font-weight-semibold);
        margin: 0;
      }

      button {
        color: white;
        background: transparent;
        border: none;
        padding: var(--space-1);
        cursor: pointer;
        font-size: var(--font-size-sm);
      }
    }

    .theme-options {
      display: flex;
      flex-direction: column;
      gap: var(--space-2);
      margin-bottom: var(--space-4);
    }

    .theme-option {
      display: flex;
      align-items: center;
      gap: var(--space-3);
      padding: var(--space-3);
      background: transparent;
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: var(--radius-lg);
      cursor: pointer;
      transition: var(--transition-normal);
      text-align: left;

      &:hover {
        background: rgba(255, 255, 255, 0.1);
        border-color: rgba(255, 255, 255, 0.3);
      }

      &.active {
        background: rgba(255, 255, 255, 0.2);
        border-color: rgba(255, 255, 255, 0.4);
        box-shadow: var(--shadow-sm);
      }
    }

    .theme-preview {
      display: flex;
      gap: var(--space-1);
    }

    .theme-color {
      width: 16px;
      height: 16px;
      border-radius: var(--radius-sm);
      border: 1px solid rgba(255, 255, 255, 0.3);
    }

    .theme-info {
      flex: 1;
    }

    .theme-name {
      color: white;
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-medium);
      margin-bottom: var(--space-1);
    }

    .theme-description {
      color: rgba(255, 255, 255, 0.7);
      font-size: var(--font-size-xs);
      line-height: var(--line-height-tight);
    }

    .dark-mode-toggle {
      border-top: 1px solid rgba(255, 255, 255, 0.2);
      padding-top: var(--space-3);
    }

    .toggle-label {
      display: flex;
      align-items: center;
      gap: var(--space-2);
      color: white;
      font-size: var(--font-size-sm);
      cursor: pointer;

      input[type="checkbox"] {
        accent-color: var(--color-primary-500);
      }
    }

    @media (max-width: 640px) {
      .theme-switcher {
        position: static;
        margin: var(--space-4);
        width: auto;
      }
    }
  `]
})
export class ThemeSwitcherComponent {
  themeService = inject(ThemeService);
  isExpanded = false;

  toggleExpanded() {
    this.isExpanded = !this.isExpanded;
  }

  selectTheme(themeName: string) {
    this.themeService.setTheme(themeName as Theme);
  }

  toggleDarkMode() {
    this.themeService.toggleDarkMode();
  }
}
