using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Mvc;
using TouristPortal.Data;
using TouristPortal.DTO;

namespace TouristPortal.Controllers;

[ApiController]
[Route("api/[controller]")]
public class DestinazioniController : ControllerBase
{
    private readonly TouristPortalDbContext _db;
    private readonly IWebHostEnvironment _env;

    public DestinazioniController(TouristPortalDbContext db, IWebHostEnvironment env)
    {
        _db = db;
        _env = env;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<DestinazioneDto>>> Get()
    {
        var destinazioni = await _db.Destinazioni
            .Select(d => new DestinazioneDto
            {
                Id = d.Id,
                Nome = d.Nome,
                Descrizione = d.Descrizione ?? string.Empty,
                Localita = d.Localita ?? string.Empty,
                Immagine = d.Immagine ?? string.Empty
            })
            .ToListAsync();

        return Ok(destinazioni);
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<DestinazioneDto>> GetById(int id)
    {
        var destinazione = await _db.Destinazioni
            .Where(d => d.Id == id)
            .Select(d => new DestinazioneDto
            {
                Id = d.Id,
                Nome = d.Nome,
                Descrizione = d.Descrizione ?? string.Empty,
                Localita = d.Localita ?? string.Empty,
                Immagine = d.Immagine ?? string.Empty
            })
            .FirstOrDefaultAsync();

        return destinazione is null
            ? NotFound()
            : Ok(destinazione);
    }

    [HttpPost]
    public async Task<ActionResult<DestinazioneDto>> Create([FromBody] DestinazioneDto dto)
    {
        var entity = new Models.Destinazione
        {
            Nome = dto.Nome,
            Descrizione = dto.Descrizione,
            Localita = dto.Localita,
            Immagine = dto.Immagine
        };
        _db.Destinazioni.Add(entity);
        await _db.SaveChangesAsync();

        dto.Id = entity.Id;
        return CreatedAtAction(nameof(GetById), new { id = entity.Id }, dto);
    }

    [HttpPost("upload")]
    public async Task<ActionResult<object>> UploadImage(IFormFile file)
    {
        if (file == null || file.Length == 0)
            return BadRequest(new { error = "Nessun file fornito." });

        var allowedExtensions = new[] { ".jpg", ".jpeg", ".png", ".gif", ".webp" };
        var extension = Path.GetExtension(file.FileName).ToLowerInvariant();

        if (!allowedExtensions.Contains(extension))
            return BadRequest(new { error = "Formato file non supportato. Sono ammessi: " + string.Join(", ", allowedExtensions) });

        if (file.Length > 5 * 1024 * 1024)
            return BadRequest(new { error = "Il file non può superare 5 MB." });

        var uploadsDir = Path.Combine(_env.WebRootPath, "images", "destinations");
        Directory.CreateDirectory(uploadsDir);

        var fileName = $"{Guid.NewGuid()}{extension}";
        var filePath = Path.Combine(uploadsDir, fileName);

        using (var stream = new FileStream(filePath, FileMode.Create))
        {
            await file.CopyToAsync(stream);
        }

        var imageUrl = $"/images/destinations/{fileName}";
        return Ok(new { imageUrl });
    }

    [HttpPut("{id:int}")]
    public async Task<ActionResult<DestinazioneDto>> Update(int id, [FromBody] DestinazioneDto dto)
    {
        var entity = await _db.Destinazioni.FindAsync(id);
        if (entity is null)
            return NotFound();

        if (!string.IsNullOrEmpty(entity.Immagine) && entity.Immagine != dto.Immagine)
        {
            var uploadsDir = Path.Combine(_env.WebRootPath, "images", "destinations");
            var oldFileName = Path.GetFileName(entity.Immagine);
            var oldImagePath = Path.Combine(uploadsDir, oldFileName);
            if (System.IO.File.Exists(oldImagePath))
                System.IO.File.Delete(oldImagePath);
        }

        entity.Nome = dto.Nome;
        entity.Descrizione = dto.Descrizione;
        entity.Localita = dto.Localita;
        entity.Immagine = dto.Immagine;

        await _db.SaveChangesAsync();

        dto.Id = entity.Id;
        return Ok(dto);
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        var entity = await _db.Destinazioni.FindAsync(id);
        if (entity is null)
            return NotFound();

        if (!string.IsNullOrEmpty(entity.Immagine))
        {
            var uploadsDir = Path.Combine(_env.WebRootPath, "images", "destinations");
            var fileName = Path.GetFileName(entity.Immagine);
            var imagePath = Path.Combine(uploadsDir, fileName);
            if (System.IO.File.Exists(imagePath))
                System.IO.File.Delete(imagePath);
        }

        _db.Destinazioni.Remove(entity);
        await _db.SaveChangesAsync();

        return NoContent();
    }
}
