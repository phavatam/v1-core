using Microsoft.AspNetCore.Authorization;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace eDocCore.Infrastructure.Authorization
{
    public class DepartmentRequirement : IAuthorizationRequirement
    {
        public string RequiredDepartment { get; }

        public DepartmentRequirement(string requiredDepartment)
        {
            RequiredDepartment = requiredDepartment;
        }
    }
}
