using MediatR;
using System;

namespace eDocCore.Application.Features.Users.Commands
{
    public class CreateUserCommand : IRequest<Guid>
    {
        public string LoginName { get; set; } = null!;
        public string? FullName { get; set; }
        public bool? Gender { get; set; }
        public string? Email { get; set; }
        public bool IsActive { get; set; }
    }
}
