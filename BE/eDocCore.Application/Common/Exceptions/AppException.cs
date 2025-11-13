using System;
using System.Collections.Generic;

namespace eDocCore.Application.Common.Exceptions
{
    public static class AppErrorCodes
    {
        public const string BadRequest = "bad_request";
        public const string Validation = "validation_error";
        public const string NotFound = "not_found";
        public const string Conflict = "conflict";
        public const string BusinessRule = "business_rule_violation";
        public const string Unauthorized = "unauthorized";
        public const string Forbidden = "forbidden";
        public const string TooManyRequests = "too_many_requests";
        public const string Internal = "internal_error";
    }

    public class AppException : Exception
    {
        public int StatusCode { get; }
        public string? ErrorCode { get; }
        public IReadOnlyList<string>? Errors { get; }

        public AppException(string message, int statusCode = 400, IReadOnlyList<string>? errors = null, string? errorCode = null, Exception? innerException = null)
            : base(message, innerException)
        {
            StatusCode = statusCode;
            Errors = errors;
            ErrorCode = errorCode ?? AppErrorCodes.BadRequest;
        }
    }

    public class BadRequestAppException : AppException
    {
        public BadRequestAppException(string message, IReadOnlyList<string>? errors = null, string? errorCode = null)
            : base(message, 400, errors, errorCode ?? AppErrorCodes.BadRequest)
        {
        }
    }

    public class ValidationAppException : AppException
    {
        public ValidationAppException(string message, IReadOnlyList<string>? errors = null, string? errorCode = null)
            : base(message, 400, errors, errorCode ?? AppErrorCodes.Validation)
        {
        }
    }

    public class NotFoundAppException : AppException
    {
        public NotFoundAppException(string message, IReadOnlyList<string>? errors = null, string? errorCode = null)
            : base(message, 404, errors, errorCode ?? AppErrorCodes.NotFound)
        {
        }
    }

    public class ConflictException : AppException
    {
        public ConflictException(string message, IReadOnlyList<string>? errors = null, string? errorCode = null)
            : base(message, 409, errors, errorCode ?? AppErrorCodes.Conflict)
        {
        }
    }

    public class BusinessRuleException : AppException
    {
        public BusinessRuleException(string message, IReadOnlyList<string>? errors = null, string? errorCode = null)
            : base(message, 400, errors, errorCode ?? AppErrorCodes.BusinessRule)
        {
        }
    }

    public class UnauthorizedAppException : AppException
    {
        public UnauthorizedAppException(string message = "Unauthorized", IReadOnlyList<string>? errors = null, string? errorCode = null)
            : base(message, 401, errors, errorCode ?? AppErrorCodes.Unauthorized)
        {
        }
    }

    public class ForbiddenAppException : AppException
    {
        public ForbiddenAppException(string message = "Forbidden", IReadOnlyList<string>? errors = null, string? errorCode = null)
            : base(message, 403, errors, errorCode ?? AppErrorCodes.Forbidden)
        {
        }
    }

    public class TooManyRequestsAppException : AppException
    {
        public TooManyRequestsAppException(string message = "Too many requests", IReadOnlyList<string>? errors = null, string? errorCode = null)
            : base(message, 429, errors, errorCode ?? AppErrorCodes.TooManyRequests)
        {
        }
    }

    public class InternalServerAppException : AppException
    {
        public InternalServerAppException(string message = "Internal server error", IReadOnlyList<string>? errors = null, string? errorCode = null)
            : base(message, 500, errors, errorCode ?? AppErrorCodes.Internal)
        {
        }
    }
}
