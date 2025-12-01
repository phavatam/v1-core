using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace eDocCore.Application.Features.Users.DTOs
{
    public class UserDTO
    {
        public Guid Id { get; set; }

        public string LoginName { get; set; } = null!;

        public string? FullName { get; set; }

        public byte? Gender { get; set; }

        public string? Email { get; set; }

        public bool IsActive { get; set; }

        public bool IsAdmin { get; set; }

        public DateTimeOffset Created { get; set; }

        public DateTimeOffset Modified { get; set; }

        public string SAPCode { get; set; } = "00150399";

        public string PositionName { get; set; } = "TECH";

        public string DepartmentName { get; set; } = "TECH-APPLICATION,INTEGRATION & MARKETPLACE";

        public string DivisionName { get; set; } = "TECH INTEGRATION";

        public string WorkLocationName { get; set; } = "TP Hồ Chí Minh";
    }
}
