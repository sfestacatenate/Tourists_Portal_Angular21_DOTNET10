import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Guida } from '../models/guida.model';

@Injectable({
  providedIn: 'root'
})
export class GuideService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiBaseUrl}/guide`;

  getGuide(): Observable<Guida[]> {
    return this.http.get<Guida[]>(this.apiUrl);
  }

  getGuidaById(id: number): Observable<Guida> {
    return this.http.get<Guida>(`${this.apiUrl}/${id}`);
  }

  createGuida(data: Omit<Guida, 'id'>): Observable<Guida> {
    return this.http.post<Guida>(this.apiUrl, data);
  }

  updateGuida(id: number, data: Omit<Guida, 'id'>): Observable<Guida> {
    return this.http.put<Guida>(`${this.apiUrl}/${id}`, data);
  }

  deleteGuida(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
