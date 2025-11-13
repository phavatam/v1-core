using System;
using System.Collections.Generic;

namespace eDocCore.Domain.Entities;

public partial class Department
{
    public Guid Id { get; set; }

    public string Name { get; set; } = null!;

    public DateTimeOffset Created { get; set; }

    public DateTimeOffset Modified { get; set; }
}
