using MediatR;
using eDocCore.Domain.Entities;
using eDocCore.Application.Features.Users.Commands;
using eDocCore.Domain.Interfaces.Extend;

namespace eDocCore.Application.Features.Users.Handlers
{
    public class UpdateUserCommandHandler : IRequestHandler<UpdateUserCommand, bool>
    {
        private readonly IUserRepository _userRepository;
        public UpdateUserCommandHandler(IUserRepository userRepository)
        {
            _userRepository = userRepository;
        }
        public async Task<bool> Handle(UpdateUserCommand request, CancellationToken cancellationToken)
        {
            var user = await _userRepository.GetByIdAsync(request.Id);
            if (user == null) return false;
            user.LoginName = request.LoginName;
            user.FullName = request.FullName;
            user.Gender = request.Gender;
            user.Email = request.Email;
            user.IsActive = request.IsActive;
            await _userRepository.UpdateAsync(user);
            return true;
        }
    }
}
