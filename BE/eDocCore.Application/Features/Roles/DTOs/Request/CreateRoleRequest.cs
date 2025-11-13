namespace eDocCore.Application.Features.Roles.DTOs.Request
{
    public class CreateRoleRequest
    {
        public required string Name { get; init; }
        public bool IsActive { get; init; } = true;
    }
}
