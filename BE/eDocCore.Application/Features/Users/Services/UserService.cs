using AutoMapper;
using eDocCore.Application.Common;
using eDocCore.Application.Features.Users.DTOs;
using eDocCore.Domain.Entities;
using eDocCore.Domain.Interfaces.Extend;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using eDocCore.Domain.Interfaces;
using System.Linq.Expressions;

namespace eDocCore.Application.Features.Users.Services
{
    public class UserService : IUserService
    {
        private readonly IUserRepository _userRepository;
        private readonly IMapper _mapper;
        private readonly IGenericRepository<User> _genericRepository;

        public UserService(IUserRepository userRepository, IMapper mapper, IGenericRepository<User> genericRepository)
        {
            _userRepository = userRepository;
            _mapper = mapper;
            _genericRepository = genericRepository;
        }

        public async Task<UserDTO?> GetUserById(Guid userId, CancellationToken ct = default)
        {
            var user = await _userRepository.GetByIdAsync(userId);
            return user == null ? null : _mapper.Map<UserDTO>(user);
        }

        public async Task<UserDTO?> GetUserByLoginName(string loginName, CancellationToken ct = default)
        {
            var user = await _userRepository.GetByLoginNameAsync(loginName);
            return user == null ? null : _mapper.Map<UserDTO>(user);
        }

        public async Task<ResultDTO<ArrayResultDTO>> GetListUsers(int pageNumber, int pageSize, CancellationToken ct = default)
        {
            Expression<Func<User, bool>> predicate = x => true;


            var selector = ManualProjectionBuilder.CreateSelector<User, UserDTO>();
            ResultDTO<ArrayResultDTO> resultDTO = new ResultDTO<ArrayResultDTO>() { };
            var users = await _genericRepository.GetPagedProjectedAsync(
                pageNumber,
                pageSize,
                selector,
                null);


            var arrays = new ArrayResultDTO()
            {
                PageNumber = pageNumber,
                PageSize = pageSize,
                TotalItems = users.TotalItems,
                Items = users.Items
            };

            return ResultDTO<ArrayResultDTO>.Success(arrays);
        }
    }
}
