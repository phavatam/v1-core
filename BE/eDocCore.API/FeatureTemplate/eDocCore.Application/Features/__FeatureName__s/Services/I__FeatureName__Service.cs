using eDocCore.Application.Common;
using eDocCore.Application.Common.Models;
using eDocCore.Application.Features.__FeatureName__s.DTOs;
using eDocCore.Application.Features.__FeatureName__s.DTOs.Request;
using eDocCore.Application.Features.Auth.DTOs;
using eDocCore.Application.Features.Auth.DTOs.Request;

namespace eDocCore.Application.Features.__FeatureName__s.Services
{
    public interface I__FeatureName__Service
    {
        Task<ResultDTO<ArrayResultDTO>> Get(int pageNumber, int pageSize, CancellationToken ct = default);
        Task<__FeatureName__Dto> Get(Guid id);
        Task<ResultDTO<__FeatureName__Dto>> Create(Create__FeatureName__Request request);
        Task<ResultDTO<__FeatureName__Dto>> Update(Update__FeatureName__Request request);
        Task<ResultDTO<bool>> Delete(Guid id);
        // Thêm API phân trang + filter
    }
}