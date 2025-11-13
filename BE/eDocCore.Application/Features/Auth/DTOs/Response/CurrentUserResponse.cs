using System;
using System.Collections.Generic;

namespace eDocCore.Application.Features.Auth.DTOs.Response
{
    public class CurrentUserResponse
    {
        public Guid Id { get; set; }
        public string LoginName { get; set; } = string.Empty;
        public string? FullName { get; set; }
        public string? Email { get; set; }
        public IReadOnlyList<string> Roles { get; set; } = Array.Empty<string>();
        public bool IsActive { get; set; }
    }
}
