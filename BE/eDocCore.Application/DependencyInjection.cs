using eDocCore.Application.Behaviours;
using eDocCore.Application.Features.Auth.DTOs.Request;
using eDocCore.Application.Features.Auth.Services;
using eDocCore.Application.Features.Auth.Validators;
using eDocCore.Application.Features.Users.Services;
using FluentValidation;
using MediatR;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;

namespace eDocCore.Application
{
    public static class DependencyInjection
    {
        public static IServiceCollection AddApplicationServices(this IServiceCollection services)
        {
            // Cấu hình AutoMapper
            services.AddAutoMapper(Assembly.GetExecutingAssembly());

            // Cấu hình FluentValidation
            services.AddValidatorsFromAssembly(Assembly.GetExecutingAssembly());

            // Cấu hình MediatR
            services.AddMediatR(cfg => {
                cfg.RegisterServicesFromAssembly(Assembly.GetExecutingAssembly());
                cfg.AddBehavior(typeof(IPipelineBehavior<,>), typeof(ValidationBehaviour<,>));
            });


            //// Application services (không CQRS)
            //services.AddScoped<IRoleService, RoleService>();
            //services.AddScoped<IRoleValidator, RoleValidator>();

            //// Auth services
            //services.AddScoped<IAuthService, AuthService>();
            //services.AddScoped<IValidator<RegisterUserRequest>, RegisterUserRequestValidator>();
            //services.AddScoped<IValidator<LoginRequest>, LoginRequestValidator>();

            //#region User Service
            //services.AddScoped<IUserService, UserService>();
            //#endregion

            //services.AddScoped<IMenuService, MenuService>();
            //services.AddScoped<IMenuValidator, MenuValidator>();

            //#region User Type
            //services.AddScoped<IUserTypeService, UserTypeService>();
            //services.AddScoped<IUserTypeValidator, UserTypeValidator>();
            //#endregion

            //#region Resignation Application
            //services.AddScoped<IResignationApplicationService, ResignationApplicationService>();
            //services.AddScoped<IResignationApplicationValidator, ResignationApplicationValidator>();
            //#endregion

            //// Tự động quét các cặp Interface/Class Service
            //var assembly = Assembly.GetExecutingAssembly();

            //// Tìm tất cả các Concrete Class (không phải interface/abstract) kết thúc bằng "Service"
            //var serviceImplementations = assembly.GetTypes()
            //    .Where(t => t.IsClass && !t.IsAbstract && t.Name.EndsWith("Service"));

            //foreach (var implementation in serviceImplementations)
            //{
            //    // Tìm Interface tương ứng (ví dụ: IProductService cho ProductService)
            //    var serviceInterface = implementation.GetInterfaces()
            //        .FirstOrDefault(i => i.Name == $"I{implementation.Name}");

            //    if (serviceInterface != null)
            //    {
            //        // Tự động đăng ký
            //        services.AddScoped(serviceInterface, implementation);
            //    }
            //}

            var assembly = Assembly.GetExecutingAssembly();

            // 1. Cấu hình MediatR, AutoMapper, FluentValidation (Không thay đổi)
            // Các cấu hình này đã tự động quét Handler/Profile/Validator dựa trên Interface chuẩn.
            services.AddAutoMapper(assembly);
            services.AddValidatorsFromAssembly(assembly);
            services.AddMediatR(cfg => {
                cfg.RegisterServicesFromAssembly(assembly);
                cfg.AddBehavior(typeof(IPipelineBehavior<,>), typeof(ValidationBehaviour<,>));
            });


            // 2. Logic Quét Tự động cho các thành phần Custom (Custom Auto-Registration)
            // Khối 1: Quét và Đăng ký các cặp I...Service và ...Service (Scoped Lifetime)
            services.Scan(scan => scan
                .FromAssemblies(assembly)
                .AddClasses(classes => classes.Where(t => t.Name.EndsWith("Service")))
                .AsMatchingInterface()
                .WithScopedLifetime());

            //// Khối 2: Quét và Đăng ký các cặp I...Validator và ...Validator (Scoped Lifetime)
            //// Điều kiện: Nếu bạn có các Validator không phải là IValidator<T> (ví dụ: IMenuValidator)
            services.Scan(scan => scan
                .FromAssemblies(assembly)
                .AddClasses(classes => classes.Where(t => t.Name.EndsWith("Validator")))
                .AsMatchingInterface()
                .WithScopedLifetime());

            // Khối 3 (Tùy chọn cho tầng Infrastructure): Quét Repository (Scoped/Transient Lifetime)
            // Giả sử bạn có IProductRepository và ProductRepository
            // Bạn sẽ đặt logic quét này trong Project Infrastructure
            /*
            var infraAssembly = typeof(Infrastructure.Data.GenericRepository<>).Assembly; // Thay thế bằng Assembly của Infrastructure
            services.Scan(scan => scan
                .FromAssemblies(infraAssembly)
                .AddClasses(classes => classes.Where(t => t.Name.EndsWith("Repository")))
                .AsMatchingInterface()
                .WithScopedLifetime()); 
            */

            return services;
        }
    }
}
