import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Tatuador {
  id?: number;
  nombre: string;
  especialidad: string;
  descripcion?: string;
  telefono?: string;
  email?: string;
  instagram?: string;
  experiencia?: string;
  imagen?: string;
  activo?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface ApiResponse<T> {
  status: 'success' | 'error';
  data: T;
  message?: string;
}

@Injectable({
  providedIn: 'root'
})
export class TatuadorService {
  private apiUrl = `${environment.apiUrl}/tatuadores.php`;

  constructor(private http: HttpClient) {}

  getTatuadores(): Observable<ApiResponse<Tatuador[]>> {
    return this.http.get<ApiResponse<Tatuador[]>>(this.apiUrl);
  }

  addTatuador(tatuador: Partial<Tatuador>): Observable<ApiResponse<{id: number}>> {
    return this.http.post<ApiResponse<{id: number}>>(this.apiUrl, tatuador);
  }

  updateTatuador(tatuador: Tatuador): Observable<ApiResponse<null>> {
    return this.http.put<ApiResponse<null>>(this.apiUrl, tatuador);
  }

  deleteTatuador(id: number): Observable<ApiResponse<null>> {
    return this.http.delete<ApiResponse<null>>(`${this.apiUrl}?id=${id}`);
  }
}
