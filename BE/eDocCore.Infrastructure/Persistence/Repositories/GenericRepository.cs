using AutoMapper;
using AutoMapper.QueryableExtensions;
using eDocCore.Domain;
using eDocCore.Domain.Interfaces;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading;
using System.Threading.Tasks;

namespace eDocCore.Infrastructure.Persistence.Repositories
{
    public class GenericRepository<T> : IGenericRepository<T> where T : class, IAuditableEntity
    {
        protected readonly ApplicationDbContext _context;
        private readonly IMapper _mapper;

        public GenericRepository(ApplicationDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public virtual async Task<T?> GetByIdAsync(Guid id)
        {
            return await _context.Set<T>().FindAsync(id);
        }

        public virtual async Task<IReadOnlyList<T>> GetAllAsync()
        {
            return await _context.Set<T>().AsNoTracking().ToListAsync();
        }

        public virtual async Task<T> AddAsync(T entity)
        {
            var now = DateTimeOffset.UtcNow;

            if (entity.Id == Guid.Empty)
                entity.Id = Guid.NewGuid();

            // only set Created when not provided
            if (entity.Created == default)
                entity.Created = now;

            entity.Modified = now;

            await _context.Set<T>().AddAsync(entity);
            return entity;
        }

        public virtual async Task<T> UpdateAsync(T entity)
        {
            entity.Modified = DateTimeOffset.UtcNow;

            var entry = _context.Entry(entity);
            if (entry.State == EntityState.Detached)
            {
                _context.Set<T>().Attach(entity);
                entry = _context.Entry(entity);
            }

            entry.State = EntityState.Modified;
            entry.Property(e => e.Created).IsModified = false;

            return entity;
        }

        public virtual async Task<bool> DeleteAsync(Guid id)
        {
            var entity = await _context.Set<T>().FindAsync(id);
            if (entity == null)
                return false;

            _context.Set<T>().Remove(entity);
            // Defer SaveChanges to UnitOfWork.CommitAsync
            return true;
        }

        // New overloads and helper methods per recommendations
        public virtual async Task<T?> GetByIdAsync(Guid id, bool asNoTracking, CancellationToken ct = default)
        {
            var set = _context.Set<T>().AsQueryable();
            if (asNoTracking) set = set.AsNoTracking();
            return await set.FirstOrDefaultAsync(e => e.Id == id, ct);
        }

        public virtual async Task<IReadOnlyList<T>> GetAllAsync(bool asNoTracking, CancellationToken ct = default)
        {
            var set = _context.Set<T>().AsQueryable();
            if (asNoTracking) set = set.AsNoTracking();
            return await set.ToListAsync(ct);
        }

        public virtual async Task<IReadOnlyList<T>> FindAsync(Expression<Func<T, bool>> predicate, bool asNoTracking = true, CancellationToken ct = default)
        {
            var query = _context.Set<T>().Where(predicate);
            if (asNoTracking) query = query.AsNoTracking();
            return await query.ToListAsync(ct);
        }

        public virtual async Task<IReadOnlyList<T>> FindAsync(Expression<Func<T, bool>> predicate, Func<IQueryable<T>, IOrderedQueryable<T>>? orderBy, bool asNoTracking = true, CancellationToken ct = default)
        {
            var query = _context.Set<T>().Where(predicate);
            if (orderBy != null)
            {
                query = orderBy(query);
            }
            if (asNoTracking)
            {
                query = query.AsNoTracking();
            }
            return await query.ToListAsync(ct);
        }

        public virtual async Task<T?> FirstOrDefaultAsync(Expression<Func<T, bool>> predicate, bool asNoTracking = true, CancellationToken ct = default)
        {
            var query = _context.Set<T>().Where(predicate);
            if (asNoTracking)
            {
                query = query.AsNoTracking();
            }
            return await query.FirstOrDefaultAsync(ct);
        }

        public virtual async Task<T?> FirstOrDefaultAsync(Expression<Func<T, bool>> predicate, Func<IQueryable<T>, IOrderedQueryable<T>>? orderBy, bool asNoTracking = true, CancellationToken ct = default)
        {
            var query = _context.Set<T>().Where(predicate);
            if (orderBy != null)
            {
                query = orderBy(query);
            }
            if (asNoTracking)
            {
                query = query.AsNoTracking();
            }
            return await query.FirstOrDefaultAsync(ct);
        }

        public virtual async Task<bool> AnyAsync(Expression<Func<T, bool>> predicate, CancellationToken ct = default)
        {
            return await _context.Set<T>().AnyAsync(predicate, ct);
        }

        public virtual async Task<int> CountAsync(Expression<Func<T, bool>>? predicate = null, CancellationToken ct = default)
        {
            var query = _context.Set<T>().AsQueryable();
            if (predicate != null)
            {
                query = query.Where(predicate);
            }
            return await query.CountAsync(ct);
        }

        public virtual async Task<(IReadOnlyList<T> Items, int TotalCount)> GetPagedAsync(
            int page,
            int pageSize,
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

            if (asNoTracking) query = query.AsNoTracking();

            var items = await query.Skip((page - 1) * pageSize).Take(pageSize).ToListAsync(ct);
            return (items, total);
        }

        public virtual async Task<(IReadOnlyList<TResult> Items, int TotalItems)> GetPagedProjectedAsync<TResult>(
            int page,
            int pageSize,
            Expression<Func<T, bool>>? filter,
            Func<IQueryable<T>, IOrderedQueryable<T>>? orderBy,
            bool asNoTracking = true,
            CancellationToken ct = default)
        {
            if (page < 1) page = 1;
            if (pageSize < 1) pageSize = 10;

            var set = _context.Set<T>().AsQueryable();

            if (filter != null)
            {
                set = set.Where(filter);
            }

            var total = await set.CountAsync(ct);

            if (orderBy != null)
            {
                set = orderBy(set);
            }

            if (asNoTracking)
            {
                set = set.AsNoTracking();
            }

            // Sử dụng ProjectTo để ánh xạ từ T sang TResult
            var query = set.Skip((page - 1) * pageSize)
                            .Take(pageSize)
                            .ProjectTo<TResult>(_mapper.ConfigurationProvider);

            var items = await query.ToListAsync(ct);
            return (items, total);
        }

        public virtual async Task<(IReadOnlyList<TResult> Items, int TotalCount)> GetPagedProjectedAsync<TResult>(
            int page,
            int pageSize,
            Expression<Func<T, bool>>? filter,
            Func<IQueryable<T>, IOrderedQueryable<T>>? orderBy,
            Expression<Func<T, TResult>> selector,
            bool asNoTracking = true,
            CancellationToken ct = default)
        {
            if (page < 1) page = 1;
            if (pageSize < 1) pageSize = 10;

            var set = _context.Set<T>().AsQueryable();
            if (filter != null)
            {
                set = set.Where(filter);
            }

            var total = await set.CountAsync(ct);

            if (orderBy != null)
            {
                set = orderBy(set);
            }

            if (asNoTracking)
            {
                set = set.AsNoTracking();
            }

            var query = set.Skip((page - 1) * pageSize).Take(pageSize).Select(selector);
            var items = await query.ToListAsync(ct);
            return (items, total);
        }

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
            // Defer SaveChanges to UnitOfWork.CommitAsync
        }

        public virtual async Task UpdateRangeAsync(IEnumerable<T> entities, CancellationToken ct = default)
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
                entry.Property(e => e.Id).IsModified = false;
                entry.Property(e => e.Created).IsModified = false;
            }
            // Defer SaveChanges to UnitOfWork.CommitAsync
        }

        public virtual async Task RemoveRangeAsync(IEnumerable<T> entities, CancellationToken ct = default)
        {
            _context.Set<T>().RemoveRange(entities);
            // Defer SaveChanges to UnitOfWork.CommitAsync
        }
    }
}
