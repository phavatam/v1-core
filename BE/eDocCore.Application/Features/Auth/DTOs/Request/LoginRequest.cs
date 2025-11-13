using System.ComponentModel.DataAnnotations;

namespace eDocCore.Application.Features.Auth.DTOs.Request
{
    public class LoginRequest
    {
        public string LoginName { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
    }
}
