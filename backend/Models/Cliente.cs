using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TouristPortal.Models;

[Table("clienti")]
public class Cliente
{
    [Key]
    public int Id { get; set; }

    [Required]
    [MaxLength(50)]
    public string Nome { get; set; } = string.Empty;

    [Required]
    [MaxLength(50)]
    public string Cognome { get; set; } = string.Empty;

    [Required]
    [MaxLength(16)]
    [Column("codice_fiscale")]
    public string CodiceFiscale { get; set; } = string.Empty;

    [Required]
    [Column("data_nascita")]
    public DateOnly DataNascita { get; set; }

    [MaxLength(255)]
    public string? Email { get; set; }

    [MaxLength(100)]
    public string? Citta { get; set; }
}
