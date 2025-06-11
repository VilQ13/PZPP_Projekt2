using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

[ApiController]
[Route("api/[controller]")]
public class TodosController : ControllerBase
{
    private readonly AppDbContext _context;

    public TodosController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet("user/{userId}")]
    public async Task<IActionResult> GetTodos(Guid userId)
    {
        var todos = await _context.Todos
            .Where(t => t.UserId == userId)
            .ToListAsync();

        return Ok(todos);
    }

    [HttpPost]
    public async Task<IActionResult> AddTodo([FromBody] CreateTodoRequest request)
    {
        var todo = new Todo
        {
            Id = Guid.NewGuid(),
            Text = request.Text,
            IsCompleted = false,
            UserId = request.UserId
        };

        _context.Todos.Add(todo);
        await _context.SaveChangesAsync();

        return Ok(todo);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateTodo(Guid id, [FromBody] UpdateTodoRequest request)
    {
        var todo = await _context.Todos.FindAsync(id);
        if (todo == null) return NotFound();

        todo.Text = request.Text;
        todo.IsCompleted = request.IsCompleted;

        await _context.SaveChangesAsync();
        return Ok(todo);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteTodo(Guid id)
    {
        var todo = await _context.Todos.FindAsync(id);
        if (todo == null) return NotFound();

        _context.Todos.Remove(todo);
        await _context.SaveChangesAsync();
        return NoContent();
    }

    // DTOs
    public class CreateTodoRequest
    {
        public string Text { get; set; }
        public Guid UserId { get; set; }
    }

    public class UpdateTodoRequest
    {
        public string Text { get; set; }
        public bool IsCompleted { get; set; }
    }
}
