using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using restorant_projem.Data;
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

    [HttpPost("cart")]
    public async Task<IActionResult> AddToCart([FromBody] CartRequest request)
    {
        var menuItem = await _context.MenuDetails.FindAsync(request.MenuDetailId);
        if (menuItem == null) return NotFound("Urun bulunamadi.");

        return Ok(new
        {
            MenuDetailId = menuItem.Id,
            FoodName = menuItem.FoodName,
            Price = menuItem.Price,
            Quantity = request.Quantity,
            SubTotal = menuItem.Price * request.Quantity
        });
    }

    [HttpPost]
    public async Task<IActionResult> CreateOrder([FromBody] CreateOrderRequest request)
    {
        var userId = request.UserId;
        var user = await _context.Users.FindAsync(userId);
        if (user == null) return NotFound("Kullanici bulunamadi.");

        var order = new Order
        {
            UserId = userId,
            TotalAmount = request.TotalAmount,
            Status = "Pending",
            Notes = request.Notes,
            CreatedDate = DateTime.Now
        };

        _context.Orders.Add(order);
        await _context.SaveChangesAsync();

        foreach (var item in request.Items)
        {
            var menuItem = await _context.MenuDetails.FindAsync(item.MenuDetailId);
            if (menuItem == null) continue;

            var orderItem = new OrderItem
            {
                OrderId = order.Id,
                MenuDetailId = item.MenuDetailId,
                Quantity = item.Quantity,
                UnitPrice = menuItem.Price,
                SubTotal = menuItem.Price * item.Quantity
            };

            _context.OrderItems.Add(orderItem);
        }

        await _context.SaveChangesAsync();

        return Ok(new { message = "Siparis olusturuldu.", orderId = order.Id });
    }

    [HttpGet("user/{userId}")]
    public async Task<ActionResult<IEnumerable<object>>> GetUserOrders(int userId)
    {
        var orders = await _context.Orders
            .Where(o => o.UserId == userId)
            .Include(o => o.OrderItems)
                .ThenInclude(oi => oi.MenuDetail)
            .OrderByDescending(o => o.CreatedDate)
            .ToListAsync();

        var result = orders.Select(o => new
        {
            o.Id,
            o.TotalAmount,
            o.Status,
            o.CreatedDate,
            o.Notes,
            Items = o.OrderItems?.Select(oi => new
            {
                oi.MenuDetail?.FoodName,
                oi.Quantity,
                oi.UnitPrice,
                oi.SubTotal
            }).ToList()
        });

        return Ok(result);
    }

    [HttpGet("admin/all")]
    public async Task<ActionResult<IEnumerable<object>>> GetAllOrders()
    {
        var orders = await _context.Orders
            .Include(o => o.User)
            .Include(o => o.OrderItems)
                .ThenInclude(oi => oi.MenuDetail)
            .OrderByDescending(o => o.CreatedDate)
            .ToListAsync();

        var result = orders.Select(o => new
        {
            o.Id,
            UserName = o.User?.Username,
            o.TotalAmount,
            o.Status,
            o.CreatedDate,
            o.Notes,
            Items = o.OrderItems?.Select(oi => new
            {
                oi.MenuDetail?.FoodName,
                oi.Quantity,
                oi.UnitPrice,
                oi.SubTotal
            }).ToList()
        });

        return Ok(result);
    }

    [HttpPut("{orderId}/status")]
    public async Task<IActionResult> UpdateOrderStatus(int orderId, [FromBody] UpdateStatusRequest request)
    {
        var order = await _context.Orders.FindAsync(orderId);
        if (order == null) return NotFound("Siparis bulunamadi.");

        order.Status = request.Status;
        await _context.SaveChangesAsync();

        return Ok(new { message = "Siparis durumu guncellendi.", order.Status });
    }

    [HttpDelete("{orderId}")]
    public async Task<IActionResult> CancelOrder(int orderId)
    {
        var order = await _context.Orders
            .Include(o => o.OrderItems)
            .FirstOrDefaultAsync(o => o.Id == orderId);

        if (order == null) return NotFound("Siparis bulunamadi.");

        _context.OrderItems.RemoveRange(order.OrderItems ?? new List<OrderItem>());
        _context.Orders.Remove(order);
        await _context.SaveChangesAsync();

        return Ok(new { message = "Siparis iptal edildi." });
    }
}

public class CartRequest
{
    public int MenuDetailId { get; set; }
    public int Quantity { get; set; }
}

public class CreateOrderRequest
{
    public int UserId { get; set; }
    public decimal TotalAmount { get; set; }
    public string? Notes { get; set; }
    public List<OrderItemRequest> Items { get; set; } = new();
}

public class OrderItemRequest
{
    public int MenuDetailId { get; set; }
    public int Quantity { get; set; }
}

public class UpdateStatusRequest
{
    public string Status { get; set; } = string.Empty;
}




