using eDocCore.Domain.Interfaces;
using eDocCore.Domain.Interfaces.Extend;
using eDocCore.Infrastructure.Persistence;
using eDocCore.Infrastructure.Persistence.Repositories;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using eDocCore.Application.Common.Interfaces;
using eDocCore.Infrastructure.Identity;
using eDocCore.Infrastructure.Security;
using eDocCore.Application.Features.Menus.Services;
using eDocCore.API.Persistence.Repositories;

namespace eDocCore.Infrastructure
{
    public static class DependencyInjection
    {
        public static IServiceCollection AddInfrastructureServices(this IServiceCollection services, IConfiguration configuration)
        {
            // Cấu hình DbContext cho Database First (không dùng migrations)
            services.AddDbContext<ApplicationDbContext>(options =>
                options.UseSqlServer(configuration.GetConnectionString("DefaultConnection")));

            // Đăng ký Generic Repository cho tất cả entities
            services.AddScoped(typeof(IGenericRepository<>), typeof(GenericRepository<>));
            services.AddScoped<IRoleRepository, RoleRepository>();
            services.AddScoped<IUserRepository, UserRepository>();
            services.AddScoped<IMenuRepository, MenuRepository>();
            services.AddScoped<IUserTypeRepository, UserTypeRepository>();

            // Unit of Work (giữ tạm; cân nhắc bỏ SaveChanges trong repo nếu dùng UoW thực sự)
            services.AddScoped<IUnitOfWork, UnitOfWork>();

            // Current user accessor
            services.AddHttpContextAccessor();
            services.AddScoped<ICurrentUser, CurrentUser>();

            // JWT
            services.Configure<JwtOptions>(configuration.GetSection("Jwt"));
            services.AddScoped<IJwtTokenService, JwtTokenService>();

            return services;
        }
    }
}
