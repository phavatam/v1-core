using AutoMapper;
using eDocCore.Application.Common;
using eDocCore.Application.Common.Interfaces;
using eDocCore.Application.Common.Models;
using eDocCore.Application.Features.UserTypes.DTOs;
using eDocCore.Application.Features.UserTypes.DTOs.Request;
using eDocCore.Application.Features.Users.DTOs;
using eDocCore.Domain.Entities;
using eDocCore.Domain.Interfaces;
using eDocCore.Domain.Interfaces.Extend;
using MediatR;
using Microsoft.Extensions.Logging;

namespace eDocCore.Application.Features.UserTypes.Services
{
    public class UserTypeService : IUserTypeService
    {
        private readonly IUserTypeRepository _UserTypeRepository;
        private readonly IMapper _mapper;
        private readonly IUnitOfWork _unitOfWork;
        private readonly ILogger<UserTypeService> _logger;
        private readonly ICurrentUser _currentUser;

        public UserTypeService(IUserTypeRepository UserTypeRepository, IMapper mapper, IUnitOfWork unitOfWork, ILogger<UserTypeService> logger,  ICurrentUser currentUser)
        {
            _UserTypeRepository = UserTypeRepository;
            _mapper = mapper;
            _unitOfWork = unitOfWork;
            _logger = logger;
            _currentUser = currentUser;
        }

        public async Task<ResultDTO<ArrayResultDTO>> Get(int pageNumber, int pageSize, CancellationToken ct = default)
        {
            ResultDTO<ArrayResultDTO> resultDTO = new ResultDTO<ArrayResultDTO>() { };
            var list = await _UserTypeRepository.GetPagedProjectedAsync<UserTypeDto>(pageNumber, pageSize);

            var arrays = new ArrayResultDTO()
            {
                PageNumber = pageNumber,
                PageSize = pageSize,
                TotalRecord = list.TotalItems,
                Items = list.Items
            };

            return ResultDTO<ArrayResultDTO>.Success(arrays);
        }

        public async Task<UserTypeDto> Get(Guid id)
        {
            var UserType = await _UserTypeRepository.GetByIdAsync(id);
            return _mapper == null ? null : _mapper.Map<UserTypeDto>(UserType);
        }

        public async Task<ResultDTO<UserTypeDto>> Create(CreateUserTypeRequest request)
        {
            await _unitOfWork.BeginTransactionAsync();
            try
            {
                var UserType = _mapper.Map<UserType>(request);
                UserType = await _UserTypeRepository.AddAsync(UserType);

                await _unitOfWork.CommitAsync();
                return ResultDTO< UserTypeDto >.Success();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Unexpected error creating UserType by {UserId}", _currentUser.UserId);
                await _unitOfWork.RollbackAsync();
                throw;
            }
        }

        public async Task<ResultDTO<UserTypeDto>> Update(UpdateUserTypeRequest request)
        {
            await _unitOfWork.BeginTransactionAsync();
            try
            {
                if (request.Id == Guid.Empty) return ResultDTO<UserTypeDto>.Failure(400, "Id is required");
                var existing = await _UserTypeRepository.GetByIdAsync(request.Id);
                _mapper.Map(request, existing);

                if (existing != null)
                {
                    await _UserTypeRepository.UpdateAsync(existing);
                    await _unitOfWork.CommitAsync();
                    _logger.LogInformation("Updated UserType {UserTypeId} by {UserId}", request.Id, _currentUser.UserId);
                }
                return ResultDTO<UserTypeDto>.Success();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Unexpected error updating UserType {UserTypeId} by {UserId}", request.Id, _currentUser.UserId);
                await _unitOfWork.RollbackAsync();
                throw;
            }
        }

        public async Task<ResultDTO<bool>> Delete(Guid id)
        {
            await _unitOfWork.BeginTransactionAsync();
            try
            {
                var deleted = await _UserTypeRepository.DeleteAsync(id);
                if (!deleted) return ResultDTO<bool>.Failure(500, "Delete Fail!");

                await _unitOfWork.CommitAsync();
                return ResultDTO<bool>.Success(true);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Unexpected error delete UserType {UserTypeId} by {UserId}", id, _currentUser.UserId);
                await _unitOfWork.RollbackAsync();
                throw;
            }
        }
    }
}