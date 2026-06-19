import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Destinazione } from '../models/destinazione.model';

@Injectable({
  providedIn: 'root'
})
export class DestinazioniService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiBaseUrl}/destinazioni`;

  getDestinazioni(): Observable<Destinazione[]> {
    return this.http.get<Destinazione[]>(this.apiUrl);
  }

  getDestinazioneById(id: number): Observable<Destinazione> {
    return this.http.get<Destinazione>(`${this.apiUrl}/${id}`);
  }

  createDestinazione(data: Omit<Destinazione, 'id'>): Observable<Destinazione> {
    return this.http.post<Destinazione>(this.apiUrl, data);
  }

  updateDestinazione(id: number, data: Omit<Destinazione, 'id'>): Observable<Destinazione> {
    return this.http.put<Destinazione>(`${this.apiUrl}/${id}`, data);
  }

  deleteDestinazione(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  uploadImage(file: File): Observable<{ imageUrl: string }> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<{ imageUrl: string }>(`${this.apiUrl}/upload`, formData);
  }
}
