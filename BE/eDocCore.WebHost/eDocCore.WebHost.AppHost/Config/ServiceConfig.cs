using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace eDocCore.WebHost.AppHost.Config
{
    public class ServiceConfig
    {
        public string Project { get; set; }
        public string Executable { get; set; }
        public string WorkingDirectory { get; set; }
        public List<string> Args { get; set; }
        public object Bindings { get; set; } // Thêm property này để tránh lỗi YamlDotNet
    }
}
