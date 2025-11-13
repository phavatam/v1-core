using eDocCore.Application.Common.Models;
using eDocCore.Application.Features.UserRoles.DTOs;
using eDocCore.Application.Features.UserRoles.DTOs.Request;

namespace eDocCore.Application.Features.UserRoles.Services
{
    public interface IUserRoleService
    {
        Task<IReadOnlyList<UserRoleDto>> GetAllAsync();
        Task<UserRoleDto?> GetByIdAsync(Guid id);
        Task<UserRoleDto> CreateAsync(CreateUserRoleRequest request);
        Task<bool> UpdateAsync(UpdateUserRoleRequest request);
        Task<bool> DeleteAsync(Guid id);

        // Thêm API phân trang + filter
        Task<PagedResult<UserRoleDto>> GetPagedInternalAsync(GetUserRoleRequest request, System.Threading.CancellationToken ct = default);
    }
}