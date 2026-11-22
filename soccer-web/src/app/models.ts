//Modelos que coinciden con las tablas del script
export interface League {
  id: number;
  name: string;
  country: string;
  startDate: string; //ejemplo 2026-01-09T00:00:00
  endDate: string;
  enabled: boolean;
  leagueTeams?: LeagueTeam[];
}

export interface Team {
  id: number;
  name: string;
  country: string;
  playersQuantity: number; //11-22
  enabled: boolean;
}

export interface LeagueTeam {
  leagueId: number;
  teamId: number;
  team?: Team;
}