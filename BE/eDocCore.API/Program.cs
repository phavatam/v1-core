using Asp.Versioning;
using Asp.Versioning.ApiExplorer;
using eDocCore.API.Middlewares;
using eDocCore.Application;
using eDocCore.Application.Common;
using eDocCore.Infrastructure;
using eDocCore.Infrastructure.Authorization;
using eDocCore.Infrastructure.Authorization.Handle;
using eDocCore.Infrastructure.Interceptors;
using eDocCore.Infrastructure.Persistence;
using FluentValidation.AspNetCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Localization;
using Microsoft.AspNetCore.OData;
using Microsoft.OData.ModelBuilder;
using eDocCore.Application.Features.Users.DTOs;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Diagnostics.HealthChecks;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using OfficeOpenXml;
using Serilog;
using Serilog.Events;
using Serilog.Formatting.Json;
using System;
using System.Globalization;
using System.Reflection;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

#region Cấu hình log
builder.Host.UseSerilog((context, services, loggerConfiguration) =>
{
    var logsDir = Path.Combine(builder.Environment.ContentRootPath, "Logs");
    Directory.CreateDirectory(logsDir);
    var logsPath = Path.Combine(logsDir, "log-.txt");

    loggerConfiguration
        .ReadFrom.Configuration(context.Configuration)
        .ReadFrom.Services(services)
        .Enrich.FromLogContext()
        .Enrich.WithProperty("Application", "eDocCore.API")
        .MinimumLevel.Information()
        .MinimumLevel.Override("Microsoft", LogEventLevel.Warning)
        .MinimumLevel.Override("Microsoft.AspNetCore", LogEventLevel.Warning)
        .MinimumLevel.Override("Microsoft.AspNetCore.Mvc", LogEventLevel.Warning)
        .MinimumLevel.Override("System", LogEventLevel.Warning)
        .MinimumLevel.Override("Microsoft.EntityFrameworkCore", LogEventLevel.Warning)
        .WriteTo.File(
            formatter: new JsonFormatter(), // Sử dụng JSON Formatter
            path: logsPath,
            rollingInterval: RollingInterval.Day,
            retainedFileCountLimit: 14, // keep 14 days
            fileSizeLimitBytes: 10 * 1024 * 1024, // 10 MB per file
            rollOnFileSizeLimit: true,
            shared: true
            //outputTemplate: "{Timestamp:yyyy-MM-dd HH:mm:ss.fff zzz} [{Level:u3}] {Message:lj} | IP={ClientIp} | {RequestId} {TraceId}{NewLine}{Exception}"
            );
});
#endregion

#region Cấu hình Version
builder.Services.AddApiVersioning(options =>
{
    options.DefaultApiVersion = new ApiVersion(1, 0);
    options.AssumeDefaultVersionWhenUnspecified = true;
    options.ReportApiVersions = true;
})
.AddApiExplorer(options =>
{
    options.GroupNameFormat = "'v'VVV";
    options.SubstituteApiVersionInUrl = true;
});

// 2. Cấu hình Swagger/OpenAPI
builder.Services.AddSwaggerGen(options =>
{
    // ⚠️ Lấy service IApiVersionDescriptionProvider được cung cấp bởi .AddMvcApiExplorer()
    var apiVersionDescriptionProvider = builder?.Services?.BuildServiceProvider()?.GetRequiredService<IApiVersionDescriptionProvider>();
    // Vòng lặp này tạo một tài liệu Swagger riêng biệt (SwaggerDoc) cho mỗi phiên bản
    if (apiVersionDescriptionProvider != null)
    {
        // Vòng lặp này tạo một tài liệu Swagger riêng biệt (SwaggerDoc) cho mỗi phiên bản
        foreach (var description in apiVersionDescriptionProvider.ApiVersionDescriptions) // Đã an toàn
        {
            options.SwaggerDoc(description.GroupName, new OpenApiInfo
            {
                Title = $"My API {description.ApiVersion}",
                Version = description.ApiVersion.ToString(),
                Description = $"API Documentation for version {description.GroupName}."
            });
        }
    }

    // Add JWT bearer to Swagger
    options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Description = "JWT Authorization header using the Bearer scheme. Example: \"Authorization: Bearer {token}\"",
        Name = "Authorization",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.Http,
        Scheme = "bearer",
        BearerFormat = "JWT"
    });
    options.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference { Type = ReferenceType.SecurityScheme, Id = "Bearer" }
            },
            new string[] {}
        }
    });
});
#endregion

#region Cấu hình limit request
builder.Services.AddAppRateLimiting();
#endregion

#region Cấu hình Output Caching (Bộ đệm đầu ra)
// builder.Services.AddOutputCache();
builder.Services.AddCustomOutputCache();
#endregion

// Add services to the container.
builder.Services.AddApplicationServices();

#region Cấu hình datatbase & repository
builder.Services.AddInfrastructureServices(builder.Configuration);
#endregion

// JWT Authentication configuration
#region Cấu hình JWO Token
var jwtSettings = builder.Configuration.GetSection("Jwt");
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = jwtSettings["Issuer"],
        ValidAudience = jwtSettings["Audience"],
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSettings["Key"] ?? string.Empty)),
        ClockSkew = TimeSpan.Zero
    };
});
//builder.Services.AddAuthorization(); // ensure authorization services registered
#endregion

