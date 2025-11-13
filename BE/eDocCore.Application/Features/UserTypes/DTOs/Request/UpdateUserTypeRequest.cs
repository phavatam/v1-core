using System.ComponentModel.DataAnnotations;

namespace eDocCore.Application.Features.UserTypes.DTOs.Request
{
    public class UpdateUserTypeRequest
    {
        public Guid Id { get; set; }

        public string Name { get; set; } = null!;

    }
}