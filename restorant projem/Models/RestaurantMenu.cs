using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace restorant_projem.Models;

[Table("RestaurantMenu")]
public class RestaurantMenu
{
    [Key]
    public int MenuID { get; set; }
    public string? MenuName { get; set; }
    public decimal Price { get; set; }
    public int RestaurantID { get; set; }

    [ForeignKey("RestaurantID")]
    public virtual Restaurant? Restaurant { get; set; }
}










