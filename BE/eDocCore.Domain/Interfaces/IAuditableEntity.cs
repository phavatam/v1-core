namespace eDocCore.Domain.Interfaces;

public interface IAuditableEntity
{
     Guid Id { get; set; }
     DateTimeOffset Created { get; set; }
     DateTimeOffset Modified { get; set; }
}