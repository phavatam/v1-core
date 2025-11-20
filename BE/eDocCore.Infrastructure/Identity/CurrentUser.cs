using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.IdentityModel.Tokens.Jwt;
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
                if (user != null)
                {
                    var id = user.FindFirst(ClaimTypes.NameIdentifier)?.Value
                             ?? user.FindFirst("sub")?.Value
                             ?? user.FindFirst("uid")?.Value;
                    if (!string.IsNullOrEmpty(id)) return id;
                }

                // Fallback: try to read token from Authorization header and parse claims
                var authHeader = _httpContextAccessor.HttpContext?.Request?.Headers["Authorization"].FirstOrDefault();
                if (string.IsNullOrWhiteSpace(authHeader)) return null;

                var token = authHeader.StartsWith("Bearer ", StringComparison.OrdinalIgnoreCase)
                    ? authHeader.Substring(7).Trim()
                    : authHeader.Trim();

                try
                {
                    var handler = new JwtSecurityTokenHandler();
                    if (!string.IsNullOrEmpty(token) && handler.CanReadToken(token))
                    {
                        var jwt = handler.ReadJwtToken(token);
                        var id = jwt.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier || c.Type == "sub" || c.Type == "uid")?.Value;
                        return string.IsNullOrEmpty(id) ? null : id;
                    }
                }
                catch
                {
                    // ignore parse errors
                }

                return null;
            }
        }

        public string? UserName
        {
            get
            {
                var user = _httpContextAccessor.HttpContext?.User;
                if (user != null)
                {
                    var name = user.FindFirst(ClaimTypes.Name)?.Value
                               ?? user.Identity?.Name;
                    if (!string.IsNullOrEmpty(name)) return name;
                }

                var authHeader = _httpContextAccessor.HttpContext?.Request?.Headers["Authorization"].FirstOrDefault();
                if (string.IsNullOrWhiteSpace(authHeader)) return null;

                var token = authHeader.StartsWith("Bearer ", StringComparison.OrdinalIgnoreCase)
                    ? authHeader.Substring(7).Trim()
                    : authHeader.Trim();

                try
                {
                    var handler = new JwtSecurityTokenHandler();
                    if (!string.IsNullOrEmpty(token) && handler.CanReadToken(token))
                    {
                        var jwt = handler.ReadJwtToken(token);
                        var name = jwt.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Name || c.Type == "name" || c.Type == JwtRegisteredClaimNames.UniqueName)?.Value;
                        return string.IsNullOrEmpty(name) ? null : name;
                    }
                }
                catch
                {
                    // ignore parse errors
                }

                return null;
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
