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
            return Ok(_context.MenuDetails.ToList());
        }

        [HttpPost]
        public IActionResult AddMenu([FromBody] MenuDetail item)
        {
            // Yeni kayıt için oluşturulma tarihini set et
            if (item.CreatedDate == default)
            {
                item.CreatedDate = DateTime.Now;
            }

            _context.MenuDetails.Add(item);
            _context.SaveChanges();

            // Frontend POST sonrası JSON beklediği için, eklenen kaydı geri döndürüyoruz
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

            // CreatedDate'i koru; gönderildiyse ve boşsa mevcut değeri silme

            _context.SaveChanges();

            // Güncellenmiş kaydı geri gönder
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