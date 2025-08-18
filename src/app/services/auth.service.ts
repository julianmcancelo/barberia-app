import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private loggedIn = new BehaviorSubject<boolean>(false);

  get isLoggedIn() {
    return this.loggedIn.asObservable();
  }

  // Simula un inicio de sesión
  login() {
    this.loggedIn.next(true);
  }

  // Simula un cierre de sesión
  logout() {
    this.loggedIn.next(false);
  }

  // Devuelve el estado actual de autenticación
  isAuthenticated(): boolean {
    return this.loggedIn.getValue();
  }
}
