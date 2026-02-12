using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using restorant_projem.Models;

namespace restorant_projem.Models;

[Table("Orders")]
public class Order
{
    [Key]
    public int Id { get; set; }
    
    public int UserId { get; set; }
    
    [ForeignKey("UserId")]
    public virtual User? User { get; set; }
    
    public decimal TotalAmount { get; set; }
    
    public string Status { get; set; } = "Pending";
    
    public DateTime CreatedDate { get; set; } = DateTime.Now;
    
    public string? Notes { get; set; }
    
    public virtual ICollection<OrderItem>? OrderItems { get; set; }
}










