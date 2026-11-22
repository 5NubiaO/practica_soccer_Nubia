import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <h1>Soccer — Ligas y Equipos</h1>
    <nav>
      <a routerLink="/leagues" routerLinkActive="active">Ligas</a> |
      <a routerLink="/teams" routerLinkActive="active">Equipos</a>
    </nav>
    <router-outlet></router-outlet>
  `,
  styles: [`a.active { font-weight: bold; }`]
})
export class App {}