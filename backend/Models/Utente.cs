using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TouristPortal.Models;

[Table("utenti")]
public class Utente
{
    [Key]
    public int Id { get; set; }

    [Required]
    [MaxLength(100)]
    [Column("nome_utente")]
    public string NomeUtente { get; set; } = string.Empty;

    [Required]
    [MaxLength(255)]
    public string Email { get; set; } = string.Empty;

    [Required]
    [MaxLength(255)]
    [Column("password_hash")]
    public string PasswordHash { get; set; } = string.Empty;

    [MaxLength(50)]
    public string? Nome { get; set; }

    [MaxLength(50)]
    public string? Cognome { get; set; }

    [Required]
    [MaxLength(50)]
    public string Ruolo { get; set; } = "Utente";

    [Column("data_creazione")]
    public DateTime DataCreazione { get; set; } = DateTime.UtcNow;

    [Column("ultimo_accesso")]
    public DateTime? UltimoAccesso { get; set; }
}
