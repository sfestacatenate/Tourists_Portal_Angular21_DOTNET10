namespace TouristPortal.DTO;

public class PacchettoDto
{
    public int Id { get; set; }
    public string Nome { get; set; } = string.Empty;
    public string Descrizione { get; set; } = string.Empty;
    public decimal Prezzo { get; set; }
    public int DurataGiorni { get; set; }
    public string Destinazione { get; set; } = string.Empty;
}
