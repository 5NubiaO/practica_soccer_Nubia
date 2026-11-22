using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SoccerApi.Data;
using SoccerApi.Models;

namespace SoccerApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class LeaguesController : ControllerBase
{
    private readonly SoccerContext _context;

    public LeaguesController(SoccerContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<League>>> GetLeagues()
    {
        return await _context.Leagues.ToListAsync();
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<League>> GetLeague(int id)
    {
        var league = await _context.Leagues.FindAsync(id);
        if (league == null) return NotFound();
        return league;
    }

    [HttpPost]
    public async Task<ActionResult<League>> CreateLeague(League league)
    {
        if (league.StartDate > league.EndDate)
            return BadRequest("La fecha de inicio no puede ser mayor que la fecha final");

        _context.Leagues.Add(league);
        await _context.SaveChangesAsync();
        return CreatedAtAction(nameof(GetLeague), new { id = league.ID }, league);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateLeague(int id, League league)
    {
        if (id != league.ID) return BadRequest();
        if (league.StartDate > league.EndDate)
            return BadRequest("La fecha de inicio no puede ser mayor que la fecha final");

        _context.Entry(league).State = EntityState.Modified;
        await _context.SaveChangesAsync();
        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteLeague(int id)
    {
        var league = await _context.Leagues.FindAsync(id);
        if (league == null) return NotFound();

        _context.Leagues.Remove(league);
        await _context.SaveChangesAsync();
        return NoContent();
    }

    [HttpGet("{id}/teams")]
    public async Task<ActionResult<IEnumerable<Team>>> GetLeagueTeams(int id)
    {
        var league = await _context.Leagues
            .Include(l => l.LeagueTeams)
            .ThenInclude(lt => lt.Team)
            .FirstOrDefaultAsync(l => l.ID == id);
        if (league == null) return NotFound();
        return league.LeagueTeams.Select(lt => lt.Team).ToList();
    }

    [HttpPost("{id}/teams/{teamId}")]
    public async Task<IActionResult> AddTeamToLeague(int id, int teamId)
    {
        var league = await _context.Leagues.FindAsync(id);
        if (league == null) return NotFound("Liga no encontrada.");

        var team = await _context.Teams.FindAsync(teamId);
        if (team == null) return NotFound("Equipo no encontrado.");

        var exists = await _context.LeagueTeams
            .AnyAsync(lt => lt.LeagueId == id && lt.TeamId == teamId);
        if (exists) return BadRequest("El equipo ya está inscrito en esta liga.");

        _context.LeagueTeams.Add(new LeagueTeam { LeagueId = id, TeamId = teamId });
        await _context.SaveChangesAsync();
        return NoContent();
    }

    [HttpDelete("{id}/teams/{teamId}")]
    public async Task<IActionResult> RemoveTeamFromLeague(int id, int teamId)
    {
        var enrolment = await _context.LeagueTeams
            .FirstOrDefaultAsync(lt => lt.LeagueId == id && lt.TeamId == teamId);
        if (enrolment == null) return NotFound();

        _context.LeagueTeams.Remove(enrolment);
        await _context.SaveChangesAsync();
        return NoContent();
    }
}