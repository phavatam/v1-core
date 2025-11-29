using eDocCore.Infrastructure.Persistence;
using Microsoft.AspNetCore.Authorization;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace eDocCore.Infrastructure.Authorization.Handle
{
    /// <summary>
    /// To use
    /// [Authorize(Policy = "RequireHRDepartment")]
    /// </summary>
    public class DepartmentHandler : AuthorizationHandler<DepartmentRequirement>
    {
        protected override Task HandleRequirementAsync(
        AuthorizationHandlerContext context,
        DepartmentRequirement requirement)
        {
            // 1. Lấy Claim "Department" của người dùng
            //var userDepartmentClaim = context.User.FindFirst("Department");
            var userDepartmentClaim = context.User.FindFirst(c => c.Type == "department");

            // 2. Kiểm tra: Người dùng có Claim "Department" không
            if (userDepartmentClaim == null)
            {
                // Không có Claim Department => Yêu cầu thất bại
                return Task.CompletedTask;
            }

            // 3. Kiểm tra: Giá trị Claim có khớp với phòng ban yêu cầu không
            if (userDepartmentClaim.Value.Equals(requirement.RequiredDepartment, StringComparison.OrdinalIgnoreCase))
            {
                // Nếu khớp (ví dụ: Claim là "IT" và yêu cầu là "IT")
                context.Succeed(requirement);
            }

            // Nếu không khớp, yêu cầu thất bại (mặc định của ASP.NET Core)
            return Task.CompletedTask;
        }

    }
}
