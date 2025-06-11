using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Projekt_2_PZPP.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class LinksController : ControllerBase
    {
        private readonly AppDbContext _context;

        public LinksController(AppDbContext context)
        {
            _context = context;
        }

        
        [HttpGet("user/{userId}")]
        public async Task<IActionResult> GetUserLinks(Guid userId)
        {
            var links = await _context.Links
                .Where(l => l.UserId == userId)
                .ToListAsync();

            return Ok(links);
        }

     
        [HttpPost]
        public async Task<IActionResult> AddLink([FromBody] CreateLinkRequest request)
        {
            var link = new Link
            {
                Id = Guid.NewGuid(),      
                Url = request.Url,
                Name = request.Name,
                UserId = request.UserId     
            };

            _context.Links.Add(link);
            await _context.SaveChangesAsync();
            return Ok(link);
        }

        public class CreateLinkRequest
        {
            public string Url { get; set; }
            public string Name { get; set; }
            public Guid UserId { get; set; }
        }       

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteLink(Guid id)
        {
            var link = await _context.Links.FindAsync(id);
            if (link == null)
                return NotFound();

            _context.Links.Remove(link);
            await _context.SaveChangesAsync();
            return NoContent();
        }

      
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateLink(Guid id, [FromBody] UpdateLinkDto dto)
        {
            var link = await _context.Links.FindAsync(id);
            if (link == null)
                return NotFound();

            link.Name = dto.Name;
            link.Url = dto.Url;
            await _context.SaveChangesAsync();
            return Ok(link);
        }

     
        public class UpdateLinkDto
        {
            public string Name { get; set; }
            public string Url { get; set; }
        }
    }

}
