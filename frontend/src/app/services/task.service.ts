import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environment';

export interface Task {
  id?: number;
  customer: string;
  name: string;
  description: string;
  price: number;
  createdAt?: string;
  updatedAt?: string;
}

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  constructor(private readonly http: HttpClient) {}

  private getHeaders() {
    return new HttpHeaders({
      'x-api-key': environment['API_KEY'],
      'Authorization': `Bearer ${localStorage.getItem('token') || ''}`,
    });
  }

  getTasks(): Observable<Task[]> {
    return this.http.get<Task[]>(
      `${environment['ENDPOINT_API']}/tasks`,
      { headers: this.getHeaders() }
    );
  }

  addTask(task: Task): Observable<Task> {
    return this.http.post<Task>(`
      ${environment['ENDPOINT_API']}/tasks`,
      task,
      { headers: this.getHeaders() }
    );
  }

  updateTask(id: number, task: Task): Observable<void> {
    return this.http.put<void>(`
      ${environment['ENDPOINT_API']}/tasks/${id}`,
      task,
      { headers: this.getHeaders() }
    );
  }

  deleteTask(id: number): Observable<void> {
    return this.http.delete<void>(`
      ${environment['ENDPOINT_API']}/tasks/${id}`,
      { headers: this.getHeaders() }
    );
  }
}
