// Đảm bảo các using này trỏ đến đúng namespace của bạn
using eDocCore.Domain.Interfaces;
using eDocCore.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;

public class GenericRepository<T> : IGenericRepository<T> where T : class, IAuditableEntity
{
    protected readonly ApplicationDbContext _context;

    // IMapper đã được loại bỏ để Repository chỉ tập trung vào Data Access
    public GenericRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    // === 1. CRUD Cơ bản & Gộp Overloads ===

    public virtual async Task<T?> GetByIdAsync(Guid id, bool asNoTracking = false, CancellationToken ct = default)
    {
        var set = _context.Set<T>().AsQueryable();
        if (asNoTracking) set = set.AsNoTracking();

        // Sử dụng FirstOrDefaultAsync thay vì FindAsync để áp dụng AsNoTracking
        return await set.FirstOrDefaultAsync(e => e.Id == id, ct);
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
        if (entity.Id == Guid.Empty)
            entity.Id = Guid.NewGuid();
        if (entity.Created == default)
            entity.Created = now;
        entity.Modified = now;

        await _context.Set<T>().AddAsync(entity, ct);
        // Defer SaveChanges
        return entity;
    }

    public virtual async Task<T> UpdateAsync(T entity)
    {
        entity.Modified = DateTimeOffset.UtcNow;

        var entry = _context.Entry(entity);
        if (entry.State == EntityState.Detached)
        {
            // Attach và đánh dấu là Modified nếu Entity không được theo dõi
            _context.Set<T>().Attach(entity);
            entry = _context.Entry(entity);
        }
        entry.State = EntityState.Modified;

        // Đảm bảo các thuộc tính Auditing không được chỉnh sửa (Trừ Modified)
        entry.Property(e => e.Id).IsModified = false;
        entry.Property(e => e.Created).IsModified = false;

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
        var now = DateTimeOffset.UtcNow;
        foreach (var entity in entities)
        {
            if (entity.Id == Guid.Empty)
                entity.Id = Guid.NewGuid();
            if (entity.Created == default)
                entity.Created = now;
            entity.Modified = now;
        }
        await _context.Set<T>().AddRangeAsync(entities, ct);
    }

    public virtual Task UpdateRangeAsync(IEnumerable<T> entities)
    {
        var now = DateTimeOffset.UtcNow;
        foreach (var entity in entities)
        {
            entity.Modified = now;
            var entry = _context.Entry(entity);
            if (entry.State == EntityState.Detached)
            {
                _context.Set<T>().Attach(entity);
                entry = _context.Entry(entity);
            }
            entry.State = EntityState.Modified;
            entry.Property(e => e.Created).IsModified = false;
        }
        return Task.CompletedTask;
    }

    public virtual Task RemoveRangeAsync(IEnumerable<T> entities)
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

    public virtual async Task<(IReadOnlyList<TResult> Items, int TotalCount)> GetPagedProjectedAsync<TResult>(
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
            query = query.OrderBy(e => e.Id);
        }

        if (asNoTracking) query = query.AsNoTracking();

        var itemsQuery = query.Skip((page - 1) * pageSize)
                              .Take(pageSize)
                              .Select(selector); // Sử dụng Projection Selector

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