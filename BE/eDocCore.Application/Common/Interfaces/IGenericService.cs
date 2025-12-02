using eDocCore.Domain.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace eDocCore.Application.Common.Interfaces
{
    public interface IGenericService<T, TDto> where T : class where TDto : class
    {
        //Task<TDto> GetByIdAsync(Guid id);
        //Task<List<TDto>> GetAllAsync();
        //IQueryable<T> Query();
        //Task<TDto> Create(TDto entity);
        //Task<TDto> Update(Guid id, TDto entity);
        Task<TDto> Patch(Guid id, Microsoft.AspNetCore.OData.Deltas.Delta<TDto> delta);
        //Task<bool> Delete(Guid id);
        //Task<int> CountAsync(Expression<Func<T, bool>> predicate);
    }
}
