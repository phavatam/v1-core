// Đảm bảo các using này trỏ đến đúng namespace của bạn
using eDocCore.Domain.Interfaces;
using eDocCore.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Linq.Expressions;
using System.Linq.Dynamic.Core;

public class GenericRepository<T> : IGenericRepository<T> where T : class
{
    protected readonly ApplicationDbContext _context;
    protected readonly DbSet<T> _dbSet;

    public GenericRepository(ApplicationDbContext context)
    {
        _context = context;
        _dbSet = context.Set<T>();
    }

    // === 1. CRUD Cơ bản & Gộp Overloads ===

    public virtual async Task<T?> GetByIdAsync(Guid id, bool asNoTracking = false, CancellationToken ct = default)
    {

        //var set = _context.Set<T>().AsQueryable();
        //if (asNoTracking) set = set.AsNoTracking();
        //return await set.FirstOrDefaultAsync(e => e.Id == id, ct);

        //var set = _context.Set<T>().AsQueryable();
        //if (asNoTracking) set = set.AsNoTracking();

        //// Tạo biểu thức lambda: e => e.Id == id (bằng reflection)
        //var param = Expression.Parameter(typeof(T), "e");
        //var prop = Expression.PropertyOrField(param, "Id");
        //var body = Expression.Equal(prop, Expression.Constant(id));
        //var lambda = Expression.Lambda<Func<T, bool>>(body, param);

        //return await set.FirstOrDefaultAsync(lambda, ct);
        return await _dbSet.FindAsync(id, ct);
    }

    public virtual async Task<IReadOnlyList<T>> GetAllAsync(bool asNoTracking = false, CancellationToken ct = default)
    {
        var set = _context.Set<T>().AsQueryable();
        if (asNoTracking) set = set.AsNoTracking();
        return await set.ToListAsync(ct);
    }

    public virtual async Task<T> AddAsync(T entity, CancellationToken ct = default)
    {
        var now = DateTimeOffset.UtcNow;

        // Nếu entity implement IAuditableEntity thì set Id
        if (entity is IAuditableEntity auditable)
        {
            if (auditable.Id == Guid.Empty)
                auditable.Id = Guid.NewGuid();
        }

        await _context.Set<T>().AddAsync(entity, ct);
        // Defer SaveChanges
        return entity;
    }

    public virtual async Task<T> UpdateAsync(T entity)
    {
        //entity.Modified = DateTimeOffset.UtcNow;

        var entry = _context.Entry(entity);
        if (entry.State == EntityState.Detached)
        {
            // Attach và đánh dấu là Modified nếu Entity không được theo dõi
            _context.Set<T>().Attach(entity);
            entry = _context.Entry(entity);
        }
        entry.State = EntityState.Modified;

        // Đảm bảo các thuộc tính Auditing không được chỉnh sửa (Trừ Modified)
        //entry.Property(e => e.Id).IsModified = false;
        //entry.Property(e => e.Created).IsModified = false;

        return entity;
    }

    public virtual async Task DeleteAsync(Guid id)
    {
        var entity = await _context.Set<T>().FindAsync(id);
        if (entity == null)
            throw new ArgumentException($"Entity with id {id} not found for deletion.");

        _context.Set<T>().Remove(entity);
        // Defer SaveChanges
    }

    public virtual async Task<int> SaveChangesAsync(CancellationToken ct = default)
    {
        // Thực hiện lưu thay đổi. Nếu bạn có UnitOfWork Pattern, phương thức này sẽ được gọi từ đó.
        return await _context.SaveChangesAsync(ct);
    }

    // === 2. Batch Operations (Thao tác theo lô) ===

    public virtual async Task AddRangeAsync(IEnumerable<T> entities, CancellationToken ct = default)
    {
        foreach (var entity in entities)
        {
            if (entity is IAuditableEntity auditable)
            {
                if (auditable.Id == Guid.Empty)
                    auditable.Id = Guid.NewGuid();
            }
        }
        await _context.Set<T>().AddRangeAsync(entities, ct);
    }

