import { Component, inject } from '@angular/core';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-profilo',
  imports: [],
  templateUrl: './profilo.html',
  styleUrl: './profilo.scss'
})
export class Profilo {
  private authService = inject(AuthService);

  get currentUser() {
    return this.authService.currentUser;
  }
}
