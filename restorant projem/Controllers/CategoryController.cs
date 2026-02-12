using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using restorant_projem.Data;
using restorant_projem.Models;

namespace restorant_projem.Controllers;

[Route("api/[controller]")]
[ApiController]
public class CategoryController : ControllerBase
{
    private readonly AppDbContext _context;

    public CategoryController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Category>>> GetCategories()
    {
        var categories = await _context.Categories
            .OrderBy(c => c.Name)
            .ToListAsync();

        return Ok(categories);
    }

    [HttpPost]
    public async Task<ActionResult<Category>> CreateCategory([FromBody] Category category)
    {
        if (string.IsNullOrWhiteSpace(category.Name))
        {
            return BadRequest(new { message = "Kategori adi bos olamaz." });
        }

        category.Name = category.Name.Trim();

        if (await _context.Categories.AnyAsync(c => c.Name == category.Name))
        {
            return BadRequest(new { message = "Bu kategori adi zaten mevcut." });
        }

        _context.Categories.Add(category);
        await _context.SaveChangesAsync();

        return Ok(category);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateCategory(int id, [FromBody] Category category)
    {
        var existing = await _context.Categories.FindAsync(id);
        if (existing == null) return NotFound();

        if (string.IsNullOrWhiteSpace(category.Name))
        {
            return BadRequest(new { message = "Kategori adi bos olamaz." });
        }

        var newName = category.Name.Trim();
        if (await _context.Categories.AnyAsync(c => c.Id != id && c.Name == newName))
        {
            return BadRequest(new { message = "Bu kategori adi zaten mevcut." });
        }

        existing.Name = newName;
        await _context.SaveChangesAsync();

        return Ok(existing);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteCategory(int id)
    {
        var category = await _context.Categories
            .Include(c => c.MenuItems)
            .FirstOrDefaultAsync(c => c.Id == id);

        if (category == null) return NotFound();

        if (category.MenuItems != null && category.MenuItems.Any())
        {
            foreach (var item in category.MenuItems)
            {
                item.CategoryId = null;
            }
        }

        _context.Categories.Remove(category);
        await _context.SaveChangesAsync();

        return Ok(new { message = "Kategori silindi." });
    }
}