    public virtual Task UpdateRangeAsync(IEnumerable<T> entities)
    {
        var now = DateTimeOffset.UtcNow;
        foreach (var entity in entities)
        {
            //entity.Modified = now;
            var entry = _context.Entry(entity);
            if (entry.State == EntityState.Detached)
            {
                _context.Set<T>().Attach(entity);
                entry = _context.Entry(entity);
            }
            entry.State = EntityState.Modified;
            //entry.Property(e => e.Created).IsModified = false;
        }
        return Task.CompletedTask;
    }

    public virtual Task DeleteRangeAsync(IEnumerable<T> entities)
    {
        _context.Set<T>().RemoveRange(entities);
        return Task.CompletedTask;
    }

    // === 3. Truy vấn LINQ Linh hoạt (Predicate & Sắp xếp) ===
    public virtual async Task<IReadOnlyList<T>> FindAsync(
        Expression<Func<T, bool>> predicate,
        Func<IQueryable<T>, IOrderedQueryable<T>>? orderBy = null,
        bool asNoTracking = true,
        CancellationToken ct = default)
    {
        var query = _context.Set<T>().Where(predicate);
        if (orderBy != null) query = orderBy(query);
        if (asNoTracking) query = query.AsNoTracking();

        return await query.ToListAsync(ct);
    }

    public virtual async Task<T?> FirstOrDefaultAsync(
        Expression<Func<T, bool>> predicate,
        Func<IQueryable<T>, IOrderedQueryable<T>>? orderBy = null,
        bool asNoTracking = true,
        CancellationToken ct = default)
    {
        var query = _context.Set<T>().Where(predicate);
        if (orderBy != null) query = orderBy(query);
        if (asNoTracking) query = query.AsNoTracking();

        return await query.FirstOrDefaultAsync(ct);
    }

    public virtual async Task<bool> AnyAsync(Expression<Func<T, bool>> predicate, CancellationToken ct = default)
    {
        return await _context.Set<T>().AnyAsync(predicate, ct);
    }

    public virtual async Task<int> CountAsync(Expression<Func<T, bool>>? predicate = null, CancellationToken ct = default)
    {
        var query = _context.Set<T>().AsQueryable();
        if (predicate != null) query = query.Where(predicate);
        return await query.CountAsync(ct);
    }

    // === 4. Eager Loading (Tải đối tượng liên quan) ===
    public virtual async Task<IReadOnlyList<T>> FindWithIncludesAsync(
        Expression<Func<T, bool>> predicate,
        Expression<Func<T, object>>[] includes,
        Func<IQueryable<T>, IOrderedQueryable<T>>? orderBy = null,
        bool asNoTracking = true,
        CancellationToken ct = default)
    {
        IQueryable<T> query = _context.Set<T>();

        // Áp dụng Include cho từng Navigation Property
        foreach (var include in includes)
        {
            query = query.Include(include);
        }

        query = query.Where(predicate);
        if (orderBy != null) query = orderBy(query);
        if (asNoTracking) query = query.AsNoTracking();

        return await query.ToListAsync(ct);
    }

    // === 5. Phân trang, Projection (Ánh xạ DTO) & Sắp xếp ===

    public virtual async Task<(IReadOnlyList<TResult> Items, int TotalItems)> GetPagedProjectedAsync<TResult>(
        int page,
        int pageSize,
        Expression<Func<T, TResult>> selector, // Biểu thức ánh xạ (Projection) bắt buộc
        Expression<Func<T, bool>>? filter = null,
        Func<IQueryable<T>, IOrderedQueryable<T>>? orderBy = null,
        bool asNoTracking = true,
        CancellationToken ct = default) 
    {
        if (page < 1) page = 1;
        if (pageSize < 1) pageSize = 10;

        var query = _context.Set<T>().AsQueryable();
        if (filter != null) query = query.Where(filter);

        var total = await query.CountAsync(ct);

        if (orderBy != null)
        {
            query = orderBy(query);
        }
        else
        {
            // Bắt buộc phải có OrderBy trước Skip/Take
            query = query.OrderBy(e => EF.Property<Guid>(e, "Id"));
        }

        if (asNoTracking) query = query.AsNoTracking();


        var itemsQuery = query.Skip((page - 1) * pageSize)
                              .Take(pageSize)
                              .Select(selector);

        var items = await itemsQuery.ToListAsync(ct);
        return (items, total);
    }

