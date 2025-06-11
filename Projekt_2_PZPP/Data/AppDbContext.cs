using Microsoft.EntityFrameworkCore;
using Projekt_2_PZPP.Models;
using System.Collections.Generic;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<User> Users => Set<User>();
    public DbSet<Link> Links { get; set; }
    public DbSet<Todo> Todos { get; set; }
    public DbSet<CalendarEvent> CalendarEvents { get; set; }
    public DbSet<StickyNote> StickyNotes { get; set; }

}
