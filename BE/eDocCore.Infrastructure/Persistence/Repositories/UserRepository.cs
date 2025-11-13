using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using eDocCore.Domain.Entities;
using eDocCore.Domain.Interfaces.Extend;

namespace eDocCore.Infrastructure.Persistence.Repositories
{
    public class UserRepository : IUserRepository
    {
        private readonly ApplicationDbContext _context;
        public UserRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public IQueryable<User> GetAllAsQueryable()
        {
            return _context.Users.AsNoTracking().AsQueryable();
        }

        public async Task<int> CountAsync()
        {
            return await _context.Users.CountAsync();
        }

        public async Task<List<User>> GetAllAsync()
        {
            return await _context.Users.AsNoTracking().ToListAsync();
        }

        public async Task<User?> GetByIdAsync(Guid id)
        {
            return await _context.Users.FindAsync(id);
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

        public async Task<Guid> AddAsync(User user)
        {
            user.Id = Guid.NewGuid();
            user.Created = DateTimeOffset.UtcNow;
            user.Modified = DateTimeOffset.UtcNow;
            _context.Users.Add(user);
            // Defer SaveChanges to UnitOfWork.CommitAsync
            return user.Id;
        }

        public async Task UpdateAsync(User user)
        {
            user.Modified = DateTimeOffset.UtcNow;
            _context.Users.Update(user);
            // Defer SaveChanges to UnitOfWork.CommitAsync
        }

        public async Task DeleteAsync(User user)
        {
            _context.Users.Remove(user);
            // Defer SaveChanges to UnitOfWork.CommitAsync
        }
    }
}
