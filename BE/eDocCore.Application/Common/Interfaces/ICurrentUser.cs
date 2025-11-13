using System;
using System.Collections.Generic;

namespace eDocCore.Application.Common.Interfaces
{
    public interface ICurrentUser
    {
        bool IsAuthenticated { get; }
        string? UserId { get; }
        string? UserName { get; }
        IReadOnlyList<string> Roles { get; }
    }
}
