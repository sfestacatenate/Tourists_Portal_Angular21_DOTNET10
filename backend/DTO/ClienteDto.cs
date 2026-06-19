namespace TouristPortal.DTO;

public class ClienteDto
{
    public int Id { get; set; }
    public string Nome { get; set; } = string.Empty;
    public string Cognome { get; set; } = string.Empty;
    public string CodiceFiscale { get; set; } = string.Empty;
    public DateOnly DataNascita { get; set; }
    public string Email { get; set; } = string.Empty;
    public string Citta { get; set; } = string.Empty;
}
