using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using restorant_projem.Data;
using restorant_projem.Models;
using System.Linq;

namespace restorant_projem.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MenuDetailController : ControllerBase
    {
        private readonly AppDbContext _context;

        public MenuDetailController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public IActionResult GetMenu()
        {
            var items = _context.MenuDetails
                .Include(m => m.Category)
                .Select(m => new
                {
                    m.Id,
                    m.FoodName,
                    m.Description,
                    m.Price,
                    m.Calories,
                    m.IsActive,
                    m.CreatedDate,
                    m.CategoryId,
                    CategoryName = m.Category != null ? m.Category.Name : null
                })
                .ToList();

            return Ok(items);
        }

        [HttpPost]
        public IActionResult AddMenu([FromBody] MenuDetail item)
        {
            _context.MenuDetails.Add(item);
            _context.SaveChanges();
            return Ok();
        }

        [HttpDelete("{id}")]
        public IActionResult DeleteMenu(int id)
        {
            var item = _context.MenuDetails.Find(id);
            if (item == null) return NotFound();
            _context.MenuDetails.Remove(item);
            _context.SaveChanges();
            return Ok();
        }
    }
}