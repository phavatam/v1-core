using eDocCore.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace eDocCore.Domain.Interfaces.Extend
{
    public interface IUserRepository : IGenericRepository<User>
    {
        Task<int> CountAsync();
        Task<User?> GetByLoginNameAsync(string loginName);
        Task<User?> GetByEmailAsync(string email);
        Task<List<string>> GetRoleNamesAsync(Guid userId);
    }
}
