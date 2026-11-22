using Microsoft.EntityFrameworkCore;
using SoccerApi.Data;

var builder = WebApplication.CreateBuilder(args);

//añadir los  servicios al contenedor
builder.Services.AddControllers();

//Eso le dice a la API: "cuando un controlador pida el SoccerContext, créalo conectado con la cadena SoccerDb que pusiste en el appsettings
builder.Services.AddDbContext<SoccerContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("SoccerDb")));

builder.Services.AddOpenApi();

builder.Services.AddCors(options =>
    options.AddDefaultPolicy(policy =>
        policy.WithOrigins("http://localhost:4200")
              .AllowAnyHeader()
              .AllowAnyMethod()));

var app = builder.Build();

//Configurar el HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();

app.UseCors();

app.UseAuthorization();

app.MapControllers();

app.Run();
