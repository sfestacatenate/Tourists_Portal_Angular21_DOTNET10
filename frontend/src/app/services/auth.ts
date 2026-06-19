import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { Utente } from '../models/utente.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiBaseUrl}/auth`;

  readonly currentUser = signal<Utente | null>(null);

  login(email: string, password: string): Observable<Utente> {
    return this.http.post<Utente>(`${this.apiUrl}/login`, { email, password })
      .pipe(tap(user => this.currentUser.set(user)));
  }

  logout(): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.apiUrl}/logout`, {})
      .pipe(tap(() => this.currentUser.set(null)));
  }

  checkSession(): Observable<Utente> {
    return this.http.get<Utente>(`${this.apiUrl}/me`)
      .pipe(tap(user => this.currentUser.set(user)));
  }
}
