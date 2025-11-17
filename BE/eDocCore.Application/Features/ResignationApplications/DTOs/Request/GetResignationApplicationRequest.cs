using System.ComponentModel.DataAnnotations;

namespace eDocCore.Application.Features.ResignationApplications.DTOs.Request
{
    public class GetResignationApplicationRequest
    {
        // Add properties 
        public Guid Id { get; set; }
        public string Keyword { get; set; } = string.Empty;
        public int Page { get; init; } = 1;
        public int PageSize { get; init; } = 20;
    }
}