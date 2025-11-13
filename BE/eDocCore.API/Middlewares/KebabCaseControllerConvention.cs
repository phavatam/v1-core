using Microsoft.AspNetCore.Mvc.ApplicationModels;
using System.Text.RegularExpressions;
using System.Linq;

namespace eDocCore.API.Middlewares
{
    public class KebabCaseControllerConvention : IControllerModelConvention
    {
        private static readonly Regex PascalCaseRegex = new Regex("(?<=[a-z0-9])[A-Z]", RegexOptions.Compiled);

        // Hàm chuyển đổi từ PascalCase (UserTypeController) thành kebab-case (user-type)
        private static string ToKebabCase(string name)
        {
            // Loại bỏ hậu tố "Controller"
            if (name.EndsWith("Controller"))
            {
                name = name.Substring(0, name.Length - 10);
            }

            // Chuyển PascalCase (UserType) thành kebab-case (user-type)
            return PascalCaseRegex.Replace(name, m => "-" + m.Value).ToLowerInvariant();
        }

        public void Apply(ControllerModel controller)
        {
            var kebabCaseName = ToKebabCase(controller.ControllerName);

            // 🚨 Sửa đổi chính: Lặp qua Selector và thay thế [controller] trong Template
            foreach (var selector in controller.Selectors.Where(s => s.AttributeRouteModel != null))
            {
                var routeModel = selector.AttributeRouteModel;

                // Kiểm tra Template để thay thế token [controller]
                if (routeModel.Template != null)
                {
                    // Thay thế [controller] bằng tên kebab-case đã được tính toán.
                    // Điều này áp dụng cho các route như "api/[controller]"
                    routeModel.Template = routeModel.Template
                        .Replace("[controller]", kebabCaseName, StringComparison.OrdinalIgnoreCase);
                }
            }
        }
    }
}
