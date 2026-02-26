using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace restorant_projem.Models
{
    public class MenuDetail
    {
        public int Id { get; set; }

        [Required]
        public string FoodName { get; set; } = string.Empty;

        [Required]
        public string Description { get; set; } = string.Empty;

        [Column(TypeName = "decimal(18,2)")]
        public decimal Price { get; set; }

        public int Calories { get; set; }

        public bool IsActive { get; set; }

        public DateTime CreatedDate { get; set; }
    }
}

namespace restorant_projem
{
    public class Restaurant
    {
        [Key]
        public int RestaurantID { get; set; }
        public string? RestaurantName { get; set; }
        public string? Address { get; set; }

        public ICollection<RestaurantMenu>? Menus { get; set; }
    }

    public class RestaurantMenu
    {
        [Key]
        public int MenuID { get; set; }
        public string? MenuName { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal Price { get; set; }

        public int RestaurantID { get; set; }
        public Restaurant? Restaurant { get; set; }
    }

    public class User
    {
        [Key]
        public int ID { get; set; }

        [Required]
        public string Username { get; set; } = string.Empty;

        [Required]
        public string Password { get; set; } = string.Empty;

        [Required]
        public string Role { get; set; } = string.Empty;

        public DateTime CreatedDate { get; set; }
    }

    public class Order
    {
        public int Id { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal TotalAmount { get; set; }

        [Required]
        public string Status { get; set; } = string.Empty;

        public string? Notes { get; set; }

        public DateTime CreatedDate { get; set; }

        // Müşteri değerlendirmesi
        // 1-5 arası puan, boş ise henüz değerlendirilmemiş demektir.
        public int? Rating { get; set; }

        // Müşteri yorumu (opsiyonel)
        public string? Review { get; set; }

        // Değerlendirme tarihi (opsiyonel)
        public DateTime? RatedAt { get; set; }

        public int UserId { get; set; }
        public User User { get; set; } = null!;

        public ICollection<OrderItem> OrderItems { get; set; } = new List<OrderItem>();
    }

    public class OrderItem
    {
        public int Id { get; set; }

        public int OrderId { get; set; }
        public Order Order { get; set; } = null!;

        public int MenuDetailId { get; set; }
        public restorant_projem.Models.MenuDetail MenuDetail { get; set; } = null!;

        public int Quantity { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal UnitPrice { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal SubTotal { get; set; }
    }
}
