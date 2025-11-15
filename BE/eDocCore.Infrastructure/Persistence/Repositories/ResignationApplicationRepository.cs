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
    public class ResignationApplicationRepository : GenericRepository<ResignationApplication>, IResignationApplicationRepository
    {
        private readonly IMapper _mapper;
        public ResignationApplicationRepository(ApplicationDbContext context, IMapper mapper) : base(context, mapper)
        {
            _mapper = mapper;
        }
    }
}
