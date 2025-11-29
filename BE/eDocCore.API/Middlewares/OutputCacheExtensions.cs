namespace eDocCore.API.Middlewares
{
    /// <summary>
    /// To use
    /// Default [OutputCache(Duration = 60)] 
    /// [OutputCache(PolicyName = "CacheByParam")]
    /// </summary>
    public static class OutputCacheExtensions
    {
        public static IServiceCollection AddCustomOutputCache(this IServiceCollection services)
        {
            services.AddOutputCache(options =>
            {
                // Cấu hình Chính sách Mặc định
                options.AddPolicy("Default30Seconds", policy =>
                {
                    policy.Expire(TimeSpan.FromSeconds(30)); // Thời gian lưu là 30 giây
                });

                // Cấu hình Chính sách Khác cho API có tham số
                options.AddPolicy("CacheByParam", policy =>
                {
                    policy.Expire(TimeSpan.FromMinutes(1))
                          .SetVaryByQuery("id"); // Phân biệt bộ đệm dựa trên tham số truy vấn 'id'
                });
            });

            return services;
        }
    }
}
