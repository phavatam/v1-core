using eDocCore.Application.Common;
using eDocCore.Application.Common.Exceptions;
using eDocCore.Application.Features.Auth.DTOs.Request;
using eDocCore.Application.Features.Users.Commands;
using eDocCore.Application.Features.Users.DTOs;
using eDocCore.Application.Features.Users.Queries;
using eDocCore.Application.Features.Users.Services;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.IdentityModel.Tokens.Jwt;
using System.Net;

namespace eDocCore.API.Controllers
{
    [ApiController]
    [Route("api/v1/[controller]")]
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
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
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

                var user = await _userService.GetUserById(Guid.Parse(sub));
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
                return StatusCode(StatusCodes.Status500InternalServerError, ResultDTO.Failure((int) HttpStatusCode.InternalServerError, ex.Message, HttpContext.TraceIdentifier));
            }
        }

        private static DateTime UnixTimeStampToDateTime(double unixTimeStamp)
        {
            var dateTime = new DateTime(1970, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc);
            dateTime = dateTime.AddSeconds(unixTimeStamp).ToLocalTime();
            return dateTime;
        }


        [HttpGet("get-list-users")]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult> GetListUsers(int pageNumber, int pageSize)
        {
            try
            {
                var result = await _userService.GetListUsers(pageNumber, pageSize);
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
}
