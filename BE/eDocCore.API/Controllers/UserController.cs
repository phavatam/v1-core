using Asp.Versioning;
using eDocCore.Application.Common;
using eDocCore.Application.Common.Exceptions;
using eDocCore.Application.Common.Export;
using eDocCore.Application.Features.Auth.DTOs.Request;
using eDocCore.Application.Features.Users.Commands;
using eDocCore.Application.Features.Users.DTOs;
using eDocCore.Application.Features.Users.DTOs.Request;
using eDocCore.Application.Features.Users.Queries;
using eDocCore.Application.Features.Users.Services;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.OData.Deltas;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Net;

namespace eDocCore.API.Controllers
{
    [ApiController]
    [Route("api/v{version:apiVersion}/[controller]")]
    [ApiVersion(1.0)]
    [ApiVersion(2.0)]
    public class UserController : ControllerBase
    {
        private readonly IMediator _mediator;
        private readonly ILogger<UserController> _logger;
        private readonly IUserService _userService;
        public UserController(IMediator mediator, ILogger<UserController> logger, IUserService userService)
        {
            _mediator = mediator;
            _logger = logger;
            _userService = userService;
        }

        [HttpGet("get-user")]
        [MapToApiVersion(1.0)]
        public async Task<ActionResult> GetUser()
        {
            try
            {
                var jwt = Request.Headers["Authorization"].FirstOrDefault()?.Split(" ").Last();
                if (jwt is null)
                    return Ok(ResultDTO.Failure(400, "Không tìm thấy jwt"));

                var handler = new JwtSecurityTokenHandler();
                var tokenS = handler.ReadToken(jwt) as JwtSecurityToken;
                var sub = tokenS!.Claims.First(claim => claim.Type == "sub").Value;
                var expire = tokenS.Claims.First(claim => claim.Type == "exp").Value;

                var doubleVal = Convert.ToDouble(expire);
                var dateAfterConvert = UnixTimeStampToDateTime(doubleVal);

                if (dateAfterConvert < DateTime.Now)
                    return Ok(ResultDTO.Failure(400, "Token đã hết hạn"));

                var user = await _userService.Get(Guid.Parse(sub));
                if (user == null)
                {
                    return Ok(ResultDTO.Failure(400, "User không tồn tại!"));
                }

                if (!user.IsActive)
                {
                    return Ok(ResultDTO.Failure(400, "User chưa được kích hoạt!"));
                }
                user.IsAdmin = true;
                return Ok(ResultDTO<UserDTO>.Success(user, "Xác thực thành công.", HttpContext.TraceIdentifier));
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ResultDTO.Failure((int)HttpStatusCode.InternalServerError, ex.Message, HttpContext.TraceIdentifier));
            }
        }

        private static DateTime UnixTimeStampToDateTime(double unixTimeStamp)
        {
            var dateTime = new DateTime(1970, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc);
            dateTime = dateTime.AddSeconds(unixTimeStamp).ToLocalTime();
            return dateTime;
        }

