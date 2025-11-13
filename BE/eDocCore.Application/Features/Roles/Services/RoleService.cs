using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using AutoMapper;
using eDocCore.Application.Common.Models;
using eDocCore.Application.Features.Roles.DTOs;
using eDocCore.Domain.Entities;
using eDocCore.Domain.Interfaces.Extend;
using System.Linq;
using System.Linq.Expressions;
using eDocCore.Domain.Interfaces;
using eDocCore.Application.Common.Exceptions;
using Microsoft.Extensions.Logging;
using eDocCore.Application.Common.Interfaces;
using eDocCore.Application.Features.Roles.DTOs.Request;
using System.Data.Common;

namespace eDocCore.Application.Features.Roles.Services
{
    /// <summary>
    /// Service đơn giản cho Role (không dùng CQRS)
    /// </summary>
    public class RoleService : IRoleService
    {
        private readonly IRoleRepository _roleRepository;
        private readonly IMapper _mapper;
        private readonly IUnitOfWork _unitOfWork;
        private readonly ILogger<RoleService> _logger;
        private readonly IRoleValidator _validator;
        private readonly ICurrentUser _currentUser;

        public RoleService(IRoleRepository roleRepository, IMapper mapper, IUnitOfWork unitOfWork, ILogger<RoleService> logger, IRoleValidator validator, ICurrentUser currentUser)
        {
            _roleRepository = roleRepository;
            _mapper = mapper;
            _unitOfWork = unitOfWork;
            _logger = logger;
            _validator = validator;
            _currentUser = currentUser;
        }
        public async Task<Role?> GetRoleByNameAsync(string name)
        {
            return await _roleRepository.FirstOrDefaultAsync(x => x.Name.Equals(name));
        }

        public async Task<IReadOnlyList<RoleDto>> GetAllAsync()
        {
            _logger.LogDebug("Fetching all roles by {UserId}", _currentUser.UserId);
            var roles = await _roleRepository.GetAllAsync();
            return _mapper.Map<IReadOnlyList<RoleDto>>(roles);
        }

        public async Task<RoleDto?> GetByIdAsync(Guid id)
        {
            _logger.LogDebug("Fetching role by id {RoleId} by {UserId}", id, _currentUser.UserId);
            var role = await _roleRepository.GetByIdAsync(id);
            return _mapper.Map<RoleDto?>(role);
        }

        public async Task<RoleDto> CreateAsync(CreateRoleRequest request)
        {
            await _unitOfWork.BeginTransactionAsync();
            try
            {
                var errors = await _validator.ValidateCreateAsync(request.Name);
                if (errors.Count > 0)
                    throw new ValidationAppException("Business validation failed", errors);

                var name = request.Name.Trim();
                _logger.LogInformation("Creating role {RoleName} by {UserId}", name, _currentUser.UserId);

                var role = _mapper.Map<Role>(request);
                role.Name = name;
                role = await _roleRepository.AddAsync(role);

                await _unitOfWork.CommitAsync();
                _logger.LogInformation("Created role {RoleId} by {UserId}", role.Id, _currentUser.UserId);
                return _mapper.Map<RoleDto>(role);
            }
            catch (AppException ex)
            {
                _logger.LogWarning(ex, "Business error creating role {RoleName} by {UserId}", request.Name, _currentUser.UserId);
                await _unitOfWork.RollbackAsync();
                throw;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Unexpected error creating role {RoleName} by {UserId}", request.Name, _currentUser.UserId);
                await _unitOfWork.RollbackAsync();
                throw;
            }
        }

