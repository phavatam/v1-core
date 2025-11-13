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

        public bool? Gender { get; set; }

        public string? Email { get; set; }

        public bool IsActive { get; set; }
        public bool IsAdmin { get; set; }

        public DateTimeOffset Created { get; set; }

        public DateTimeOffset Modified { get; set; }
    }
}
