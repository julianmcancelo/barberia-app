import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Cupon {
  id?: number;
  codigo: string;
  nombre: string;
  descripcion?: string;
  tipo_descuento: 'porcentaje' | 'monto_fijo';
  valor_descuento: number;
  monto_minimo: number;
  fecha_inicio: string;
  fecha_expiracion: string;
  usos_maximos?: number;
  usos_actuales: number;
  activo: boolean;
  solo_primera_vez: boolean;
  tatuador_especifico?: number;
  servicio_especifico?: number;
  created_at?: string;
  updated_at?: string;
}

export interface CuponValidation {
  cupon: Cupon;
  descuento: number;
  monto_final: number;
}

export interface ApiResponse<T> {
  status: 'success' | 'error';
  data: T;
  message?: string;
}

@Injectable({
  providedIn: 'root'
})
export class CuponService {
  private apiUrl = `${environment.apiUrl}/cupones.php`;

  constructor(private http: HttpClient) {}

  getCupones(): Observable<ApiResponse<Cupon[]>> {
    return this.http.get<ApiResponse<Cupon[]>>(this.apiUrl);
  }

  validateCupon(codigo: string, monto: number, email?: string): Observable<ApiResponse<CuponValidation>> {
    const params = new URLSearchParams({
      action: 'validate',
      codigo: codigo,
      monto: monto.toString(),
      ...(email && { email })
    });
    
    return this.http.get<ApiResponse<CuponValidation>>(`${this.apiUrl}?${params}`);
  }

  addCupon(cupon: Partial<Cupon>): Observable<ApiResponse<{id: number}>> {
    return this.http.post<ApiResponse<{id: number}>>(this.apiUrl, cupon);
  }

  updateCupon(cupon: Cupon): Observable<ApiResponse<null>> {
    return this.http.put<ApiResponse<null>>(this.apiUrl, cupon);
  }

  deleteCupon(id: number): Observable<ApiResponse<null>> {
    return this.http.delete<ApiResponse<null>>(`${this.apiUrl}?id=${id}`);
  }
}
