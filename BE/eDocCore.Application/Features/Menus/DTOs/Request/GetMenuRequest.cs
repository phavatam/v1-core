using System.ComponentModel.DataAnnotations;

namespace eDocCore.Application.Features.Menus.DTOs.Request
{
    public class GetMenuRequest
    {
        // Add properties 
        public Guid Id { get; set; }
        public string Keyword { get; set; } = string.Empty;
        public int Page { get; init; } = 1;

        [Range(1, 200)]
        public int PageSize { get; init; } = 20;
    }
}