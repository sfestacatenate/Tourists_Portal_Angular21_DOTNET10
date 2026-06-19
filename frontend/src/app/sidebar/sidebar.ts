import { Component, HostListener, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../services/auth';

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss'
})
export class Sidebar {
  private authService = inject(AuthService);
  private router = inject(Router);

  isCollapsed = false;
  isMobileMenuOpen = false;

  get currentUser() {
    return this.authService.currentUser;
  }

  toggleSidebar() {
    this.isCollapsed = !this.isCollapsed;
  }

  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  closeMobileMenu() {
    this.isMobileMenuOpen = false;
  }

  logout() {
    this.authService.logout().subscribe(() => this.router.navigate(['/login']));
  }

  @HostListener('window:resize')
  onResize() {
    if (window.innerWidth > 768) {
      this.isMobileMenuOpen = false;
    }
  }
}
