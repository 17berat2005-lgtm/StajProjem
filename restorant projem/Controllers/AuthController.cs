using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using restorant_projem.Data;
using restorant_projem;

namespace restorant_projem.Controllers;

[Route("api/[controller]")]
[ApiController]
public class AuthController : ControllerBase
{
    private readonly AppDbContext _context;
    public AuthController(AppDbContext context) { _context = context; }

    public class LoginRequest
    {
        public string Username { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
    }

    public class RegisterRequest
    {
        public string Username { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequest loginUser)
    {
        var username = (loginUser.Username ?? string.Empty).Trim();
        var password = (loginUser.Password ?? string.Empty).Trim();

        if (string.IsNullOrWhiteSpace(username))
            return BadRequest(new { message = "Kullanıcı adı zorunlu." });

        // Kullanıcı adı üzerinden tekil giriş mantığı:
        // - Varsa şifreye hiç bakmadan içeri al.
        // - Yoksa yeni kullanıcı oluştur (varsayılan User rolü, istersen özel isimlere farklı rol verebiliriz).

        var user = await _context.Users.FirstOrDefaultAsync(u => u.Username == username);

        if (user == null)
        {
            var role = username.Equals("superadmin", StringComparison.OrdinalIgnoreCase)
                ? "SuperAdmin"
                : "User";

            user = new User
            {
                Username = username,
                Password = password,
                Role = role,
                CreatedDate = DateTime.Now
            };
            _context.Users.Add(user);
            await _context.SaveChangesAsync();
        }
        else
        {
            // Eski kayıtları normalize et (trim) ve istersen yeni şifreyi kaydet.
            user.Username = username;
            if (!string.IsNullOrEmpty(password))
            {
                user.Password = password;
            }
            await _context.SaveChangesAsync();
        }

        return Ok(new { username = user.Username, role = user.Role });
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterRequest newUser)
    {
        var username = (newUser.Username ?? string.Empty).Trim();
        var password = (newUser.Password ?? string.Empty).Trim();

        if (string.IsNullOrWhiteSpace(username) || string.IsNullOrWhiteSpace(password))
            return BadRequest("Kullanıcı adı ve şifre zorunlu!");

        if (await _context.Users.AnyAsync(u => u.Username == username)) return BadRequest("Bu isim alınmış!");

        var entity = new User
        {
            Username = username,
            Password = password,
            Role = "User", // Yeni kayıt olan herkes normal kullanıcıdır
            CreatedDate = DateTime.Now
        };

        _context.Users.Add(entity);
        await _context.SaveChangesAsync();
        return Ok(new { message = "Kayıt başarılı!" });
    }

    // 🔐 Sadece SuperAdmin arayüzünden kullanılacak: kullanıcıları listele
    [HttpGet("users")]
    public async Task<IActionResult> GetUsers()
    {
        var users = await _context.Users
            .OrderBy(u => u.Username)
            .Select(u => new { id = u.ID, username = u.Username, role = u.Role })
            .ToListAsync();

        return Ok(users);
    }

    public class UpdateRoleRequest
    {
        public string Role { get; set; } = string.Empty;
    }

    // 🔐 Süperadmin panelinden rol güncelleme
    [HttpPut("{id}/role")]
    public async Task<IActionResult> UpdateRole(int id, [FromBody] UpdateRoleRequest request)
    {
        var user = await _context.Users.FindAsync(id);
        if (user == null) return NotFound();

        var allowedRoles = new[] { "User", "Admin", "SuperAdmin" };
        if (!allowedRoles.Contains(request.Role))
        {
            return BadRequest("Geçersiz rol.");
        }

        user.Role = request.Role;
        await _context.SaveChangesAsync();
        return Ok(new { message = "Rol güncellendi." });
    }

    public class UpdatePasswordRequest
    {
        public string Password { get; set; } = string.Empty;
    }

    // Süperadmin için şifre güncelleme (reset)
    [HttpPut("{id}/password")]
    public async Task<IActionResult> UpdatePassword(int id, [FromBody] UpdatePasswordRequest request)
    {
        var user = await _context.Users.FindAsync(id);
        if (user == null) return NotFound();

        var newPass = (request.Password ?? string.Empty).Trim();
        if (string.IsNullOrWhiteSpace(newPass))
            return BadRequest("Şifre boş olamaz.");

        user.Password = newPass;
        await _context.SaveChangesAsync();
        return Ok(new { message = "Şifre güncellendi." });
    }
}