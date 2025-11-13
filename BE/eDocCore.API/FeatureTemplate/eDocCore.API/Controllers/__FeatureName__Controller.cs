using eDocCore.Application.Common;
using eDocCore.Application.Common.Models;
using eDocCore.Application.Features.__FeatureName__s.DTOs;
using eDocCore.Application.Features.__FeatureName__s.DTOs.Request;
using eDocCore.Application.Features.__FeatureName__s.Services;
using Microsoft.AspNetCore.Mvc;
using System.Net;

namespace eDocCore.API.FeatureTemplate.eDocCore.API.Controllers
{
    [ApiController]
    [Route("api/v1/[controller]")]
    public class __FeatureName__Controller : ControllerBase
    {
        private readonly I__FeatureName__Service ___FeatureName__Service;
        public __FeatureName__Controller(I__FeatureName__Service __FeatureName__Service)
        {
            ___FeatureName__Service = __FeatureName__Service;
        }

        [HttpGet]
        public async Task<ActionResult> Get([FromQuery(Name = "page_number")] int pageNumber, [FromQuery(Name = "page_size")] int pageSize) 
        {
            try
            {
                var result = await ___FeatureName__Service.Get(pageNumber, pageSize);
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
                var result = await ___FeatureName__Service.Get(id);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ResultDTO.Failure((int)HttpStatusCode.InternalServerError, ex.Message, HttpContext.TraceIdentifier));
            }
        }

        [HttpPost]
        public async Task<ActionResult> Create(Create__FeatureName__Request args)
        {
            try
            {
                var result = await ___FeatureName__Service.Create(args);
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
        public async Task<ActionResult> Update(Update__FeatureName__Request args)
        {
            try
            {
                var result = await ___FeatureName__Service.Update(args);
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
                var result = await ___FeatureName__Service.Delete(id);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ResultDTO.Failure((int) HttpStatusCode.InternalServerError, ex.Message, HttpContext.TraceIdentifier));
            }
        }
    }
}