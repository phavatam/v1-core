using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading;
using System.Threading.Tasks;

namespace eDocCore.Domain.Interfaces
{
    /// <summary>
    /// Interface chung cho Repository Pattern, định nghĩa các thao tác CRUD cơ bản.
    /// </summary>
    /// <typeparam name="T">Một lớp kế thừa từ BaseEntity.</typeparam>
    public interface IGenericRepository<T> where T : class
    {
        // CRUD cơ bản (giữ nguyên để không phá vỡ tương thích)
        Task<T?> GetByIdAsync(Guid id);
        Task<IReadOnlyList<T>> GetAllAsync();
        Task<T> AddAsync(T entity);
        Task<T> UpdateAsync(T entity);      // Trả về T
        Task<bool> DeleteAsync(Guid id);    // Trả về bool

        // Khuyến nghị: overloads hỗ trợ kiểm soát tracking và hủy tác vụ
        Task<T?> GetByIdAsync(Guid id, bool asNoTracking, CancellationToken ct = default);
        Task<IReadOnlyList<T>> GetAllAsync(bool asNoTracking, CancellationToken ct = default);

        // Khuyến nghị: truy vấn linh hoạt theo biểu thức
        Task<IReadOnlyList<T>> FindAsync(Expression<Func<T, bool>> predicate, bool asNoTracking = true, CancellationToken ct = default);
        Task<IReadOnlyList<T>> FindAsync(Expression<Func<T, bool>> predicate, Func<IQueryable<T>, IOrderedQueryable<T>>? orderBy, bool asNoTracking = true, CancellationToken ct = default);
        Task<T?> FirstOrDefaultAsync(Expression<Func<T, bool>> predicate, bool asNoTracking = true, CancellationToken ct = default);
        Task<T?> FirstOrDefaultAsync(Expression<Func<T, bool>> predicate, Func<IQueryable<T>, IOrderedQueryable<T>>? orderBy, bool asNoTracking = true, CancellationToken ct = default);
        Task<bool> AnyAsync(Expression<Func<T, bool>> predicate, CancellationToken ct = default);
        Task<int> CountAsync(Expression<Func<T, bool>>? predicate = null, CancellationToken ct = default);

        // Khuyến nghị: phân trang + sắp xếp
        Task<(IReadOnlyList<T> Items, int TotalCount)> GetPagedAsync(
            int page,
            int pageSize,
            Expression<Func<T, bool>>? filter = null,
            Func<IQueryable<T>, IOrderedQueryable<T>>? orderBy = null,
            bool asNoTracking = true,
            CancellationToken ct = default);

        // Khuyến nghị: phân trang + sắp xếp với projection để giảm IO/memory
        Task<(IReadOnlyList<TResult> Items, int TotalItems)> GetPagedProjectedAsync<TResult>(
            int page,
            int pageSize,
            Expression<Func<T, bool>>? filter = null,
            Func<IQueryable<T>, IOrderedQueryable<T>>? orderBy = null,
            bool asNoTracking = true,
            CancellationToken ct = default);

        // Khuyến nghị: phân trang + sắp xếp với projection để giảm IO/memory
        Task<(IReadOnlyList<TResult> Items, int TotalCount)> GetPagedProjectedAsync<TResult>(
            int page,
            int pageSize,
            Expression<Func<T, bool>>? filter,
            Func<IQueryable<T>, IOrderedQueryable<T>>? orderBy,
            Expression<Func<T, TResult>> selector,
            bool asNoTracking = true,
            CancellationToken ct = default);


        // Khuyến nghị: batch operations
        Task AddRangeAsync(IEnumerable<T> entities, CancellationToken ct = default);
        Task UpdateRangeAsync(IEnumerable<T> entities, CancellationToken ct = default);
        Task RemoveRangeAsync(IEnumerable<T> entities, CancellationToken ct = default);
    }
}
