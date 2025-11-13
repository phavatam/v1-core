using System.ComponentModel.DataAnnotations;

namespace eDocCore.Application.Features.Auth.DTOs.Request
{
    public class RegisterUserRequest
    {
        public string LoginName { get; set; } = string.Empty;

        public string Password { get; set; } = string.Empty;

        public string? FullName { get; set; }

        public string Email { get; set; } = string.Empty;
    }
}
