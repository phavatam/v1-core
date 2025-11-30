using eDocCore.Domain.Shared.Enum;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace eDocCore.Application.Features.Users.DTOs.Request
{
    public class UpdateUserRequest
    {
        [Required(ErrorMessage = "Field is required!")]
        public Guid? Id { get; set; }

        public string? LoginName { get; set; }

        public string? FullName { get; set; }

        public byte? Gender { get; set; }

        public string? Email { get; set; }

        public bool? IsActive { get; set; }

        public bool? IsAdmin { get; set; }
    }
}
