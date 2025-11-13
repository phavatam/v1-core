using eDocCore.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;
using eDocCore.Domain.Interfaces.Extend;
using System.Threading;
using AutoMapper;

namespace eDocCore.Infrastructure.Persistence.Repositories
{
    public class RoleRepository : GenericRepository<Role>, IRoleRepository
    {
        private readonly IMapper _mapper;
        public RoleRepository(ApplicationDbContext context, IMapper mapper) : base(context, mapper)
        {
            _mapper = mapper;
        }
        public async Task<bool> ExistsByNameAsync(string name)
        {
            // Assume DB collation is case-insensitive; avoid ToLower() to keep index usage
            return await _context.Set<Role>()
                .AnyAsync(r => r.Name == name);
        }

        public async Task<bool> HasAssignedUsersAsync(Guid roleId, CancellationToken ct = default)
        {
            return await _context.Set<UserRole>()
                .AsNoTracking()
                .AnyAsync(ur => ur.RoleId == roleId, ct);
        }

        public async Task<(bool NameTaken, bool HasUsers)> GetUpdateGuardsAsync(Guid roleId, string newName, CancellationToken ct = default)
        {
            var nameTakenTask = _context.Set<Role>()
                .AsNoTracking()
                .AnyAsync(r => r.Name == newName && r.Id != roleId, ct);

            var hasUsersTask = _context.Set<UserRole>()
                .AsNoTracking()
                .AnyAsync(ur => ur.RoleId == roleId, ct);

            await Task.WhenAll(nameTakenTask, hasUsersTask);
            return (nameTakenTask.Result, hasUsersTask.Result);
        }
    }
}
