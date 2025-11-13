namespace eDocCore.Application.Features.Auth.DTOs.Response
{
 public class RegisterResponseDTO
 {
     public bool IsSuccess { get; set; }
     public string? Message { get; set; }
     public Guid? UserId { get; set; }
     public List<string>? Errors { get; set; }
 }
}