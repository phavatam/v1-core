using System;
using System.Collections.Generic;

namespace eDocCore.Domain.Entities;

public partial class ResignationApplication
{
    public Guid Id { get; set; }

    public string? ReferenceNumber { get; set; }

    public bool IsExpiredLaborContractDate { get; set; }

    public DateTimeOffset OfficialResignationDate { get; set; }

    public int ShuibookCode { get; set; }

    public string? ReasonForActionCode { get; set; }

    public double UnusedLeaveDate { get; set; }

    public int ContractTypeCode { get; set; }

    public DateTimeOffset? SuggestionForLastWorkingDay { get; set; }

    public bool? IsAgree { get; set; }

    public DateTimeOffset Created { get; set; }

    public DateTimeOffset Modified { get; set; }
}
