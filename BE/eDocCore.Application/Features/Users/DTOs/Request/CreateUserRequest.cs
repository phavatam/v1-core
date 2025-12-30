using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace eDocCore.Application.Features.Users.DTOs.Request
{
    public class CreateUserRequest
    {
        public string? LoginName { get; set; }
        public string? Password { get; set; }

        public string? FullName { get; set; }

        public byte? Gender { get; set; }

        public string? Email { get; set; }

        public bool? IsActive { get; set; }

    }
}
