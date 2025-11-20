namespace eDocCore.Application.Features.ResignationApplications.DTOs
{
    public class ResignationApplicationDto
    {
        public Guid Id { get; set; }

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

        public string? PositionName { get; set; }

        public string? DepartmentName { get; set; }

        public string? DivisionName { get; set; }

        public string? WorkLocationName { get; set; }

        public bool IsNotifiedLastWorkingDate { get; set; }

        public string? ReasonForLastWorkingDay { get; set; }

        public DateTimeOffset Created { get; set; }

        public DateTimeOffset Modified { get; set; }
    }
}