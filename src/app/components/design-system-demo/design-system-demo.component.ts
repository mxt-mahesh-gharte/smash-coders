import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeService } from '../../services/theme.service';
import { ThemeSwitcherComponent } from '../theme-switcher/theme-switcher.component';

@Component({
  selector: 'app-design-system-demo',
  standalone: true,
  imports: [CommonModule, ThemeSwitcherComponent],
  template: `
    <div class="demo-container">
      <!-- Theme Switcher -->
      <app-theme-switcher></app-theme-switcher>

      <!-- Header -->
      <header class="demo-header">
        <div class="container">
          <h1 class="text-4xl font-bold text-center mb-4">Design System Demo</h1>
          <p class="text-lg text-center text-neutral-600 mb-8">
            Consistent theming and spacing for {{ themeService.getCurrentThemeConfig().displayName }}
          </p>
        </div>
      </header>

      <!-- Color Palette -->
      <section class="demo-section">
        <div class="container">
          <h2 class="text-2xl font-semibold mb-6">Color Palette</h2>
          <div class="color-grid">
            <div class="color-card">
              <div class="color-swatch bg-primary"></div>
              <div class="color-info">
                <h3>Primary</h3>
                <p>Main brand color</p>
              </div>
            </div>
            <div class="color-card">
              <div class="color-swatch bg-secondary"></div>
              <div class="color-info">
                <h3>Secondary</h3>
                <p>Accent color</p>
              </div>
            </div>
            <div class="color-card">
              <div class="color-swatch bg-success"></div>
              <div class="color-info">
                <h3>Success</h3>
                <p>Success states</p>
              </div>
            </div>
            <div class="color-card">
              <div class="color-swatch bg-warning"></div>
              <div class="color-info">
                <h3>Warning</h3>
                <p>Warning states</p>
              </div>
            </div>
            <div class="color-card">
              <div class="color-swatch bg-error"></div>
              <div class="color-info">
                <h3>Error</h3>
                <p>Error states</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Typography -->
      <section class="demo-section">
        <div class="container">
          <h2 class="text-2xl font-semibold mb-6">Typography</h2>
          <div class="typography-demo">
            <h1 class="mb-4">Heading 1 - Large Display</h1>
            <h2 class="mb-4">Heading 2 - Section Title</h2>
            <h3 class="mb-4">Heading 3 - Subsection</h3>
            <h4 class="mb-4">Heading 4 - Component Title</h4>
            <p class="text-lg mb-4">Large body text for important content</p>
            <p class="mb-4">Regular body text for general content</p>
            <p class="text-sm">Small text for captions and notes</p>
          </div>
        </div>
      </section>

      <!-- Buttons -->
      <section class="demo-section">
        <div class="container">
          <h2 class="text-2xl font-semibold mb-6">Buttons</h2>
          <div class="button-demo">
            <div class="button-group">
              <h3 class="mb-4">Primary Buttons</h3>
              <div class="flex gap-4 flex-wrap">
                <button class="btn btn-primary btn-sm">Small</button>
                <button class="btn btn-primary">Medium</button>
                <button class="btn btn-primary btn-lg">Large</button>
              </div>
            </div>
            <div class="button-group">
              <h3 class="mb-4">Secondary Buttons</h3>
              <div class="flex gap-4 flex-wrap">
                <button class="btn btn-secondary btn-sm">Small</button>
                <button class="btn btn-secondary">Medium</button>
                <button class="btn btn-secondary btn-lg">Large</button>
              </div>
            </div>
            <div class="button-group">
              <h3 class="mb-4">Ghost Buttons</h3>
              <div class="flex gap-4 flex-wrap">
                <button class="btn btn-ghost btn-sm">Small</button>
                <button class="btn btn-ghost">Medium</button>
                <button class="btn btn-ghost btn-lg">Large</button>
              </div>
            </div>
            <div class="button-group">
              <h3 class="mb-4">Glass Buttons</h3>
              <div class="flex gap-4 flex-wrap">
                <button class="btn btn-glass btn-sm">Small</button>
                <button class="btn btn-glass">Medium</button>
                <button class="btn btn-glass btn-lg">Large</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Form Elements -->
      <section class="demo-section">
        <div class="container">
          <h2 class="text-2xl font-semibold mb-6">Form Elements</h2>
          <div class="form-demo">
            <div class="form-group">
              <label>Regular Input</label>
              <input type="text" placeholder="Enter text here" class="input" />
            </div>
            <div class="form-group">
              <label>Glass Input</label>
              <input type="text" placeholder="Glass effect input" class="input-glass" />
            </div>
            <div class="form-group">
              <label>Error State</label>
              <input type="text" placeholder="This has an error" class="input error" />
              <span class="text-error text-sm">This field is required</span>
            </div>
          </div>
        </div>
      </section>

      <!-- Cards -->
      <section class="demo-section">
        <div class="container">
          <h2 class="text-2xl font-semibold mb-6">Cards</h2>
          <div class="card-demo">
            <div class="card p-6">
              <h3 class="font-semibold mb-3">Regular Card</h3>
              <p class="text-neutral-600">This is a standard card with shadow and rounded corners.</p>
              <button class="btn btn-primary mt-4">Action</button>
            </div>
            <div class="card-glass p-6">
              <h3 class="font-semibold mb-3 text-white">Glass Card</h3>
              <p class="text-neutral-200">This card has a glass morphism effect with backdrop blur.</p>
              <button class="btn btn-glass mt-4">Action</button>
            </div>
          </div>
        </div>
      </section>

      <!-- Spacing Examples -->
      <section class="demo-section">
        <div class="container">
          <h2 class="text-2xl font-semibold mb-6">Spacing System</h2>
          <div class="spacing-demo">
            <div class="spacing-example">
              <div class="spacing-box p-2">Padding 2</div>
              <div class="spacing-box p-4">Padding 4</div>
              <div class="spacing-box p-6">Padding 6</div>
              <div class="spacing-box p-8">Padding 8</div>
            </div>
            <div class="gap-example">
              <div class="flex gap-2">
                <div class="spacing-item">Gap 2</div>
                <div class="spacing-item">Items</div>
              </div>
              <div class="flex gap-4">
                <div class="spacing-item">Gap 4</div>
                <div class="spacing-item">Items</div>
              </div>
              <div class="flex gap-6">
                <div class="spacing-item">Gap 6</div>
                <div class="spacing-item">Items</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  `,
  styles: [`
    @import '../../../assets/styles/design-system';

    .demo-container {
      min-height: 100vh;
      background: var(--gradient-primary);
      padding: var(--space-8) 0;
    }

    .demo-header {
      text-align: center;
      color: white;
      margin-bottom: var(--space-12);
    }

    .demo-section {
      margin-bottom: var(--space-12);
      
      .container {
        background: rgba(255, 255, 255, 0.95);
        border-radius: var(--radius-2xl);
        padding: var(--space-8);
        backdrop-filter: blur(10px);
        box-shadow: var(--shadow-xl);
      }
    }

    .color-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: var(--space-4);
    }

    .color-card {
      display: flex;
      align-items: center;
      gap: var(--space-3);
      padding: var(--space-4);
      border: 1px solid var(--color-neutral-200);
      border-radius: var(--radius-lg);
    }

    .color-swatch {
      width: 50px;
      height: 50px;
      border-radius: var(--radius-lg);
      border: 1px solid var(--color-neutral-300);
    }

    .color-info h3 {
      font-weight: var(--font-weight-medium);
      margin-bottom: var(--space-1);
    }

    .color-info p {
      font-size: var(--font-size-sm);
      color: var(--color-neutral-600);
    }

    .typography-demo {
      space-y: var(--space-4);
    }

    .button-demo {
      display: flex;
      flex-direction: column;
      gap: var(--space-6);
    }

    .button-group h3 {
      font-size: var(--font-size-lg);
      color: var(--color-neutral-700);
    }

    .form-demo {
      max-width: 400px;
      
      .form-group {
        margin-bottom: var(--space-4);
        
        label {
          display: block;
          font-weight: var(--font-weight-medium);
          margin-bottom: var(--space-2);
          color: var(--color-neutral-700);
        }
      }
    }

    .card-demo {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: var(--space-6);
    }

    .spacing-demo {
      display: flex;
      flex-direction: column;
      gap: var(--space-8);
    }

    .spacing-example {
      display: flex;
      gap: var(--space-4);
      flex-wrap: wrap;
    }

    .spacing-box {
      background: var(--color-primary-100);
      border: 1px solid var(--color-primary-300);
      border-radius: var(--radius-md);
      text-align: center;
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-medium);
      color: var(--color-primary-700);
    }

    .gap-example {
      display: flex;
      flex-direction: column;
      gap: var(--space-4);
    }

    .spacing-item {
      background: var(--color-secondary-100);
      padding: var(--space-2) var(--space-4);
      border-radius: var(--radius-md);
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-medium);
      color: var(--color-secondary-700);
    }

    @media (max-width: 768px) {
      .demo-section .container {
        margin: 0 var(--space-4);
        padding: var(--space-6);
      }
    }
  `]
})
export class DesignSystemDemoComponent {
  themeService = inject(ThemeService);
}
