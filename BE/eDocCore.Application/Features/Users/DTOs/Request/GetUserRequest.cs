using eDocCore.Application.Common.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace eDocCore.Application.Features.Users.DTOs.Request
{
    public class GetUserRequest : BasePageRequest
    {
        public string Keyword { get; set; } = null!;

        public string? LoginName { get; set; }

        public string? FullName { get; set; }

        public bool? Gender { get; set; }

        public string? Email { get; set; }

        public bool? IsActive { get; set; }
    }
}
