using eDocCore.API.Middlewares;
using eDocCore.Application;
using eDocCore.Application.Common;
using eDocCore.Infrastructure;
using FluentValidation.AspNetCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using Serilog;
using Serilog.Events;
using System.Reflection;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// Configure Serilog to write rolling files under /Logs per day at the content root (project folder in dev)
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
            path: logsPath,
            rollingInterval: RollingInterval.Day,
            retainedFileCountLimit: 14, // keep 14 days
            fileSizeLimitBytes: 10 * 1024 * 1024, // 10 MB per file
            rollOnFileSizeLimit: true,
            shared: true,
            outputTemplate: "{Timestamp:yyyy-MM-dd HH:mm:ss.fff zzz} [{Level:u3}] {Message:lj} | IP={ClientIp} | {RequestId} {TraceId}{NewLine}{Exception}");
});

// Add services to the container.
builder.Services.AddApplicationServices();
builder.Services.AddInfrastructureServices(builder.Configuration);

// JWT Authentication configuration
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

builder.Services.AddControllers();
// FluentValidation auto-validation
builder.Services.AddFluentValidationAutoValidation();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Cấu hình CORS (tùy chọn)
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll",
        b => b.AllowAnyHeader()
              .AllowAnyOrigin()
              .AllowAnyMethod());
});

builder.Services.AddRouting(options =>
{
    // Đặt tất cả các URL route thành chữ thường
    options.LowercaseUrls = true;

    // Tùy chọn: Đặt tên hành động thành chữ thường
    options.LowercaseQueryStrings = false; // Thường giữ nguyên 
});
builder.Services.AddAutoMapper(Assembly.GetExecutingAssembly());
builder.Services.Configure<AppSettingDTO>(builder.Configuration.GetSection("AppSettings"));
// Xóa trả về type dư thừa
builder.Services.Configure<ProblemDetailsOptions>(options =>
{
    options.CustomizeProblemDetails = context =>
    {
        context.ProblemDetails.Type = null;
    };
});

builder.Services.AddControllers(options =>
{
    // Thêm Convention của bạn vào đây
    options.Conventions.Add(new KebabCaseControllerConvention());
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// Removed SerilogRequestLogging to avoid extra framework logs; our custom middleware logs payloads

// Custom middleware to log only payload/response (truncated) and skip noisy endpoints
app.UseMiddleware<RequestResponseLoggingMiddleware>();

// Sử dụng Middleware xử lý lỗi toàn cục
app.UseMiddleware<GlobalExceptionHandlerMiddleware>();

app.UseHttpsRedirection();

app.UseCors("AllowAll");

app.UseAuthentication();

// Đăng ký middleware kiểm tra role, không truyền tham số trực tiếp nữa
app.UseMiddleware<RoleAuthorizationMiddleware>();

app.UseAuthorization();

app.MapControllers();

app.Run();
