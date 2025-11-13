using MediatR;
using System;

namespace eDocCore.Application.Features.Users.Commands
{
    public class UpdateUserCommand : IRequest<bool>
    {
        public Guid Id { get; set; }
        public string LoginName { get; set; } = null!;
        public string? FullName { get; set; }
        public bool? Gender { get; set; }
        public string? Email { get; set; }
        public bool IsActive { get; set; }
    }
}
