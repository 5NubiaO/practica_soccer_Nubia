import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Team } from '../models';
import { TeamService } from '../team.service';

@Component({
  selector: 'app-teams',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <h2>Equipos</h2>

    <form (ngSubmit)="save()" #f="ngForm">
      <input [(ngModel)]="form.name" name="name" placeholder="Nombre del equipo"
             required minlength="2" maxlength="50" />
      <input [(ngModel)]="form.country" name="country" placeholder="País"
             required minlength="2" maxlength="50" />
      <label>Jugadores
        <input type="number" [(ngModel)]="form.playersQuantity" name="playersQuantity"
               required min="11" max="22" />
      </label>
      <label><input type="checkbox" [(ngModel)]="form.enabled" name="enabled" /> Activo</label>
      <button type="submit" [disabled]="f.invalid">{{ editing ? 'Guardar cambios' : 'Crear equipo' }}</button>
      <button type="button" *ngIf="editing" (click)="resetForm()">Cancelar</button>
    </form>
    <p *ngIf="error" class="error">{{ error }}</p>

    <table *ngIf="teams.length">
      <thead><tr><th>Equipo</th><th>País</th><th>Jugadores</th><th>Activo</th><th></th></tr></thead>
      <tbody>
        <tr *ngFor="let t of teams">
          <td>{{ t.name }}</td>
          <td>{{ t.country }}</td>
          <td>{{ t.playersQuantity }}</td>
          <td>{{ t.enabled ? 'Sí' : 'No' }}</td>
          <td>
            <button type="button" (click)="edit(t)">Editar</button>
            <button type="button" (click)="remove(t)">Eliminar</button>
          </td>
        </tr>
      </tbody>
    </table>
    <p *ngIf="!teams.length">Aún no hay equipos. Crea el primero con el formulario.</p>
  `,
  styles: [`.error { color: #b00020; } table { border-collapse: collapse; } td, th { border: 1px solid #ccc; padding: 4px 8px; }`]
})
export class TeamsComponent implements OnInit {
  teams: Team[] = [];
  form: Team = this.emptyTeam();
  editing = false;
  error = '';

  constructor(private teamsApi: TeamService) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.teamsApi.getAll().subscribe(t => (this.teams = t));
  }

  private emptyTeam(): Team {
    return { id: 0, name: '', country: '', playersQuantity: 11, enabled: true };
  }

  edit(team: Team): void {
    this.form = { ...team };
    this.editing = true;
  }

  resetForm(): void {
    this.form = this.emptyTeam();
    this.editing = false;
    this.error = '';
  }

  save(): void {
    const done = () => { this.resetForm(); this.load(); };
    const fail = (e: any) => (this.error = e.error?.title ?? e.error ?? 'La API rechazó los datos. Revisa las reglas.');
    if (this.editing) {
      this.teamsApi.update(this.form.id, this.form).subscribe({ next: done, error: fail });
    } else {
      this.teamsApi.create(this.form).subscribe({ next: done, error: fail });
    }
  }

  remove(team: Team): void {
    if (!confirm(`¿Eliminar el equipo ${team.name}?`)) return;
    this.teamsApi.delete(team.id).subscribe(() => this.load());
  }
}