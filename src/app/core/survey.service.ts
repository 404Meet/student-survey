import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Survey } from './models/survey';

@Injectable({ providedIn: 'root' })
export class SurveyService {
  private baseUrl = '';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Survey[]> {
    return this.http.get<Survey[]>(this.baseUrl);
  }

  getById(id: number): Observable<Survey> {
    return this.http.get<Survey>(`${this.baseUrl}/${id}`);
  }

  create(s: Survey): Observable<Survey> {
    return this.http.post<Survey>(this.baseUrl, s);
  }

  update(id: number, s: Survey): Observable<Survey> {
    return this.http.put<Survey>(`${this.baseUrl}/${id}`, s);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
