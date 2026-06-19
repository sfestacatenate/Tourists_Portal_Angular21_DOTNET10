using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TouristPortal.Models;

[Table("guide_lingue")]
public class GuidaLingua
{
    [Key]
    public int Id { get; set; }

    [Required]
    [Column("guida_id")]
    public int GuidaId { get; set; }

    [Required]
    [MaxLength(50)]
    public string Lingua { get; set; } = string.Empty;

    [ForeignKey(nameof(GuidaId))]
    public Guida Guida { get; set; } = null!;
}
