# Practica Soccer   "Ligas y Equipos" (Jabil)

Practica de ligas y equipos de futbol: base de datos SQL Server, API REST en .NET y vista en Angular

## Contenido

- `script_soccer.sql`: crea la base de datos `Soccer` con las tablas `League`, `Team` y la tabla puente `LeagueTeam` (muchos a muchos), con las validaciones pedidas:
Un equipo no puede tener menos de 11 jugadores ni más de 22 jugadores registrados.
Las fechas de inicio y fin de la Liga deben de ser reales (no puede ser la fecha de inicio mayor a la fecha final de la liga).
Por defecto el campo enabled debe de estar en 1, y por defecto las fechas de las ligas toman la fecha actual del registro.
Ningún campo debe de ser nulo.
Relaciona la tabla de Equipos con la tabla de Ligas de muchos a muchos.
Valida los nombres (no pueden tener menos de 2 letras), tanto para ligas, equipos y paises.

- `SoccerApi/`: API en .NET 10 con Entity Framework Core. CRUD de ligas y equipos, e inscripcion de equipos en ligas (`POST /api/leagues/{leagueId}/teams/{teamId}`)

- `soccer-web/`: vista en Angular 21 que consume la API: ligas y equipos con crear, editar, eliminar e inscribir equipos

## Como correrlo

1. Correr `script_soccer.sql` en SQL Server (crea la BD `Soccer` y las 3 tablas)
2. En `SoccerApi/`: revisar la cadena de conexión en `appsettings.json` y correr `dotnet run --launch-profile https`. La API queda en `https://localhost:7117`
3. En `soccer-web/`: correr `npm install` y luego `ng serve`. La vista queda en `http://localhost:4200`

## Nota

Para la API y la vista use una IA como apoyo y guia paso a paso; el script SQL y el manejo de Git los hice yo misma. Lei el codigo, lo fui entendiendo poco a poco y probe cada parte hasta que funciono. Si algo no esta bien, es mi responsabilidad y estoy lista para explicarlo y corregirlo.