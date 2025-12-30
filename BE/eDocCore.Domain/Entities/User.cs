using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using eDocCore.Domain.Interfaces;

namespace eDocCore.Domain.Entities;

public partial class User 
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public Guid Id { get; set; }

    public string LoginName { get; set; } = null!;

    public string? Password { get; set; }

    public string? FullName { get; set; }

    public byte? Gender { get; set; }

    public string? Email { get; set; }

    public bool IsActive { get; set; }

    public DateTimeOffset Created { get; set; }

    public DateTimeOffset Modified { get; set; }

    [Timestamp]
    public byte[] Version { get; set; } = null!;

}
