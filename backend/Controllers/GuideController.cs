using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Mvc;
using TouristPortal.Data;
using TouristPortal.DTO;

namespace TouristPortal.Controllers;

[ApiController]
[Route("api/[controller]")]
public class GuideController : ControllerBase
{
    private readonly TouristPortalDbContext _db;

    public GuideController(TouristPortalDbContext db)
    {
        _db = db;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<GuidaDto>>> Get()
    {
        var guide = await _db.Guide
            .Include(g => g.GuideLingue)
            .Select(g => new GuidaDto
            {
                Id = g.Id,
                Nome = g.Nome,
                Cognome = g.Cognome,
                Specializzazione = g.Specializzazione ?? string.Empty,
                Lingue = g.GuideLingue.Select(gl => gl.Lingua).ToList()
            })
            .ToListAsync();

        return Ok(guide);
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<GuidaDto>> GetById(int id)
    {
        var guida = await _db.Guide
            .Include(g => g.GuideLingue)
            .Where(g => g.Id == id)
            .Select(g => new GuidaDto
            {
                Id = g.Id,
                Nome = g.Nome,
                Cognome = g.Cognome,
                Specializzazione = g.Specializzazione ?? string.Empty,
                Lingue = g.GuideLingue.Select(gl => gl.Lingua).ToList()
            })
            .FirstOrDefaultAsync();

        return guida is null
            ? NotFound()
            : Ok(guida);
    }

    [HttpPost]
    public async Task<ActionResult<GuidaDto>> Create([FromBody] GuidaDto dto)
    {
        var entity = new Models.Guida
        {
            Nome = dto.Nome,
            Cognome = dto.Cognome,
            Specializzazione = dto.Specializzazione,
            GuideLingue = dto.Lingue.Select(l => new Models.GuidaLingua { Lingua = l }).ToList()
        };
        _db.Guide.Add(entity);
        await _db.SaveChangesAsync();

        dto.Id = entity.Id;
        return CreatedAtAction(nameof(GetById), new { id = entity.Id }, dto);
    }

    [HttpPut("{id:int}")]
    public async Task<ActionResult<GuidaDto>> Update(int id, [FromBody] GuidaDto dto)
    {
        var entity = await _db.Guide
            .Include(g => g.GuideLingue)
            .FirstOrDefaultAsync(g => g.Id == id);
        if (entity is null)
            return NotFound();

        entity.Nome = dto.Nome;
        entity.Cognome = dto.Cognome;
        entity.Specializzazione = dto.Specializzazione;

        _db.GuideLingue.RemoveRange(entity.GuideLingue);
        entity.GuideLingue = dto.Lingue.Select(l => new Models.GuidaLingua { Lingua = l }).ToList();

        await _db.SaveChangesAsync();

        dto.Id = entity.Id;
        return Ok(dto);
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        var entity = await _db.Guide
            .Include(g => g.GuideLingue)
            .FirstOrDefaultAsync(g => g.Id == id);
        if (entity is null)
            return NotFound();

        _db.GuideLingue.RemoveRange(entity.GuideLingue);
        _db.Guide.Remove(entity);
        await _db.SaveChangesAsync();

        return NoContent();
    }
}
