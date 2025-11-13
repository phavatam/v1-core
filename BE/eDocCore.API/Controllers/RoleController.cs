using eDocCore.Application.Common;
using eDocCore.Application.Common.Exceptions;
using eDocCore.Application.Common.Models;
using eDocCore.Application.Features.Roles.DTOs;
using eDocCore.Application.Features.Roles.DTOs.Request;
using eDocCore.Application.Features.Roles.Services;
using Microsoft.AspNetCore.Mvc;
using System.Net;
using System.Threading;

namespace eDocCore.API.Controllers
{
    [ApiController]
    [Route("api/v1/[controller]")]
    public class RoleController : ControllerBase
    {
        private readonly IRoleService _roleService;
        private readonly ILogger _logger;

        public RoleController(IRoleService roleService, ILogger logger)
        {
            _roleService = roleService;
            _logger = logger;
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ApiResult<RoleDto?>>> GetById(Guid id)
        {
            var role = await _roleService.GetByIdAsync(id);
            if (role == null) return NotFound(ApiResult<RoleDto?>.Fail("Not found", traceId: HttpContext.TraceIdentifier));
            return Ok(ApiResult<RoleDto?>.Ok(role, traceId: HttpContext.TraceIdentifier));
        }

        [HttpPost]
        public async Task<ActionResult<ApiResult<RoleDto>>> Create([FromBody] CreateRoleRequest request)
        {
            if (!ModelState.IsValid)
                return BadRequest(ApiResult<RoleDto>.Fail("Validation failed", errors: ModelState.Values.SelectMany(v => v.Errors).Select(e => e.ErrorMessage).ToList(), traceId: HttpContext.TraceIdentifier));
            try
            {
                var created = await _roleService.CreateAsync(request);
                return CreatedAtAction(nameof(GetById), new { id = created.Id }, ApiResult<RoleDto>.Ok(created, traceId: HttpContext.TraceIdentifier));
            }
            catch (AppException ex)
            {
                return StatusCode(ex.StatusCode, ApiResult<RoleDto>.Fail(ex.Message, errors: ex.Errors, traceId: HttpContext.TraceIdentifier));
            }
            catch (Exception ex)
            {
                return StatusCode(500, ApiResult<RoleDto>.Fail(ex.Message, traceId: HttpContext.TraceIdentifier));
            }
        }

        [HttpPut]
        public async Task<IActionResult> Update([FromBody] UpdateRoleRequest request)
        {
            if (!ModelState.IsValid)
                return BadRequest(ApiResult<string>.Fail("Validation failed", errors: ModelState.Values.SelectMany(v => v.Errors).Select(e => e.ErrorMessage).ToList(), traceId: HttpContext.TraceIdentifier));
            try
            {
                var updated = await _roleService.UpdateAsync(request);
                if (!updated) return NotFound(ApiResult<string>.Fail("Not found", traceId: HttpContext.TraceIdentifier));
                return Ok(ApiResult<string>.Ok("Updated", traceId: HttpContext.TraceIdentifier));
            }
            catch (AppException ex)
            {
                return StatusCode(ex.StatusCode, ApiResult<string>.Fail(ex.Message, errors: ex.Errors, traceId: HttpContext.TraceIdentifier));
            }
            catch (Exception ex)
            {
                return StatusCode(500, ApiResult<string>.Fail(ex.Message, traceId: HttpContext.TraceIdentifier));
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            try
            {
                var deleted = await _roleService.DeleteAsync(id);
                if (!deleted) return NotFound(ApiResult<string>.Fail("Not found", traceId: HttpContext.TraceIdentifier));
                return Ok(ApiResult<string>.Ok("Deleted", traceId: HttpContext.TraceIdentifier));
            }
            catch (AppException ex)
            {
                return StatusCode(ex.StatusCode, ApiResult<string>.Fail(ex.Message, errors: ex.Errors, traceId: HttpContext.TraceIdentifier));
            }
            catch (Exception ex)
            {
                return StatusCode(500, ApiResult<string>.Fail(ex.Message, traceId: HttpContext.TraceIdentifier));
            }
        }
    }
}
