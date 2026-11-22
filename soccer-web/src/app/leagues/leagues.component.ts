import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { League, Team } from '../models';
import { LeagueService } from '../league.service';
import { TeamService } from '../team.service';

@Component({
  selector: 'app-leagues',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <h2>Ligas</h2>

    <form (ngSubmit)="save()" #f="ngForm">
      <input [(ngModel)]="form.name" name="name" placeholder="Nombre de la liga"
             required minlength="2" maxlength="50" />
      <input [(ngModel)]="form.country" name="country" placeholder="País"
             required minlength="2" maxlength="50" />
      <label>Inicio <input type="date" [(ngModel)]="startDate" name="startDate" required /></label>
      <label>Fin <input type="date" [(ngModel)]="endDate" name="endDate" required /></label>
      <label><input type="checkbox" [(ngModel)]="form.enabled" name="enabled" /> Activa</label>
      <button type="submit" [disabled]="f.invalid">{{ editing ? 'Guardar cambios' : 'Crear liga' }}</button>
      <button type="button" *ngIf="editing" (click)="resetForm()">Cancelar</button>
    </form>
    <p *ngIf="error" class="error">{{ error }}</p>

    <table *ngIf="leagues.length">
      <thead><tr><th>Liga</th><th>País</th><th>Inicio</th><th>Fin</th><th>Equipos</th><th></th></tr></thead>
      <tbody>
        <tr *ngFor="let league of leagues">
          <td>{{ league.name }}</td>
          <td>{{ league.country }}</td>
          <td>{{ league.startDate | date:'dd/MM/yyyy' }}</td>
          <td>{{ league.endDate | date:'dd/MM/yyyy' }}</td>
          <td>
            <span *ngFor="let lt of league.leagueTeams">
              {{ lt.team?.name }}
              <button type="button" (click)="removeTeam(league, lt.teamId)">×</button>
            </span>
            <select [(ngModel)]="selectedTeam[league.id]" [ngModelOptions]="{standalone: true}">
              <option [ngValue]="0">Inscribir equipo…</option>
              <option *ngFor="let t of teams" [ngValue]="t.id">{{ t.name }}</option>
            </select>
            <button type="button" (click)="enrollTeam(league)">Inscribir</button>
          </td>
          <td>
            <button type="button" (click)="edit(league)">Editar</button>
            <button type="button" (click)="remove(league)">Eliminar</button>
          </td>
        </tr>
      </tbody>
    </table>
    <p *ngIf="!leagues.length">Aún no hay ligas. Crea la primera con el formulario.</p>
  `,
  styles: [`.error { color: #b00020; } table { border-collapse: collapse; } td, th { border: 1px solid #ccc; padding: 4px 8px; }`]
})
export class LeaguesComponent implements OnInit {
  leagues: League[] = [];
  teams: Team[] = [];
  form: League = this.emptyLeague();
  startDate = '';
  endDate = '';
  editing = false;
  error = '';
  selectedTeam: Record<number, number> = {};

  constructor(private leaguesApi: LeagueService, private teamsApi: TeamService) {}

  ngOnInit(): void {
    this.load();
    this.teamsApi.getAll().subscribe(t => (this.teams = t));
  }

  load(): void {
    this.leaguesApi.getAll().subscribe(l => (this.leagues = l));
  }

  private emptyLeague(): League {
    return { id: 0, name: '', country: '', startDate: '', endDate: '', enabled: true };
  }

  edit(league: League): void {
    this.form = { ...league };
    this.startDate = league.startDate.slice(0, 10);
    this.endDate = league.endDate.slice(0, 10);
    this.editing = true;
  }

  resetForm(): void {
    this.form = this.emptyLeague();
    this.startDate = '';
    this.endDate = '';
    this.editing = false;
    this.error = '';
  }

  save(): void {
    if (this.startDate > this.endDate) {
      this.error = 'La fecha de inicio no puede ser mayor que la fecha de fin.';
      return;
    }
    this.form.startDate = new Date(this.startDate).toISOString();
    this.form.endDate = new Date(this.endDate).toISOString();
    // No reenviar la lista de equipos inscritos al crear/editar la liga.
    const payload: League = { ...this.form, leagueTeams: [] };
    const done = () => { this.resetForm(); this.load(); };
    const fail = (e: any) => (this.error = e.error?.title ?? e.error ?? 'La API rechazó los datos. Revisa las reglas.');
    if (this.editing) {
      this.leaguesApi.update(this.form.id, payload).subscribe({ next: done, error: fail });
    } else {
      this.leaguesApi.create(payload).subscribe({ next: done, error: fail });
    }
  }

  remove(league: League): void {
    if (!confirm(`¿Eliminar la liga ${league.name}?`)) return;
    this.leaguesApi.delete(league.id).subscribe(() => this.load());
  }

  enrollTeam(league: League): void {
    const teamId = this.selectedTeam[league.id];
    if (!teamId) return;
    this.leaguesApi.enrollTeam(league.id, teamId).subscribe({
      next: () => this.load(),
      error: (e: any) => (this.error = e.error ?? 'No se pudo inscribir el equipo.')
    });
  }

  removeTeam(league: League, teamId: number): void {
    this.leaguesApi.removeTeam(league.id, teamId).subscribe(() => this.load());
  }
}