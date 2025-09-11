import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ToastContainerComponent } from './components/toast-container.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ToastContainerComponent],
  template: `
    <router-outlet />
    <app-toast-container />
  `,
  styles: `
    :host {
      display: block;
      width: 100%;
      height: 100vh;
    }
  `
})
export class AppComponent {
  title = 'smash-coders';
}
