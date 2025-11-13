using System;
using System.Collections.Generic;

namespace eDocCore.Domain.Entities;

public partial class UserDepartmentMapping
{
    public Guid Id { get; set; }

    public Guid UserId { get; set; }

    public Guid DepartmentId { get; set; }

    public DateTimeOffset Created { get; set; }

    public DateTimeOffset Modified { get; set; }

    public virtual User User { get; set; } = null!;
}
