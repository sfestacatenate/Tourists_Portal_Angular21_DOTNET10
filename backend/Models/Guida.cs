using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TouristPortal.Models;

[Table("guide")]
public class Guida
{
    [Key]
    public int Id { get; set; }

    [Required]
    [MaxLength(50)]
    public string Nome { get; set; } = string.Empty;

    [Required]
    [MaxLength(50)]
    public string Cognome { get; set; } = string.Empty;

    [MaxLength(100)]
    public string? Specializzazione { get; set; }

    public List<GuidaLingua> GuideLingue { get; set; } = [];
}
