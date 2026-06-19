using Microsoft.EntityFrameworkCore;
using TouristPortal.Models;

namespace TouristPortal.Data;

public class TouristPortalDbContext : DbContext
{
    public TouristPortalDbContext(DbContextOptions<TouristPortalDbContext> options) : base(options) { }

    public DbSet<Cliente> Clienti { get; set; }
    public DbSet<Destinazione> Destinazioni { get; set; }
    public DbSet<Guida> Guide { get; set; }
    public DbSet<GuidaLingua> GuideLingue { get; set; }
    public DbSet<Pacchetto> Pacchetti { get; set; }
    public DbSet<Utente> Utenti { get; set; }
    public DbSet<Sessione> Sessioni { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Guida>(entity =>
        {
            entity.HasMany(g => g.GuideLingue)
                  .WithOne(gl => gl.Guida)
                  .HasForeignKey(gl => gl.GuidaId)
                  .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<GuidaLingua>(entity =>
        {
            entity.HasIndex(gl => gl.GuidaId);
        });
    }
}
