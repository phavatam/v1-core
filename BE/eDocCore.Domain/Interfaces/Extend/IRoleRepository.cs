using eDocCore.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace eDocCore.Domain.Interfaces.Extend
{
    public interface IRoleRepository : IGenericRepository<Role>
    {
        Task<bool> ExistsByNameAsync(string name);
        Task<bool> HasAssignedUsersAsync(Guid roleId, CancellationToken ct = default);
        // G?p các ki?m tra guard cho thao tác update ?? tránh l?p logic ? service
        Task<(bool NameTaken, bool HasUsers)> GetUpdateGuardsAsync(Guid roleId, string newName, CancellationToken ct = default);
    }
}
