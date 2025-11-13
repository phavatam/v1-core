using System;
using System.Security.Cryptography;
using Microsoft.AspNetCore.Cryptography.KeyDerivation;

namespace eDocCore.Application.Common.Security
{
    public static class PasswordHasher
    {
        public static string Hash(string password)
        {
            // 128-bit salt
            byte[] salt = RandomNumberGenerator.GetBytes(16);
            // derive a 256-bit subkey (HMACSHA256)
            byte[] subkey = KeyDerivation.Pbkdf2(password, salt, KeyDerivationPrf.HMACSHA256, 100_000, 32);
            var payload = new byte[1 + salt.Length + subkey.Length];
            payload[0] = 0x01; // version
            Buffer.BlockCopy(salt, 0, payload, 1, salt.Length);
            Buffer.BlockCopy(subkey, 0, payload, 1 + salt.Length, subkey.Length);
            return Convert.ToBase64String(payload);
        }

        public static bool Verify(string hashed, string password)
        {
            try
            {
                var payload = Convert.FromBase64String(hashed);
                if (payload.Length < 1 + 16 + 32 || payload[0] != 0x01) return false;
                var salt = new byte[16];
                Buffer.BlockCopy(payload, 1, salt, 0, 16);
                var stored = new byte[32];
                Buffer.BlockCopy(payload, 17, stored, 0, 32);
                var computed = KeyDerivation.Pbkdf2(password, salt, KeyDerivationPrf.HMACSHA256, 100_000, 32);
                return CryptographicOperations.FixedTimeEquals(stored, computed);
            }
            catch
            {
                return false;
            }
        }
    }
}
