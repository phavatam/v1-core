using System.ComponentModel.DataAnnotations;

namespace eDocCore.Application.Features.ResignationApplications.DTOs.Request
{
    public class UpdateResignationApplicationRequest
    {
        [Required(ErrorMessage = "Field Id Is Required!")]
        public Guid Id { get; set; }

        public bool IsExpiredLaborContractDate { get; set; }

        public DateTimeOffset OfficialResignationDate { get; set; }

        public int ShuibookCode { get; set; }

        public string? ReasonForActionCode { get; set; }

        public double UnusedLeaveDate { get; set; }

        public int ContractTypeCode { get; set; }

        public DateTimeOffset? SuggestionForLastWorkingDay { get; set; }

        public bool? IsAgree { get; set; }

        public bool IsNotifiedLastWorkingDate { get; set; }

        public string? ReasonForLastWorkingDay { get; set; }
    }
}