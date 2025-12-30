using AutoMapper;
using eDocCore.Application.Common.Interfaces;
using eDocCore.Domain.Interfaces;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace eDocCore.Application.Common
{
    public class GenericService<T, TDto> : IGenericService<T, TDto> where T : class where TDto : class
    {
        protected readonly IUnitOfWork _unitOfWork;
        protected readonly IMapper _mapper;
        protected readonly IGenericRepository<T> _repository;

        public GenericService(IUnitOfWork unitOfWork, IMapper mapper, IGenericRepository<T> repository)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
            _repository = repository;
        }

        //public virtual async Task<TDto> GetByIdAsync(Guid id)
        //{
        //    var entity = await _repository.GetByIdAsync(id);
        //    if (entity == null)
        //        throw new ApplicationException($"{typeof(T).Name} entity with id {id} not found");
        //    return _mapper.Map<TDto>(entity);
        //}

        //public virtual async Task<List<TDto>> GetAllAsync()
        //{
        //    var result = await _repository.GetAllAsync();

        //    return _mapper.Map<List<TDto>>(result);
        //}

        //public virtual IQueryable<T> Query()
        //{
        //    return _repository.Query();
        //}

        //public async Task<TDto> Create(TDto dto)
        //{
        //    if (dto == null) throw new ArgumentNullException(nameof(dto));
        //    var entity = _mapper.Map<T>(dto);

        //    try
        //    {
        //        _repository.Create(entity);
        //        await _unitOfWork.SaveChangeAsync();
        //        return _mapper.Map<TDto>(entity);
        //    }
        //    catch (Exception ex)
        //    {
        //        throw new ApplicationException($"Error adding {typeof(T).Name} entity: {ex.Message}");
        //    }
        //}

        //public async Task<TDto> Update(Guid id, TDto dto)
        //{
        //    if (dto == null) throw new ArgumentNullException(nameof(dto));

        //    var entity = await _repository.GetByIdAsync(id);
        //    if (entity == null)
        //    {
        //        throw new ApplicationException($"{typeof(T).Name} entity with id {id} not found");
        //    }

        //    try
        //    {
        //        _mapper.Map(dto, entity);
        //        _repository.Update(entity);
        //        await _unitOfWork.SaveChangeAsync();
        //        return _mapper.Map<TDto>(entity);
        //    }
        //    catch (Exception ex)
        //    {
        //        throw new ApplicationException($"Error updating {typeof(T).Name} entity: {ex.Message}");
        //    }
        //}

        public async Task<TDto> Patch(Guid id, Microsoft.AspNetCore.OData.Deltas.Delta<TDto> delta)
        {
            if (delta == null) throw new ArgumentNullException(nameof(delta));

            var entity = await _repository.GetByIdAsync(id);
            if (entity == null)
                throw new ApplicationException($"Entity of type {typeof(T).Name} with id {id} not found");

            var dto = _mapper.Map<TDto>(entity);

            await ValidateDto(dto);

            delta.Patch(dto);
            _mapper.Map(dto, entity);

            await _repository.SaveChangesAsync();
            await _unitOfWork.CommitAsync();
            return _mapper.Map<TDto>(entity);
        }

        //public virtual async Task<bool> Delete(Guid id)
        //{
        //    var entity = await _repository.GetByIdAsync(id);
        //    if (entity == null)
        //    {
        //        throw new ApplicationException($"Entity of type {typeof(T).Name} with id {id} not found");
        //    }

        //    try
        //    {
        //        _repository.Delete(entity);
        //        await _unitOfWork.SaveChangeAsync();
        //        return true;
        //    }
        //    catch (Exception ex)
        //    {
        //        throw new ApplicationException($"Error deleting {typeof(T).Name} entity: {ex.Message}");
        //    }
        //}

        //public async Task<int> CountAsync(Expression<Func<T, bool>> predicate)
        //{
        //    return await _repository.CountAsync(predicate);
        //}

        protected virtual Task ValidateDto(TDto dto)
        {
            if (dto == null)
                throw new ArgumentNullException(nameof(dto));

            return Task.CompletedTask;
        }
    }
}
