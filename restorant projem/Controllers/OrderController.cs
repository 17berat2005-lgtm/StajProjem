using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using restorant_projem.Data;
using restorant_projem;
using restorant_projem.Models;

namespace restorant_projem.Controllers;

[Route("api/[controller]")]
[ApiController]
public class OrderController : ControllerBase
{
    private readonly AppDbContext _context;

    public OrderController(AppDbContext context)
    {
        _context = context;
    }

    [HttpPost]
    public async Task<IActionResult> CreateOrder([FromBody] CreateOrderRequest request)
    {
        if (request.Items == null || request.Items.Count == 0)
            return BadRequest("Sepet boş olamaz.");

        var username = request.Username?.Trim();
        if (string.IsNullOrWhiteSpace(username))
            return BadRequest("Kullanıcı adı zorunlu.");

        // Kullanıcıyı bul veya oluştur
        var user = await _context.Users.FirstOrDefaultAsync(u => u.Username == username);
        if (user == null)
        {
            user = new User
            {
                Username = username,
                Password = "", // Şifre burada önemli değil, login endpoint'i zaten güncelliyor
                Role = "User",
                CreatedDate = DateTime.Now
            };
            _context.Users.Add(user);
            await _context.SaveChangesAsync();
        }

        // İlgili menü kayıtlarını çek
        var menuIds = request.Items.Select(i => i.MenuDetailId).Distinct().ToList();
        var menuItems = await _context.MenuDetails
            .Where(m => menuIds.Contains(m.Id))
            .ToDictionaryAsync(m => m.Id, m => m);

        if (menuItems.Count != menuIds.Count)
            return BadRequest("Bazı ürünler menüde bulunamadı.");

        var order = new Order
        {
            UserId = user.ID,
            Status = "Yeni",
            Notes = request.Notes,
            CreatedDate = DateTime.Now,
            TotalAmount = 0
        };

        foreach (var item in request.Items)
        {
            var menu = menuItems[item.MenuDetailId];
            var quantity = item.Quantity <= 0 ? 1 : item.Quantity;

            var orderItem = new OrderItem
            {
                MenuDetailId = menu.Id,
                Quantity = quantity,
                UnitPrice = menu.Price,
                SubTotal = menu.Price * quantity
            };

            order.TotalAmount += orderItem.SubTotal;
            order.OrderItems.Add(orderItem);
        }

        _context.Orders.Add(order);
        await _context.SaveChangesAsync();

        return Ok(new
        {
            order.Id,
            order.TotalAmount,
            order.Status,
            order.CreatedDate,
            Items = order.OrderItems.Select(oi => new
            {
                oi.MenuDetailId,
                Name = menuItems[oi.MenuDetailId].FoodName,
                oi.Quantity,
                oi.UnitPrice,
                oi.SubTotal
            })
        });
    }

    // Belirli kullanıcının geçmiş siparişleri
    [HttpGet("user/{username}")]
    public async Task<IActionResult> GetOrdersByUser(string username)
    {
        if (string.IsNullOrWhiteSpace(username))
            return BadRequest("Kullanıcı adı zorunlu.");

        var orders = await _context.Orders
            .Include(o => o.OrderItems)
            .Where(o => o.User.Username == username)
            .OrderByDescending(o => o.CreatedDate)
            .Select(o => new
            {
                o.Id,
                o.TotalAmount,
                o.Status,
                o.CreatedDate,
                o.Notes,
                Items = o.OrderItems.Select(oi => new
                {
                    oi.MenuDetailId,
                    Name = _context.MenuDetails.FirstOrDefault(m => m.Id == oi.MenuDetailId)!.FoodName,
                    oi.Quantity,
                    oi.UnitPrice,
                    oi.SubTotal
                })
            })
            .ToListAsync();

        return Ok(orders);
    }
}


