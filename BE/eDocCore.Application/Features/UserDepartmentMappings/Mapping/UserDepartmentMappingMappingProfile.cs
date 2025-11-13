using AutoMapper;
using eDocCore.Application.Features.UserDepartmentMappings.DTOs;
using eDocCore.Application.Features.UserDepartmentMappings.DTOs.Request;
using eDocCore.Application.Features.Auth.DTOs;
using eDocCore.Application.Features.Auth.DTOs.Request;
using eDocCore.Domain.Entities;

namespace eDocCore.Application.Features.UserDepartmentMappings.Mapping
{
    public class UserDepartmentMappingMappingProfile : Profile
    {
        public UserDepartmentMappingMappingProfile()
        {
            CreateMap<UserDepartmentMapping, UserDepartmentMappingDto>();
            CreateMap<CreateUserDepartmentMappingRequest, UserDepartmentMapping>();
            CreateMap<UpdateUserDepartmentMappingRequest, UserDepartmentMapping>();
        }
    }
}