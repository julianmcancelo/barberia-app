import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { Tatuador } from '../models';
import { environment } from '../../../environments/environment';

export interface ReservaRequest {
  nombre_completo: string;
  email: string;
  whatsapp?: string;
  tatuador_id?: number;
  servicio_id: number | string;
  fecha_hora: string;
}

export interface ReservaResponse {
  token_reserva: string;
}

export interface ReservaAdmin {
  id: number;
  token_reserva: string;
  nombre_completo: string;
  email: string;
  whatsapp: string;
  fecha_hora: string;
  estado: string;
  notas: string;
  created_at: string;
  tatuador_nombre: string;
  tatuador_especialidad: string;
  servicios_nombres: string;
  servicios_ids: number[];
  duracion_total: number;
  precio_total: number;
}

export interface Horario {
  hora: string;
  disponible: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ReservaService {

  private apiUrl = `${environment.apiUrl}/reservas.php`;

  constructor(private http: HttpClient) { }

  crearReserva(reservaData: ReservaRequest): Observable<{ status: string, data: { token_reserva: string } }> {
    return this.http.post<{ status: string, data: { token_reserva: string } }>(this.apiUrl, reservaData);
  }

  getReservasAdmin(): Observable<{ status: string, data: ReservaAdmin[], count: number }> {
    return this.http.get<{ status: string, data: ReservaAdmin[], count: number }>(`${environment.apiUrl}/admin-reservas.php`);
  }

  updateReservaEstado(id: number, estado: string): Observable<any> {
    return this.http.post(`${environment.apiUrl}/admin-reservas.php`, {
      action: 'update_estado',
      reserva_id: id,
      estado: estado
    });
  }

  getHorariosDisponibles(tatuador: Tatuador, fecha: Date, duracion: number): Observable<Horario[]> {
    const fechaStr = fecha.toISOString().split('T')[0]; // Format: YYYY-MM-DD
    const params = new URLSearchParams({
      tatuador_id: (tatuador.id || 0).toString(),
      fecha: fechaStr,
      duracion: duracion.toString()
    });
    
    return this.http.get<{status: string, data: Horario[]}>(`${environment.apiUrl}/horarios-disponibles.php?${params}`)
      .pipe(
        map((response: {status: string, data: Horario[]}) => response.data || [])
      );
  }
}
