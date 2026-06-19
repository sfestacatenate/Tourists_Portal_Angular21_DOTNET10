namespace TouristPortal.DTO;

public class GuidaDto
{
    public int Id { get; set; }
    public string Nome { get; set; } = string.Empty;
    public string Cognome { get; set; } = string.Empty;
    public string Specializzazione { get; set; } = string.Empty;
    public List<string> Lingue { get; set; } = [];
}
