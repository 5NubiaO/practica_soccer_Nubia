using System.ComponentModel.DataAnnotations;

namespace SoccerApi.Models;

public class Team
{
    public int ID {get; set;}

    [Required]
    [StringLength(50, MinimumLength = 2)]
    public string Name {get; set;} = string.Empty;

    [Required]
    [StringLength(50, MinimumLength = 2)]
    public string Country {get; set;} = string.Empty;

    [Range(11, 22)]
    public int PlayersQuantity {get; set;}

    public bool Enabled {get; set;} = true;

    public ICollection<LeagueTeam> LeagueTeams {get; set;} = new List<LeagueTeam>();
}