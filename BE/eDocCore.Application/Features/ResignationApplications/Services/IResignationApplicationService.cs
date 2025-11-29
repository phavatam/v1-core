using eDocCore.Application.Common;
using eDocCore.Application.Common.Models;
using eDocCore.Application.Features.ResignationApplications.DTOs;
using eDocCore.Application.Features.ResignationApplications.DTOs.Request;
using eDocCore.Application.Features.Auth.DTOs;
using eDocCore.Application.Features.Auth.DTOs.Request;

namespace eDocCore.Application.Features.ResignationApplications.Services
{
    public interface IResignationApplicationService
    {
        Task<ResultDTO<ArrayResultDTO>> Get(int pageNumber, int pageSize, CancellationToken ct = default);
        Task<ResignationApplicationDto?> Get(Guid id);
        Task<ResultDTO<ResignationApplicationDto>> Create(CreateResignationApplicationRequest request);
        Task<ResultDTO<ResignationApplicationDto>> Update(UpdateResignationApplicationRequest request);
        Task<ResultDTO<bool>> Delete(Guid id);
        Task<ResultDTO<ArrayResultDTO>> GetListByFilter(GetResignationApplicationRequest args);
        // Thêm API phân trang + filter
    }
}