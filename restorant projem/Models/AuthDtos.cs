using System.ComponentModel.DataAnnotations;

namespace restorant_projem.Models
{
    public class LoginRequest
    {
        [Required]
        public string Username { get; set; } = string.Empty;

        public string Password { get; set; } = string.Empty;
    }

    public class RegisterRequest
    {
        [Required]
        public string Username { get; set; } = string.Empty;

        [Required]
        public string Password { get; set; } = string.Empty;
    }

    public class UpdateRoleRequest
    {
        [Required]
        public string Role { get; set; } = string.Empty;
    }

    public class UpdatePasswordRequest
    {
        [Required]
        public string Password { get; set; } = string.Empty;
    }
}

















