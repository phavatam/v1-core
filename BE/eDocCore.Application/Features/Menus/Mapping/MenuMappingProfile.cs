using AutoMapper;
using eDocCore.Application.Features.Menus.DTOs;
using eDocCore.Application.Features.Menus.DTOs.Request;
using eDocCore.Application.Features.Auth.DTOs;
using eDocCore.Application.Features.Auth.DTOs.Request;
using eDocCore.Domain.Entities;

namespace eDocCore.Application.Features.Menus.Mapping
{
    public class MenuMappingProfile : Profile
    {
        public MenuMappingProfile()
        {
            CreateMap<Menu, MenuDto>();
            CreateMap<CreateMenuRequest, Menu>();
            CreateMap<UpdateMenuRequest, Menu>();
        }
    }
}