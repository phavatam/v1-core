using Microsoft.Extensions.Configuration;

namespace eDocCore.Infrastructure.Security
{
    public class JwtOptions
    {
        public string Key { get; set; } = string.Empty;
        public string Issuer { get; set; } = string.Empty;
        public string Audience { get; set; } = string.Empty;
        [ConfigurationKeyName("ExpireMinutes")]
        public int ExpiresMinutes { get; set; } = 60;
    }
}