    // Giả định: T là Entity và TResult là DTO
    public virtual async Task<(IReadOnlyList<TResult> Items, int TotalItems)> GetPagedProjectedDynamicFilterAsync<TResult>(
        int page,
        int pageSize,
        Expression<Func<T, TResult>> selector, // Biểu thức ánh xạ (Projection) bắt buộc
        string? dynamicFilter = null,           // 👈 Đã thay đổi: Nhận chuỗi filter động
        string? dynamicOrderBy = null,          // 👈 Đã thay đổi: Nhận chuỗi orderBy động
        bool asNoTracking = true,
        CancellationToken ct = default) // Giả định T là Entity (hoặc có định nghĩa)
    {
        if (page < 1) page = 1;
        if (pageSize < 1) pageSize = 10;

        var query = _context.Set<T>().AsQueryable();

        // 1. ÁP DỤNG DYNAMIC FILTER
        if (!string.IsNullOrWhiteSpace(dynamicFilter))
        {
            // ⚠️ Lưu ý: Trong môi trường thực tế, cần validation chuỗi dynamicFilter tại đây
            try
            {
                query = query.Where(dynamicFilter); // Sử dụng phương thức mở rộng của Dynamic LINQ
            }
            catch (Exception ex)
            {
                // Xử lý lỗi cú pháp filter không hợp lệ
                throw new ArgumentException($"Lỗi cú pháp Filter: {dynamicFilter}", nameof(dynamicFilter), ex);
            }
        }

        // Lấy tổng số lượng trước khi phân trang (Rất quan trọng)
        var total = await query.CountAsync(ct);

        // 2. ÁP DỤNG DYNAMIC ORDERBY
        if (!string.IsNullOrWhiteSpace(dynamicOrderBy))
        {
            try
            {
                query = query.OrderBy(dynamicOrderBy); // Sử dụng phương thức mở rộng của Dynamic LINQ
            }
            catch (Exception ex)
            {
                // Xử lý lỗi cú pháp OrderBy không hợp lệ
                throw new ArgumentException($"Lỗi cú pháp OrderBy: {dynamicOrderBy}", nameof(dynamicOrderBy), ex);
            }
        }
        else
        {
            // Bắt buộc phải có OrderBy trước Skip/Take
            // Giả sử Entity T có thuộc tính "Id" (hoặc Guid Id)
            query = query.OrderBy("Id asc");
        }

        if (asNoTracking) query = query.AsNoTracking();

        // 3. Áp dụng Phân trang và Projection
        var itemsQuery = query.Skip((page - 1) * pageSize)
                              .Take(pageSize)
                              .Select(selector);

        var items = await itemsQuery.ToListAsync(ct);

        return (items, total);
    }

    // === 6. Aggregation (Tính toán tập hợp) ===
    public virtual async Task<decimal> SumAsync(
        Expression<Func<T, decimal>> selector,
        Expression<Func<T, bool>>? predicate = null,
        CancellationToken ct = default)
    {
        var query = _context.Set<T>().AsQueryable();
        if (predicate != null) query = query.Where(predicate);

        return await query.SumAsync(selector, ct);
    }

    // === 7. Raw SQL (Truy vấn SQL thô) ===
    public virtual async Task<IReadOnlyList<T>> FromSqlRawAsync(string sql, params object[] parameters)
    {
        // Truy vấn SQL trả về Entity T
        return await _context.Set<T>().FromSqlRaw(sql, parameters).ToListAsync();
    }
}