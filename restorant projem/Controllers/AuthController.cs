using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using restorant_projem.Data;
using restorant_projem.Models;

namespace restorant_projem.Controllers;

[Route("api/[controller]")]
[ApiController]
public class AuthController : ControllerBase
{
    private readonly AppDbContext _context;
    public AuthController(AppDbContext context) { _context = context; }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] User loginUser)
    {
        var username = (loginUser.Username ?? string.Empty).Trim();
        var password = (loginUser.Password ?? string.Empty).Trim();

        var user = await _context.Users
            .FirstOrDefaultAsync(u =>
                u.Username.ToLower() == username.ToLower() &&
                u.Password == password);

        if (user == null &&
            username.Equals("superadmin", StringComparison.OrdinalIgnoreCase) &&
            password == "1234")
        {
            user = new User
            {
                Username = "superadmin",
                Password = "1234",
                Role = "SuperAdmin",
                CreatedDate = DateTime.Now
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();
        }

        if (user == null)
        {
            return Unauthorized(new { message = "Hatali giris!" });
        }

        return Ok(new { user.ID, user.Username, user.Role });
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] User newUser)
    {
        if (await _context.Users.AnyAsync(u => u.Username == newUser.Username)) return BadRequest("Bu isim alinmis!");
        newUser.Role = "User";
        _context.Users.Add(newUser);
        await _context.SaveChangesAsync();
        return Ok(new { message = "Kayit basarili!" });
    }

    [HttpGet("users")]
    public async Task<ActionResult<IEnumerable<User>>> GetUsers()
    {
        var users = await _context.Users
            .OrderBy(u => u.Username)
            .ToListAsync();

        return Ok(users);
    }

    [HttpPut("users/{id}/role")]
    public async Task<IActionResult> UpdateUserRole(int id, [FromBody] UpdateRoleRequest request)
    {
        var user = await _context.Users.FindAsync(id);
        if (user == null) return NotFound();

        var allowedRoles = new[] { "User", "Admin", "SuperAdmin" };
        if (!allowedRoles.Contains(request.Role))
            return BadRequest(new { message = "Gecersiz rol." });

        user.Role = request.Role;
        await _context.SaveChangesAsync();

        return Ok(new { message = "Rol guncellendi.", user.Username, user.Role });
    }

    public class UpdateRoleRequest
    {
        public string Role { get; set; } = string.Empty;
    }
}