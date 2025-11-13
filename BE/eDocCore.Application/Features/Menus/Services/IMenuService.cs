using eDocCore.Application.Common.Models;
using eDocCore.Application.Features.Menus.DTOs;
using eDocCore.Application.Features.Menus.DTOs.Request;
using eDocCore.Application.Features.Auth.DTOs;
using eDocCore.Application.Features.Auth.DTOs.Request;

namespace eDocCore.Application.Features.Menus.Services
{
    public interface IMenuService
    {
        Task<IReadOnlyList<MenuDto>> GetAllAsync();
        Task<MenuDto?> GetByIdAsync(Guid id);
        Task<MenuDto> CreateAsync(CreateMenuRequest request);
        Task<bool> UpdateAsync(UpdateMenuRequest request);
        Task<bool> DeleteAsync(Guid id);
        // Thêm API phân trang + filter
        Task<PagedResult<MenuDto>> GetPagedInternalAsync(GetMenuRequest request, System.Threading.CancellationToken ct = default);
    }
}