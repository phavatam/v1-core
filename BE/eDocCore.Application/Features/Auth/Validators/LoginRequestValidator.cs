using eDocCore.Application.Features.Auth.DTOs.Request;
using eDocCore.Application.Features.Users.Services;
using FluentValidation;

namespace eDocCore.Application.Features.Auth.Validators
{
    public class LoginRequestValidator : AbstractValidator<LoginRequest>
    {
        public LoginRequestValidator()
        {
            RuleFor(x => x.LoginName)
                .NotEmpty()
                .WithMessage("Login Name Is Required!");

            RuleFor(x => x.Password)
                .NotEmpty()
                .WithMessage("Password Is Required!");
        }
    }
}
