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
        // === 1. CRUD Cơ bản & Gộp Overloads ===

        /// <summary>Truy vấn một Entity theo ID và tùy chọn kiểm soát Tracking.</summary>
        Task<T?> GetByIdAsync(Guid id, bool asNoTracking = false, CancellationToken ct = default);

        /// <summary>Lấy tất cả các Entity, tùy chọn kiểm soát Tracking.</summary>
        Task<IReadOnlyList<T>> GetAllAsync(bool asNoTracking = false, CancellationToken ct = default);

        /// <summary>Thêm một Entity mới vào Context.</summary>
        Task<T> AddAsync(T entity, CancellationToken ct = default);

        /// <summary>Cập nhật một Entity đã có trong Context.</summary>
        Task<T> UpdateAsync(T entity);

        /// <summary>Xóa một Entity theo ID.</summary>
        Task DeleteAsync(Guid id);

        /// <summary>Lưu các thay đổi vào cơ sở dữ liệu (Có thể tách ra UnitOfWork).</summary>
        Task<int> SaveChangesAsync(CancellationToken ct = default);

        // === 2. Batch Operations (Thao tác theo lô) ===

        /// <summary>Thêm nhiều Entity cùng lúc.</summary>
        Task AddRangeAsync(IEnumerable<T> entities, CancellationToken ct = default);

        /// <summary>Cập nhật nhiều Entity cùng lúc.</summary>
        Task UpdateRangeAsync(IEnumerable<T> entities);

        /// <summary>Xóa nhiều Entity cùng lúc.</summary>
        Task DeleteRangeAsync(IEnumerable<T> entities);

        // === 3. Truy vấn LINQ Linh hoạt (Predicate & Sắp xếp) ===

        /// <summary>Tìm kiếm danh sách Entity theo điều kiện, sắp xếp và tùy chọn kiểm soát Tracking.</summary>
        Task<IReadOnlyList<T>> FindAsync(
            Expression<Func<T, bool>> predicate,
            Func<IQueryable<T>, IOrderedQueryable<T>>? orderBy = null,
            bool asNoTracking = true,
            CancellationToken ct = default);

        /// <summary>Lấy Entity đầu tiên thỏa mãn điều kiện, tùy chọn sắp xếp.</summary>
        Task<T?> FirstOrDefaultAsync(
            Expression<Func<T, bool>> predicate,
            Func<IQueryable<T>, IOrderedQueryable<T>>? orderBy = null,
            bool asNoTracking = true,
            CancellationToken ct = default);

        /// <summary>Kiểm tra xem có Entity nào thỏa mãn điều kiện hay không.</summary>
        Task<bool> AnyAsync(Expression<Func<T, bool>> predicate, CancellationToken ct = default);

        /// <summary>Đếm số lượng Entity thỏa mãn điều kiện.</summary>
        Task<int> CountAsync(Expression<Func<T, bool>>? predicate = null, CancellationToken ct = default);

        // === 4. Eager Loading (Tải đối tượng liên quan) ===

        /// <summary>Tìm kiếm danh sách Entity và tải các Navigation Properties liên quan (Includes).</summary>
        Task<IReadOnlyList<T>> FindWithIncludesAsync(
            Expression<Func<T, bool>> predicate,
            Expression<Func<T, object>>[] includes,
            Func<IQueryable<T>, IOrderedQueryable<T>>? orderBy = null,
            bool asNoTracking = true,
            CancellationToken ct = default);

        // === 5. Phân trang, Projection (Ánh xạ DTO) & Sắp xếp ===
        /// <summary>
        /// Thực hiện phân trang, lọc, sắp xếp và ánh xạ (Projection) sang một DTO (TResult) để tối ưu IO/Memory.
        /// </summary>
        Task<(IReadOnlyList<TResult> Items, int TotalItems)> GetPagedProjectedAsync<TResult>(
            int page,
            int pageSize,
            Expression<Func<T, TResult>> selector, // Biểu thức ánh xạ (Projection) bắt buộc
            Expression<Func<T, bool>>? filter = null,
            Func<IQueryable<T>, IOrderedQueryable<T>>? orderBy = null,
            bool asNoTracking = true,
            CancellationToken ct = default);

        // === 6. Aggregation (Tính toán tập hợp) ===

        /// <summary>Tính tổng các giá trị thỏa mãn điều kiện.</summary>
        Task<decimal> SumAsync(
            Expression<Func<T, decimal>> selector,
            Expression<Func<T, bool>>? predicate = null,
            CancellationToken ct = default);

        // === 7. Raw SQL (Truy vấn SQL thô) ===

        /// <summary>Thực thi câu lệnh SQL thô và trả về danh sách Entity.</summary>
        Task<IReadOnlyList<T>> FromSqlRawAsync(string sql, params object[] parameters);
    }
}
