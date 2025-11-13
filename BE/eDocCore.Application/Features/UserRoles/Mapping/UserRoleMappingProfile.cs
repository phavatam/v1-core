using AutoMapper;
using eDocCore.Application.Features.Roles.DTOs.Request;
using eDocCore.Domain.Entities;
using eDocCore.Application.Features.UserRoles.DTOs;
using eDocCore.Application.Features.UserRoles.DTOs.Request;

namespace eDocCore.Application.Features.UserRoles.Mapping
{
    public class UserRoleMappingProfile : Profile
    {
        public UserRoleMappingProfile()
        {
            CreateMap<UserRole, UserRoleDto>();
            CreateMap<CreateUserRoleRequest, UserRole>();
            CreateMap<UpdateUserRoleRequest, UserRole>();
        }
    }
}