#region Cấu hình FluentValidation auto-validation
builder.Services.AddFluentValidationAutoValidation();
#endregion

#region Cấu hình các chính sách phân quyền (Authorization Policies), API theo property JWT Token, 
builder.Services.AddSingleton<IAuthorizationHandler, DepartmentHandler>();
builder.Services.AddAuthorization(options =>
{
    // Chính sách: Chỉ cho phép người dùng thuộc phòng ban IT
    options.AddPolicy("RequireITDepartment", policy =>
    {
        // Thêm yêu cầu DepartmentRequirement với tham số "IT"
        policy.Requirements.Add(new DepartmentRequirement("IT"));

        // *Bạn vẫn có thể kết hợp với Role/Claim cơ bản*
        // policy.RequireRole("Employee"); 
    });

    // Chính sách: Chỉ cho phép người dùng thuộc phòng ban HR
    options.AddPolicy("RequireHRDepartment", policy =>
    {
        policy.Requirements.Add(new DepartmentRequirement("HR"));
    });
});
#endregion

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();

#region Cấu hình CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll",
        b =>
        b.WithOrigins("http://localhost:4200")
            .AllowAnyHeader()
            .AllowAnyOrigin()
            .AllowAnyMethod()
            );
});
#endregion

#region Cấu hình đồng bộ format api
builder.Services.AddRouting(options =>
{
    // Đặt tất cả các URL route thành chữ thường
    options.LowercaseUrls = true;

    // Tùy chọn: Đặt tên hành động thành chữ thường
    options.LowercaseQueryStrings = false; // Thường giữ nguyên 
});
#endregion

builder.Services.AddAutoMapper(Assembly.GetExecutingAssembly());
builder.Services.Configure<AppSettingDTO>(builder.Configuration.GetSection("AppSettings"));

#region Cấu hình Xóa trả về type dư thừa
builder.Services.Configure<ProblemDetailsOptions>(options =>
{
    options.CustomizeProblemDetails = context =>
    {
        context.ProblemDetails.Type = null;
    };
});
#endregion

#region Cấu hình Exception Handler chuẩn mới (.NET 8)
builder.Services.AddExceptionHandler<GlobalExceptionHandler>();
builder.Services.AddProblemDetails();
#endregion

#region Thêm cấu hình Localization
//builder.Services.AddLocalization(options => options.ResourcesPath = "Resources");

//// Cấu hình Supported Cultures
//var supportedCultures = new[]
//{
//    new CultureInfo("vi-VN"),
//    new CultureInfo("en-US")
//};

//builder.Services.Configure<RequestLocalizationOptions>(options =>
//{
//    options.DefaultRequestCulture = new RequestCulture("vi-VN");
//    options.SupportedCultures = supportedCultures;
//    options.SupportedUICultures = supportedCultures;
//    options.RequestCultureProviders.Insert(0, new QueryStringRequestCultureProvider());
//});
#endregion

var app = builder.Build();

#region Áp dụng Localization Middleware
//var localizationOptions = app.Services.GetRequiredService<IOptions<RequestLocalizationOptions>>().Value;
//app.UseRequestLocalization(localizationOptions);
#endregion

#region Cấu hình phần App Exception Handler (.NET 8)
app.UseExceptionHandler(); // Dòng này sẽ sử dụng GlobalExceptionHandler đã đăng ký ở trên
#endregion

#region Cấu hình migration
// Tự động migrate khi ứng dụng khởi động
using (var scope = app.Services.CreateScope())
{
    var dbContext = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
    dbContext.Database.Migrate(); // Tự động cập nhật schema theo migration mới nhất
    Log.Information("Database migration completed successfully at {Time}", DateTime.UtcNow);
}
#endregion

// Configure the HTTP request pipeline.
#region Cấu hình Development
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    //app.UseSwaggerUI();
    #region config version
    app.UseSwaggerUI(options =>
    {
        var apiVersionDescriptionProvider = app.Services.GetRequiredService<IApiVersionDescriptionProvider>();

        foreach (var description in apiVersionDescriptionProvider.ApiVersionDescriptions)
        {
            options.SwaggerEndpoint($"/swagger/{description.GroupName}/swagger.json",
                                    description.GroupName.ToUpperInvariant());
        }
    });
    #endregion
}
#endregion

#region Custom middleware to log only payload/response (truncated) and skip noisy endpoints
app.UseMiddleware<RequestResponseLoggingMiddleware>();
#endregion

#region Sử dụng Middleware xử lý lỗi toàn cục
//app.UseMiddleware<GlobalExceptionHandlerMiddleware>();
#endregion
app.UseHttpsRedirection();

app.UseCors("AllowAll");    // Thêm accept key CORS
app.UseRateLimiter();       // Thêm Rate Limiter Middleware
app.UseOutputCache();       //  Middleware Output Caching

app.UseAuthentication();   
#region Đăng ký middleware kiểm tra role
app.UseMiddleware<RoleAuthorizationMiddleware>();
#endregion
app.UseAuthorization();
app.MapControllers();

app.Run();
