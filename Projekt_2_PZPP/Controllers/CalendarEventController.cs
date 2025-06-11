using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class CalendarEventsController : ControllerBase
{
    private readonly AppDbContext _context;

    public CalendarEventsController(AppDbContext context)
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
    public async Task<IActionResult> GetEvents()
    {
        var userId = GetCurrentUserId();
        if (userId == null)
            return Unauthorized("User ID not found in token");

        var events = await _context.CalendarEvents
            .Where(e => e.UserId == userId)
            .ToListAsync();

        var result = events.Select(e => new CalendarEventDto
        {
            Id = e.Id,
            Title = e.Title,
            Start = e.Start.ToString("o"),
            End = e.End?.ToString("o"),
            AllDay = e.AllDay,
            BackgroundColor = e.BackgroundColor,
            BorderColor = e.BorderColor,
            Description = e.Description
        });

        return Ok(result);
    }


    [HttpPost]
    public async Task<IActionResult> AddEvent([FromBody] CalendarEventDto dto)
    {
        var userId = GetCurrentUserId();
        if (userId == null)
            return Unauthorized("User ID not found in token");

        var newEvent = new CalendarEvent
        {
            Id = Guid.NewGuid(),
            Title = dto.Title,
            Start = DateTime.Parse(dto.Start),
            End = string.IsNullOrEmpty(dto.End) ? null : DateTime.Parse(dto.End),
            AllDay = dto.AllDay,
            BackgroundColor = dto.BackgroundColor,
            BorderColor = dto.BorderColor,
            Description = dto.Description,
            UserId = userId.Value
        };

        _context.CalendarEvents.Add(newEvent);
        await _context.SaveChangesAsync();

        return Ok(new CalendarEventDto
        {
            Id = newEvent.Id,
            Title = newEvent.Title,
            Start = newEvent.Start.ToString("o"),
            End = newEvent.End?.ToString("o"),
            AllDay = newEvent.AllDay,
            BackgroundColor = newEvent.BackgroundColor,
            BorderColor = newEvent.BorderColor,
            Description = newEvent.Description
        });
    }


    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateEvent(Guid id, [FromBody] CalendarEventDto dto)
    {
        var userId = GetCurrentUserId();
        if (userId == null)
            return Unauthorized("User ID not found in token");

        var evt = await _context.CalendarEvents.FindAsync(id);
        if (evt == null || evt.UserId != userId)
            return NotFound();

        evt.Title = dto.Title;
        evt.Start = DateTime.Parse(dto.Start);
        evt.End = string.IsNullOrEmpty(dto.End) ? null : DateTime.Parse(dto.End);
        evt.AllDay = dto.AllDay;
        evt.BackgroundColor = dto.BackgroundColor;
        evt.BorderColor = dto.BorderColor;
        evt.Description = dto.Description;

        await _context.SaveChangesAsync();

        return Ok(new CalendarEventDto
        {
            Id = evt.Id,
            Title = evt.Title,
            Start = evt.Start.ToString("o"),
            End = evt.End?.ToString("o"),
            AllDay = evt.AllDay,
            BackgroundColor = evt.BackgroundColor,
            BorderColor = evt.BorderColor,
            Description = evt.Description
        });
    }


    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteEvent(Guid id)
    {
        var userId = GetCurrentUserId();
        if (userId == null)
            return Unauthorized("User ID not found in token");

        var evt = await _context.CalendarEvents.FindAsync(id);
        if (evt == null || evt.UserId != userId)
            return NotFound();

        _context.CalendarEvents.Remove(evt);
        await _context.SaveChangesAsync();

        return NoContent();
    }
}