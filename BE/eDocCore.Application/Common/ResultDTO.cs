using System.Collections.Generic;
using System.Net;

namespace eDocCore.Application.Common
{
    public class ResultDTO<T>
    {
        public bool IsSuccess { get; set; }
        public int StatusCode { get; init; }
        public T? Data { get; set; }
        public string? Message { get; set; }
        public string? TraceId { get; init; }
        public static ResultDTO<T> Success(T? data = default, string? message = null, string? traceId = null) =>
            new() { IsSuccess = true, StatusCode = (int) HttpStatusCode.OK, Message = message ?? "Success", Data = data, TraceId = traceId };

        public static ResultDTO<T> Failure(int statusCode, string message, T? data = default, string? traceId = null) =>
            new() { IsSuccess = false, StatusCode = statusCode, Message = message, Data = data, TraceId = traceId };
    }

    public class ResultDTO
    {
        public bool IsSuccess { get; set; }
        public int StatusCode { get; init; }
        public string? Message { get; set; }
        public string? TraceId { get; init; }
        public static ResultDTO Success(string? message = null, string? traceId = null) =>
            new() { IsSuccess = true, StatusCode = (int) HttpStatusCode.OK, Message = message ?? "Success", TraceId = traceId };

        public static ResultDTO Failure(int statusCode, string message, string? traceId = null) =>
            new() { IsSuccess = false, StatusCode = statusCode, Message = message, TraceId = traceId };
    }

    public class ArrayResultDTO
    {
        public int PageNumber { get; set; }
        public int PageSize { get; set; }
        public int TotalRecord { get; set; }
        public object Items { get; set; } = new object { };
    }
}
