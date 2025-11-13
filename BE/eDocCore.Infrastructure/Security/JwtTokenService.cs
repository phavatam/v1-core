using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using eDocCore.Application.Common.Interfaces;
using eDocCore.Application.Features.Auth.DTOs.Response;
using eDocCore.Domain.Entities;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;

namespace eDocCore.Infrastructure.Security
{
    public class JwtTokenService : IJwtTokenService
    {
        private readonly JwtOptions _options;
        public JwtTokenService(IOptions<JwtOptions> options)
        {
            _options = options.Value;
        }

        public LoginResponse GenerateToken(User user, IReadOnlyList<string> roles)
        {
            if (string.IsNullOrEmpty(_options.Key) || _options.Key.Length < 16)
                throw new InvalidOperationException("JWT signing key too short; must be at least 128 bits (16 chars).");

            var now = DateTimeOffset.UtcNow;

            var claims = new List<Claim>
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Name, user.LoginName),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                new Claim(JwtRegisteredClaimNames.Iat, now.ToUnixTimeSeconds().ToString(), ClaimValueTypes.Integer64)
            };
            foreach (var role in roles)
            {
                claims.Add(new Claim(ClaimTypes.Role, role));
            }

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_options.Key));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
            var expires = now.AddMinutes(_options.ExpiresMinutes);

            var token = new JwtSecurityToken(
                issuer: _options.Issuer,
                audience: _options.Audience,
                claims: claims,
                notBefore: now.UtcDateTime,
                expires: expires.UtcDateTime,
                signingCredentials: creds);

            var handler = new JwtSecurityTokenHandler();
            var accessToken = handler.WriteToken(token);

            return new LoginResponse
            {
                AccessToken = accessToken,
                ExpiresAt = expires
            };
        }
    }
}
