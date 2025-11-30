using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace eDocCore.Application.Common.Models
{
    public abstract class BasePageRequest
    {
        public int PageNumber { get; set; }

        public int PageSize { get; set; }
    }
}
