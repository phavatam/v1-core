using eDocCore.Application.Common.Models;
using eDocCore.Application.Features.UserDepartmentMappings.DTOs;
using eDocCore.Application.Features.UserDepartmentMappings.DTOs.Request;
using eDocCore.Application.Features.Auth.DTOs;
using eDocCore.Application.Features.Auth.DTOs.Request;

namespace eDocCore.Application.Features.UserDepartmentMappings.Services
{
    public interface IUserDepartmentMappingService
    {
        Task<IReadOnlyList<UserDepartmentMappingDto>> GetAllAsync();
        Task<UserDepartmentMappingDto?> GetByIdAsync(Guid id);
        Task<UserDepartmentMappingDto> CreateAsync(CreateUserDepartmentMappingRequest request);
        Task<bool> UpdateAsync(UpdateUserDepartmentMappingRequest request);
        Task<bool> DeleteAsync(Guid id);
        // Thêm API phân trang + filter
        Task<PagedResult<UserDepartmentMappingDto>> GetPagedInternalAsync(GetUserDepartmentMappingRequest request, System.Threading.CancellationToken ct = default);
    }
}