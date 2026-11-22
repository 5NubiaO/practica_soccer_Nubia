using Microsoft.EntityFrameworkCore;
using SoccerApi.Models;

namespace SoccerApi.Data;

public class SoccerContext : DbContext
{
    public SoccerContext(DbContextOptions<SoccerContext> options)
    : base(options)
    {
    }

    public DbSet<League> Leagues {get; set;}
    public DbSet<Team> Teams {get; set;}
    public DbSet<LeagueTeam> LeagueTeams {get; set;}

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<League>().ToTable("League");
        modelBuilder.Entity<Team>().ToTable("Team");
        modelBuilder.Entity<LeagueTeam>().ToTable("LeagueTeam");

        modelBuilder.Entity<LeagueTeam>()
            .HasKey(lt => new {lt.LeagueId, lt.TeamId});

        modelBuilder.Entity<LeagueTeam>()
            .HasOne(lt => lt.League)
            .WithMany(l => l.LeagueTeams)
            .HasForeignKey(lt => lt.LeagueId);

        modelBuilder.Entity<LeagueTeam>()
            .HasOne(lt => lt.Team)
            .WithMany(t => t.LeagueTeams)
            .HasForeignKey(lt => lt.TeamId);
    }
}