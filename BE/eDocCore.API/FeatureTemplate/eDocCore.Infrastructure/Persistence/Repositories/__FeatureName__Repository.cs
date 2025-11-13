using AutoMapper;
using eDocCore.Domain.Entities;
using eDocCore.Domain.Interfaces.Extend;
using eDocCore.Infrastructure.Persistence;
using eDocCore.Infrastructure.Persistence.Repositories;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace eDocCore.API.Persistence.Repositories
{
    public class __FeatureName__Repository : GenericRepository<__ModelName__>, I__FeatureName__Repository
    {
        private readonly IMapper _mapper;
        public __FeatureName__Repository(ApplicationDbContext context, IMapper mapper) : base(context, mapper)
        {
            _mapper = mapper;
        }
    }
}
