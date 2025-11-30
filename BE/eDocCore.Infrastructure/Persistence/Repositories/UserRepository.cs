using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using eDocCore.Domain.Entities;
using eDocCore.Domain.Interfaces.Extend;

namespace eDocCore.Infrastructure.Persistence.Repositories
{
    public class UserRepository : GenericRepository<User>, IUserRepository
    {
        private readonly ApplicationDbContext _context;
        public UserRepository(ApplicationDbContext context) : base(context) {
            _context = context;
        }
        public async Task<int> CountAsync()
        {
            return await _context.Users.CountAsync();
        }
        public async Task<User?> GetByLoginNameAsync(string loginName)
        {
            return await _context.Users.AsNoTracking().FirstOrDefaultAsync(u => u.LoginName == loginName);
        }
        public async Task<User?> GetByEmailAsync(string email)
        {
            return await _context.Users.AsNoTracking().FirstOrDefaultAsync(u => !string.IsNullOrEmpty(u.Email) && u.Email.ToLower().Equals(email.ToLower()) );
        }

        public async Task<List<string>> GetRoleNamesAsync(Guid userId)
        {
            return await _context.UserRoles
                .Where(ur => ur.UserId == userId)
                .Select(ur => ur.Role.Name)
                .Distinct()
                .ToListAsync();
        }
    }
}
