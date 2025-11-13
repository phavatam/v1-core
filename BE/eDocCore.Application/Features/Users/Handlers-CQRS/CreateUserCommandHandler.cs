using MediatR;
using eDocCore.Domain.Entities;
using eDocCore.Application.Features.Users.Commands;
using eDocCore.Domain.Interfaces.Extend;

namespace eDocCore.Application.Features.Users.Handlers
{
    public class CreateUserCommandHandler : IRequestHandler<CreateUserCommand, Guid>
    {
        private readonly IUserRepository _userRepository;
        public CreateUserCommandHandler(IUserRepository userRepository)
        {
            _userRepository = userRepository;
        }
        public async Task<Guid> Handle(CreateUserCommand request, CancellationToken cancellationToken)
        {
            var user = new User
            {
                LoginName = request.LoginName,
                FullName = request.FullName,
                Gender = request.Gender,
                Email = request.Email,
                IsActive = request.IsActive
            };
            return await _userRepository.AddAsync(user);
        }
    }
}
