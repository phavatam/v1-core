using System;

namespace eDocCore.Application.Features.Auth.DTOs.Response
{
    public class LoginResponse
    {
        public string AccessToken { get; set; } = string.Empty;
        public DateTimeOffset ExpiresAt { get; set; }
    }
}
