using AutoMapper;
using eDocCore.Application.Common.Interfaces;
using eDocCore.Application.Common.Models;
using eDocCore.Application.Features.UserDepartmentMappings.DTOs;
using eDocCore.Application.Features.UserDepartmentMappings.DTOs.Request;
using eDocCore.Domain.Entities;
using eDocCore.Domain.Interfaces;
using eDocCore.Domain.Interfaces.Extend;
using Microsoft.Extensions.Logging;

namespace eDocCore.Application.Features.UserDepartmentMappings.Services
{
    public class UserDepartmentMappingService : IUserDepartmentMappingService
    {

        private readonly IUserDepartmentMappingRepository _UserDepartmentMappingRepository;
        private readonly IMapper _mapper;
        private readonly IUnitOfWork _unitOfWork;
        private readonly ILogger<UserDepartmentMappingService> _logger;
        private readonly IUserDepartmentMappingValidator _validator;
        private readonly ICurrentUser _currentUser;

        public UserDepartmentMappingService(IUserDepartmentMappingRepository UserDepartmentMappingRepository, IMapper mapper, IUnitOfWork unitOfWork, ILogger<UserDepartmentMappingService> logger, IUserDepartmentMappingValidator validator, ICurrentUser currentUser)
        {
            _UserDepartmentMappingRepository = UserDepartmentMappingRepository;
            _mapper = mapper;
            _unitOfWork = unitOfWork;
            _logger = logger;
            _validator = validator;
            _currentUser = currentUser;
        }

        public async Task<IReadOnlyList<UserDepartmentMappingDto>> GetAllAsync()
        {
            _logger.LogDebug("Fetching all UserDepartmentMappings by {UserId}", _currentUser.UserId);
            var UserDepartmentMappings = await _UserDepartmentMappingRepository.GetAllAsync();
            return _mapper.Map<IReadOnlyList<UserDepartmentMappingDto>>(UserDepartmentMappings);
        }

        public async Task<UserDepartmentMappingDto?> GetByIdAsync(Guid id)
        {
            _logger.LogDebug("Fetching UserDepartmentMapping by id {UserDepartmentMappingId} by {UserId}", id, _currentUser.UserId);
            var UserDepartmentMapping = await _UserDepartmentMappingRepository.GetByIdAsync(id);
            return _mapper.Map<UserDepartmentMappingDto?>(UserDepartmentMapping);
        }

        public async Task<UserDepartmentMappingDto> CreateAsync(CreateUserDepartmentMappingRequest request)
        {
            await _unitOfWork.BeginTransactionAsync();
            try
            {
                
                var UserDepartmentMapping = _mapper.Map<UserDepartmentMapping>(request);
                UserDepartmentMapping = await _UserDepartmentMappingRepository.AddAsync(UserDepartmentMapping);

                await _unitOfWork.CommitAsync();
                return _mapper.Map<UserDepartmentMappingDto>(UserDepartmentMapping);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Unexpected error creating UserDepartmentMapping by {UserId}", _currentUser.UserId);
                await _unitOfWork.RollbackAsync();
                throw;
            }
        }

        public async Task<bool> UpdateAsync(UpdateUserDepartmentMappingRequest request)
        {
            await _unitOfWork.BeginTransactionAsync();
            try
            {
                _logger.LogInformation("Updating UserDepartmentMapping {UserDepartmentMappingId} by {UserId}", request.Id, _currentUser.UserId);
                var existing = await _UserDepartmentMappingRepository.GetByIdAsync(request.Id);
                _mapper.Map(request, existing);

                if (existing != null)
                {
                    await _UserDepartmentMappingRepository.UpdateAsync(existing);
                    await _unitOfWork.CommitAsync();
                    _logger.LogInformation("Updated UserDepartmentMapping {UserDepartmentMappingId} by {UserId}", request.Id, _currentUser.UserId);
                    return true;
                }

                return false;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Unexpected error updating UserDepartmentMapping {UserDepartmentMappingId} by {UserId}", request.Id, _currentUser.UserId);
                await _unitOfWork.RollbackAsync();
                throw;
            }
        }

        public async Task<bool> DeleteAsync(Guid id)
        {
            await _unitOfWork.BeginTransactionAsync();
            try
            {
                _logger.LogInformation("Deleting UserDepartmentMapping {UserDepartmentMappingId} by {UserId}", id, _currentUser.UserId);
                var deleted = await _UserDepartmentMappingRepository.DeleteAsync(id);
                if (!deleted)
                {
                    _logger.LogWarning("UserDepartmentMapping {UserDepartmentMappingId} not found for delete by {UserId}", id, _currentUser.UserId);
                    await _unitOfWork.RollbackAsync();
                    return false;
                }

                await _unitOfWork.CommitAsync();
                _logger.LogInformation("Deleted UserDepartmentMapping {UserDepartmentMappingId} by {UserId}", id, _currentUser.UserId);
                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Unexpected error deleting UserDepartmentMapping {UserDepartmentMappingId} by {UserId}", id, _currentUser.UserId);
                await _unitOfWork.RollbackAsync();
                throw;
            }
        }

        public Task<PagedResult<UserDepartmentMappingDto>> GetPagedInternalAsync(GetUserDepartmentMappingRequest request, CancellationToken ct = default)
        {
            throw new NotImplementedException();
        }

        /*public async Task<PagedResult<UserDepartmentMappingDto>> GetPagedInternalAsync(GetUserDepartmentMappingRequest request, System.Threading.CancellationToken ct = default)
        {
            // filter theo keyword & IsActive
            Expression<Func<UserDepartmentMapping, bool>>? filter = null;

            if (!string.IsNullOrWhiteSpace(request.Keyword))
            {
                var keyword = request.Keyword;
                //filter = r => (string.IsNullOrWhiteSpace(keyword) || r.Name.Contains(keyword));
            }

            Func<IQueryable<UserDepartmentMapping>, IOrderedQueryable<UserDepartmentMapping>> orderBy = q => q
                .OrderByDescending(x => x.)
                .ThenBy(x => x.Id); // deterministic

            // Project trực tiếp sang UserDepartmentMappingDto để giảm IO và bỏ AutoMapper mapping ở client
            Expression<Func<UserDepartmentMapping, UserDepartmentMappingDto>> selector = r => new UserDepartmentMappingDto
            {
                Id = r.Id,
                
            };

            var (items, total) = await _UserDepartmentMappingRepository.GetPagedProjectedAsync(
                request.Page,
                request.PageSize,
                filter,
                orderBy,
                selector,
                asNoTracking: true,
                ct: ct);

            return new PagedResult<UserDepartmentMappingDto>
            {
                Items = items,
                TotalCount = total,
                Page = request.Page,
                PageSize = request.PageSize
            };
        }*/
    }
}