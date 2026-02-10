using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using restorant_projem;
using restorant_projem.Data;

namespace restorant_projem.Controllers;

[Route("api/[controller]")]
[ApiController]
public class MenuController : ControllerBase
{
    private readonly AppDbContext _context;
    public MenuController(AppDbContext context) => _context = context;

    [HttpGet]
    public async Task<ActionResult<IEnumerable<RestaurantMenu>>> GetMenus()
        => await _context.RestaurantMenus.ToListAsync();
}