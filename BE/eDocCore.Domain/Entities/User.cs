using System;
using System.Collections.Generic;

namespace eDocCore.Domain.Entities;

public partial class User
{
    public Guid Id { get; set; }

    public string LoginName { get; set; } = null!;

    public string? Password { get; set; }

    public string? FullName { get; set; }

    public bool? Gender { get; set; }

    public string? Email { get; set; }

    public bool IsActive { get; set; }

    public DateTimeOffset Created { get; set; }

    public DateTimeOffset Modified { get; set; }

    public virtual ICollection<UserDepartmentMapping> UserDepartmentMappings { get; set; } = new List<UserDepartmentMapping>();

    public virtual ICollection<UserRole> UserRoles { get; set; } = new List<UserRole>();
}
