using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TouristPortal.Models;

[Table("sessioni")]
public class Sessione
{
    [Key]
    public int Id { get; set; }

    [Required]
    [Column("utente_id")]
    public int UtenteId { get; set; }

    [Required]
    [MaxLength(255)]
    public string Token { get; set; } = string.Empty;

    [Column("data_creazione")]
    public DateTime DataCreazione { get; set; } = DateTime.UtcNow;

    [Column("data_scadenza")]
    public DateTime DataScadenza { get; set; }

    [Column("data_ultimo_utilizzo")]
    public DateTime DataUltimoUtilizzo { get; set; } = DateTime.UtcNow;

    [Column("ip_indirizzo")]
    [MaxLength(45)]
    public string? IpIndirizzo { get; set; }

    [Column("user_agent")]
    [MaxLength(500)]
    public string? UserAgent { get; set; }

    [ForeignKey(nameof(UtenteId))]
    public Utente? Utente { get; set; }
}
