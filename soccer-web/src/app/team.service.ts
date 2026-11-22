import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Team } from './models';

@Injectable({ providedIn: 'root' })
export class TeamService {
  private baseUrl = 'https://localhost:7117/api/teams';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Team[]> {
    return this.http.get<Team[]>(this.baseUrl);
  }

  create(team: Team): Observable<Team> {
    return this.http.post<Team>(this.baseUrl, team);
  }

  update(id: number, team: Team): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/${id}`, team);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}