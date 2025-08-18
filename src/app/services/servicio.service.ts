import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Servicio } from '../core/models';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ServicioService {

  private apiUrl = `${environment.apiUrl}/servicios.php`;

  constructor(private http: HttpClient) { }

  getServicios(): Observable<{ status: string, data: Servicio[] }> {
    return this.http.get<{ status: string, data: Servicio[] }>(this.apiUrl);
  }
}
