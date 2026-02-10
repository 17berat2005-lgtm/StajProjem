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