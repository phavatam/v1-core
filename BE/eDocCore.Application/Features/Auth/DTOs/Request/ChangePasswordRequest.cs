using System.ComponentModel.DataAnnotations;

namespace eDocCore.Application.Features.Auth.DTOs.Request
{
    public class ChangePasswordRequest
    {
        [Required]
        public string CurrentPassword { get; set; } = string.Empty;
        [Required]
        public string NewPassword { get; set; } = string.Empty;
    }
}
