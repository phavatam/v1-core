using eDocCore.Application.Common;
using eDocCore.Application.Common.Models;
using eDocCore.Application.Features.UserTypes.DTOs;
using eDocCore.Application.Features.UserTypes.DTOs.Request;
using eDocCore.Application.Features.Auth.DTOs;
using eDocCore.Application.Features.Auth.DTOs.Request;

namespace eDocCore.Application.Features.UserTypes.Services
{
    public interface IUserTypeService
    {
        Task<ResultDTO<ArrayResultDTO>> Get(int pageNumber, int pageSize, CancellationToken ct = default);
        Task<UserTypeDto> Get(Guid id);
        Task<ResultDTO<UserTypeDto>> Create(CreateUserTypeRequest request);
        Task<ResultDTO<UserTypeDto>> Update(UpdateUserTypeRequest request);
        Task<ResultDTO<bool>> Delete(Guid id);
        // Thêm API phân trang + filter
    }
}