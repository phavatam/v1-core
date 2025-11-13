using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace eDocCore.Application.Features.Roles.Services
{
    public interface IRoleValidator
    {
        Task<IReadOnlyList<string>> ValidateCreateAsync(string name, CancellationToken ct = default);
        Task<IReadOnlyList<string>> ValidateUpdateAsync(Guid id, string name, bool isActive, CancellationToken ct = default);
    }
}
