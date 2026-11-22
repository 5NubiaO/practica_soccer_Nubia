import { Routes } from '@angular/router';
import { LeaguesComponent } from './leagues/leagues.component';
import { TeamsComponent } from './teams/teams.component';

export const routes: Routes = [
  { path: '', redirectTo: 'leagues', pathMatch: 'full' },
  { path: 'leagues', component: LeaguesComponent },
  { path: 'teams', component: TeamsComponent },
  { path: '**', redirectTo: 'leagues' }
];