using System;
using System.Collections.Generic;
using System.Text;

namespace eDocCore.Application.Common.Export
{
    public class SheetData
    {
        public string SheetName { get; set; } = string.Empty;
        public object DataList { get; set; }
    }
}