        [HttpPost("get-list")]
        [MapToApiVersion(1.0)]
        [Authorize]
        public async Task<ActionResult> Get(GetUserRequest request)
        {
            try
            {
                var result = await _userService.Get(request);
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
        [MapToApiVersion(1.0)]
        public async Task<ActionResult> Get(Guid id)
        {
            try
            {
                var result = await _userService.Get(id);
                if (result is null)
                {
                    return BadRequest(ResultDTO.Failure(400, "Không tìm thấy User!"));
                }
                return Ok(ResultDTO<object>.Success(result, HttpContext.TraceIdentifier));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Lỗi Server không mong muốn. TraceId: {TraceId}", HttpContext.TraceIdentifier);
                return StatusCode(StatusCodes.Status500InternalServerError, new
                {
                    error = "Đã xảy ra lỗi hệ thống không mong muốn. Vui lòng liên hệ hỗ trợ.",
                    traceId = HttpContext.TraceIdentifier
                });
            }
        }

        [HttpPost]
        [MapToApiVersion(1.0)]
        public async Task<ActionResult> Create(CreateUserRequest request)
        {
            try
            {
                var result = await _userService.Create(request);
                if (!result.IsSuccess)
                {
                    result.TraceId = HttpContext.TraceIdentifier;
                    return BadRequest(result);
                }
                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Lỗi Server không mong muốn. TraceId: {TraceId}", HttpContext.TraceIdentifier);
                return StatusCode(StatusCodes.Status500InternalServerError, new
                {
                    error = "Đã xảy ra lỗi hệ thống không mong muốn. Vui lòng liên hệ hỗ trợ.",
                    traceId = HttpContext.TraceIdentifier
                });
            }
        }

        [HttpPut("{id}")]
        [MapToApiVersion(1.0)]
        public async Task<ActionResult> Update(Guid id, [FromBody] UpdateUserRequest request)
        {
            try
            {
                var result = await _userService.Update(id, request);
                if (!result.IsSuccess)
                {
                    result.TraceId = HttpContext.TraceIdentifier;
                    return BadRequest(result);
                }
                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Lỗi Server không mong muốn. TraceId: {TraceId}", HttpContext.TraceIdentifier);
                return StatusCode(StatusCodes.Status500InternalServerError, new
                {
                    error = "Đã xảy ra lỗi hệ thống không mong muốn. Vui lòng liên hệ hỗ trợ.",
                    traceId = HttpContext.TraceIdentifier
                });
            }
        }


        [HttpPatch("{id}")]
        [MapToApiVersion(1.0)]
        public async Task<ActionResult> Patch(Guid id, [FromBody] Microsoft.AspNetCore.OData.Deltas.Delta<UserDTO> request)
        {
            try
            {
                var result = await _userService.Patch(id, request);
                if (result == null)
                {
                    return BadRequest(result);
                }
                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Lỗi Server không mong muốn. TraceId: {TraceId}", HttpContext.TraceIdentifier);
                return StatusCode(StatusCodes.Status500InternalServerError, new
                {
                    error = "Đã xảy ra lỗi hệ thống không mong muốn. Vui lòng liên hệ hỗ trợ.",
                    traceId = HttpContext.TraceIdentifier
                });
            }
        }


        [HttpDelete("{id}")]
        [MapToApiVersion(1.0)]
        public async Task<ActionResult> Delete(Guid id)
        {
            try
            {
                var result = await _userService.Delete(id);
                if (!result.IsSuccess)
                {
                    result.TraceId = HttpContext.TraceIdentifier;
                    return BadRequest(result);
                }
                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Lỗi Server không mong muốn. TraceId: {TraceId}", HttpContext.TraceIdentifier);
                return StatusCode(StatusCodes.Status500InternalServerError, new
                {
                    error = "Đã xảy ra lỗi hệ thống không mong muốn. Vui lòng liên hệ hỗ trợ.",
                    traceId = HttpContext.TraceIdentifier
                });
            }
        }


        [HttpGet]
        [MapToApiVersion(1.0)]
        public async Task<ActionResult> Export()
        {
            try
            {

                // 1. Chuẩn bị dữ liệu cho từng Sheet
                var products = new List<Product>
                {
                    new Product { Id = 1, Name = "Laptop X", Price = 1500m },
                    new Product { Id = 2, Name = "Keyboard Y", Price = 75m }
                };

                var customers = new List<Customer>
                {
                    new Customer { CustomerId = 101, FullName = "Nguyễn Văn A", City = "Hà Nội" },
                    new Customer { CustomerId = 102, FullName = "Trần Thị B", City = "HCM" }
                };

                // 2. Tạo danh sách SheetData
                var sheetsToExport = new List<SheetData>
                {
                    new SheetData { SheetName = "BaoCaoSanPham", DataList = products },
                    new SheetData { SheetName = "DanhSachKhachHang", DataList = customers }
                };

                // 3. Gọi hàm Export
                byte[] fileBytesSingle = ExcelExporter.ExportDataToExcel(customers);
                byte[] fileBytes = ExcelExporter.ExportMultipleSheets(sheetsToExport);


                // Thiết lập kiểu MIME cho file Excel(.xlsx)
                string mimeType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";

                // Thiết lập tên file sẽ được tải xuống
                string fileName = $"DanhSach_{DateTime.Now:yyyyMMdd_HHmmss}.xlsx";

                // Trả về FileResult, đây là chuẩn để kích hoạt download trên trình duyệt
                return File(fileBytes, mimeType, fileName);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Lỗi Server không mong muốn. TraceId: {TraceId}", HttpContext.TraceIdentifier);
                return StatusCode(StatusCodes.Status500InternalServerError, new
                {
                    error = "Đã xảy ra lỗi hệ thống không mong muốn. Vui lòng liên hệ hỗ trợ.",
                    traceId = HttpContext.TraceIdentifier
                });
            }
        }

        /*/// <summary>
        /// Lấy danh sách User
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        [Authorize(Roles = "Admin,Manager")]
        public async Task<IActionResult> GetUsers()
        {
            var users = await _mediator.Send(new GetUsersQuery());
            return Ok(users);
        }

        // POST: /api/user
        [HttpPost]
        public async Task<IActionResult> CreateUser([FromBody] CreateUserCommand command)
        {
            var id = await _mediator.Send(command);
            return CreatedAtAction(nameof(GetUsers), new { id }, id);
        }

        // PUT: /api/user/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateUser(Guid id, [FromBody] UpdateUserCommand command)
        {
            command.Id = id;
            var result = await _mediator.Send(command);
            if (!result) return NotFound();
            return NoContent();
        }

        // DELETE: /api/user/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUser(Guid id)
        {
            var result = await _mediator.Send(new DeleteUserCommand { Id = id });
            if (!result) return NotFound();
            return NoContent();
        }*/
    }

    public class Product
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public decimal Price { get; set; }
    }

    public class Customer
    {
        public int CustomerId { get; set; }
        public string FullName { get; set; } = string.Empty;
        public string City { get; set; } = string.Empty;
    }
}
