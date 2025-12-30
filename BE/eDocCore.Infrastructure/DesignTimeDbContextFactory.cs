using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.Extensions.Configuration;
using System;
using System.IO;

namespace eDocCore.Infrastructure.Persistence
{
    // Provides a way for EF tools (migrations) to create the DbContext at design-time.
    public class DesignTimeDbContextFactory : IDesignTimeDbContextFactory<ApplicationDbContext>
    {
        public ApplicationDbContext CreateDbContext(string[] args)
        {
            var basePath = Directory.GetCurrentDirectory();

            var config = new ConfigurationBuilder()
                .SetBasePath(basePath)
                .AddJsonFile("appsettings.json", optional: true)
                .AddJsonFile(Path.Combine("..", "eDocCore.API", "appsettings.json"), optional: true)
                .AddEnvironmentVariables()
                .Build();

            var conn = config.GetConnectionString("DefaultConnection")
                       ?? config["ConnectionStrings:DefaultConnection"];

            if (string.IsNullOrEmpty(conn))
                throw new InvalidOperationException("Could not find a connection string named 'DefaultConnection'.");

            var optionsBuilder = new DbContextOptionsBuilder<ApplicationDbContext>();
            optionsBuilder.UseSqlServer(conn, o => o.MigrationsAssembly(typeof(ApplicationDbContext).Assembly.FullName));

            return new ApplicationDbContext(optionsBuilder.Options);
        }
    }
}
