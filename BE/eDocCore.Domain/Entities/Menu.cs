using System;
using System.Collections.Generic;

namespace eDocCore.Domain.Entities;

public partial class Menu
{
    public Guid Id { get; set; }

    public string Name { get; set; } = null!;

    public Guid? ParentId { get; set; }

    public string? MenuCode { get; set; }

    public string? IconLink { get; set; }

    public double? Sort { get; set; }

    public DateTimeOffset Created { get; set; }

    public DateTimeOffset Modified { get; set; }

    public virtual ICollection<Menu> InverseParent { get; set; } = new List<Menu>();

    public virtual Menu? Parent { get; set; }
}
