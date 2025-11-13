using AutoMapper;
using eDocCore.Application.Common.Interfaces;
using eDocCore.Application.Common.Models;
using eDocCore.Application.Features.Menus.DTOs;
using eDocCore.Application.Features.Menus.DTOs.Request;
using eDocCore.Domain.Entities;
using eDocCore.Domain.Interfaces;
using eDocCore.Domain.Interfaces.Extend;
using Microsoft.Extensions.Logging;

namespace eDocCore.Application.Features.Menus.Services
{
    public class MenuService : IMenuService
    {

        private readonly IMenuRepository _MenuRepository;
        private readonly IMapper _mapper;
        private readonly IUnitOfWork _unitOfWork;
        private readonly ILogger<MenuService> _logger;
        private readonly IMenuValidator _validator;
        private readonly ICurrentUser _currentUser;

        public MenuService(IMenuRepository MenuRepository, IMapper mapper, IUnitOfWork unitOfWork, ILogger<MenuService> logger, IMenuValidator validator, ICurrentUser currentUser)
        {
            _MenuRepository = MenuRepository;
            _mapper = mapper;
            _unitOfWork = unitOfWork;
            _logger = logger;
            _validator = validator;
            _currentUser = currentUser;
        }

        public async Task<IReadOnlyList<MenuDto>> GetAllAsync()
        {
            _logger.LogDebug("Fetching all Menus by {UserId}", _currentUser.UserId);
            var Menus = await _MenuRepository.GetAllAsync();
            return _mapper.Map<IReadOnlyList<MenuDto>>(Menus);
        }

        public async Task<MenuDto?> GetByIdAsync(Guid id)
        {
            _logger.LogDebug("Fetching Menu by id {MenuId} by {UserId}", id, _currentUser.UserId);
            var Menu = await _MenuRepository.GetByIdAsync(id);
            return _mapper.Map<MenuDto?>(Menu);
        }

        public async Task<MenuDto> CreateAsync(CreateMenuRequest request)
        {
            await _unitOfWork.BeginTransactionAsync();
            try
            {
                
                var Menu = _mapper.Map<Menu>(request);
                Menu = await _MenuRepository.AddAsync(Menu);

                await _unitOfWork.CommitAsync();
                return _mapper.Map<MenuDto>(Menu);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Unexpected error creating Menu by {UserId}", _currentUser.UserId);
                await _unitOfWork.RollbackAsync();
                throw;
            }
        }

        public async Task<bool> UpdateAsync(UpdateMenuRequest request)
        {
            await _unitOfWork.BeginTransactionAsync();
            try
            {
                _logger.LogInformation("Updating Menu {MenuId} by {UserId}", request.Id, _currentUser.UserId);
                var existing = await _MenuRepository.GetByIdAsync(request.Id);
                _mapper.Map(request, existing);

                if (existing != null)
                {
                    await _MenuRepository.UpdateAsync(existing);
                    await _unitOfWork.CommitAsync();
                    _logger.LogInformation("Updated Menu {MenuId} by {UserId}", request.Id, _currentUser.UserId);
                    return true;
                }

                return false;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Unexpected error updating Menu {MenuId} by {UserId}", request.Id, _currentUser.UserId);
                await _unitOfWork.RollbackAsync();
                throw;
            }
        }

        public async Task<bool> DeleteAsync(Guid id)
        {
            await _unitOfWork.BeginTransactionAsync();
            try
            {
                _logger.LogInformation("Deleting Menu {MenuId} by {UserId}", id, _currentUser.UserId);
                var deleted = await _MenuRepository.DeleteAsync(id);
                if (!deleted)
                {
                    _logger.LogWarning("Menu {MenuId} not found for delete by {UserId}", id, _currentUser.UserId);
                    await _unitOfWork.RollbackAsync();
                    return false;
                }

                await _unitOfWork.CommitAsync();
                _logger.LogInformation("Deleted Menu {MenuId} by {UserId}", id, _currentUser.UserId);
                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Unexpected error deleting Menu {MenuId} by {UserId}", id, _currentUser.UserId);
                await _unitOfWork.RollbackAsync();
                throw;
            }
        }

        public Task<PagedResult<MenuDto>> GetPagedInternalAsync(GetMenuRequest request, CancellationToken ct = default)
        {
            throw new NotImplementedException();
        }

        /*public async Task<PagedResult<MenuDto>> GetPagedInternalAsync(GetMenuRequest request, System.Threading.CancellationToken ct = default)
        {
            // filter theo keyword & IsActive
            Expression<Func<Menu, bool>>? filter = null;

            if (!string.IsNullOrWhiteSpace(request.Keyword))
            {
                var keyword = request.Keyword;
                //filter = r => (string.IsNullOrWhiteSpace(keyword) || r.Name.Contains(keyword));
            }

            Func<IQueryable<Menu>, IOrderedQueryable<Menu>> orderBy = q => q
                .OrderByDescending(x => x.)
                .ThenBy(x => x.Id); // deterministic

            // Project trực tiếp sang MenuDto để giảm IO và bỏ AutoMapper mapping ở client
            Expression<Func<Menu, MenuDto>> selector = r => new MenuDto
            {
                Id = r.Id,
                
            };

            var (items, total) = await _MenuRepository.GetPagedProjectedAsync(
                request.Page,
                request.PageSize,
                filter,
                orderBy,
                selector,
                asNoTracking: true,
                ct: ct);

            return new PagedResult<MenuDto>
            {
                Items = items,
                TotalCount = total,
                Page = request.Page,
                PageSize = request.PageSize
            };
        }*/
    }
}