using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using eDocCore.Application.Common.Interfaces;
using Microsoft.AspNetCore.Http;

namespace eDocCore.Infrastructure.Identity
{
    public class CurrentUser : ICurrentUser
    {
        private readonly IHttpContextAccessor _httpContextAccessor;

        public CurrentUser(IHttpContextAccessor httpContextAccessor)
        {
            _httpContextAccessor = httpContextAccessor;
        }

        public bool IsAuthenticated => _httpContextAccessor.HttpContext?.User?.Identity?.IsAuthenticated == true;

        public string? UserId
        {
            get
            {
                var user = _httpContextAccessor.HttpContext?.User;
                if (user == null) return null;
                return user.FindFirst(ClaimTypes.NameIdentifier)?.Value
                       ?? user.FindFirst("sub")?.Value
                       ?? user.FindFirst("uid")?.Value;
            }
        }

        public string? UserName
        {
            get
            {
                var user = _httpContextAccessor.HttpContext?.User;
                if (user == null) return null;
                return user.FindFirst(ClaimTypes.Name)?.Value
                       ?? user.Identity?.Name;
            }
        }

        public IReadOnlyList<string> Roles
            => _httpContextAccessor.HttpContext?.User?
                   .FindAll(ClaimTypes.Role)
                   .Select(c => c.Value)
                   .ToList()
               ?? new List<string>();
    }
}
