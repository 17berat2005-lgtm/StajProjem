using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace restorant_projem.Models;

[Table("OrderItems")]
public class OrderItem
{
    [Key]
    public int Id { get; set; }
    
    public int OrderId { get; set; }
    
    [ForeignKey("OrderId")]
    public virtual Order? Order { get; set; }
    
    public int MenuDetailId { get; set; }
    
    [ForeignKey("MenuDetailId")]
    public virtual MenuDetail? MenuDetail { get; set; }
    
    public int Quantity { get; set; }
    
    public decimal UnitPrice { get; set; }
    
    public decimal SubTotal { get; set; }
}










