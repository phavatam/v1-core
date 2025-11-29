using Microsoft.AspNetCore.RateLimiting;
using System.Threading.RateLimiting;

namespace eDocCore.API.Middlewares
{
    /// <summary>
    /// To Use Rate Limiter in ASP.NET Core 8, we can define named policies here and register them in the DI container.
    /// [EnableRateLimiting(PolicyNames.FixedWindowPolicy)]
    /// </summary>
    public static class RateLimiterServiceExtensions
    {
        private const string FixedPolicyName = "FixedLimitPolicy";
        private const string SlidingPolicyName = "SlidingLimitPolicy";

        // Phương thức mở rộng để thêm cấu hình Rate Limiter vào IServiceCollection
        public static IServiceCollection AddAppRateLimiting(this IServiceCollection services)
        {
            services.AddRateLimiter(options =>
            {
                // 1. Cấu hình phản hồi chung
                options.RejectionStatusCode = 429; // Too Many Requests

                // Chính sách 1: Fixed Window Limiter
                options.AddFixedWindowLimiter(FixedPolicyName, fixedOptions =>
                {
                    fixedOptions.PermitLimit = 5;       // Tối đa 5 request
                    fixedOptions.Window = TimeSpan.FromSeconds(10); // Trong 10 giây
                    fixedOptions.QueueProcessingOrder = QueueProcessingOrder.OldestFirst;
                    fixedOptions.QueueLimit = 0;
                });

                // Chính sách 2: Sliding Window Limiter
                options.AddSlidingWindowLimiter(SlidingPolicyName, slidingOptions =>
                {
                    slidingOptions.PermitLimit = 15; // Tối đa 15 requests
                    slidingOptions.Window = TimeSpan.FromSeconds(30); // Trong 30 giây
                    slidingOptions.SegmentsPerWindow = 3; // Cửa sổ chia làm 3 đoạn (mỗi đoạn 10s)
                    slidingOptions.QueueProcessingOrder = QueueProcessingOrder.OldestFirst;
                    slidingOptions.QueueLimit = 3;
                });

            });

            return services;
        }

        // Bạn cũng có thể thêm các hằng số Tên Policy để sử dụng trong [EnableRateLimiting]
        public static class PolicyNames
        {
            public static string FixedLimit => FixedPolicyName;
            public static string SlidingLimit => SlidingPolicyName;
        }
    }
}
