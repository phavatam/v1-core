using Azure.Core;
using eDocCore.Application.Common;
using eDocCore.Application.Common.Exceptions;
using eDocCore.Application.Common.Models;
using eDocCore.Application.Features.Auth.DTOs.Request;
using eDocCore.Application.Features.Auth.DTOs.Response;
using eDocCore.Application.Features.Auth.Services;
using eDocCore.Application.Features.Auth.Validators; // Added missing namespace
using eDocCore.Application.Features.Users.DTOs;
using FluentValidation;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.WebUtilities;
using System.Net;
using System.Security.Claims;
using System.Threading;
using System.Threading.Tasks;

namespace eDocCore.API.Controllers
{
    [ApiController]
    [Route("api/v1/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;
        private readonly ILogger<AuthController> _logger;
        private readonly IValidator<RegisterUserRequest> _registerValidatorAuth;
        private readonly IValidator<LoginRequest> _loginValidatorAuth;

        public AuthController(IAuthService authService, ILogger<AuthController> logger, IValidator<RegisterUserRequest> registerValidatorAuth, IValidator<LoginRequest> loginValidatorAuth)
        {
            _authService = authService;
            _logger = logger;
            _registerValidatorAuth = registerValidatorAuth;
            _loginValidatorAuth = loginValidatorAuth;
        }

        [HttpPost("register")]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult> Register([FromBody] RegisterUserRequest request, CancellationToken ct)
        {
            Console.WriteLine("Register");
            // Manually validate the request using FluentValidation
            var validationResult = await _registerValidatorAuth.ValidateAsync(request, ct);
            if (!validationResult.IsValid)
            {
                // Collect validation errors and return a BadRequest response
                var errorMessages = string.Join(" | ", validationResult.Errors.Select(e => e.ErrorMessage));
                return BadRequest(ResultDTO.Failure((int) HttpStatusCode.BadRequest, errorMessages, HttpContext.TraceIdentifier));
            }

            // Proceed with registration logic if validation passes
            _logger.LogInformation("Processing registration for user: {LoginName}", request.LoginName);

            try
            {
                var result = await _authService.RegisterAsync(request, ct);
                if (result == null)
                {
                    return BadRequest(ResultDTO.Failure((int) HttpStatusCode.InternalServerError, "Registration failed.", HttpContext.TraceIdentifier));
                }

                _logger.LogInformation("Registration successful for user: {LoginName}", request.LoginName);
                return Ok(ResultDTO<object>.Success(result, "Registration successful.", HttpContext.TraceIdentifier));
            }
            catch (BusinessRuleException ex)
            {
                _logger.LogError(ex, "Business rule error during registration for user: {LoginName}", request.LoginName);
                return BadRequest(ResultDTO.Failure((int) HttpStatusCode.BadRequest, ex.Message, HttpContext.TraceIdentifier));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Unexpected error during registration for user: {LoginName}", request.LoginName);
                return StatusCode(StatusCodes.Status500InternalServerError, ResultDTO.Failure((int) HttpStatusCode.InternalServerError, ex.Message, HttpContext.TraceIdentifier));
            }
        }

        [HttpPost("login")]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult> Login([FromBody] LoginRequest request, CancellationToken ct)
        {
            // Manually validate the request using FluentValidation
            var validationResult = await _loginValidatorAuth.ValidateAsync(request, ct);
            if (!validationResult.IsValid)
            {
                // Collect validation errors and return a BadRequest response
                var errorMessages = string.Join(" | ", validationResult.Errors.Select(e => e.ErrorMessage));
                return BadRequest(ResultDTO.Failure((int) HttpStatusCode.BadRequest, errorMessages, HttpContext.TraceIdentifier));
            }

            // Proceed with login logic if validation passes
            _logger.LogInformation("Processing login for user: {LoginName}", request.LoginName);

            try
            {
                var result = await _authService.Login(request, ct);
                if (!result.IsSuccess)
                {
                    return BadRequest(ResultDTO.Failure((int) HttpStatusCode.BadRequest, result.Message ?? "", HttpContext.TraceIdentifier));
                }
                Response.Cookies.Append("jwt", result?.Data?.AccessToken ?? "", new CookieOptions
                {
                    HttpOnly = true
                });
                _logger.LogInformation("login successful for user: {LoginName}", request.LoginName);
                return Ok(ResultDTO<object?>.Success(result?.Data, traceId: HttpContext.TraceIdentifier ));
            }
            catch (BusinessRuleException ex)
            {
                _logger.LogError(ex, "Business rule error during login for user: {LoginName}", request.LoginName);
                return BadRequest(ResultDTO.Failure((int) HttpStatusCode.BadRequest, ex.Message, HttpContext.TraceIdentifier));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Unexpected error during login for user: {LoginName}", request.LoginName);
                return StatusCode(StatusCodes.Status500InternalServerError, ResultDTO.Failure((int) HttpStatusCode.InternalServerError, ex.Message, HttpContext.TraceIdentifier));
            }
        }
    }
}
