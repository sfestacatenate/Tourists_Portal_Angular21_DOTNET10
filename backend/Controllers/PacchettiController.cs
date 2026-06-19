using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Mvc;
using TouristPortal.Data;
using TouristPortal.DTO;

namespace TouristPortal.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PacchettiController : ControllerBase
{
    private readonly TouristPortalDbContext _db;

    public PacchettiController(TouristPortalDbContext db)
    {
        _db = db;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<PacchettoDto>>> Get()
    {
        var pacchetti = await _db.Pacchetti
            .Select(p => new PacchettoDto
            {
                Id = p.Id,
                Nome = p.Nome,
                Descrizione = p.Descrizione ?? string.Empty,
                Prezzo = p.Prezzo,
                DurataGiorni = p.DurataGiorni,
                Destinazione = p.Destinazione ?? string.Empty
            })
            .ToListAsync();

        return Ok(pacchetti);
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<PacchettoDto>> GetById(int id)
    {
        var pacchetto = await _db.Pacchetti
            .Where(p => p.Id == id)
            .Select(p => new PacchettoDto
            {
                Id = p.Id,
                Nome = p.Nome,
                Descrizione = p.Descrizione ?? string.Empty,
                Prezzo = p.Prezzo,
                DurataGiorni = p.DurataGiorni,
                Destinazione = p.Destinazione ?? string.Empty
            })
            .FirstOrDefaultAsync();

        return pacchetto is null
            ? NotFound()
            : Ok(pacchetto);
    }

    [HttpPost]
    public async Task<ActionResult<PacchettoDto>> Create([FromBody] PacchettoDto dto)
    {
        var entity = new Models.Pacchetto
        {
            Nome = dto.Nome,
            Descrizione = dto.Descrizione,
            Prezzo = dto.Prezzo,
            DurataGiorni = dto.DurataGiorni,
            Destinazione = dto.Destinazione
        };
        _db.Pacchetti.Add(entity);
        await _db.SaveChangesAsync();

        dto.Id = entity.Id;
        return CreatedAtAction(nameof(GetById), new { id = entity.Id }, dto);
    }

    [HttpPut("{id:int}")]
    public async Task<ActionResult<PacchettoDto>> Update(int id, [FromBody] PacchettoDto dto)
    {
        var entity = await _db.Pacchetti.FindAsync(id);
        if (entity is null)
            return NotFound();

        entity.Nome = dto.Nome;
        entity.Descrizione = dto.Descrizione;
        entity.Prezzo = dto.Prezzo;
        entity.DurataGiorni = dto.DurataGiorni;
        entity.Destinazione = dto.Destinazione;

        await _db.SaveChangesAsync();

        dto.Id = entity.Id;
        return Ok(dto);
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        var entity = await _db.Pacchetti.FindAsync(id);
        if (entity is null)
            return NotFound();

        _db.Pacchetti.Remove(entity);
        await _db.SaveChangesAsync();

        return NoContent();
    }
}
