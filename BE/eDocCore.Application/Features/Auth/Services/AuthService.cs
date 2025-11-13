using AutoMapper;
using eDocCore.Application.Common;
using eDocCore.Application.Common.Exceptions;
using eDocCore.Application.Common.Security;
using eDocCore.Application.Features.Auth.DTOs;
using eDocCore.Application.Features.Auth.DTOs.Request;
using eDocCore.Application.Features.Users.DTOs;
using eDocCore.Domain.Entities;
using eDocCore.Domain.Interfaces;
using eDocCore.Domain.Interfaces.Extend;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;

namespace eDocCore.Application.Features.Auth.Services
{
    public class AuthService : IAuthService
    {
        private readonly IUserRepository _userRepository;
        private readonly IRoleRepository _roleRepository;
        private readonly IGenericRepository<UserRole> _userRole;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;
        private readonly ILogger<AuthService> _logger;
        private readonly IOptionsMonitor<AppSettingDTO> _optionsMonitor;
        private readonly int ExpireTime = 8;

        public AuthService(IUserRepository userRepository, IGenericRepository<UserRole> userRole, IRoleRepository roleRepository, IUnitOfWork unitOfWork, ILogger<AuthService> logger, IMapper mapper, IOptionsMonitor<AppSettingDTO> optionsMonitor)
        {
            _userRepository = userRepository;
            _userRole = userRole;
            _roleRepository = roleRepository;
            _unitOfWork = unitOfWork;
            _logger = logger;
            _mapper = mapper;
            _optionsMonitor = optionsMonitor;
        }

        public async Task<UserDTO?> RegisterAsync(RegisterUserRequest request, CancellationToken ct = default)
        {
            try
            {
                // Tạo người dùng
                var user = new User
                {
                    LoginName = request.LoginName,
                    Password = PasswordHasher.Hash(request.Password),
                    FullName = request.FullName,
                    Email = request.Email,
                    IsActive = true,
                };
                await _userRepository.AddAsync(user);

                // Gán vai trò mặc định
                await AssignDefaultRole(user.Id);
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

        private async Task AssignDefaultRole(Guid userId)
        {
            var roleDefault = await _roleRepository.FirstOrDefaultAsync(x => x.Name == "Member");
            if (roleDefault == null) throw new BusinessRuleException("Default role 'Member' not found");

            var userRole = new UserRole { UserId = userId, RoleId = roleDefault.Id };
            await _userRole.AddAsync(userRole);
        }

        public async Task<ResultDTO<TokenDTO>> Login(LoginRequest request, CancellationToken ct = default)
        {
            var user = await _userRepository.GetByLoginNameAsync(request.LoginName);
            if (user == null)
            {
                return ResultDTO<TokenDTO>.Failure((int) System.Net.HttpStatusCode.Unauthorized, "Invalid login credentials.");
            }

            if (!user.IsActive)
            {
                return ResultDTO<TokenDTO>.Failure((int) System.Net.HttpStatusCode.Forbidden, "User account is inactive.");
            }

            if (!PasswordHasher.Verify(user.Password ?? "", request.Password))
            {
                return ResultDTO<TokenDTO>.Failure((int)System.Net.HttpStatusCode.Unauthorized, "Invalid login credentials.");
            }
            //var token = GenerateToken(user);
            var token = GenerateTokenDPD(user);
            var generateData = new TokenDTO()
            {
                AccessToken = token
            };

            return ResultDTO<TokenDTO>.Success(generateData); 
        }

        private string GenerateTokenDPD(User user)
        {
            var jwtTokenHandler = new JwtSecurityTokenHandler();
            var secretKeyBytes = Encoding.UTF8.GetBytes(_optionsMonitor.CurrentValue.SecretKey);

            var tokenDescription = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[]
                {
                    new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
                    new Claim(JwtRegisteredClaimNames.Name, user.FullName ?? ""),
                    new Claim(JwtRegisteredClaimNames.Email, user.Email ?? ""),
                    new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
                }),
                Expires = DateTime.UtcNow.AddHours(8),
                //Expires = DateTime.UtcNow.AddMinutes(15),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(secretKeyBytes),
                    SecurityAlgorithms.HmacSha512Signature)
            };

            var token = jwtTokenHandler.CreateToken(tokenDescription);
            var accessToken = jwtTokenHandler.WriteToken(token);

            return accessToken;
        }

        private TokenDTO GenerateToken(User user)
        {
            var jwtTokenHandler = new JwtSecurityTokenHandler();
            var secretKeyBytes = Encoding.UTF8.GetBytes(_optionsMonitor.CurrentValue.SecretKey);

            var tokenDescription = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[] {
                    new Claim("UserId", user.Id.ToString()),
                    new Claim("FullName", user.FullName ?? ""),
                    new Claim("LoginName", user.LoginName),
                    new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
                }),
                Expires = DateTime.UtcNow.AddHours(ExpireTime),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(secretKeyBytes), SecurityAlgorithms.HmacSha512)
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
