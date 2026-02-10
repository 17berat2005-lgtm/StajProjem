using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using restorant_projem;
using restorant_projem.Data;

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
        var user = await _context.Users.FirstOrDefaultAsync(u => u.Username == loginUser.Username && u.Password == loginUser.Password);
        if (user == null) return Unauthorized(new { message = "Hatalı giriş!" });
        return Ok(new { user.ID, user.Username, user.Role });
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] User newUser)
    {
        if (await _context.Users.AnyAsync(u => u.Username == newUser.Username)) return BadRequest("Bu isim alınmış!");
        newUser.Role = "User";
        _context.Users.Add(newUser);
        await _context.SaveChangesAsync();
        return Ok(new { message = "Kayıt başarılı!" });
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

        user.Role = request.Role;
        await _context.SaveChangesAsync();

        return Ok(new { message = "Rol güncellendi.", user.Username, user.Role });
    }

    public class UpdateRoleRequest
    {
        public string Role { get; set; } = string.Empty;
    }
}