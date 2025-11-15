using AutoMapper;
using eDocCore.Application.Common;
using eDocCore.Application.Common.Interfaces;
using eDocCore.Application.Common.Models;
using eDocCore.Application.Features.ResignationApplications.DTOs;
using eDocCore.Application.Features.ResignationApplications.DTOs.Request;
using eDocCore.Application.Features.Users.DTOs;
using eDocCore.Domain.Entities;
using eDocCore.Domain.Interfaces;
using eDocCore.Domain.Interfaces.Extend;
using MediatR;
using Microsoft.Extensions.Logging;

namespace eDocCore.Application.Features.ResignationApplications.Services
{
    public class ResignationApplicationService : IResignationApplicationService
    {
        private readonly IResignationApplicationRepository _ResignationApplicationRepository;
        private readonly IMapper _mapper;
        private readonly IUnitOfWork _unitOfWork;
        private readonly ILogger<ResignationApplicationService> _logger;
        private readonly ICurrentUser _currentUser;

        public ResignationApplicationService(IResignationApplicationRepository ResignationApplicationRepository, IMapper mapper, IUnitOfWork unitOfWork, ILogger<ResignationApplicationService> logger,  ICurrentUser currentUser)
        {
            _ResignationApplicationRepository = ResignationApplicationRepository;
            _mapper = mapper;
            _unitOfWork = unitOfWork;
            _logger = logger;
            _currentUser = currentUser;
        }

        public async Task<ResultDTO<ArrayResultDTO>> Get(int pageNumber, int pageSize, CancellationToken ct = default)
        {
            ResultDTO<ArrayResultDTO> resultDTO = new ResultDTO<ArrayResultDTO>() { };
            var list = await _ResignationApplicationRepository.GetPagedProjectedAsync<ResignationApplicationDto>(pageNumber, pageSize);

            var arrays = new ArrayResultDTO()
            {
                PageNumber = pageNumber,
                PageSize = pageSize,
                TotalRecord = list.TotalItems,
                Items = list.Items
            };

            return ResultDTO<ArrayResultDTO>.Success(arrays);
        }

        public async Task<ResignationApplicationDto> Get(Guid id)
        {
            var ResignationApplication = await _ResignationApplicationRepository.GetByIdAsync(id);
            return _mapper == null ? null : _mapper.Map<ResignationApplicationDto>(ResignationApplication);
        }

        public async Task<ResultDTO<ResignationApplicationDto>> Create(CreateResignationApplicationRequest request)
        {
            await _unitOfWork.BeginTransactionAsync();
            try
            {
                var ResignationApplication = _mapper.Map<ResignationApplication>(request);
                ResignationApplication = await _ResignationApplicationRepository.AddAsync(ResignationApplication);

                await _unitOfWork.CommitAsync();
                return ResultDTO< ResignationApplicationDto >.Success();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Unexpected error creating ResignationApplication by {UserId}", _currentUser.UserId);
                await _unitOfWork.RollbackAsync();
                throw;
            }
        }

        public async Task<ResultDTO<ResignationApplicationDto>> Update(UpdateResignationApplicationRequest request)
        {
            await _unitOfWork.BeginTransactionAsync();
            try
            {
                if (request.Id == Guid.Empty) return ResultDTO<ResignationApplicationDto>.Failure(400, "Id is required");

                var existing = await _ResignationApplicationRepository.GetByIdAsync(request.Id);
                _mapper.Map(request, existing);

                if (existing != null)
                {
                    await _ResignationApplicationRepository.UpdateAsync(existing);
                    await _unitOfWork.CommitAsync();
                    _logger.LogInformation("Updated ResignationApplication {ResignationApplicationId} by {UserId}", request.Id, _currentUser.UserId);
                }
                return ResultDTO<ResignationApplicationDto>.Success();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Unexpected error updating ResignationApplication {ResignationApplicationId} by {UserId}", request.Id, _currentUser.UserId);
                await _unitOfWork.RollbackAsync();
                throw;
            }
        }

        public async Task<ResultDTO<bool>> Delete(Guid id)
        {
            await _unitOfWork.BeginTransactionAsync();
            try
            {
                var deleted = await _ResignationApplicationRepository.DeleteAsync(id);
                if (!deleted) return ResultDTO<bool>.Failure(500, "Delete Fail!");

                await _unitOfWork.CommitAsync();
                return ResultDTO<bool>.Success(true);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Unexpected error delete ResignationApplication {ResignationApplicationId} by {UserId}", id, _currentUser.UserId);
                await _unitOfWork.RollbackAsync();
                throw;
            }
        }
    }
}