using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace eDocCore.WebHost.AppHost.Config
{
    public class DistributedConfig
    {
        public Dictionary<string, ServiceConfig> Services { get; set; }
    }
}
