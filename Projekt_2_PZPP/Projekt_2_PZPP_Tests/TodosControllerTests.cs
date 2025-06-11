using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.VisualStudio.TestTools.UnitTesting;


[TestClass]
public class TodosControllerTests
{
    private AppDbContext _context;
    private TodosController _controller;
    private Guid userId;

    [TestInitialize]
    public void Setup()
    {
        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString())
            .Options;

        _context = new AppDbContext(options);

        userId = Guid.NewGuid();

        _context.Todos.AddRange(new[]
        {
            new Todo { Id = Guid.NewGuid(), UserId = userId, Text = "Task 1", IsCompleted = false },
            new Todo { Id = Guid.NewGuid(), UserId = userId, Text = "Task 2", IsCompleted = true }
        });

        _context.SaveChanges();

        _controller = new TodosController(_context);
    }

    [TestMethod]
    public async Task GetTodos_ReturnsTodosForUser()
    {
        var result = await _controller.GetTodos(userId);
        Assert.IsInstanceOfType(result, typeof(OkObjectResult));
        var okResult = (OkObjectResult)result;
        var todos = okResult.Value as List<Todo>;
        Assert.IsNotNull(todos);
        Assert.AreEqual(2, todos.Count);
    }
}
