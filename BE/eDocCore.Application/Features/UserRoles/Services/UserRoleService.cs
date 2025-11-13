using AutoMapper;
using eDocCore.Application.Common.Interfaces;
using eDocCore.Application.Common.Models;
using eDocCore.Application.Features.UserRoles.DTOs;
using eDocCore.Application.Features.UserRoles.DTOs.Request;
using eDocCore.Domain.Entities;
using eDocCore.Domain.Interfaces;
using eDocCore.Domain.Interfaces.Extend;
using Microsoft.Extensions.Logging;
using System.Linq.Expressions;

namespace eDocCore.Application.Features.UserRoles.Services
{
    public class UserRoleService : IUserRoleService
    {

        private readonly IUserRoleRepository _UserRoleRepository;
        private readonly IMapper _mapper;
        private readonly IUnitOfWork _unitOfWork;
        private readonly ILogger<UserRoleService> _logger;
        private readonly IUserRoleValidator _validator;
        private readonly ICurrentUser _currentUser;

        public UserRoleService(IUserRoleRepository UserRoleRepository, IMapper mapper, IUnitOfWork unitOfWork, ILogger<UserRoleService> logger, IUserRoleValidator validator, ICurrentUser currentUser)
        {
            _UserRoleRepository = UserRoleRepository;
            _mapper = mapper;
            _unitOfWork = unitOfWork;
            _logger = logger;
            _validator = validator;
            _currentUser = currentUser;
        }

        public async Task<IReadOnlyList<UserRoleDto>> GetAllAsync()
        {
            _logger.LogDebug("Fetching all UserRoles by {UserId}", _currentUser.UserId);
            var UserRoles = await _UserRoleRepository.GetAllAsync();
            return _mapper.Map<IReadOnlyList<UserRoleDto>>(UserRoles);
        }

        public async Task<UserRoleDto?> GetByIdAsync(Guid id)
        {
            _logger.LogDebug("Fetching UserRole by id {UserRoleId} by {UserId}", id, _currentUser.UserId);
            var UserRole = await _UserRoleRepository.GetByIdAsync(id);
            return _mapper.Map<UserRoleDto?>(UserRole);
        }

        public async Task<UserRoleDto> CreateAsync(CreateUserRoleRequest request)
        {
            await _unitOfWork.BeginTransactionAsync();
            try
            {
                
                var UserRole = _mapper.Map<UserRole>(request);
                UserRole = await _UserRoleRepository.AddAsync(UserRole);

                await _unitOfWork.CommitAsync();
                return _mapper.Map<UserRoleDto>(UserRole);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Unexpected error creating UserRole by {UserId}", _currentUser.UserId);
                await _unitOfWork.RollbackAsync();
                throw;
            }
        }

        public async Task<bool> UpdateAsync(UpdateUserRoleRequest request)
        {
            await _unitOfWork.BeginTransactionAsync();
            try
            {
                _logger.LogInformation("Updating UserRole {UserRoleId} by {UserId}", request.Id, _currentUser.UserId);
                var existing = await _UserRoleRepository.GetByIdAsync(request.Id);
                if (existing != null)
                {
                    _mapper.Map(request, existing);
                    await _UserRoleRepository.UpdateAsync(existing);

                    await _unitOfWork.CommitAsync();
                    _logger.LogInformation("Updated UserRole {UserRoleId} by {UserId}", request.Id, _currentUser.UserId);
                    return true;
                }

                return false;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Unexpected error updating UserRole {UserRoleId} by {UserId}", request.Id, _currentUser.UserId);
                await _unitOfWork.RollbackAsync();
                throw;
            }
        }

        public async Task<bool> DeleteAsync(Guid id)
        {
            await _unitOfWork.BeginTransactionAsync();
            try
            {
                _logger.LogInformation("Deleting UserRole {UserRoleId} by {UserId}", id, _currentUser.UserId);
                var deleted = await _UserRoleRepository.DeleteAsync(id);
                if (!deleted)
                {
                    _logger.LogWarning("UserRole {UserRoleId} not found for delete by {UserId}", id, _currentUser.UserId);
                    await _unitOfWork.RollbackAsync();
                    return false;
                }

                await _unitOfWork.CommitAsync();
                _logger.LogInformation("Deleted UserRole {UserRoleId} by {UserId}", id, _currentUser.UserId);
                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Unexpected error deleting UserRole {UserRoleId} by {UserId}", id, _currentUser.UserId);
                await _unitOfWork.RollbackAsync();
                throw;
            }
        }

        public Task<PagedResult<UserRoleDto>> GetPagedInternalAsync(GetUserRoleRequest request, CancellationToken ct = default)
        {
            throw new NotImplementedException();
        }

        /*public async Task<PagedResult<UserRoleDto>> GetPagedInternalAsync(GetUserRoleRequest request, System.Threading.CancellationToken ct = default)
        {
            // filter theo keyword & IsActive
            Expression<Func<UserRole, bool>>? filter = null;

            if (!string.IsNullOrWhiteSpace(request.Keyword))
            {
                var keyword = request.Keyword;
                //filter = r => (string.IsNullOrWhiteSpace(keyword) || r.Name.Contains(keyword));
            }

            Func<IQueryable<UserRole>, IOrderedQueryable<UserRole>> orderBy = q => q
                .OrderByDescending(x => x.)
                .ThenBy(x => x.Id); // deterministic

            // Project trực tiếp sang UserRoleDto để giảm IO và bỏ AutoMapper mapping ở client
            Expression<Func<UserRole, UserRoleDto>> selector = r => new UserRoleDto
            {
                Id = r.Id,
                
            };

            var (items, total) = await _UserRoleRepository.GetPagedProjectedAsync(
                request.Page,
                request.PageSize,
                filter,
                orderBy,
                selector,
                asNoTracking: true,
                ct: ct);

            return new PagedResult<UserRoleDto>
            {
                Items = items,
                TotalCount = total,
                Page = request.Page,
                PageSize = request.PageSize
            };
        }*/
    }
}