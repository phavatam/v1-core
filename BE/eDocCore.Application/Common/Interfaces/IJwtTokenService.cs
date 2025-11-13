using System;
using System.Collections.Generic;
using eDocCore.Application.Features.Auth.DTOs.Response;
using eDocCore.Domain.Entities;

namespace eDocCore.Application.Common.Interfaces
{
    public interface IJwtTokenService
    {
        LoginResponse GenerateToken(User user, IReadOnlyList<string> roles);
    }
}
