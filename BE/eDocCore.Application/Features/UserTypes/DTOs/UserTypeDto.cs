namespace eDocCore.Application.Features.UserTypes.DTOs
{
    public class UserTypeDto
    {
        public Guid Id { get; set; }

        public string Name { get; set; } = null!;

        public DateTimeOffset Created { get; set; }

        public DateTimeOffset Modified { get; set; }
    }
}