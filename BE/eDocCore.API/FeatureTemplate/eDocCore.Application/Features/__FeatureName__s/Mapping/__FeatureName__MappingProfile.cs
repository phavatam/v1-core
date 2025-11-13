using AutoMapper;
using eDocCore.Application.Features.__FeatureName__s.DTOs;
using eDocCore.Application.Features.__FeatureName__s.DTOs.Request;
using eDocCore.Application.Features.Auth.DTOs;
using eDocCore.Application.Features.Auth.DTOs.Request;
using eDocCore.Domain.Entities;

namespace eDocCore.Application.Features.__FeatureName__s.Mapping
{
    public class __FeatureName__MappingProfile : Profile
    {
        public __FeatureName__MappingProfile()
        {
            CreateMap<__ModelName__, __FeatureName__Dto>().ReverseMap();
            CreateMap<Create__FeatureName__Request, __ModelName__>().ReverseMap();
            CreateMap<Update__FeatureName__Request, __ModelName__>().ReverseMap();
        }
    }
}