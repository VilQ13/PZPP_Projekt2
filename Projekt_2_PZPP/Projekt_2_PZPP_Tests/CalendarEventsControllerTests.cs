using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.VisualStudio.TestTools.UnitTesting;


[TestClass]
public class CalendarEventsControllerTests
{
    private AppDbContext _context;
    private CalendarEventsController _controller;

    [TestInitialize]
    public void Setup()
    {
        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
            .Options;

        _context = new AppDbContext(options);

        // Заполнение тестовыми данными
        var userId = Guid.NewGuid();
        _context.CalendarEvents.AddRange(new[]
{
        new CalendarEvent
        {
            Id = Guid.NewGuid(),
            UserId = userId,
            Title = "Event 1",
            Start = DateTime.UtcNow,
            AllDay = false,
            BackgroundColor = "#FFFFFF",
            BorderColor = "#000000",
            Description = "Description 1"
        },
        new CalendarEvent
        {
            Id = Guid.NewGuid(),
            UserId = userId,
            Title = "Event 2",
            Start = DateTime.UtcNow.AddDays(1),
            AllDay = true,
            BackgroundColor = "#FF0000",
            BorderColor = "#00FF00",
            Description = "Description 2"
        }
    });

        _context.SaveChanges();

        _controller = new CalendarEventsController(_context);

       
        var user = new ClaimsPrincipal(new ClaimsIdentity(new Claim[]
        {
            new Claim(ClaimTypes.NameIdentifier, userId.ToString())
        }, "mock"));

        _controller.ControllerContext = new ControllerContext()
        {
            HttpContext = new DefaultHttpContext() { User = user }
        };
    }

    [TestMethod]
    public async Task GetEvents_ReturnsOkWithEvents()
    {
        var result = await _controller.GetEvents();

        Assert.IsInstanceOfType(result, typeof(OkObjectResult));
        var okResult = (OkObjectResult)result;
        var events = okResult.Value as IEnumerable<CalendarEventDto>;
        Assert.IsNotNull(events);
        Assert.AreEqual(2, events.Count());
    }

    [TestMethod]
    public async Task GetEvents_ReturnsUnauthorized_WhenUserIdIsMissing()
    {
       
        _controller.ControllerContext.HttpContext.User = new ClaimsPrincipal(new ClaimsIdentity());

        var result = await _controller.GetEvents();

        Assert.IsInstanceOfType(result, typeof(UnauthorizedObjectResult));
    }
}
