using System.ComponentModel.DataAnnotations;

namespace restorant_projem.Models
{
    public class OrderItemDto
    {
        [Required]
        public int MenuDetailId { get; set; }

        [Required]
        public int Quantity { get; set; }
    }

    public class CreateOrderRequest
    {
        [Required]
        public string Username { get; set; } = string.Empty;

        public string? Notes { get; set; }

        [Required]
        public List<OrderItemDto> Items { get; set; } = new();
    }
}












