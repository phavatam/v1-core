using AutoMapper;
using eDocCore.Application.Common;
using eDocCore.Application.Features.Users.DTOs;
using eDocCore.Domain.Entities;
using eDocCore.Domain.Interfaces.Extend;
using eDocCore.Domain.Interfaces;
using eDocCore.Application.Features.Users.DTOs.Request;
using LinqKit;

namespace eDocCore.Application.Features.Users.Services
{
    public class UserService :  GenericService<User, UserDTO>, IUserService
    {
        private IUnitOfWork _uow;
        private readonly IUserRepository _userRepository;
        private readonly IMapper _mapper;
        private readonly IGenericRepository<User> _genericRepository;

        public UserService(IUserRepository userRepository, IMapper mapper, IUnitOfWork uow, IGenericRepository<User> genericRepository) : base(uow, mapper, genericRepository)
        {
            _userRepository = userRepository;
            _mapper = mapper;
            _uow = uow;
        }
        public async Task<ResultDTO<ArrayResultDTO>> Get(GetUserRequest request, CancellationToken ct)
        {
            //Expression<Func<User, bool>> predicate = x =>
            //    (string.IsNullOrEmpty(request.LoginName) || x.LoginName.Contains(request.LoginName)) &&
            //    (string.IsNullOrEmpty(request.FullName) || (x.FullName != null && x.FullName.Contains(request.FullName))) &&
            //    (string.IsNullOrEmpty(request.Email) || (x.Email != null && x.Email.Contains(request.Email))) &&
            //    (request.IsActive.HasValue || (x.IsActive == request.IsActive));
            //Expression<Func<User, bool>> predicate = x => true;

            var predicate = PredicateBuilder.New<User>(true);
            if (!string.IsNullOrEmpty(request.Keyword))
            {
                // var keywordPredicate = PredicateBuilder.False<User>();
                predicate = predicate.And(x =>
                (x.FullName != null && x.FullName.Contains(request.Keyword.Trim())) ||
                (x.Email != null && x.Email.Contains(request.Keyword.Trim())) ||
                (x.LoginName != null && x.LoginName.Contains(request.Keyword.Trim())));
            }

            if (!string.IsNullOrEmpty(request.LoginName))
                predicate = predicate.And(x => x.LoginName.Contains(request.LoginName));

            var selector = ManualProjectionBuilder.CreateSelector<User, UserDTO>();
            ResultDTO<ArrayResultDTO> resultDTO = new ResultDTO<ArrayResultDTO>() { };
            var users = await _userRepository.GetPagedProjectedAsync(
                request.PageNumber,
                request.PageSize,
                selector,
                predicate);

            var arrays = new ArrayResultDTO()
            {
                PageNumber = request.PageNumber,
                PageSize = request.PageSize,
                TotalItems = users.TotalItems,
                Items = users.Items
            };

            return ResultDTO<ArrayResultDTO>.Success(arrays);
        }

        public async Task<UserDTO?> Get(Guid userId, CancellationToken ct = default)
        {
            var user = await _userRepository.GetByIdAsync(userId);
            return user == null ? null : _mapper.Map<UserDTO>(user);
        }
        public async Task<UserDTO?> GetByLoginName(string loginName, CancellationToken ct = default)
        {
            var user = await _userRepository.GetByLoginNameAsync(loginName);
            return user == null ? null : _mapper.Map<UserDTO>(user);
        }

        public async Task<ResultDTO<UserDTO>> Create(CreateUserRequest request, CancellationToken ct = default)
        {
            await _uow.BeginTransactionAsync();
            var newUser = new User()
            {
                LoginName = request.LoginName ?? string.Empty,
                FullName = request.FullName ?? string.Empty,
                IsActive = request.IsActive ?? false,
                Email = request.Email ?? string.Empty,
                Gender = request.Gender,

            };
            await _userRepository.AddAsync(newUser);
            await _uow.CommitAsync();
            return ResultDTO<UserDTO>.Success(_mapper.Map<UserDTO>(newUser));
        }

        public async Task<ResultDTO<UserDTO>> Update(Guid id,UpdateUserRequest request, CancellationToken ct = default)
        {
            await _uow.BeginTransactionAsync();
            var user = await _userRepository.GetByIdAsync(request.Id ?? Guid.Empty);
            if (user == null)
            {
                return ResultDTO<UserDTO>.Failure(400, "User không tồn tại");
            }

            user.FullName = request.FullName ?? user.FullName;
            user.LoginName = request.LoginName ?? user.LoginName;
            user.Email = request.Email ?? user.Email;
            user.Gender = request.Gender ?? user.Gender;
            user.IsActive = request.IsActive ?? user.IsActive;

            await _userRepository.UpdateAsync(user);
            await _uow.CommitAsync();
            return ResultDTO<UserDTO>.Success(_mapper.Map<UserDTO>(user));
        }


        public async Task<ResultDTO<bool>> Delete(Guid userId, CancellationToken ct = default)
        {
            await _uow.BeginTransactionAsync();
            var user = await _userRepository.GetByIdAsync(userId);
            if (user == null)
            {
                return ResultDTO<bool>.Failure(400, "User không tồn tại");
            }

            await _userRepository.DeleteAsync(user.Id);
            await _uow.CommitAsync();
            return ResultDTO<bool>.Success();
        }

    }
}
