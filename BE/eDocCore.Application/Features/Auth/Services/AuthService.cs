using AutoMapper;
using eDocCore.Application.Common;
using eDocCore.Application.Common.Exceptions;
using eDocCore.Application.Common.Security;
using eDocCore.Application.Features.Auth.DTOs;
using eDocCore.Application.Features.Auth.DTOs.Request;
using eDocCore.Application.Features.Users.Commands;
using eDocCore.Application.Features.Users.DTOs;
using eDocCore.Application.Features.Users.DTOs.Request;
using eDocCore.Application.Features.Users.Services;
using eDocCore.Domain.Interfaces;
using eDocCore.Domain.Interfaces.Extend;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using Microsoft.Extensions.Configuration;

namespace eDocCore.Application.Features.Auth.Services
{
    public class AuthService : IAuthService
    {
        private readonly IUserService _userService;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;
        private readonly ILogger<AuthService> _logger;
        private readonly IOptionsMonitor<AppSettingDTO> _optionsMonitor;
        private readonly IConfiguration _configuration;
        private readonly int ExpireTime = 8;

        public AuthService(IUserRepository userRepository, 
            IUnitOfWork unitOfWork, ILogger<AuthService> logger, 
            IMapper mapper, 
            IOptionsMonitor<AppSettingDTO> optionsMonitor,
            IUserService userService,
            IConfiguration configuration)
        {
            _unitOfWork = unitOfWork;
            _logger = logger;
            _mapper = mapper;
            _optionsMonitor = optionsMonitor;
            _userService = userService;
            _configuration = configuration;
        }

        public async Task<UserDTO?> RegisterAsync(RegisterUserRequest request, CancellationToken ct = default)
        {
            try
            {
                // Tạo người dùng
                var user = new CreateUserRequest
                {
                    LoginName = request.LoginName,
                    Password = PasswordHasher.Hash(request.Password),
                    FullName = request.FullName,
                    Email = request.Email,
                    IsActive = true,
                };

                var createSuccess = await _userService.Create(user, ct);

                // Gán vai trò mặc định
                await _unitOfWork.CommitAsync();
                return _mapper.Map<UserDTO>(user);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error registering user");
                await _unitOfWork.RollbackAsync();
                return null;
            }
        }


        public async Task<ResultDTO<TokenDTO>> Login(LoginRequest request, CancellationToken ct = default)
        {
            var user = await _userService.GetByLoginName(request.LoginName);
            if (user == null)
            {
                return ResultDTO<TokenDTO>.Failure((int) System.Net.HttpStatusCode.Unauthorized, "Invalid login credentials.");
            }

            if (!user.IsActive)
            {
                return ResultDTO<TokenDTO>.Failure((int) System.Net.HttpStatusCode.Forbidden, "User account is inactive.");
            }

            if (await _userService.VerifyPassword(user.Id, request.Password) == false)
            {
                return ResultDTO<TokenDTO>.Failure((int) System.Net.HttpStatusCode.Unauthorized, "Invalid login credentials.");
            }

            //var token = GenerateToken(user);
            var token = GenerateTokenDPD(user);
            var generateData = new TokenDTO()
            {
                AccessToken = token
            };

            return ResultDTO<TokenDTO>.Success(generateData); 
        }

        private string GenerateTokenDPD(UserDTO user)
        {
            var jwtSection = _configuration.GetSection("Jwt");
            var key = jwtSection["Key"] ?? _optionsMonitor.CurrentValue.SecretKey;
            var issuer = jwtSection["Issuer"];
            var audience = jwtSection["Audience"];

            var jwtTokenHandler = new JwtSecurityTokenHandler();
            var secretKeyBytes = Encoding.UTF8.GetBytes(key);

            var tokenDescription = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[]
                {
                    new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
                    new Claim(JwtRegisteredClaimNames.Name, user.FullName ?? string.Empty),
                    new Claim(JwtRegisteredClaimNames.Email, user.Email ?? string.Empty),
                    new Claim("Role", "Member"),
                    new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
                }),
                Expires = DateTime.UtcNow.AddHours(8),
                Issuer = issuer,
                Audience = audience,
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(secretKeyBytes),
                    SecurityAlgorithms.HmacSha256Signature)
            };

            var token = jwtTokenHandler.CreateToken(tokenDescription);
            var accessToken = jwtTokenHandler.WriteToken(token);

            return accessToken;
        }

        private TokenDTO GenerateToken(UserDTO user)
        {
            var jwtSection = _configuration.GetSection("Jwt");
            var key = jwtSection["Key"] ?? _optionsMonitor.CurrentValue.SecretKey;
            var issuer = jwtSection["Issuer"];
            var audience = jwtSection["Audience"];

            var jwtTokenHandler = new JwtSecurityTokenHandler();
            var secretKeyBytes = Encoding.UTF8.GetBytes(key);

            var tokenDescription = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[] {
                    new Claim("UserId", user.Id.ToString()),
                    new Claim("FullName", user.FullName ?? string.Empty),
                    new Claim("LoginName", user.LoginName),
                    new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
                }),
                Expires = DateTime.UtcNow.AddHours(ExpireTime),
                Issuer = issuer,
                Audience = audience,
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(secretKeyBytes), SecurityAlgorithms.HmacSha256)
            };

            var token = jwtTokenHandler.CreateToken(tokenDescription);
            var accessToken = jwtTokenHandler.WriteToken(token);
            var refreshToken = GenerateRefreshToken();

            return new TokenDTO
            {
                AccessToken = accessToken
            };
        }

        private static string GenerateRefreshToken()
        {
            var random = new byte[32];
            using var rng = RandomNumberGenerator.Create();
            rng.GetBytes(random);
            return Convert.ToBase64String(random);
        }
    }
}
