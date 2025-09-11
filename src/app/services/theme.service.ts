import { Injectable, signal } from '@angular/core';

export type Theme = 'default' | 'healthcare' | 'finance' | 'startup' | 'corporate';

export interface ThemeConfig {
  name: string;
  displayName: string;
  description: string;
  primaryColor: string;
  secondaryColor: string;
  className: string;
}

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private currentTheme = signal<Theme>('default');
  
  private themes: Record<Theme, ThemeConfig> = {
    default: {
      name: 'default',
      displayName: 'Maxxton',
      description: 'Default Maxxton theme with purple and blue gradients',
      primaryColor: '#6366f1',
      secondaryColor: '#a855f7',
      className: ''
    },
    healthcare: {
      name: 'healthcare',
      displayName: 'Healthcare',
      description: 'Medical theme with green and blue colors',
      primaryColor: '#10b981',
      secondaryColor: '#3b82f6',
      className: 'theme-healthcare'
    },
    finance: {
      name: 'finance',
      displayName: 'Finance',
      description: 'Professional theme with blue and green colors',
      primaryColor: '#1e40af',
      secondaryColor: '#059669',
      className: 'theme-finance'
    },
    startup: {
      name: 'startup',
      displayName: 'Tech Startup',
      description: 'Energetic theme with orange and purple colors',
      primaryColor: '#f59e0b',
      secondaryColor: '#8b5cf6',
      className: 'theme-startup'
    },
    corporate: {
      name: 'corporate',
      displayName: 'Corporate',
      description: 'Professional theme with gray and red colors',
      primaryColor: '#374151',
      secondaryColor: '#dc2626',
      className: 'theme-corporate'
    }
  };

  constructor() {
    // Load saved theme from localStorage
    const savedTheme = localStorage.getItem('app-theme') as Theme;
    if (savedTheme && this.themes[savedTheme]) {
      this.setTheme(savedTheme);
    }
  }

  /**
   * Get the current theme
   */
  getCurrentTheme() {
    return this.currentTheme.asReadonly();
  }

  /**
   * Get the current theme configuration
   */
  getCurrentThemeConfig(): ThemeConfig {
    return this.themes[this.currentTheme()];
  }

  /**
   * Get all available themes
   */
  getAllThemes(): ThemeConfig[] {
    return Object.values(this.themes);
  }

  /**
   * Set the application theme
   */
  setTheme(theme: Theme): void {
    // Remove existing theme classes
    const body = document.body;
    Object.values(this.themes).forEach(themeConfig => {
      if (themeConfig.className) {
        body.classList.remove(themeConfig.className);
      }
    });

    // Add new theme class
    const themeConfig = this.themes[theme];
    if (themeConfig.className) {
      body.classList.add(themeConfig.className);
    }

    // Update current theme
    this.currentTheme.set(theme);

    // Save to localStorage
    localStorage.setItem('app-theme', theme);

    // Dispatch custom event for any components that need to react
    window.dispatchEvent(new CustomEvent('theme-changed', { 
      detail: { theme, config: themeConfig } 
    }));
  }

  /**
   * Toggle between default and a specific theme
   */
  toggleTheme(alternateTheme: Theme = 'healthcare'): void {
    const current = this.currentTheme();
    this.setTheme(current === 'default' ? alternateTheme : 'default');
  }

  /**
   * Get theme-specific CSS custom property values
   */
  getThemeVariable(property: string): string {
    return getComputedStyle(document.documentElement)
      .getPropertyValue(`--${property}`)
      .trim();
  }

  /**
   * Set a theme variable dynamically
   */
  setThemeVariable(property: string, value: string): void {
    document.documentElement.style.setProperty(`--${property}`, value);
  }

  /**
   * Reset all custom theme variables
   */
  resetThemeVariables(): void {
    const style = document.documentElement.style;
    const properties = [];
    
    // Collect all custom properties
    for (let i = 0; i < style.length; i++) {
      const property = style[i];
      if (property.startsWith('--')) {
        properties.push(property);
      }
    }
    
    // Remove them
    properties.forEach(property => {
      style.removeProperty(property);
    });
  }

  /**
   * Apply a custom color scheme
   */
  applyCustomColorScheme(colors: {
    primary?: string;
    secondary?: string;
    accent?: string;
  }): void {
    if (colors.primary) {
      this.setThemeVariable('color-primary-500', colors.primary);
    }
    if (colors.secondary) {
      this.setThemeVariable('color-secondary-500', colors.secondary);
    }
    if (colors.accent) {
      this.setThemeVariable('color-accent-500', colors.accent);
    }
  }

  /**
   * Check if dark mode is enabled
   */
  isDarkMode(): boolean {
    return document.body.classList.contains('dark') || 
           window.matchMedia('(prefers-color-scheme: dark)').matches;
  }

  /**
   * Toggle dark mode
   */
  toggleDarkMode(): void {
    document.body.classList.toggle('dark');
    localStorage.setItem('dark-mode', document.body.classList.contains('dark').toString());
  }

  /**
   * Set dark mode
   */
  setDarkMode(enabled: boolean): void {
    if (enabled) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
    localStorage.setItem('dark-mode', enabled.toString());
  }
}
