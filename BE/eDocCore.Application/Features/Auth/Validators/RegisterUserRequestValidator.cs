using eDocCore.Application.Features.Auth.DTOs.Request;
using eDocCore.Application.Features.Auth.Services;
using eDocCore.Application.Features.Roles.Services;
using eDocCore.Application.Features.Users.Services;
using FluentValidation;

namespace eDocCore.Application.Features.Auth.Validators
{
    public class RegisterUserRequestValidator : AbstractValidator<RegisterUserRequest>
    {
        private readonly IAuthService _authService;
        private readonly IRoleService _roleService;
        private readonly IUserService _userService;

        public RegisterUserRequestValidator(IAuthService authService, IRoleService roleService, IUserService userService)
        {
            _authService = authService;
            _roleService = roleService;
            _userService = userService;

            RuleFor(x => x.LoginName)
                .NotEmpty().WithMessage("Login name is required.")
                .Must(ExistLoginName).WithMessage(x => $"Login name {x.LoginName} already exists.");

            RuleFor(x => x.Email)
                .NotEmpty().WithMessage("Email is required.")
                .EmailAddress().WithMessage("Invalid email format.");

            RuleFor(x => x.Password)
                .NotEmpty().WithMessage("Password is required.")
                .MinimumLength(6).WithMessage("Password must be at least 6 characters long.")
                .Matches("[A-Z]").WithMessage("Password must contain at least one uppercase letter.")
                .Matches("[a-z]").WithMessage("Password must contain at least one lowercase letter.")
                .Matches("[0-9]").WithMessage("Password must contain at least one number.")
                .Matches("[!@#$%^&*(),.?\":{}|<>]").WithMessage("Password must contain at least one special character.");

            RuleFor(x => x)
            .Must(x => ExistRoleMember("Member"))
                .WithMessage("Role 'Member' does not exist.")
                .WithName("OtherErrors");
        }

        private bool ExistLoginName(string loginName)
        {
            var user = _userService.GetUserByLoginName(loginName).Result;
            return user == null;
        }

        private bool ExistRoleMember(string roleName)
        {
            // Synchronous validation by preloading data
            var roles = _roleService.GetRoleByNameAsync(roleName).Result;
            return roles != null;
        }
    }
}
