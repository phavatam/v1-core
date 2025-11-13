using eDocCore.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;
using eDocCore.Domain.Interfaces.Extend;
using System.Threading;
using AutoMapper;

namespace eDocCore.Infrastructure.Persistence.Repositories
{
    public class MenuRepository : GenericRepository<Menu>, IMenuRepository
    {
        private readonly IMapper _mapper;
        public MenuRepository(ApplicationDbContext context, IMapper mapper) : base(context, mapper)
        {
            _mapper = mapper;
        }
    }
}
