using eDocCore.Application.Common.Interfaces;
using eDocCore.Domain.Interfaces;
using eDocCore.Domain.Interfaces.Extend;
using eDocCore.Infrastructure.Identity;
using eDocCore.Infrastructure.Interceptors;
using eDocCore.Infrastructure.Persistence;
using eDocCore.Infrastructure.Persistence.Repositories;
using eDocCore.Infrastructure.Security;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace eDocCore.Infrastructure
{
    public static class DependencyInjection
    {
        public static IServiceCollection AddInfrastructureServices(this IServiceCollection services, IConfiguration configuration)
        {
            // Cấu hình DbContext cho Database First (không dùng migrations)
            #region Cấu hình database, interceptors, timeout
            #region Cấu hình var auditInterceptor = new AuditSaveChangesInterceptor();
            var auditInterceptor = new AuditSaveChangesInterceptor();
            #endregion
            const int CommandTimeoutSeconds = 30;
            services.AddDbContext<ApplicationDbContext>(options =>
            {
                options.UseSqlServer(configuration.GetConnectionString("DefaultConnection"),
                sqlServerOptions =>
                {
                    sqlServerOptions.CommandTimeout(CommandTimeoutSeconds); // Thiết lập CommandTimeout cho DbContext
                    sqlServerOptions.MigrationsAssembly(typeof(ApplicationDbContext).Assembly.FullName); // ensure migrations are in the right assembly
                });
                #region (3.5+)
                //.UseInternalServiceProvider(new ServiceCollection()
                //   .AddEntityFrameworkSqlServer()
                //   .AddSingleton<IQueryCompiler, LinqKitQueryCompiler>()
                //   .BuildServiceProvider()
                #endregion
            });

            #endregion

            // Đăng ký Generic Repository cho tất cả entities
            services.AddScoped(typeof(IGenericRepository<>), typeof(GenericRepository<>));
            //services.AddScoped<IRoleRepository, RoleRepository>();
            //services.AddScoped<IUserRepository, UserRepository>();
            //services.AddScoped<IMenuRepository, MenuRepository>();
            //services.AddScoped<IUserTypeRepository, UserTypeRepository>();
            //services.AddScoped<IResignationApplicationRepository, ResignationApplicationRepository>();
            
            services.Scan(scan => scan
            .FromAssemblies(typeof(DependencyInjection).Assembly)
            .AddClasses(classes => classes.Where(t => t.Name.EndsWith("Repository")))
            .AsMatchingInterface()
            .WithScopedLifetime());

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
