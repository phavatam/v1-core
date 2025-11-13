using eDocCore.Application.Common.Models;
using eDocCore.Application.Features.Roles.DTOs.Request;
using eDocCore.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace eDocCore.Application.Features.Roles.Services
{
    public interface IRoleService
    {
        Task<IReadOnlyList<DTOs.RoleDto>> GetAllAsync();
        Task<Role?> GetRoleByNameAsync(string name);
        Task<DTOs.RoleDto?> GetByIdAsync(Guid id);
        Task<DTOs.RoleDto> CreateAsync(CreateRoleRequest request);
        Task<bool> UpdateAsync(UpdateRoleRequest request);
        Task<bool> DeleteAsync(Guid id);
        Task<PagedResult<DTOs.RoleDto>> GetPagedInternalAsync(GetRolesRequest request, System.Threading.CancellationToken ct = default);
    }
}
