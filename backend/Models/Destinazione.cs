using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TouristPortal.Models;

[Table("destinazioni")]
public class Destinazione
{
    [Key]
    public int Id { get; set; }

    [Required]
    [MaxLength(100)]
    public string Nome { get; set; } = string.Empty;

    public string? Descrizione { get; set; }

    [MaxLength(100)]
    public string? Localita { get; set; }

    [MaxLength(255)]
    public string? Immagine { get; set; }
}
