using eDocCore.Application.Common;
using eDocCore.Application.Common.Models;
using eDocCore.Application.Features.UserTypes.DTOs;
using eDocCore.Application.Features.UserTypes.DTOs.Request;
using eDocCore.Application.Features.UserTypes.Services;
using Microsoft.AspNetCore.Mvc;
using System.Net;

namespace eDocCore.API.FeatureTemplate.eDocCore.API.Controllers
{
    [ApiController]
    [Route("api/v1/[controller]")]
    public class UserTypeController : ControllerBase
    {
        private readonly IUserTypeService _UserTypeService;
        public UserTypeController(IUserTypeService UserTypeService)
        {
            _UserTypeService = UserTypeService;
        }

        [HttpGet]
        public async Task<ActionResult> Get(
            [FromQuery(Name = "page_number")] int pageNumber, 
            [FromQuery(Name = "page_size")] int pageSize)
        {
            try
            {
                var result = await _UserTypeService.Get(pageNumber, pageSize);
                if (!result.IsSuccess)
                {
                    return Ok(ResultDTO.Failure(400, "Lấy danh sách thất bại!", HttpContext.TraceIdentifier));
                }
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ResultDTO.Failure((int)HttpStatusCode.InternalServerError, ex.Message, HttpContext.TraceIdentifier));
            }
        }

        [HttpGet("{id}")]
        public async Task<ActionResult> Get(Guid id)
        {
            try
            {
                var result = await _UserTypeService.Get(id);
                return Ok(ResultDTO<object>.Success(result));
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ResultDTO.Failure((int)HttpStatusCode.InternalServerError, ex.Message, HttpContext.TraceIdentifier));
            }
        }

        [HttpPost]
        public async Task<ActionResult> Create(CreateUserTypeRequest args)
        {
            try
            {
                var result = await _UserTypeService.Create(args);
                if (!result.IsSuccess)
                {
                    return BadRequest(ResultDTO.Failure(400, result.Message ?? "", HttpContext.TraceIdentifier));
                }
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ResultDTO.Failure((int)HttpStatusCode.InternalServerError, ex.Message, HttpContext.TraceIdentifier));
            }
        }

        [HttpPut]
        public async Task<ActionResult> Update(UpdateUserTypeRequest args)
        {
            try
            {
                var result = await _UserTypeService.Update(args);
                if (!result.IsSuccess)
                {
                    return BadRequest(ResultDTO.Failure(400, result.Message ?? "", HttpContext.TraceIdentifier));
                }
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ResultDTO.Failure((int)HttpStatusCode.InternalServerError, ex.Message, HttpContext.TraceIdentifier));
            }
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> Delete(Guid id)
        {
            try
            {
                var result = await _UserTypeService.Delete(id);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ResultDTO.Failure((int) HttpStatusCode.InternalServerError, ex.Message, HttpContext.TraceIdentifier));
            }
        }
    }
}