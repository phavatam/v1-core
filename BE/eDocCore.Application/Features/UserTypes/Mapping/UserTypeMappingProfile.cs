using AutoMapper;
using eDocCore.Application.Features.UserTypes.DTOs;
using eDocCore.Application.Features.UserTypes.DTOs.Request;
using eDocCore.Application.Features.Auth.DTOs;
using eDocCore.Application.Features.Auth.DTOs.Request;
using eDocCore.Domain.Entities;

namespace eDocCore.Application.Features.UserTypes.Mapping
{
    public class UserTypeMappingProfile : Profile
    {
        public UserTypeMappingProfile()
        {
            CreateMap<UserType, UserTypeDto>();
            CreateMap<CreateUserTypeRequest, UserType>();
            CreateMap<UpdateUserTypeRequest, UserType>();
        }
    }
}