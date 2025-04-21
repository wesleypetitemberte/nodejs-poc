import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environment';
import { Router } from '@angular/router';

export interface User {
  id?: number;
  email: string;
  password: string;
  password2?: string;
  code?: string;
  token?: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    private readonly http: HttpClient,
    private readonly router: Router,
  ) {}

  private getHeaders() {
    return new HttpHeaders({
      'x-api-key': environment['API_KEY'],
      'Authorization': `Bearer ${localStorage.getItem('token') || ''}`,
    });
  }

  login(email: string, password: string): Observable<{ token: string }> {
    return this.http.post<{ token: string }>(
      `${environment['ENDPOINT_API']}/auth/login`,
      { email, password }, // Enviar o corpo com email e password
      { headers: this.getHeaders() }
    );
  }

  register(user: User): Observable<User> {
    return this.http.post<User>(
      `${environment['ENDPOINT_API']}/auth/register`,
      user, // Enviar o objeto user completo
      { headers: this.getHeaders() }
    );
  }

  forgotPassword(email: string): Observable<void> {
    return this.http.post<void>(
      `${environment['ENDPOINT_API']}/auth/forgot-password`,
      { email }, // Enviar email no corpo da requisição
      { headers: this.getHeaders() }
    );
  }

  canActivate(): Observable<boolean> | Promise<boolean> | boolean {
    const token = localStorage.getItem('token');
    if (token) {
      return true; // Usuário logado, pode acessar a rota
    } else {
      this.router.navigate(['/']); // Redireciona para a página de login
      return false;
    }
  }
}