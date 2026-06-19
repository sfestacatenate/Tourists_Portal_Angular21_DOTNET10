using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TouristPortal.Models;

[Table("pacchetti")]
public class Pacchetto
{
    [Key]
    public int Id { get; set; }

    [Required]
    [MaxLength(100)]
    public string Nome { get; set; } = string.Empty;

    public string? Descrizione { get; set; }

    [Column(TypeName = "decimal(10,2)")]
    public decimal Prezzo { get; set; }

    [Column("durata_giorni")]
    public int DurataGiorni { get; set; }

    [MaxLength(100)]
    public string? Destinazione { get; set; }
}
