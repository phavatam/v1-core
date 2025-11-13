using eDocCore.Application.Features.Auth.DTOs.Request;
using FluentValidation;

namespace eDocCore.Application.Features.Auth.Validators
{
    public class ChangePasswordRequestValidator : AbstractValidator<ChangePasswordRequest>
    {
        public ChangePasswordRequestValidator()
        {
            RuleFor(x => x.CurrentPassword).NotEmpty();
            RuleFor(x => x.NewPassword)
                .NotEmpty()
                .MinimumLength(6).WithMessage("New password must be at least 6 characters");
        }
    }
}
