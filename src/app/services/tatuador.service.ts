import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Tatuador } from '../core/models';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TatuadorService {

  private apiUrl = `${environment.apiUrl}/tatuadores.php`;

  constructor(private http: HttpClient) { }

  getTatuadores(): Observable<{ status: string, data: Tatuador[] }> {
    return this.http.get<{ status: string, data: Tatuador[] }>(this.apiUrl);
  }
}
