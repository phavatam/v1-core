using eDocCore.Application.Behaviours;
using eDocCore.Application.Features.Auth.DTOs.Request;
using eDocCore.Application.Features.Auth.Services;
using eDocCore.Application.Features.Auth.Validators;
using eDocCore.Application.Features.Menus.Services;
using eDocCore.Application.Features.Roles.Services;
using eDocCore.Application.Features.Users.Services;
using eDocCore.Application.Features.UserTypes.Services;
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


            // Application services (không CQRS)
            services.AddScoped<IRoleService, RoleService>();
            services.AddScoped<IRoleValidator, RoleValidator>();

            // Auth services
            services.AddScoped<IAuthService, AuthService>();
            services.AddScoped<IValidator<RegisterUserRequest>, RegisterUserRequestValidator>();
            services.AddScoped<IValidator<LoginRequest>, LoginRequestValidator>();

            #region User Service
            services.AddScoped<IUserService, UserService>();
            #endregion

            services.AddScoped<IMenuService, MenuService>();
            services.AddScoped<IMenuValidator, MenuValidator>();

            #region User Type
            services.AddScoped<IUserTypeService, UserTypeService>();
            services.AddScoped<IUserTypeValidator, UserTypeValidator>();
            #endregion

            return services;
        }
    }
}
