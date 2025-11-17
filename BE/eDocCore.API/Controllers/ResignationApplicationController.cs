using eDocCore.Application.Common;
using eDocCore.Application.Common.Models;
using eDocCore.Application.Features.ResignationApplications.DTOs;
using eDocCore.Application.Features.ResignationApplications.DTOs.Request;
using eDocCore.Application.Features.ResignationApplications.Services;
using Microsoft.AspNetCore.Mvc;
using System.ComponentModel.DataAnnotations;
using System.Net;

namespace eDocCore.API.Controllers
{
    [ApiController]
    [Route("api/v1/[controller]")]
    public class ResignationApplicationController : ControllerBase
    {
        private readonly IResignationApplicationService _ResignationApplicationService;
        public ResignationApplicationController(IResignationApplicationService ResignationApplicationService)
        {
            _ResignationApplicationService = ResignationApplicationService;
        }

        [HttpGet]
        public async Task<ActionResult> Get([FromQuery(Name = "page_number"), Required] int pageNumber, [FromQuery(Name = "page_size"), Required] int pageSize) 
        {
            try
            {
                var result = await _ResignationApplicationService.Get(pageNumber, pageSize);
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
                var result = await _ResignationApplicationService.Get(id);
                return Ok(result != null ? ResultDTO<object>.Success(result) : ResultDTO.Failure(400, "Item not found!"));
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ResultDTO.Failure((int)HttpStatusCode.InternalServerError, ex.Message, HttpContext.TraceIdentifier));
            }
        }

        [HttpPost]
        public async Task<ActionResult> Create([FromForm] CreateResignationApplicationRequest args)
        {
            try
            {
                var result = await _ResignationApplicationService.Create(args);
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
        public async Task<ActionResult> Update([FromForm]UpdateResignationApplicationRequest args)
        {
            try
            {
                var result = await _ResignationApplicationService.Update(args);
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
                var result = await _ResignationApplicationService.Delete(id);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ResultDTO.Failure((int) HttpStatusCode.InternalServerError, ex.Message, HttpContext.TraceIdentifier));
            }
        }

        [HttpPost("Search")]
        public async Task<ActionResult> Search([FromBody] GetResignationApplicationRequest args)
        {
            try
            {
                var result = await _ResignationApplicationService.GetListByFilter(args);
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
    }
}