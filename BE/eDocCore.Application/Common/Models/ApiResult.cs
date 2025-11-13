using System.Collections.Generic;

namespace eDocCore.Application.Common.Models
{
    public class ApiResult<T>
    {
        public bool Success { get; init; }
        public T? Data { get; init; }
        public string? Message { get; init; }
        public string? TraceId { get; init; }
        public IReadOnlyList<string>? Errors { get; init; }

        public static ApiResult<T> Ok(T? data, string? message = null, string? traceId = null)
            => new ApiResult<T> { Success = true, Data = data, Message = message, TraceId = traceId };

        public static ApiResult<T> Fail(string message, IReadOnlyList<string>? errors = null, string? traceId = null)
            => new ApiResult<T> { Success = false, Message = message, Errors = errors, TraceId = traceId };
    }
}
