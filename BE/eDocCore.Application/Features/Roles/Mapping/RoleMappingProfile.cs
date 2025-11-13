using AutoMapper;
using eDocCore.Application.Features.Roles.DTOs.Request;
using eDocCore.Domain.Entities;

namespace eDocCore.Application.Features.Roles.Mapping
{
    public class RoleMappingProfile : Profile
    {
        public RoleMappingProfile()
        {
            CreateMap<Role, DTOs.RoleDto>();
            CreateMap<CreateRoleRequest, Role>();
            CreateMap<UpdateRoleRequest, Role>();
        }
    }
}
