using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.VisualStudio.TestTools.UnitTesting;


[TestClass]
public class UserControllerTests
{
    private AppDbContext _context;
    private UserController _controller;
    private IConfiguration _configuration;

    [TestInitialize]
    public void Setup()
    {
        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString())
            .Options;

        _context = new AppDbContext(options);

        var inMemorySettings = new Dictionary<string, string> {
            {"Jwt:Key", "VerySecretKeyForTesting123!"}
        };

        _configuration = new ConfigurationBuilder()
            .AddInMemoryCollection(inMemorySettings)
            .Build();

        _controller = new UserController(_context, _configuration);
    }

    [TestMethod]
    public async Task Register_ReturnsOk_WhenUserIsNew()
    {
        var request = new RegisterRequest
        {
            Username = "testuser",
            Password = "password123",
            Email = "test@test.com"
        };

        var result = await _controller.Register(request);
        Assert.IsInstanceOfType(result, typeof(OkObjectResult));
    }

    [TestMethod]
    public async Task Register_ReturnsBadRequest_WhenUsernameExists()
    {
        _context.Users.Add(new User { Id = Guid.NewGuid(), Username = "exists", PasswordHash = "hash" });
        _context.SaveChanges();

        var request = new RegisterRequest
        {
            Username = "exists",
            Password = "password123",
            Email = "test@test.com"
        };

        var result = await _controller.Register(request);
        Assert.IsInstanceOfType(result, typeof(BadRequestObjectResult));
    }
}
