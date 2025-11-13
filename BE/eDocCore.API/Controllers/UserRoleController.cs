using eDocCore.Application.Common.Models;
using eDocCore.Application.Features.Roles.DTOs;
using eDocCore.Application.Features.Roles.Services;
using Microsoft.AspNetCore.Mvc;
using eDocCore.Application.Features.UserRoles.DTOs;
using eDocCore.Application.Features.UserRoles.Services;

namespace eDocCore.API.Controllers
{
    [ApiController]
    [Route("api/v1/[controller]")]
    public class UserRoleController : ControllerBase
    {
        private readonly IUserRoleService _UserRoleService;
        public UserRoleController(IUserRoleService UserRoleService)
        {
            _UserRoleService = UserRoleService;
        }

        [HttpGet]
        public async Task<ActionResult<ApiResult<IReadOnlyList<UserRoleDto>>>> GetAll()
        {
            var roles = await _UserRoleService.GetAllAsync();
            return Ok(ApiResult<IReadOnlyList<UserRoleDto>>.Ok(roles, traceId: HttpContext.TraceIdentifier));
        }
    }
}