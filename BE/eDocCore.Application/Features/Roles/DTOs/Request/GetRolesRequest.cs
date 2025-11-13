using System.ComponentModel.DataAnnotations;

namespace eDocCore.Application.Features.Roles.DTOs.Request
{
    public class GetRolesRequest
    {
        public int Page { get; init; } = 1;

        [Range(1, 200)]
        public int PageSize { get; init; } = 20;

        // filter
        public string? Keyword { get; init; }
        public bool? IsActive { get; init; }
    }
}
