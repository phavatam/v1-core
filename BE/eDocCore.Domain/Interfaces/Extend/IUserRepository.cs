using eDocCore.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace eDocCore.Domain.Interfaces.Extend
{
    public interface IUserRepository
    {
        IQueryable<User> GetAllAsQueryable();
        Task<int> CountAsync();
        Task<List<User>> GetAllAsync();
        Task<User?> GetByIdAsync(Guid id);
        Task<User?> GetByLoginNameAsync(string loginName);
        Task<User?> GetByEmailAsync(string email);
        Task<List<string>> GetRoleNamesAsync(Guid userId);
        Task<Guid> AddAsync(User user);
        Task UpdateAsync(User user);
        Task DeleteAsync(User user);
    }
}
