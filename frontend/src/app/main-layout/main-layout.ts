import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Sidebar } from '../sidebar/sidebar';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [RouterOutlet, Sidebar],
  template: `
    <div class="app-layout">
      <app-sidebar></app-sidebar>
      <main class="app-main">
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
  styles: [`
    .app-layout {
      display: flex;
      min-height: 100vh;
    }
    .app-main {
      flex: 1;
      padding: 2rem;
    }
    @media (max-width: 768px) {
      .app-main {
        padding-top: 5rem;
      }
    }
  `]
})
export class MainLayout {}
