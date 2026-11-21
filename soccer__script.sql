--restricciones en los catalogos
/*  
1. Un equipo no puede tener menos de 11 jugadores ni más de 22 jugadores registrados.(-)
2. Las fechas de inicio y fin de la Liga deben de ser reales (no puede ser la fecha de inicio mayor a la fecha final de la liga). (-)
3. Por defecto el campo enabled debe de estar en 1, y por defecto las fechas de las ligas toman la fecha actual del registro. (-)
4. Ningún campo debe de ser nulo. (-)
5. Relaciona la tabla de Equipos con la tabla de Ligas de muchos a muchos. (-)
6. Valida los nombres (no pueden tener menos de 2 letras), tanto para ligas, equipos y países. (-)
*/

Create table League(
ID int identity(1,1) Primary Key,
Name varchar(50) not null,
Country varchar(50) not null,
StartDate datetime default GETDATE() not null,
EndDate datetime default GETDATE() not null,
Enabled bit default 1 not null,
--validacion de nombres
CONSTRAINT Lnames_validation CHECK (LEN(Name)>=2),
CONSTRAINT Lcountries_validation CHECK (LEN(Country)>=2),
--validar fechas
CONSTRAINT dates_validation CHECK (StartDate <= EndDate)
);
GO

Create table Team(
ID int identity(1,1) Primary Key,
Name varchar(50) not null,
Country varchar(50) not null,
PlayersQuantity int not null,
Enabled bit default 1 not null,
--validar cant jugadores
CONSTRAINT playersq_validation CHECK (PlayersQuantity>=11 AND PlayersQuantity<=22),
CONSTRAINT Tnames_validation CHECK (LEN(Name)>=2),
CONSTRAINT Tcountries_validation CHECK (LEN(Country)>=2)
);
GO

--relacionar las tablas con un puente
Create table LeagueTeam(
LeagueID int not null,
TeamID int not null,
CONSTRAINT PK_LeagueTeam PRIMARY KEY (LeagueID, TeamID),
CONSTRAINT FK_LeagueTeam_L FOREIGN KEY (LeagueID) REFERENCES League(ID),
CONSTRAINT FK_LeagueTeam_T FOREIGN KEY (TeamID) REFERENCES Team(ID)
);
GO

