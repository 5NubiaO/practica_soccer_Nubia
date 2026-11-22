using System.ComponentModel.DataAnnotations;

namespace SoccerApi.Models;

public class League
{
    public int ID {get; set;}

    [Required]
    [StringLength(50, MinimumLength = 2)]
    public string Name {get; set;} = string.Empty;

    [Required]
    [StringLength(50, MinimumLength = 2)]
    public string Country {get; set;} = string.Empty;

    public DateTime StartDate {get; set;} = DateTime.Now;
    public DateTime EndDate {get; set;} = DateTime.Now;

    public bool Enabled {get; set;} = true;

    public ICollection<LeagueTeam> LeagueTeams {get; set;} = new List<LeagueTeam>();
}
