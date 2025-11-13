using eDocCore.Application.Common.Models;
using eDocCore.Application.Features.UserDepartmentMappings.DTOs;
using eDocCore.Application.Features.UserDepartmentMappings.Services;
using Microsoft.AspNetCore.Mvc;

namespace eDocCore.API.FeatureTemplate.eDocCore.API.Controllers
{
    [ApiController]
    [Route("api/v1/[controller]")]
    public class UserDepartmentMappingController : ControllerBase
    {
        private readonly IUserDepartmentMappingService _UserDepartmentMappingService;
        public UserDepartmentMappingController(IUserDepartmentMappingService UserDepartmentMappingService)
        {
            _UserDepartmentMappingService = UserDepartmentMappingService;
        }

        [HttpGet]
        public async Task<ActionResult<ApiResult<IReadOnlyList<UserDepartmentMappingDto>>>> GetAll()
        {
            var roles = await _UserDepartmentMappingService.GetAllAsync();
            return Ok(ApiResult<IReadOnlyList<UserDepartmentMappingDto>>.Ok(roles, traceId: HttpContext.TraceIdentifier));
        }
    }
}