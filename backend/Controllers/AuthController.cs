using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TouristPortal.DTO;
using TouristPortal.Services;

namespace TouristPortal.Controllers;

[ApiController]
[Route("api/auth")]
[AllowAnonymous]
public class AuthController : ControllerBase
{
    private readonly AuthService _authService;

    private const string SessionCookieName = "session_token";

    public AuthController(AuthService authService)
    {
        _authService = authService;
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequestDto request)
    {
        var ip = HttpContext.Connection.RemoteIpAddress?.ToString();
        var userAgent = Request.Headers.UserAgent.ToString();

        var sessione = await _authService.LoginAsync(request.Email, request.Password, ip, userAgent);

        if (sessione is null)
            return Unauthorized(new { message = "Email o password non validi." });

        Response.Cookies.Append(SessionCookieName, sessione.Token, new CookieOptions
        {
            HttpOnly = true,
            Secure = false,
            SameSite = SameSiteMode.Strict,
            Expires = DateTimeOffset.UtcNow.AddMinutes(30),
            Path = "/"
        });

        return Ok(new LoginResponseDto
        {
            Id = sessione.Utente!.Id,
            NomeUtente = sessione.Utente.NomeUtente,
            Email = sessione.Utente.Email,
            Ruolo = sessione.Utente.Ruolo,
            Nome = sessione.Utente.Nome,
            Cognome = sessione.Utente.Cognome
        });
    }

    [HttpPost("logout")]
    public async Task<IActionResult> Logout()
    {
        var token = Request.Cookies[SessionCookieName];

        if (token is not null)
            await _authService.LogoutAsync(token);

        Response.Cookies.Append(SessionCookieName, "", new CookieOptions
        {
            HttpOnly = true,
            Secure = false,
            SameSite = SameSiteMode.Strict,
            Expires = DateTimeOffset.UtcNow.AddDays(-1),
            Path = "/"
        });

        return Ok(new { message = "Logout effettuato." });
    }

    [HttpGet("me")]
    public async Task<IActionResult> Me()
    {
        var token = Request.Cookies[SessionCookieName];

        if (token is null)
            return Unauthorized(new { message = "Nessuna sessione attiva." });

        var utente = await _authService.ValidaSessioneAsync(token);

        if (utente is null)
        {
            Response.Cookies.Append(SessionCookieName, "", new CookieOptions
            {
                HttpOnly = true,
                Secure = false,
                SameSite = SameSiteMode.Strict,
                Expires = DateTimeOffset.UtcNow.AddDays(-1),
                Path = "/"
            });

            return Unauthorized(new { message = "Sessione scaduta o non valida." });
        }

        Response.Cookies.Append(SessionCookieName, token, new CookieOptions
        {
            HttpOnly = true,
            Secure = false,
            SameSite = SameSiteMode.Strict,
            Expires = DateTimeOffset.UtcNow.AddMinutes(30),
            Path = "/"
        });

        return Ok(new LoginResponseDto
        {
            Id = utente.Id,
            NomeUtente = utente.NomeUtente,
            Email = utente.Email,
            Ruolo = utente.Ruolo,
            Nome = utente.Nome,
            Cognome = utente.Cognome
        });
    }
}
