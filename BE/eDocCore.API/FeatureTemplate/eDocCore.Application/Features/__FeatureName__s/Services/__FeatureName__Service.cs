using AutoMapper;
using eDocCore.Application.Common;
using eDocCore.Application.Common.Interfaces;
using eDocCore.Application.Common.Models;
using eDocCore.Application.Features.__FeatureName__s.DTOs;
using eDocCore.Application.Features.__FeatureName__s.DTOs.Request;
using eDocCore.Application.Features.Users.DTOs;
using eDocCore.Domain.Entities;
using eDocCore.Domain.Interfaces;
using eDocCore.Domain.Interfaces.Extend;
using MediatR;
using Microsoft.Extensions.Logging;

namespace eDocCore.Application.Features.__FeatureName__s.Services
{
    public class __FeatureName__Service : I__FeatureName__Service
    {
        private readonly I__FeatureName__Repository ___FeatureName__Repository;
        private readonly IMapper _mapper;
        private readonly IUnitOfWork _unitOfWork;
        private readonly ILogger<__FeatureName__Service> _logger;
        private readonly ICurrentUser _currentUser;

        public __FeatureName__Service(I__FeatureName__Repository __FeatureName__Repository, IMapper mapper, IUnitOfWork unitOfWork, ILogger<__FeatureName__Service> logger,  ICurrentUser currentUser)
        {
            ___FeatureName__Repository = __FeatureName__Repository;
            _mapper = mapper;
            _unitOfWork = unitOfWork;
            _logger = logger;
            _currentUser = currentUser;
        }

        public async Task<ResultDTO<ArrayResultDTO>> Get(int pageNumber, int pageSize, CancellationToken ct = default)
        {
            ResultDTO<ArrayResultDTO> resultDTO = new ResultDTO<ArrayResultDTO>() { };
            var list = await ___FeatureName__Repository.GetPagedProjectedAsync<__FeatureName__Dto>(pageNumber, pageSize);

            var arrays = new ArrayResultDTO()
            {
                PageNumber = pageNumber,
                PageSize = pageSize,
                TotalRecord = list.TotalItems,
                Items = list.Items
            };

            return ResultDTO<ArrayResultDTO>.Success(arrays);
        }

        public async Task<__FeatureName__Dto> Get(Guid id)
        {
            var __FeatureName__ = await ___FeatureName__Repository.GetByIdAsync(id);
            return _mapper == null ? null : _mapper.Map<__FeatureName__Dto>(__FeatureName__);
        }

        public async Task<ResultDTO<__FeatureName__Dto>> Create(Create__FeatureName__Request request)
        {
            await _unitOfWork.BeginTransactionAsync();
            try
            {
                var __FeatureName__ = _mapper.Map<__ModelName__>(request);
                __FeatureName__ = await ___FeatureName__Repository.AddAsync(__FeatureName__);

                await _unitOfWork.CommitAsync();
                return ResultDTO< __FeatureName__Dto >.Success(_mapper.Map<__FeatureName__Dto>(__FeatureName__));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Unexpected error creating __FeatureName__ by {UserId}", _currentUser.UserId);
                await _unitOfWork.RollbackAsync();
                throw;
            }
        }

        public async Task<ResultDTO<__FeatureName__Dto>> Update(Update__FeatureName__Request request)
        {
            await _unitOfWork.BeginTransactionAsync();
            try
            {
                if (request.Id == Guid.Empty) return ResultDTO<__FeatureName__Dto>.Failure(400, "Id is required");

                var existing = await ___FeatureName__Repository.GetByIdAsync(request.Id);
                _mapper.Map(request, existing);

                if (existing != null)
                {
                    await ___FeatureName__Repository.UpdateAsync(existing);
                    await _unitOfWork.CommitAsync();
                    _logger.LogInformation("Updated __FeatureName__ {__FeatureName__Id} by {UserId}", request.Id, _currentUser.UserId);
                }
                return ResultDTO<__FeatureName__Dto>.Success(_mapper.Map<__FeatureName__Dto>(existing));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Unexpected error updating __FeatureName__ {__FeatureName__Id} by {UserId}", request.Id, _currentUser.UserId);
                await _unitOfWork.RollbackAsync();
                throw;
            }
        }

        public async Task<ResultDTO<bool>> Delete(Guid id)
        {
            await _unitOfWork.BeginTransactionAsync();
            try
            {
                var deleted = await ___FeatureName__Repository.DeleteAsync(id);
                if (!deleted) return ResultDTO<bool>.Failure(500, "Delete Fail!");

                await _unitOfWork.CommitAsync();
                return ResultDTO<bool>.Success(true);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Unexpected error delete __FeatureName__ {__FeatureName__Id} by {UserId}", id, _currentUser.UserId);
                await _unitOfWork.RollbackAsync();
                throw;
            }
        }
    }
}