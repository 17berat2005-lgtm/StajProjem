using Microsoft.AspNetCore.Mvc;
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
            // Veritabanını, SQL'i, paketleri siktir et; direkt bunu basıyoruz:
            var sahteListe = new List<object>
    {
        new { MenuName = "Kanka Burger", Price = 250, IsActive = true, FoodName = "Burger", Description = "Efsane Soslu", Calories = 850 },
        new { MenuName = "Kanka Pizza", Price = 320, IsActive = true, FoodName = "Pizza", Description = "Bol Malzeme", Calories = 1200 },
        new { MenuName = "Kanka Kola", Price = 60, IsActive = true, FoodName = "İçecek", Description = "Buz Gibi", Calories = 150 }
    };

            return Ok(sahteListe);
        }

        [HttpPost]
        public IActionResult AddMenu([FromBody] MenuDetail item)
        {
           
            if (item.CreatedDate == default)
            {
                item.CreatedDate = DateTime.Now;
            }

            _context.MenuDetails.Add(item);
            _context.SaveChanges();

          
            return Ok(item);
        }

        [HttpPut("{id}")]
        public IActionResult UpdateMenu(int id, [FromBody] MenuDetail item)
        {
            if (id != item.Id && item.Id != 0)
            {
                return BadRequest("Id uyuşmuyor.");
            }

            var existing = _context.MenuDetails.Find(id);
            if (existing == null)
            {
                return NotFound();
            }

            existing.FoodName = item.FoodName;
            existing.Description = item.Description;
            existing.Price = item.Price;
            existing.Calories = item.Calories;
            existing.IsActive = item.IsActive;

           

            _context.SaveChanges();

           
            return Ok(existing);
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