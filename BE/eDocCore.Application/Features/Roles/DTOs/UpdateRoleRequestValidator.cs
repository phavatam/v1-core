using eDocCore.Application.Features.Roles.DTOs.Request;
using FluentValidation;

namespace eDocCore.Application.Features.Roles.DTOs
{
    public class UpdateRoleRequestValidator : AbstractValidator<UpdateRoleRequest>
    {
        public UpdateRoleRequestValidator()
        {
            RuleFor(x => x.Id).NotEmpty();
            RuleFor(x => x.Name)
                .Must(n => !string.IsNullOrWhiteSpace(n))
                .WithMessage("Name is required")
                .MaximumLength(100)
                .Matches("^[a-zA-Z0-9 ]*$");
        }
    }
}
