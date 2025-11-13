using eDocCore.WebHost.AppHost.Config;
using System.Diagnostics;
using YamlDotNet.Serialization;
using YamlDotNet.Serialization.NamingConventions;

// --- Auto start API and UI client ---
/*var currentDir = Directory.GetCurrentDirectory();
var yamlPath = Path.Combine(currentDir, "distributed.yaml");
if (File.Exists(yamlPath))
{
    var yaml = File.ReadAllText(yamlPath);
    var deserializer = new DeserializerBuilder()
        .WithNamingConvention(CamelCaseNamingConvention.Instance)
        .Build();
    var config = deserializer.Deserialize<DistributedConfig>(yaml);
    foreach (var svc in config.Services)
    {
        if (svc.Value.Executable == "npm")
        {
            var uiDir = Path.GetFullPath(Path.Combine(currentDir, svc.Value.WorkingDirectory));
            Process.Start(new ProcessStartInfo
            {
                FileName = "powershell.exe",
                Arguments = "-NoProfile -ExecutionPolicy Bypass -Command \"npm run dev\"",
                WorkingDirectory = uiDir,
                UseShellExecute = false,
                CreateNoWindow = true
            });
        }
    }
}*/

var builder = DistributedApplication.CreateBuilder(args);
var apiService = builder.AddProject<Projects.eDocCore_API>("eDocCoreApi");
builder.Build().Run();
