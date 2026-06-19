namespace TouristPortal.DTO;

public class LoginResponseDto
{
    public int Id { get; set; }
    public string NomeUtente { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Ruolo { get; set; } = string.Empty;
    public string? Nome { get; set; }
    public string? Cognome { get; set; }
}
