import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Pacchetto } from '../models/pacchetto.model';

@Injectable({
  providedIn: 'root'
})
export class PacchettiService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiBaseUrl}/pacchetti`;

  getPacchetti(): Observable<Pacchetto[]> {
    return this.http.get<Pacchetto[]>(this.apiUrl);
  }

  getPacchettoById(id: number): Observable<Pacchetto> {
    return this.http.get<Pacchetto>(`${this.apiUrl}/${id}`);
  }

  createPacchetto(data: Omit<Pacchetto, 'id'>): Observable<Pacchetto> {
    return this.http.post<Pacchetto>(this.apiUrl, data);
  }

  updatePacchetto(id: number, data: Omit<Pacchetto, 'id'>): Observable<Pacchetto> {
    return this.http.put<Pacchetto>(`${this.apiUrl}/${id}`, data);
  }

  deletePacchetto(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
