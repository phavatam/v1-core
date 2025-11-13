using System;
using System.IO;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using Serilog.Context;

namespace eDocCore.API.Middlewares
{
    public class RequestResponseLoggingMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<RequestResponseLoggingMiddleware> _logger;

        // Limit logged body size to avoid huge logs
        private const int MaxLoggedBodyBytes = 4096; // 4 KB

        public RequestResponseLoggingMiddleware(RequestDelegate next, ILogger<RequestResponseLoggingMiddleware> logger)
        {
            _next = next;
            _logger = logger;
        }

        public async Task Invoke(HttpContext context)
        {
            var path = context.Request.Path.Value ?? string.Empty;
            // Skip noisy endpoints
            if (path.StartsWith("/swagger", StringComparison.OrdinalIgnoreCase)
                || path.StartsWith("/_vs", StringComparison.OrdinalIgnoreCase)
                || path.StartsWith("/favicon.ico", StringComparison.OrdinalIgnoreCase))
            {
                await _next(context);
                return;
            }

            var start = DateTimeOffset.UtcNow;

            // Determine client IP (favor proxy headers if present)
            var clientIp = GetClientIp(context);

            // Add ClientIp to Serilog context so it appears in all log events in this request
            using var _ = LogContext.PushProperty("ClientIp", clientIp);

            // Capture request body
            string? requestBody = null;
            if (context.Request.ContentLength > 0 && CanReadBody(context.Request.ContentType))
            {
                context.Request.EnableBuffering();
                using var reader = new StreamReader(context.Request.Body, Encoding.UTF8, detectEncodingFromByteOrderMarks: false, leaveOpen: true);
                var body = await reader.ReadToEndAsync();
                context.Request.Body.Position = 0;
                requestBody = Truncate(body, MaxLoggedBodyBytes);
            }

            // Capture response body
            var originalBody = context.Response.Body;
            await using var memStream = new MemoryStream();
            context.Response.Body = memStream;

            try
            {
                await _next(context);
            }
            finally
            {
                memStream.Position = 0;
                string? responseBody = null;
                if (CanReadBody(context.Response.ContentType))
                {
                    using var reader = new StreamReader(memStream, Encoding.UTF8, detectEncodingFromByteOrderMarks: false, leaveOpen: true);
                    var body = await reader.ReadToEndAsync();
                    responseBody = Truncate(body, MaxLoggedBodyBytes);
                }

                memStream.Position = 0;
                await memStream.CopyToAsync(originalBody);
                context.Response.Body = originalBody;

                var duration = DateTimeOffset.UtcNow - start;
                _logger.LogInformation(
                    "HTTP {Method} {Path} => {StatusCode} ({Duration} ms) | IP={ClientIp} | TraceId={TraceId} | Request={RequestBody} | Response={ResponseBody}",
                    context.Request.Method,
                    context.Request.Path,
                    context.Response.StatusCode,
                    duration.TotalMilliseconds.ToString("0.###"),
                    clientIp,
                    context.TraceIdentifier,
                    requestBody,
                    responseBody);
            }
        }

        private static string GetClientIp(HttpContext context)
        {
            // X-Forwarded-For may contain a list: client, proxy1, proxy2... take first
            var xff = context.Request.Headers["X-Forwarded-For"].ToString();
            if (!string.IsNullOrWhiteSpace(xff))
            {
                var first = xff.Split(',')[0].Trim();
                if (!string.IsNullOrEmpty(first)) return first;
            }

            var xRealIp = context.Request.Headers["X-Real-IP"].ToString();
            if (!string.IsNullOrWhiteSpace(xRealIp)) return xRealIp.Trim();

            return context.Connection.RemoteIpAddress?.ToString() ?? "unknown";
        }

        private static string Truncate(string input, int maxBytes)
        {
            if (string.IsNullOrEmpty(input)) return input;
            var bytes = Encoding.UTF8.GetByteCount(input);
            if (bytes <= maxBytes) return input;

            // naive truncation by characters; for exact byte limit, iterate bytes
            var sb = new StringBuilder(input);
            while (Encoding.UTF8.GetByteCount(sb.ToString()) > maxBytes && sb.Length > 0)
            {
                sb.Length -= 1;
            }
            return sb.ToString() + "...<truncated>";
        }

        private static bool CanReadBody(string? contentType)
        {
            if (string.IsNullOrEmpty(contentType)) return false;
            contentType = contentType.ToLowerInvariant();
            return contentType.Contains("json") || contentType.Contains("xml") || contentType.Contains("text");
        }
    }
}
