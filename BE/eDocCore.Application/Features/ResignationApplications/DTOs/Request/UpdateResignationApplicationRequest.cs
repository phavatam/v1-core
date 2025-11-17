using System.ComponentModel.DataAnnotations;

namespace eDocCore.Application.Features.ResignationApplications.DTOs.Request
{
    public class UpdateResignationApplicationRequest
    {
        public Guid Id { get; set; }

        [Required(ErrorMessage = "Field Id Is Required!")]
        public Guid UserId { get; set; }

        public string? ReferenceNumber { get; set; }

        public bool IsExpiredLaborContractDate { get; set; }

        public DateTimeOffset OfficialResignationDate { get; set; }

        public int ShuibookCode { get; set; }

        public string? ReasonForActionCode { get; set; }

        public double UnusedLeaveDate { get; set; }

        public int ContractTypeCode { get; set; }

        public DateTimeOffset? SuggestionForLastWorkingDay { get; set; }

        public bool? IsAgree { get; set; }
    }
}