using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Projekt_2_PZPP.Controllers;
using Projekt_2_PZPP.Models;
using System.Security.Claims;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class StickyNotesController : ControllerBase
{
    private readonly AppDbContext _context;

    public StickyNotesController(AppDbContext context)
    {
        _context = context;
    }


    private Guid? GetCurrentUserId()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value ??
                         User.FindFirst("nameid")?.Value ??
                         User.FindFirst("sub")?.Value;

        if (userIdClaim != null && Guid.TryParse(userIdClaim, out var userId))
        {
            return userId;
        }
        return null;
    }

    [HttpGet]
    public async Task<IActionResult> GetNotes()
    {
        var userId = GetCurrentUserId();
        if (userId == null)
            return Unauthorized("User ID not found in token");

        var notes = await _context.StickyNotes
            .Where(n => n.UserId == userId)
            .OrderBy(n => n.CreatedAt)
            .ToListAsync();

        var result = notes.Select(n => new StickyNoteDto
        {
            Id = n.Id,
            Content = n.Content,
            BackgroundColor = n.BackgroundColor,
            PositionX = n.PositionX,
            PositionY = n.PositionY
        });

        return Ok(result);
    }


    [HttpPost]
    public async Task<IActionResult> CreateNote([FromBody] CreateStickyNoteDto dto)
    {
        var userId = GetCurrentUserId();
        if (userId == null)
            return Unauthorized("User ID not found in token");

        var note = new StickyNote
        {
            Id = Guid.NewGuid(),
            Content = dto.Content,
            BackgroundColor = dto.BackgroundColor,
            PositionX = dto.PositionX,
            PositionY = dto.PositionY,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow,
            UserId = userId.Value
        };

        _context.StickyNotes.Add(note);
        await _context.SaveChangesAsync();

        var result = new StickyNoteDto
        {
            Id = note.Id,
            Content = note.Content,
            BackgroundColor = note.BackgroundColor,
            PositionX = note.PositionX,
            PositionY = note.PositionY
        };

        return Ok(result);
    }


    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateNote(Guid id, [FromBody] UpdateStickyNoteDto dto)
    {
        var userId = GetCurrentUserId();
        if (userId == null)
            return Unauthorized("User ID not found in token");

        var note = await _context.StickyNotes.FindAsync(id);
        if (note == null || note.UserId != userId)
            return NotFound();

        note.Content = dto.Content;
        note.BackgroundColor = dto.BackgroundColor;
        note.PositionX = dto.PositionX;
        note.PositionY = dto.PositionY;
        note.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        var result = new StickyNoteDto
        {
            Id = note.Id,
            Content = note.Content,
            BackgroundColor = note.BackgroundColor,
            PositionX = note.PositionX,
            PositionY = note.PositionY
        };

        return Ok(result);
    }


    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteNote(Guid id)
    {
        var userId = GetCurrentUserId();
        if (userId == null)
            return Unauthorized("User ID not found in token");

        var note = await _context.StickyNotes.FindAsync(id);
        if (note == null || note.UserId != userId)
            return NotFound();

        _context.StickyNotes.Remove(note);
        await _context.SaveChangesAsync();

        return NoContent();
    }


    [HttpDelete]
    public async Task<IActionResult> DeleteAllNotes()
    {
        var userId = GetCurrentUserId();
        if (userId == null)
            return Unauthorized("User ID not found in token");

        var notes = await _context.StickyNotes
            .Where(n => n.UserId == userId)
            .ToListAsync();

        _context.StickyNotes.RemoveRange(notes);
        await _context.SaveChangesAsync();

        return NoContent();
    }
}