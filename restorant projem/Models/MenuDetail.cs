using System;
using System.ComponentModel.DataAnnotations.Schema;

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

        public int? CategoryId { get; set; }

        [ForeignKey("CategoryId")]
        public virtual Category? Category { get; set; }
    }
}











