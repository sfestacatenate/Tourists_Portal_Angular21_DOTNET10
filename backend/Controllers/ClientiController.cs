using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Mvc;
using TouristPortal.Data;
using TouristPortal.DTO;

namespace TouristPortal.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ClientiController : ControllerBase
{
    private readonly TouristPortalDbContext _db;

    public ClientiController(TouristPortalDbContext db)
    {
        _db = db;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<ClienteDto>>> Get()
    {
        var clienti = await _db.Clienti
            .Select(a => new ClienteDto
            {
                Id = a.Id,
                Nome = a.Nome,
                Cognome = a.Cognome,
                CodiceFiscale = a.CodiceFiscale,
                DataNascita = a.DataNascita,
                Email = a.Email ?? string.Empty,
                Citta = a.Citta ?? string.Empty
            })
            .ToListAsync();

        return Ok(clienti);
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<ClienteDto>> GetById(int id)
    {
        var cliente = await _db.Clienti
            .Where(a => a.Id == id)
            .Select(a => new ClienteDto
            {
                Id = a.Id,
                Nome = a.Nome,
                Cognome = a.Cognome,
                CodiceFiscale = a.CodiceFiscale,
                DataNascita = a.DataNascita,
                Email = a.Email ?? string.Empty,
                Citta = a.Citta ?? string.Empty
            })
            .FirstOrDefaultAsync();

        return cliente is null
            ? NotFound()
            : Ok(cliente);
    }

    [HttpPost]
    public async Task<ActionResult<ClienteDto>> Create([FromBody] ClienteDto dto)
    {
        var entity = new Models.Cliente
        {
            Nome = dto.Nome,
            Cognome = dto.Cognome,
            CodiceFiscale = dto.CodiceFiscale,
            DataNascita = dto.DataNascita,
            Email = dto.Email,
            Citta = dto.Citta
        };
        _db.Clienti.Add(entity);
        await _db.SaveChangesAsync();

        dto.Id = entity.Id;
        return CreatedAtAction(nameof(GetById), new { id = entity.Id }, dto);
    }

    [HttpPut("{id:int}")]
    public async Task<ActionResult<ClienteDto>> Update(int id, [FromBody] ClienteDto dto)
    {
        var entity = await _db.Clienti.FindAsync(id);
        if (entity is null)
            return NotFound();

        entity.Nome = dto.Nome;
        entity.Cognome = dto.Cognome;
        entity.CodiceFiscale = dto.CodiceFiscale;
        entity.DataNascita = dto.DataNascita;
        entity.Email = dto.Email;
        entity.Citta = dto.Citta;

        await _db.SaveChangesAsync();

        dto.Id = entity.Id;
        return Ok(dto);
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        var entity = await _db.Clienti.FindAsync(id);
        if (entity is null)
            return NotFound();

        _db.Clienti.Remove(entity);
        await _db.SaveChangesAsync();

        return NoContent();
    }
}
