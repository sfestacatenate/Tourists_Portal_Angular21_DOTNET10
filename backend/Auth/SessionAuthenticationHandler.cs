using System.Security.Claims;
using System.Text.Encodings.Web;
using Microsoft.AspNetCore.Authentication;
using Microsoft.Extensions.Options;
using TouristPortal.Services;

namespace TouristPortal.Auth;

public class SessionAuthenticationHandler : AuthenticationHandler<AuthenticationSchemeOptions>
{
    public const string SchemeName = "SessionCookie";

    public SessionAuthenticationHandler(
        IOptionsMonitor<AuthenticationSchemeOptions> options,
        ILoggerFactory logger,
        UrlEncoder encoder)
        : base(options, logger, encoder) { }

    protected override async Task<AuthenticateResult> HandleAuthenticateAsync()
    {
        if (!Request.Cookies.TryGetValue("session_token", out var token) || string.IsNullOrEmpty(token))
            return AuthenticateResult.Fail("Nessun token di sessione.");

        var authService = Context.RequestServices.GetRequiredService<AuthService>();
        var utente = await authService.ValidaSessioneAsync(token);

        if (utente is null)
            return AuthenticateResult.Fail("Sessione non valida o scaduta.");

        var claims = new[]
        {
            new Claim(ClaimTypes.NameIdentifier, utente.Id.ToString()),
            new Claim(ClaimTypes.Name, utente.NomeUtente),
            new Claim(ClaimTypes.Email, utente.Email),
            new Claim(ClaimTypes.Role, utente.Ruolo)
        };

        var identity = new ClaimsIdentity(claims, Scheme.Name);
        var principal = new ClaimsPrincipal(identity);
        var ticket = new AuthenticationTicket(principal, Scheme.Name);

        return AuthenticateResult.Success(ticket);
    }
}
