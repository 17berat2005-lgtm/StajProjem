using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace restorant_projem;

[Table("Restaurant")]
public class Restaurant
{
    [Key]
    public int RestaurantID { get; set; }
    public string? RestaurantName { get; set; }
    public string? Address { get; set; }
    public virtual ICollection<RestaurantMenu>? Menus { get; set; }
}