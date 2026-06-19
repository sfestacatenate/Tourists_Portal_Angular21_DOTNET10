using Microsoft.EntityFrameworkCore;
using TouristPortal.Data;
using TouristPortal.Models;

namespace TouristPortal.Services;

public class AuthService
{
    private readonly TouristPortalDbContext _db;
    private static readonly TimeSpan SessionDuration = TimeSpan.FromMinutes(30);

    public AuthService(TouristPortalDbContext db)
    {
        _db = db;
    }

    public async Task<Sessione?> LoginAsync(string email, string password, string? ipIndirizzo, string? userAgent)
    {
        var utente = await _db.Utenti.FirstOrDefaultAsync(u => u.Email == email);

        if (utente is null || !BCrypt.Net.BCrypt.Verify(password, utente.PasswordHash))
            return null;

        var token = Convert.ToBase64String(System.Security.Cryptography.RandomNumberGenerator.GetBytes(32));

        var sessione = new Sessione
        {
            UtenteId = utente.Id,
            Token = token,
            DataCreazione = DateTime.UtcNow,
            DataScadenza = DateTime.UtcNow.Add(SessionDuration),
            DataUltimoUtilizzo = DateTime.UtcNow,
            IpIndirizzo = ipIndirizzo,
            UserAgent = userAgent
        };

        _db.Sessioni.Add(sessione);

        utente.UltimoAccesso = DateTime.UtcNow;

        await _db.SaveChangesAsync();

        return sessione;
    }

    public async Task LogoutAsync(string token)
    {
        var sessione = await _db.Sessioni.FirstOrDefaultAsync(s => s.Token == token);
        if (sessione is not null)
        {
            _db.Sessioni.Remove(sessione);
            await _db.SaveChangesAsync();
        }
    }

    public async Task<Utente?> ValidaSessioneAsync(string token)
    {
        var sessione = await _db.Sessioni
            .Include(s => s.Utente)
            .FirstOrDefaultAsync(s => s.Token == token);

        if (sessione is null || sessione.Utente is null)
            return null;

        if (sessione.DataScadenza < DateTime.UtcNow)
        {
            _db.Sessioni.Remove(sessione);
            await _db.SaveChangesAsync();
            return null;
        }

        sessione.DataUltimoUtilizzo = DateTime.UtcNow;
        sessione.DataScadenza = DateTime.UtcNow.Add(SessionDuration);
        await _db.SaveChangesAsync();

        return sessione.Utente;
    }
}