        public async Task<bool> UpdateAsync(UpdateRoleRequest request)
        {
            await _unitOfWork.BeginTransactionAsync();
            try
            {
                _logger.LogInformation("Updating role {RoleId} by {UserId}", request.Id, _currentUser.UserId);
                var existing = await _roleRepository.GetByIdAsync(request.Id);
                if (existing == null)
                {
                    _logger.LogWarning("Role {RoleId} not found for update by {UserId}", request.Id, _currentUser.UserId);
                    throw new NotFoundAppException($"Role {request.Id} not found for update");
                }

                var errors = await _validator.ValidateUpdateAsync(request.Id, request.Name, request.IsActive);
                if (errors.Count > 0)
                    throw new ValidationAppException("Business validation failed", errors);

                var name = request.Name.Trim();

                _mapper.Map(request, existing);
                existing.Name = name;
                await _roleRepository.UpdateAsync(existing);

                await _unitOfWork.CommitAsync();
                _logger.LogInformation("Updated role {RoleId} by {UserId}", request.Id, _currentUser.UserId);
                return true;
            }
            catch (AppException ex)
            {
                _logger.LogWarning(ex, "Business error updating role {RoleId} by {UserId}", request.Id, _currentUser.UserId);
                await _unitOfWork.RollbackAsync();
                throw;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Unexpected error updating role {RoleId} by {UserId}", request.Id, _currentUser.UserId);
                await _unitOfWork.RollbackAsync();
                throw;
            }
        }

        public async Task<bool> DeleteAsync(Guid id)
        {
            await _unitOfWork.BeginTransactionAsync();
            try
            {
                _logger.LogInformation("Deleting role {RoleId} by {UserId}", id, _currentUser.UserId);
                var deleted = await _roleRepository.DeleteAsync(id);
                if (!deleted)
                {
                    _logger.LogWarning("Role {RoleId} not found for delete by {UserId}", id, _currentUser.UserId);
                    await _unitOfWork.RollbackAsync();
                    return false;
                }

                await _unitOfWork.CommitAsync();
                _logger.LogInformation("Deleted role {RoleId} by {UserId}", id, _currentUser.UserId);
                return true;
            }
            catch (AppException ex)
            {
                _logger.LogWarning(ex, "Business error deleting role {RoleId} by {UserId}", id, _currentUser.UserId);
                await _unitOfWork.RollbackAsync();
                throw;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Unexpected error deleting role {RoleId} by {UserId}", id, _currentUser.UserId);
                await _unitOfWork.RollbackAsync();
                throw;
            }
        }

        public async Task<PagedResult<RoleDto>> GetPagedInternalAsync(GetRolesRequest request, System.Threading.CancellationToken ct = default)
        {
            // filter theo keyword & IsActive
            Expression<Func<Role, bool>>? filter = null;

            if (!string.IsNullOrWhiteSpace(request.Keyword) || request.IsActive.HasValue)
            {
                var keyword = request.Keyword;
                filter = r =>
                    (string.IsNullOrWhiteSpace(keyword) || r.Name.Contains(keyword)) &&
                    (!request.IsActive.HasValue || r.IsActive == request.IsActive.Value);
            }

            Func<IQueryable<Role>, IOrderedQueryable<Role>> orderBy = q => q
                .OrderByDescending(x => x.Created)
                .ThenBy(x => x.Id); // deterministic

            // Project trực tiếp sang RoleDto để giảm IO và bỏ AutoMapper mapping ở client
            Expression<Func<Role, RoleDto>> selector = r => new RoleDto
            {
                Id = r.Id,
                Name = r.Name,
                IsActive = r.IsActive,
                Created = r.Created,
                Modified = r.Modified
            };

            _logger.LogDebug("Paging roles: page={Page} size={Size} keyword={Keyword} isActive={IsActive} by {UserId}", request.Page, request.PageSize, request.Keyword, request.IsActive, _currentUser.UserId);
            var (items, total) = await _roleRepository.GetPagedProjectedAsync(
                request.Page,
                request.PageSize,
                filter,
                orderBy,
                selector,
                asNoTracking: true,
                ct: ct);

            return new PagedResult<RoleDto>
            {
                Items = items,
                TotalCount = total,
                Page = request.Page,
                PageSize = request.PageSize
            };
        }
    }
}
