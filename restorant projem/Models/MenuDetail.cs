using System;

namespace restorant_projem.Models
{
    public class MenuDetail
    {
        public int Id { get; set; }
        public string FoodName { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public decimal Price { get; set; }
        public int Calories { get; set; }
        public bool IsActive { get; set; }
        public DateTime CreatedDate { get; set; } = DateTime.Now;
    }
}









