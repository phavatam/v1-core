using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace eDocCore.Application.Common
{
    public static class ManualProjectionBuilder
    {
        public static Expression<Func<TSource, TDestination>> CreateSelector<TSource, TDestination>()
        where TSource : class
        where TDestination : class
        {
            var sourceProps = typeof(TSource).GetProperties().ToDictionary(p => p.Name);
            var parameter = Expression.Parameter(typeof(TSource), "source");
            var bindings = new List<MemberBinding>();

            // Lặp qua các thuộc tính của DTO (TDestination)
            foreach (var prop in typeof(TDestination).GetProperties())
            {
                // Kiểm tra xem Entity TSource có thuộc tính cùng tên và kiểu dữ liệu không
                if (sourceProps.TryGetValue(prop.Name, out var sourceProp) && sourceProp.PropertyType == prop.PropertyType)
                {
                    // Tạo Expression: DTO.Property = Entity.Property
                    var memberAssignment = Expression.Bind(prop, Expression.Property(parameter, sourceProp));
                    bindings.Add(memberAssignment);
                }
            }

            // Tạo biểu thức: new TDestination { bindings... }
            var memberInit = Expression.MemberInit(Expression.New(typeof(TDestination)), bindings);

            // Tạo Expression Tree hoàn chỉnh: source => new TDestination { ... }
            return Expression.Lambda<Func<TSource, TDestination>>(memberInit, parameter);
        }
    }
}
