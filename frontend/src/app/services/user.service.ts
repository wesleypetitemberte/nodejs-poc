import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface User {
  id?: number;
  name: string;
  lastname: string;
  age: number;
}

@Injectable({
  providedIn: 'root',
})
export class UserService {
  apiURL: string = 'http://localhost:3000/api/users';
  apiKey: string = '9f8a7c1d2e3b4a5d6c7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9';

  constructor(private readonly http: HttpClient) {}

  private getHeaders() {
    return new HttpHeaders({
      'x-api-key': this.apiKey
    });
  };

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiURL, { headers: this.getHeaders() });
  }

  addUser(user: User): Observable<User> {
    return this.http.post<User>(this.apiURL, user, { headers: this.getHeaders() });
  }

  updateUser(id: number, user: User): Observable<void> {
    return this.http.put<void>(`${this.apiURL}/${id}`, user, { headers: this.getHeaders() });
  }

  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiURL}/${id}`, { headers: this.getHeaders() });
  }
}
