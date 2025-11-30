using eDocCore.Application.Common;
using eDocCore.Application.Features.Users.DTOs;
using eDocCore.Application.Features.Users.DTOs.Request;
using eDocCore.Application.Features.UserTypes.DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace eDocCore.Application.Features.Users.Services
{
    public interface IUserService
    {
        Task<UserDTO?> GetByLoginName(string loginName, CancellationToken ct = default);
        Task<UserDTO?> Get(Guid UserId, CancellationToken ct = default);
        Task<ResultDTO<ArrayResultDTO>> Get(GetUserRequest request, CancellationToken ct = default);
        Task<ResultDTO<UserDTO>> Create(CreateUserRequest request, CancellationToken ct = default);
        Task<ResultDTO<UserDTO>> Update(UpdateUserRequest request, CancellationToken ct = default);
        Task<ResultDTO<bool>> Delete(Guid UserId, CancellationToken ct = default);
    }
}
